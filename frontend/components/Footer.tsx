import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#5C1A1A] px-6 pt-12 pb-6 text-white sm:px-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 border-b border-white/15 pb-10 sm:grid-cols-2 md:grid-cols-5">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-full">
              <Image src="/images/logo.png" alt="Kalakosh logo" fill className="object-cover" />
            </div>
            <span className="text-lg font-serif uppercase tracking-[0.15em]">Kalakosh</span>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-[#E3D4C4]">
            A platform dedicated to preserving and promoting authentic Nepali handicrafts worldwide.
          </p>
          <div className="mt-4 flex gap-3">
            {["facebook-f", "instagram", "x-twitter", "youtube"].map((icon) => (
              <div
                key={icon}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 text-xs hover:bg-white/10"
              >
                <i className={`fa-brands fa-${icon}`}></i>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h5 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#E8B84B]">Categories</h5>
          <ul className="flex flex-col gap-2.5 text-xs text-[#E3D4C4]">
            {["Paintings", "Textiles", "Pottery", "Jewelry", "Wood Crafts"].map((c) => (
              <li key={c} className="cursor-pointer hover:text-white">{c}</li>
            ))}
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h5 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#E8B84B]">Customer Service</h5>
          <ul className="flex flex-col gap-2.5 text-xs text-[#E3D4C4]">
            {["About Us", "Contact Us", "Track Order", "Shipping & Delivery", "Returns & Refunds", "FAQ"].map((c) => (
              <li key={c} className="cursor-pointer hover:text-white">{c}</li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#E8B84B]">Quick Links</h5>
          <ul className="flex flex-col gap-2.5 text-xs text-[#E3D4C4]">
            {["My Account", "Wishlist", "Cart", "Terms & Conditions", "Privacy Policy"].map((c) => (
              <li key={c} className="cursor-pointer hover:text-white">{c}</li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h5 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#E8B84B]">Contact Us</h5>
          <ul className="flex flex-col gap-3 text-xs text-[#E3D4C4]">
            <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> +977 987654321</li>
            <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> info@kalakosh.com</li>
            <li className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Kathmandu, Nepal</li>
          </ul>
          <p className="mt-4 text-[10px] uppercase tracking-wider text-[#C4A3A3]">We accept</p>
          <div className="mt-2 flex gap-3 text-xs">
            <div className="flex h-6 w-9 items-center justify-center rounded border border-white/40"><i className="fa-brands fa-cc-mastercard"></i></div>
            <div className="flex h-6 w-9 items-center justify-center rounded border border-white/40"><i className="fa-brands fa-cc-paypal"></i></div>
            <div className="flex h-6 w-9 items-center justify-center rounded border border-white/40 text-[9px] font-semibold">VISA</div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl pt-6 text-center text-[11px] text-[#C4A3A3]">
        © 2026 KALAKOSH (हस्तकला कोष). All Rights Reserved. Crafted with love in the Himalayas.
      </div>
    </footer>
  );
};

export default Footer;