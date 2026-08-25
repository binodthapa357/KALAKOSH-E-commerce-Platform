'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { FaArrowLeft, FaUpload } from 'react-icons/fa6';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { fetchApi } from '@/lib/api';
import { toast } from 'sonner';

export default function CreateProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    discount_price: '',
    stock: '',
    description: '',
    region: 'Kathmandu',
    material: 'Handmade',
    craft_type: 'Nepalese Handicraft',
    status: 'active',
  });
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const catData = await fetchApi('/categories');
        if (catData?.categories) {
          setCategories(catData.categories);
          if (catData.categories.length > 0) {
            setFormData(prev => ({ ...prev, category: catData.categories[0]._id }));
          }
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload: any = {
        name: formData.name,
        category: formData.category || (categories[0]?._id ?? 'General'),
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description || formData.name,
        region: formData.region,
        material: formData.material,
        craft_type: formData.craft_type,
        status: formData.status,
      };

      if (formData.discount_price && Number(formData.discount_price) < Number(formData.price)) {
        payload.discount_price = Number(formData.discount_price);
      }

      if (imagePreview) {
        payload.images = [imagePreview];
      }

      await fetchApi('/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      toast.success('Product created successfully');
      router.push('/admin/products');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Page Title */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <Link
            href="/admin/products"
            className="text-text-light hover:text-primary-700 transition-colors"
          >
            <FaArrowLeft className="text-xl" />
          </Link>
          <span className="text-text-light text-xs tracking-[0.2em]">INVENTORY</span>
        </div>
        <h1 className="font-serif text-primary-700 text-[70px] font-semibold leading-none mt-2.5">
          Create Product
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-[#F7F2EA] border border-border rounded-2xl p-7">
            <div className="space-y-6">
              <div>
                <label className="block text-text-dark text-sm font-medium mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="Enter product name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-text-dark text-sm font-medium mb-2">Category *</label>
                  {categories.length > 0 ? (
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                    >
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                      placeholder="e.g. Handicraft"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-text-dark text-sm font-medium mb-2">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                    placeholder="299"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-text-dark text-sm font-medium mb-2">Stock Quantity *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-text-dark text-sm font-medium mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-text-dark text-sm font-medium mb-2">Region</label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                    placeholder="Kathmandu"
                  />
                </div>
                <div>
                  <label className="block text-text-dark text-sm font-medium mb-2">Material</label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                    placeholder="Brass / Wood / Wool"
                  />
                </div>
                <div>
                  <label className="block text-text-dark text-sm font-medium mb-2">Craft Type</label>
                  <input
                    type="text"
                    name="craft_type"
                    value={formData.craft_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                    placeholder="Nepalese Handicraft"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-dark text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                  placeholder="Describe the product..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-primary-700 text-white px-6 py-3 rounded-full hover:bg-primary-800 transition-colors shadow-lg hover:shadow-xl font-semibold disabled:opacity-60"
                >
                  {submitting ? 'Creating...' : 'Create Product'}
                </button>
                <Link
                  href="/admin/products"
                  className="flex-1 border border-border bg-white text-text-mid px-6 py-3 rounded-full hover:bg-gray-50 transition-colors text-center font-medium"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Image Upload Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-[#F7F2EA] border border-border rounded-2xl p-7 sticky top-4">
            <h3 className="font-serif text-primary-700 text-2xl mb-4">Product Image</h3>
            <div
              className={`border-2 border-dashed border-border rounded-2xl p-8 text-center transition-colors relative ${imagePreview ? 'border-primary-400' : 'hover:border-primary-400'
                }`}
            >
              {imagePreview ? (
                <div className="space-y-4">
                  <div className="relative w-full h-48">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="text-red-600 hover:text-red-700 text-sm relative z-10"
                    variant="ghost"
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary-100 flex items-center justify-center">
                    <FaUpload className="text-primary-700 text-2xl" />
                  </div>
                  <p className="text-text-mid">Click to upload</p>
                  <p className="text-text-light text-sm">PNG, JPG up to 5MB</p>
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}