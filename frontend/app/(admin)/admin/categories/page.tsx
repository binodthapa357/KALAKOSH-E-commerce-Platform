'use client';

import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaGripVertical } from 'react-icons/fa';

// Mock categories data
const mockCategories = [
  { id: 1, name: 'Paintings', productCount: 45, status: 'Active' },
  { id: 2, name: 'Textiles', productCount: 38, status: 'Active' },
  { id: 3, name: 'Pottery', productCount: 22, status: 'Active' },
  { id: 4, name: 'Jewelry', productCount: 56, status: 'Active' },
  { id: 5, name: 'Wood Crafts', productCount: 31, status: 'Inactive' },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(mockCategories);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', status: 'Active' });

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      setCategories([
        ...categories,
        {
          id: categories.length + 1,
          name: newCategory.name,
          productCount: 0,
          status: newCategory.status as 'Active' | 'Inactive',
        },
      ]);
      setNewCategory({ name: '', status: 'Active' });
      setShowAddModal(false);
    }
  };

  const handleDeleteCategory = (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const toggleCategoryStatus = (id: number) => {
    setCategories(categories.map(cat =>
      cat.id === id
        ? { ...cat, status: cat.status === 'Active' ? 'Inactive' : 'Active' }
        : cat
    ));
  };

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
            className="flex items-center gap-2 bg-primary-700 text-white px-6 py-3 rounded-full hover:bg-primary-800 transition-colors shadow-lg hover:shadow-xl"
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
            className="bg-[#F7F2EA] border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
                  <FaGripVertical className="text-primary-400" />
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
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-border hover:bg-primary-50 hover:border-primary-300 transition-colors text-text-mid hover:text-primary-700">
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
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleAddCategory}
                className="flex-1 bg-primary-700 text-white px-6 py-3 rounded-full hover:bg-primary-800 transition-colors font-semibold"
              >
                Add Category
              </button>
              <button
                onClick={() => setShowAddModal(false)}
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