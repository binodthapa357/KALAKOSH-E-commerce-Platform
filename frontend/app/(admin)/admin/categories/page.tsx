'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaGripVertical, FaUpload } from 'react-icons/fa';
import { fetchApi } from '@/lib/api';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  productCount: number;
  status: 'Active' | 'Inactive';
  image?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', status: 'Active' });
  const [addImgFile, setAddImgFile] = useState<File | null>(null);
  const [addImgPreview, setAddImgPreview] = useState<string | null>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string; status: 'Active' | 'Inactive'; image?: string } | null>(null);
  const [editImgFile, setEditImgFile] = useState<File | null>(null);
  const [editImgPreview, setEditImgPreview] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const catData = await fetchApi('/categories');
      
      let prodData: any = { products: [] };
      try {
        prodData = await fetchApi('/admin/products');
      } catch (e) {
        console.error('Failed to fetch admin products for counts', e);
      }
      
      const counts: Record<string, number> = {};
      prodData.products?.forEach((p: any) => {
        const catId = p.category_id?._id || p.category_id;
        if (catId) {
          counts[catId] = (counts[catId] || 0) + 1;
        }
      });
      
      const mapped = (catData.categories || []).map((c: any) => ({
        id: c._id,
        name: c.name,
        productCount: counts[c._id] || 0,
        status: c.status === 'active' ? 'Active' : 'Inactive',
        image: c.image || '',
      }));
      
      setCategories(mapped);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAddImgFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAddImgPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImgFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImgPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    setSubmitting(true);
    try {
      let imageUrl = '';
      if (addImgFile) {
        const fd = new FormData();
        fd.append('image', addImgFile);
        const uploadRes = await fetchApi('/admin/upload?folder=categories', {
          method: 'POST',
          body: fd,
        });
        if (uploadRes && uploadRes.url) {
          imageUrl = uploadRes.url;
        }
      }

      const response = await fetchApi('/categories', {
        method: 'POST',
        body: JSON.stringify({
          name: newCategory.name,
          status: newCategory.status.toLowerCase(),
          image: imageUrl,
        }),
      });

      if (response.success) {
        toast.success('Category added successfully');
        fetchCategories();
        setNewCategory({ name: '', status: 'Active' });
        setAddImgFile(null);
        setAddImgPreview(null);
        setShowAddModal(false);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to add category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    setSubmitting(true);
    try {
      let imageUrl = editingCategory.image || '';
      if (editImgFile) {
        const fd = new FormData();
        fd.append('image', editImgFile);
        const uploadRes = await fetchApi('/admin/upload?folder=categories', {
          method: 'POST',
          body: fd,
        });
        if (uploadRes && uploadRes.url) {
          imageUrl = uploadRes.url;
        }
      }

      const response = await fetchApi(`/categories/${editingCategory.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: editingCategory.name,
          status: editingCategory.status.toLowerCase(),
          image: imageUrl,
        }),
      });

      if (response.success) {
        toast.success('Category updated successfully');
        fetchCategories();
        setEditingCategory(null);
        setEditImgFile(null);
        setEditImgPreview(null);
        setShowEditModal(false);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetchApi(`/categories/${id}`, {
          method: 'DELETE',
        });
        if (response.success) {
          toast.success('Category deleted successfully');
          fetchCategories();
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete category');
      }
    }
  };

  const toggleCategoryStatus = async (id: string) => {
    const category = categories.find(cat => cat.id === id);
    if (!category) return;
    
    try {
      const nextStatus = category.status === 'Active' ? 'inactive' : 'active';
      const response = await fetchApi(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: category.name,
          status: nextStatus,
          image: category.image || '',
        }),
      });
      if (response.success) {
        toast.success('Category status updated');
        fetchCategories();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-light">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Title */}
      <div className="mb-8">
        <span className="text-text-light text-xs tracking-[0.2em]">CATALOG</span>
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-primary-700 text-[70px] font-semibold leading-none mt-2.5">
            Categories
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-primary-700 text-white px-6 py-3 rounded-full hover:bg-primary-800 transition-colors shadow-lg hover:shadow-xl font-semibold"
          >
            <FaPlus /> Add Category
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                  ) : (
                    <FaGripVertical className="text-primary-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-primary-700">{category.name}</h3>
                  <p className="text-text-light text-sm">{category.productCount} products</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleCategoryStatus(category.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    category.status === 'Active'
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.status}
                </button>
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-border">
              <button
                onClick={() => {
                  setEditingCategory({
                    id: category.id,
                    name: category.name,
                    status: category.status,
                    image: category.image,
                  });
                  setEditImgPreview(category.image || null);
                  setShowEditModal(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-border hover:bg-primary-50 hover:border-primary-300 transition-colors text-text-mid hover:text-primary-700"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-border hover:bg-red-50 hover:border-red-300 transition-colors text-text-mid hover:text-red-600"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 text-text-light">
          No categories found. Try adding one!
        </div>
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="font-serif text-3xl text-primary-700 mb-6">Add New Category</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-text-dark text-sm font-medium mb-2">Category Name *</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <label className="block text-text-dark text-sm font-medium mb-2">Status</label>
                <select
                  value={newCategory.status}
                  onChange={(e) => setNewCategory({ ...newCategory, status: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-text-dark text-sm font-medium mb-2">Category Image</label>
                <div className="border-2 border-dashed border-border rounded-xl p-4 text-center relative cursor-pointer hover:border-primary-400 transition-colors">
                  {addImgPreview ? (
                    <div className="space-y-2">
                      <img src={addImgPreview} alt="Preview" className="max-h-32 mx-auto object-contain rounded-lg" />
                      <button
                        type="button"
                        onClick={() => {
                          setAddImgFile(null);
                          setAddImgPreview(null);
                        }}
                        className="text-xs text-red-600 hover:text-red-700 relative z-10"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 text-text-mid">
                      <FaUpload className="text-xl mx-auto text-text-light" />
                      <p className="text-xs font-semibold">Click to upload image</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAddImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleAddCategory}
                disabled={submitting}
                className="flex-1 bg-primary-700 text-white px-6 py-3 rounded-full hover:bg-primary-800 transition-colors font-semibold disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add Category'}
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewCategory({ name: '', status: 'Active' });
                  setAddImgFile(null);
                  setAddImgPreview(null);
                }}
                className="flex-1 border border-border bg-white text-text-mid px-6 py-3 rounded-full hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="font-serif text-3xl text-primary-700 mb-6">Edit Category</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-text-dark text-sm font-medium mb-2">Category Name *</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <label className="block text-text-dark text-sm font-medium mb-2">Status</label>
                <select
                  value={editingCategory.status}
                  onChange={(e) => setEditingCategory({ ...editingCategory, status: e.target.value as 'Active' | 'Inactive' })}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-text-dark text-sm font-medium mb-2">Category Image</label>
                <div className="border-2 border-dashed border-border rounded-xl p-4 text-center relative cursor-pointer hover:border-primary-400 transition-colors">
                  {editImgPreview ? (
                    <div className="space-y-2">
                      <img src={editImgPreview} alt="Preview" className="max-h-32 mx-auto object-contain rounded-lg" />
                      <button
                        type="button"
                        onClick={() => {
                          setEditImgFile(null);
                          setEditImgPreview(null);
                          setEditingCategory({ ...editingCategory, image: '' });
                        }}
                        className="text-xs text-red-600 hover:text-red-700 relative z-10"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 text-text-mid">
                      <FaUpload className="text-xl mx-auto text-text-light" />
                      <p className="text-xs font-semibold">Click to upload image</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleEditCategory}
                disabled={submitting}
                className="flex-1 bg-primary-700 text-white px-6 py-3 rounded-full hover:bg-primary-800 transition-colors font-semibold disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingCategory(null);
                  setEditImgFile(null);
                  setEditImgPreview(null);
                }}
                className="flex-1 border border-border bg-white text-text-mid px-6 py-3 rounded-full hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}