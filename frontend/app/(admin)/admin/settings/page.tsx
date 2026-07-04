'use client';

import { useState } from 'react';
import { FaSave, FaStore, FaPalette, FaShippingFast, FaCreditCard, FaEnvelope, FaGlobe } from 'react-icons/fa';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: FaGlobe },
    { id: 'store', label: 'Store', icon: FaStore },
    { id: 'appearance', label: 'Appearance', icon: FaPalette },
    { id: 'shipping', label: 'Shipping', icon: FaShippingFast },
    { id: 'payment', label: 'Payment', icon: FaCreditCard },
    { id: 'email', label: 'Email', icon: FaEnvelope },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-text-dark text-sm font-medium mb-2">Site Name</label>
              <input
                type="text"
                defaultValue="KALAKOSH"
                className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div>
              <label className="block text-text-dark text-sm font-medium mb-2">Tagline</label>
              <input
                type="text"
                defaultValue="Nepali Handicrafts"
                className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div>
              <label className="block text-text-dark text-sm font-medium mb-2">Default Currency</label>
              <select className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400">
                <option value="NPR">NPR - Nepalese Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>
          </div>
        );
      case 'store':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-text-dark text-sm font-medium mb-2">Store Email</label>
              <input
                type="email"
                defaultValue="info@kalakosh.com"
                className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div>
              <label className="block text-text-dark text-sm font-medium mb-2">Store Phone</label>
              <input
                type="text"
                defaultValue="+977 1 1234567"
                className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div>
              <label className="block text-text-dark text-sm font-medium mb-2">Store Address</label>
              <textarea
                rows={3}
                defaultValue="Kathmandu, Nepal"
                className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
              />
            </div>
          </div>
        );
      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-text-dark text-sm font-medium mb-2">Primary Color</label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  defaultValue="#7B1F1F"
                  className="w-16 h-16 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  defaultValue="#7B1F1F"
                  className="flex-1 px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-text-dark text-sm font-medium mb-2">Secondary Color</label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  defaultValue="#C9973A"
                  className="w-16 h-16 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  defaultValue="#C9973A"
                  className="flex-1 px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-12 text-text-light">
            <p className="text-lg">Settings for {activeTab} coming soon</p>
          </div>
        );
    }
  };

  return (
    <div>
      {/* Page Title */}
      <div className="mb-8">
        <span className="text-text-light text-xs tracking-[0.2em]">CONFIGURATION</span>
        <h1 className="font-serif text-primary-700 text-[70px] font-semibold leading-none mt-2.5">
          Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Tabs */}
        <div className="bg-[#F7F2EA] border border-border rounded-2xl p-4 h-fit sticky top-4">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
                    activeTab === tab.id
                      ? 'bg-primary-700 text-white'
                      : 'text-text-mid hover:bg-primary-50 hover:text-primary-700'
                  }`}
                >
                  <Icon />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-[#F7F2EA] border border-border rounded-2xl p-7">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-3xl text-primary-700 capitalize">{activeTab} Settings</h2>
            <button className="flex items-center gap-2 bg-primary-700 text-white px-6 py-3 rounded-full hover:bg-primary-800 transition-colors shadow-lg hover:shadow-xl">
              <FaSave /> Save Changes
            </button>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}