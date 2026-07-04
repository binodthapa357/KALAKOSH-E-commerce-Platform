const Footer = () => {
  return (
    <>
  <footer className="w-full bg-[#5C1A1A] text-[#FBF7F0] pt-12 pb-6 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 border-b border-[#7D2D2D] pb-10 text-sm">
          <div className="md:col-span-1 flex flex-col gap-4">
            <h4 className="text-lg font-serif font-bold tracking-widest">KALAKOSH</h4>
            <p className="text-xs text-[#E3D4C4] leading-relaxed">
              A platform dedicated to preserving and promoting authentic Nepali handicrafts worldwide.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-4 uppercase text-xs tracking-wider">Categories</h5>
            <ul className="flex flex-col gap-2.5 text-xs text-[#E3D4C4]">
              <li className="hover:text-white cursor-pointer transition-colors">Paintings</li>
              <li className="hover:text-white cursor-pointer transition-colors">Textiles</li>
              <li className="hover:text-white cursor-pointer transition-colors">Pottery</li>
              <li className="hover:text-white cursor-pointer transition-colors">Jewelry</li>
              <li className="hover:text-white cursor-pointer transition-colors">Wood Crafts</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-4 uppercase text-xs tracking-wider">Customer Service</h5>
            <ul className="flex flex-col gap-2.5 text-xs text-[#E3D4C4]">
              <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
              <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
              <li className="hover:text-white cursor-pointer transition-colors">Track Order</li>
              <li className="hover:text-white cursor-pointer transition-colors">Shipping & Delivery</li>
              <li className="hover:text-white cursor-pointer transition-colors">Returns & Refunds</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-4 uppercase text-xs tracking-wider">Quick Links</h5>
            <ul className="flex flex-col gap-2.5 text-xs text-[#E3D4C4]">
              <li className="hover:text-white cursor-pointer transition-colors">My Account</li>
              <li className="hover:text-white cursor-pointer transition-colors">Wishlist</li>
              <li className="hover:text-white cursor-pointer transition-colors">Cart</li>
              <li className="hover:text-white cursor-pointer transition-colors">Terms & Conditions</li>
              <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-4 uppercase text-xs tracking-wider">Contact Us</h5>
            <ul className="flex flex-col gap-3 text-xs text-[#E3D4C4]">
              <li className="flex items-center gap-2">📞 <span>+977 987654321</span></li>
              <li className="flex items-center gap-2">✉️ <span className="break-all">info@kalakosh.com</span></li>
              <li className="flex items-center gap-2">📍 <span>Kathmandu, Nepal</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-[#C4A3A3]">
          <div>© 2026 Kalakosh E-commerce Platform. All rights reserved.</div>
          <div className="flex gap-4">
            <span>eSewa</span>
            <span>Khalti</span>
            <span>Visa/MasterCard</span>
          </div>
        </div>
      </footer>

   
    </>
  );
};

export default Footer;