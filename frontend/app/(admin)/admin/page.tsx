'use client';

import { useEffect, useRef } from 'react';
import Chart from "chart.js/auto";



export default function AdminDashboard() {
//   const chartRef = useRef<HTMLCanvasElement>(null);
//   const chartInstance = useRef<Chart | null>(null);

//   useEffect(() => {
//     if (chartRef.current) {
//       const ctx = chartRef.current.getContext('2d');
//       if (ctx) {
//         if (chartInstance.current) {
//           chartInstance.current.destroy();
//         }

//         chartInstance.current = new Chart(ctx, {
//           type: 'line',
//           data: {
//             labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//             datasets: [
//               {
//                 label: 'Revenue',
//                 data: [12000, 19000, 15000, 28000, 22000, 35000],
//                 borderColor: '#7B1F1F',
//                 backgroundColor: 'rgba(123, 31, 31, 0.1)',
//                 fill: true,
//                 tension: 0.4,
//                 pointBackgroundColor: '#7B1F1F',
//                 pointBorderColor: '#fff',
//                 pointBorderWidth: 2,
//                 pointRadius: 4,
//                 pointHoverRadius: 6,
//               },
//             ],
//           },
//           options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: {
//               legend: {
//                 display: false,
//               },
//               tooltip: {
//                 backgroundColor: 'rgba(123, 31, 31, 0.9)',
//                 titleColor: '#fff',
//                 bodyColor: '#fff',
//                 cornerRadius: 12,
//                 padding: 12,
//                 callbacks: {
//                   label: function(context) {
//                     return '$' + context.parsed.y.toLocaleString();
//                   }
//                 }
//               }
//             },
//             scales: {
//               y: {
//                 beginAtZero: true,
//                 ticks: {
//                   callback: function(value) {
//                     return '$' + value.toLocaleString();
//                   },
//                   color: '#8B6552',
//                 },
//                 grid: {
//                   color: 'rgba(0,0,0,0.05)',
//                   drawBorder: false,
//                 },
//               },
//               x: {
//                 grid: {
//                   display: false,
//                 },
//                 ticks: {
//                   color: '#2C1A0E',
//                 },
//               },
//             },
//           },
//         }
//     );
//       }
//     }

//     return () => {
//       if (chartInstance.current) {
//         chartInstance.current.destroy();
//       }
//     };
//   }, []);

  const stats = [
    { label: 'TOTAL USERS', value: '4,328', change: '+312 this month' },
    { label: 'TOTAL VENDORS', value: '86', change: '+4 this week' },
    { label: 'TOTAL ORDERS', value: '12,847', change: '+18% YoY' },
    { label: 'TOTAL REVENUE', value: '$184k', change: '+18% YoY' },
  ];

  const recentOrders = [
    { id: 'KLK-3104', user: 'Diya R.', vendor: 'Sita Tamang', total: '$268', status: 'Delivered' },
    { id: 'KLK-3103', user: 'Aarav K.', vendor: 'Krishna Shilpakar', total: '$98', status: 'Shipped' },
    { id: 'KLK-3102', user: 'Maya L.', vendor: 'Ratna Shakya', total: '$79', status: 'Processing' },
    { id: 'KLK-3101', user: 'Bikash T.', vendor: 'Tenzin Lama', total: '$189', status: 'Delivered' },
  ];

  const topProducts = [
    { name: 'Sacred Tara Thangka', count: 142 },
    { name: 'Tibetan Singing Bowl', count: 128 },
    { name: 'Maroon Pashmina Shawl', count: 96 },
    { name: 'Khukuri Heritage Knife', count: 84 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'Shipped':
        return 'bg-blue-100 text-blue-700';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      {/* Page Title */}
      <div className="mb-8">
        <span className="text-text-light text-xs tracking-[0.2em]">OVERVIEW</span>
        <h1 className="font-serif text-primary-700 text-[70px] font-semibold leading-none mt-2.5">
          Platform Health
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5 mb-7">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#F7F2EA] border border-border rounded-2xl p-6">
            <span className="text-text-light text-xs">{stat.label}</span>
            <h2 className="font-serif text-primary-700 text-[54px] font-semibold mt-2">
              {stat.value}
            </h2>
            <p className="text-text-mid text-sm mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      {/* <div className="bg-[#F7F2EA] border border-border rounded-2xl p-7 mb-7">
        <h2 className="font-serif text-primary-700 text-5xl mb-6">Revenue Trend</h2>
        <div className="flex gap-5">
          <div className="flex flex-col justify-between h-[320px] text-text-mid text-sm">
            <span>40000</span>
            <span>30000</span>
            <span>20000</span>
            <span>10000</span>
            <span>0</span>
          </div>
          <div className="flex-1">
            <div className="h-[320px]">
              <canvas ref={chartRef}></canvas>
            </div>
            <div className="flex justify-between mt-3.5 text-text-dark text-sm">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
        </div>
      </div> */}

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Recent Orders Table */}
        <div className="bg-[#F7F2EA] border border-border rounded-2xl p-7">
          <h2 className="font-serif text-primary-700 text-5xl mb-7">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-text-mid text-xs pb-4">ORDER</th>
                  <th className="text-left text-text-mid text-xs pb-4">USER</th>
                  <th className="text-left text-text-mid text-xs pb-4">VENDOR</th>
                  <th className="text-left text-text-mid text-xs pb-4">TOTAL</th>
                  <th className="text-left text-text-mid text-xs pb-4">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-4 border-t border-black/5 text-text-dark text-sm">{order.id}</td>
                    <td className="py-4 border-t border-black/5 text-text-dark text-sm">{order.user}</td>
                    <td className="py-4 border-t border-black/5 text-text-dark text-sm">{order.vendor}</td>
                    <td className="py-4 border-t border-black/5 text-text-dark text-sm">{order.total}</td>
                    <td className="py-4 border-t border-black/5 text-text-dark text-sm">
                      <span className={`px-3.5 py-2 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-[#F7F2EA] border border-border rounded-2xl p-7">
          <h2 className="font-serif text-primary-700 text-5xl mb-7">Top Products</h2>
          {topProducts.map((product, index) => (
            <div key={index} className="flex items-center mb-5">
              <div className="w-8.5 h-8.5 rounded-full bg-secondary-500 flex items-center justify-center text-white text-sm mr-3.5">
                {index + 1}
              </div>
              <div className="flex-1 text-text-dark">{product.name}</div>
              <div className="text-text-mid">{product.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}