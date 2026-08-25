"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaCloudUploadAlt, FaTrash } from "react-icons/fa";
import { isLoggedIn, getRole } from "@/lib/auth";
import { toast } from "sonner";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [region, setRegion] = useState("");
  const [material, setMaterial] = useState("");
  const [craftType, setCraftType] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // ---- Auth guard: only logged-in active vendors may access this page ----
  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/signin?redirect=/vendor/products");
      return;
    }
    if (getRole() !== "vendor") {
      router.push("/dashboard");
      return;
    }

    const checkVendorStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BACKEND_URL}/api/vendor/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          router.push("/vendor/dashboard");
          return;
        }
        const data = await res.json();
        if (data.status !== "active") {
          toast.error(`Your vendor account status is '${data.status}'. Access denied.`);
          router.push("/vendor/dashboard");
          return;
        }
        setCheckingAuth(false);
      } catch {
        router.push("/vendor/dashboard");
      }
    };

    checkVendorStatus();
  }, [router]);

  // ---- Load categories for the dropdown ----
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data.categories ?? []))
      .catch(() => setCategories([]));
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const combined = [...images, ...files].slice(0, 6); // cap at 6 images
    setImages(combined);
    setPreviews(combined.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (index: number) => {
    const nextImages = images.filter((_, i) => i !== index);
    setImages(nextImages);
    setPreviews(nextImages.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (images.length === 0) {
      setError("Please upload at least one product image.");
      return;
    }
    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      if (discountPrice) formData.append("discount_price", discountPrice);
      formData.append("stock", stock);
      formData.append("category_id", categoryId);
      formData.append("region", region);
      formData.append("material", material);
      formData.append("craft_type", craftType);
      images.forEach((img) => formData.append("images", img));

      const res = await fetch(`${BACKEND_URL}/api/vendor/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Could not upload product. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/vendor/dashboard"), 1500);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#FBF7F0] flex items-center justify-center">
        <p className="text-[#8B3232] text-sm">Checking your account...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF7F0] font-sans">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* HEADER */}
        <div className="mb-8">
          <Link href="/vendor/dashboard" className="text-xs text-gray-400 hover:text-[#8B3232]">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-serif font-semibold text-[#8B3232] mt-2">
            Upload New Product
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Add a handcrafted item to your shop. Fields marked with * are required.
          </p>
        </div>

        {success && (
          <div className="mb-6 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-4 py-3">
            Product uploaded successfully! Redirecting to your dashboard...
          </div>
        )}
        {error && (
          <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* IMAGE UPLOAD */}
          <section className="bg-white rounded-lg border border-[#EADCC9] p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-[#5C2E2E] mb-4">
              Product Images * (up to 6)
            </h3>

            <div className="flex flex-wrap gap-4">
              {previews.map((src, i) => (
                <div key={i} className="relative w-24 h-24 rounded-md overflow-hidden border border-[#EADCC9]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-red-600 hover:bg-red-50"
                    aria-label="Remove image"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              ))}

              {images.length < 6 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-md border-2 border-dashed border-[#EADCC9] flex flex-col items-center justify-center text-[#8B3232] hover:bg-[#F5EFE6] transition-colors"
                >
                  <FaCloudUploadAlt className="text-xl mb-1" />
                  <span className="text-[10px]">Add photo</span>
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </section>

          {/* BASIC INFO */}
          <section className="bg-white rounded-lg border border-[#EADCC9] p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-[#5C2E2E]">Basic Information</h3>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sacred Tara Thangka"
                className="w-full border border-[#EADCC9] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#8B3232] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Description *</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the craftsmanship, story, and materials used..."
                className="w-full border border-[#EADCC9] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#8B3232] transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Category *</label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border border-[#EADCC9] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#8B3232] transition-colors bg-white"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* PRICING & STOCK */}
          <section className="bg-white rounded-lg border border-[#EADCC9] p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-[#5C2E2E] mb-4">Pricing & Stock</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Price (Rs.) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1500"
                  className="w-full border border-[#EADCC9] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#8B3232] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Discount Price (Rs.)</label>
                <input
                  type="number"
                  min="0"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  placeholder="Optional"
                  className="w-full border border-[#EADCC9] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#8B3232] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Stock Quantity *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="10"
                  className="w-full border border-[#EADCC9] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#8B3232] transition-colors"
                />
              </div>
            </div>
          </section>

          {/* CRAFT DETAILS */}
          <section className="bg-white rounded-lg border border-[#EADCC9] p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-[#5C2E2E] mb-4">Craft Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Region *</label>
                <input
                  type="text"
                  required
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="Kathmandu"
                  className="w-full border border-[#EADCC9] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#8B3232] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Material *</label>
                <input
                  type="text"
                  required
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="Cotton Canvas"
                  className="w-full border border-[#EADCC9] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#8B3232] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Craft Type *</label>
                <input
                  type="text"
                  required
                  value={craftType}
                  onChange={(e) => setCraftType(e.target.value)}
                  placeholder="Hand-painted"
                  className="w-full border border-[#EADCC9] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#8B3232] transition-colors"
                />
              </div>
            </div>
          </section>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#8B3232] hover:bg-[#732828] text-white font-semibold py-3 rounded-md transition-colors disabled:opacity-60"
            >
              {loading ? "Uploading..." : "Upload Product"}
            </button>
            <Link
              href="/vendor/dashboard"
              className="flex-1 border-2 border-[#8B3232] text-[#8B3232] hover:bg-[#8B3232] hover:text-white font-semibold py-3 rounded-md text-center transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}