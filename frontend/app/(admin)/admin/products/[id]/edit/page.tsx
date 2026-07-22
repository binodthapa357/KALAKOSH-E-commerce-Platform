'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaUpload } from 'react-icons/fa6';
import { Input } from '@/components/ui/input';
import { fetchApi } from '@/lib/api';
import { toast } from 'sonner';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    discount_price: '',
    stock: '',
    description: '',
    region: 'Kathmandu',
    material: 'Cotton Canvas',
    craft_type: 'Nepalese Handicraft',
    status: 'pending',
  });
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const catData = await fetchApi('/categories');
        if (catData && catData.categories) {
          setCategories(catData.categories);
        }

        const product = await fetchApi(`/products/${productId}`);
        if (product) {
          setFormData({
            name: product.name || '',
            category: product.category_id?._id || product.category_id || '',
            price: product.price?.toString() || '',
            discount_price: product.discount_price?.toString() || '',
            stock: product.stock?.toString() || '',
            description: product.description || '',
            region: product.region || 'Unknown',
            material: product.material || 'Handmade',
            craft_type: product.craft_type || 'Nepalese Handicraft',
            status: product.status || 'pending',
          });
          setImages(product.images || []);
        }
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Failed to load product or categories');
      } finally {
        setLoading(false);
      }
    };
    
    if (productId) {
      loadData();
    }
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const remainingSlots = 6 - (images.length + newImageFiles.length);
      const updatedFiles = [...newImageFiles, ...files].slice(0, remainingSlots);
      setNewImageFiles(updatedFiles);
      
      const newPreviews = files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newPreviews).then(results => {
        setNewImagePreviews(prev => [...prev, ...results].slice(0, remainingSlots));
      });
    }
  };

  const removeExistingImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const removeNewImage = (idx: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== idx));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0 && newImageFiles.length === 0) {
      toast.error('Please keep/upload at least one product image.');
      return;
    }
    setSubmitting(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of newImageFiles) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        const uploadRes = await fetchApi('/admin/upload?folder=products', {
          method: 'POST',
          body: formDataUpload,
        });

        if (uploadRes && uploadRes.url) {
          uploadedUrls.push(uploadRes.url);
        }
      }

      const finalImages = [...images, ...uploadedUrls];

      const body = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        discount_price: formData.discount_price ? Number(formData.discount_price) : undefined,
        stock: Number(formData.stock),
        description: formData.description,
        region: formData.region,
        material: formData.material,
        craft_type: formData.craft_type,
        status: formData.status,
        images: finalImages,
      };

      await fetchApi(`/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });

      toast.success('Product updated successfully');
      router.push('/admin/products');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-light">Loading product...</p>
        </div>
      </div>
    );
  }

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
          Edit Product
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-text-dark text-sm font-medium mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-text-dark text-sm font-medium mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 capitalize"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-text-dark text-sm font-medium mb-2">Price *</label>
                  <input
                    type="number"
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
                  <label className="block text-text-dark text-sm font-medium mb-2">Discount Price</label>
                  <input
                    type="number"
                    name="discount_price"
                    value={formData.discount_price}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                    placeholder="e.g. 249"
                  />
                </div>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-text-dark text-sm font-medium mb-2">Region (Location)</label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    <option value="Kathmandu">Kathmandu</option>
                    <option value="Patan">Patan</option>
                    <option value="Bhaktapur">Bhaktapur</option>
                    <option value="Lalitpur">Lalitpur</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
                <div>
                  <label className="block text-text-dark text-sm font-medium mb-2">Material</label>
                  <select
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    <option value="Cotton Canvas">Cotton Canvas</option>
                    <option value="Brass Alloy">Brass Alloy</option>
                    <option value="Pashmina Wool">Pashmina Wool</option>
                    <option value="Sterling Silver">Sterling Silver</option>
                    <option value="Clay">Clay</option>
                    <option value="Lokta Paper">Lokta Paper</option>
                    <option value="Yak Wool">Yak Wool</option>
                    <option value="Handmade">Handmade</option>
                  </select>
                </div>
                <div>
                  <label className="block text-text-dark text-sm font-medium mb-2">Craft Type</label>
                  <select
                    name="craft_type"
                    value={formData.craft_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    <option value="Nepalese Handicraft">Nepalese Handicraft</option>
                    <option value="Thangka Painting">Thangka Painting</option>
                    <option value="Dhaka Weaving">Dhaka Weaving</option>
                    <option value="Pottery">Pottery</option>
                    <option value="Jewelry">Jewelry</option>
                    <option value="Wood Crafts">Wood Crafts</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-text-dark text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  required
                  className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                  placeholder="Describe the product..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-primary-700 text-white px-6 py-3 rounded-full hover:bg-primary-800 transition-colors shadow-lg hover:shadow-xl font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Updating...' : 'Update Product'}
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
          <div className="bg-card border border-border rounded-2xl p-7 sticky top-4 shadow-sm space-y-6">
            <div>
              <h3 className="font-serif text-primary-700 text-2xl mb-4">Product Images</h3>
              
              {/* Existing Images */}
              {images.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-text-mid text-xs font-semibold uppercase tracking-wider mb-2">Existing Images ({images.length})</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {images.map((src, idx) => (
                      <div key={idx} className="relative aspect-square border border-border rounded-xl overflow-hidden group">
                        <img
                          src={src}
                          alt={`Existing ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(idx)}
                          className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition-colors shadow-md z-10"
                          title="Remove Image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Newly Uploaded Images */}
              {newImagePreviews.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-text-mid text-xs font-semibold uppercase tracking-wider mb-2">New Uploads ({newImagePreviews.length})</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {newImagePreviews.map((src, idx) => (
                      <div key={idx} className="relative aspect-square border border-border rounded-xl overflow-hidden group">
                        <img
                          src={src}
                          alt={`New Preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(idx)}
                          className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition-colors shadow-md z-10"
                          title="Remove Image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {images.length + newImageFiles.length < 6 ? (
              <div
                className={`border-2 border-dashed border-border rounded-2xl p-8 text-center transition-colors relative hover:border-primary-400`}
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary-100 flex items-center justify-center">
                    <FaUpload className="text-primary-700 text-xl" />
                  </div>
                  <p className="text-text-mid font-medium text-sm">Upload more (max {6 - (images.length + newImageFiles.length)} more)</p>
                  <p className="text-text-light text-xs">PNG, JPG up to 5MB</p>
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            ) : (
              <p className="text-xs text-text-light text-center border border-border rounded-xl p-4 bg-muted">
                Maximum limit of 6 product images reached.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}