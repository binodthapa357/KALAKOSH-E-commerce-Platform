//const Navbar = () => {
 // return (
  //  <nav>
    // <h1>Navbar</h1>
    //</nav>
  //);
//};

//export default Navbar;//
"use client";

import { usePathname } from "next/navigation";
import "./Navbar.css";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/categories", label: "Categories" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* TOPBAR */}
      <div className="topbar">
        <div className="container topbar-flex">
          <div>🚚 FREE SHIPPING on orders above Rs. 5000 within Nepal</div>

          <div className="top-links">
            <a href="#">Track Order</a>
            <a href="#">Help &amp; Support</a>
            <a href="#">Vendor</a>
            <a href="#">Admin</a>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header>
        <div className="container">
          <div className="header-item">
            <a
              href="/"
              className="logo-section"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="logo-circle">
                <img src="/images/logo.png" alt="Logo" />
              </div>
              <div className="logo-text">
                <h2>KALAKOSH</h2>
                <p>कलाकोष</p>
              </div>
            </a>

            <nav>
              <ul className="nav-link">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={pathname === link.href ? "active" : ""}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="actions">
              <button>♡</button>
              <button className="cart">
                🛒
                <span>5</span>
              </button>
              <button>👤</button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}