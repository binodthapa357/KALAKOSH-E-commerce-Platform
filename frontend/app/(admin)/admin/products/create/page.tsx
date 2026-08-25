'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaUpload, FaTrash } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { fetchApi } from '@/lib/api';
import { toast } from 'sonner';

export default function CreateProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    vendor_id: '',
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const updatedFiles = [...imageFiles, ...files].slice(0, 6);
      setImageFiles(updatedFiles);

      const newPreviews = files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newPreviews).then(results => {
        setImagePreviews(prev => [...prev, ...results].slice(0, 6));
      });
    }
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
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

      if (formData.vendor_id) {
        payload.vendor_id = formData.vendor_id;
      }

      if (formData.discount_price && Number(formData.discount_price) < Number(formData.price)) {
        payload.discount_price = Number(formData.discount_price);
      }

      if (imagePreviews.length > 0) {
        payload.images = imagePreviews;
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
        <h1 className="font-serif text-primary-700 text-3xl sm:text-5xl md:text-[60px] lg:text-[70px] font-semibold leading-none mt-2.5">
          Create Product
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-7 shadow-sm">
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <div>
                  <label className="block text-text-dark text-sm font-medium mb-2">Discount Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="discount_price"
                    value={formData.discount_price}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                    placeholder="e.g. 249"
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
                  className="flex-1 bg-primary-700 text-white px-6 py-3 rounded-full hover:bg-primary-800 transition-colors shadow-lg hover:shadow-xl font-semibold disabled:opacity-60 cursor-pointer"
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
          <div className="bg-card border border-border rounded-2xl p-7 sticky top-4 shadow-sm">
            <h3 className="font-serif text-primary-700 text-2xl mb-4">Product Images</h3>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative h-28 rounded-xl overflow-hidden border border-border group bg-[#f5efe7]">
                    <Image
                      src={preview}
                      alt={`Product preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1.5 right-1.5 bg-red-600/90 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 cursor-pointer"
                      title="Remove image"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label
              htmlFor="product-image-upload"
              className="block border-2 border-dashed border-border rounded-2xl p-8 text-center transition-colors relative hover:border-primary-400 cursor-pointer bg-white"
            >
              <div className="space-y-3 pointer-events-none">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary-100 flex items-center justify-center">
                  <FaUpload className="text-primary-700 text-xl" />
                </div>
                <p className="text-text-mid font-medium text-sm">Upload images (up to 6)</p>
                <p className="text-text-light text-xs">PNG, JPG up to 5MB</p>
              </div>
              <input
                id="product-image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}