"use client";

import React, { useState } from 'react';

export default function DashboardPage() {
  // 'all' shows all sections initially. Clicking individual tabs filters the view.
  const [activeTab, setActiveTab] = useState<'all' | 'profile' | 'orders' | 'wishlist'>('all');
  
  // Static user details matching your exact design requirements
  const [user] = useState({
    name: "Aarya Sharma",
    email: "aaryasharma@gmail.com",
    phone: "+977 987654333",
    address: "Kathmandu, Nepal"
  });

  // Static order items layout matching image_e9b723.png
  const [orders] = useState([
    { id: "KLK-1042", date: "April 10, 2026", price: 268, status: "Delivered" },
    { id: "KLK-1019", date: "March 20, 2026", price: 124, status: "Shipped" }
  ]);

  const [wishlistCount] = useState(0);

  return (
    <div className="min-h-screen bg-[#FBF7F0] flex flex-col font-sans">
      
      {/* ============================== HEADER ====================== */}
      
      {/* =============================== CONTENT WORKSPACE ===================== */}
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* ================= LEFT NAV SIDEBAR ================= */}
        <aside className="bg-white rounded-lg p-8 border border-[#EADCC9] flex flex-col items-center h-fit shadow-sm">
          <div className="w-16 h-16 bg-[#E8D9C5] text-[#5C2E2E] rounded-full flex items-center justify-center text-xl font-semibold mb-3">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-lg font-semibold text-[#5C2E2E] mb-1 text-center">{user.name}</h2>
          <p className="text-[11px] text-gray-400 mb-8 break-all text-center">{user.email}</p>

          <nav className="w-full flex flex-col gap-5 text-left text-sm font-medium text-[#5C2E2E]">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`text-left transition-colors ${activeTab === 'profile' ? 'text-[#8B3232] font-bold' : 'hover:text-[#8B3232]'}`}
            >
              Profile
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`text-left transition-colors ${activeTab === 'orders' ? 'text-[#8B3232] font-bold' : 'hover:text-[#8B3232]'}`}
            >
              Orders
            </button>
            <button 
              onClick={() => setActiveTab('wishlist')}
              className={`text-left transition-colors ${activeTab === 'wishlist' ? 'text-[#8B3232] font-bold' : 'hover:text-[#8B3232]'}`}
            >
              WishList
            </button>
            <hr className="border-[#F1E4D3] my-1" />
            <button className="text-left text-sm font-medium text-[#E57373] hover:text-red-600 transition-colors">
              LogOut
            </button>
          </nav>
        </aside>

        {/* ================= DETAILS SECTION ================= */}
        <div className="md:col-span-3 flex flex-col gap-6 w-full">
          
          {/* PROFILE CARD */}
          {(activeTab === 'all' || activeTab === 'profile') && (
            <section className="bg-white rounded-lg p-6 border border-[#EADCC9] shadow-sm animate-fade-in">
              <h3 className="text-xl font-serif mb-6 text-[#8B3232] font-semibold">Profile Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4 text-sm text-[#5C2E2E]">
                <div>
                  <span className="block text-xs text-gray-400 mb-1">Name</span>
                  <span className="font-medium text-base">{user.name}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 mb-1">Email</span>
                  <span className="font-medium text-base">{user.email}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 mb-1">Phone</span>
                  <span className="font-medium text-base">{user.phone}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 mb-1">Address</span>
                  <span className="font-medium text-base">{user.address}</span>
                </div>
              </div>
            </section>
          )}

          {/* RECENT ORDERS CARD */}
          {(activeTab === 'all' || activeTab === 'orders') && (
            <section className="bg-white rounded-lg p-6 border border-[#EADCC9] shadow-sm">
              <h3 className="text-xl font-serif mb-4 text-[#8B3232] font-semibold">Recent Orders</h3>
              <div className="flex flex-col gap-3">
                {orders.map((order) => (
                  <div key={order.id} className="bg-[#F5EFE6] rounded-md p-4 flex justify-between items-center text-sm text-[#5C2E2E]">
                    <div>
                      <span className="font-semibold block text-base">{order.id}</span>
                      <span className="text-xs text-gray-500">{order.date}</span>
                    </div>
                    <div className="font-serif font-semibold text-[#8B3232] text-base">Rs. {order.price}</div>
                    <div>
                      <span className={`px-4 py-1 rounded-full text-xs font-semibold tracking-wide ${
                        order.status === 'Delivered' ? 'bg-[#E3EED8] text-[#5A823B]' : 'bg-[#FDEBD0] text-[#B7791F]'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* WISHLIST CARD */}
          {(activeTab === 'all' || activeTab === 'wishlist') && (
            <section className="bg-white rounded-lg p-6 border border-[#EADCC9] shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-serif text-[#8B3232] font-semibold">Wishlist</h3>
                <button className="text-xs underline text-gray-400 hover:text-black transition-colors">View All</button>
              </div>
              <p className="text-sm text-gray-500 py-2">
                {wishlistCount === 0 ? "0 saved items" : `${wishlistCount} items saved in wishlist`}
              </p>
            </section>
          )}

        </div>
      </main>
          </div>
  );
}