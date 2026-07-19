'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaPlus, FaEdit, FaTrash, FaImage, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Input } from '@/components/ui/input';

// Mock banners data
const mockBanners = [
  { id: 1, title: 'Spring Collection', image: '/banners/spring.jpg', link: '/shop/spring', status: 'Active', position: 'Homepage Hero' },
  { id: 2, title: 'Handicraft Festival', image: '/banners/festival.jpg', link: '/shop/festival', status: 'Active', position: 'Homepage Banner' },
  { id: 3, title: 'New Arrivals', image: '/banners/new-arrivals.jpg', link: '/shop/new', status: 'Inactive', position: 'Sidebar' },
];

export default function BannersPage() {
  const [banners, setBanners] = useState(mockBanners);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBanner, setNewBanner] = useState({ title: '', link: '', position: 'Homepage Hero', status: 'Active' });

  const toggleBannerStatus = (id: number) => {
    setBanners(banners.map(banner =>
      banner.id === id
        ? { ...banner, status: banner.status === 'Active' ? 'Inactive' : 'Active' }
        : banner
    ));
  };

  const handleAddBanner = () => {
    if (newBanner.title && newBanner.link) {
      setBanners([
        ...banners,
        {
          id: banners.length + 1,
          ...newBanner,
          image: '/banners/placeholder.jpg',
        },
      ]);
      setNewBanner({ title: '', link: '', position: 'Homepage Hero', status: 'Active' });
      setShowAddModal(false);
    }
  };

  const handleDeleteBanner = (id: number) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      setBanners(banners.filter(banner => banner.id !== id));
    }
  };

  return (
    <div>
      {/* Page Title */}
      <div className="mb-8">
        <span className="text-text-light text-xs tracking-[0.2em]">MARKETING</span>
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-primary-700 text-[70px] font-semibold leading-none mt-2.5">
            Banners
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-primary-700 text-white px-6 py-3 rounded-full hover:bg-primary-800 transition-colors shadow-lg hover:shadow-xl"
          >
            <FaPlus /> Add Banner
          </button>
        </div>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow shadow-sm"
          >
            <div className="relative h-48 bg-gray-200 flex items-center justify-center">
              {banner.image ? (
                <Image src={banner.image} alt={banner.title}
                height={100}
                width={100}
                className="w-full h-full object-cover" />
              ) : (
                <FaImage className="text-4xl text-text-light" />
              )}
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => toggleBannerStatus(banner.id)}
                  className={`p-2 rounded-full shadow-lg transition-colors ${
                    banner.status === 'Active'
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-500 text-white hover:bg-gray-600'
                  }`}
                >
                  {banner.status === 'Active' ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-serif text-xl text-primary-700">{banner.title}</h3>
                  <p className="text-text-light text-sm">{banner.position}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  banner.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {banner.status}
                </div>
              </div>
              <p className="text-text-mid text-sm mb-4">Link: {banner.link}</p>
              <div className="flex gap-2 pt-4 border-t border-border">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-border hover:bg-primary-50 hover:border-primary-300 transition-colors text-text-mid hover:text-primary-700">
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDeleteBanner(banner.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-border hover:bg-red-50 hover:border-red-300 transition-colors text-text-mid hover:text-red-600"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Banner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="font-serif text-3xl text-primary-700 mb-6">Add New Banner</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-text-dark text-sm font-medium mb-2">Banner Title *</label>
                <input
                  type="text"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="Enter banner title"
                />
              </div>
              <div>
                <label className="block text-text-dark text-sm font-medium mb-2">Link URL *</label>
                <input
                  type="text"
                  value={newBanner.link}
                  onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="/shop/collection"
                />
              </div>
              <div>
                <label className="block text-text-dark text-sm font-medium mb-2">Position</label>
                <select
                  value={newBanner.position}
                  onChange={(e) => setNewBanner({ ...newBanner, position: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  <option value="Homepage Hero">Homepage Hero</option>
                  <option value="Homepage Banner">Homepage Banner</option>
                  <option value="Sidebar">Sidebar</option>
                  <option value="Footer">Footer</option>
                </select>
              </div>
              <div>
                <label className="block text-text-dark text-sm font-medium mb-2">Image</label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary-400 transition-colors cursor-pointer">
                  <FaImage className="text-3xl text-text-light mx-auto mb-2" />
                  <p className="text-text-mid">Click to upload image</p>
                  <p className="text-text-light text-sm">PNG, JPG up to 5MB</p>
                  <Input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleAddBanner}
                className="flex-1 bg-primary-700 text-white px-6 py-3 rounded-full hover:bg-primary-800 transition-colors font-semibold"
              >
                Add Banner
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