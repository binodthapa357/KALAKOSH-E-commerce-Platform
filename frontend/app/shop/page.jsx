// app/shop/page.jsx
import "./shop.css";
import Image from "next/image";

const products = [
  { id: 1, name: "Himalayan Landscape Painting", price: "$120", rating: 4.9, reviews: 128, location: "Kathmandu", material: "Cotton Canvas", image: "/images/product1.jpg" },
  { id: 2, name: "Handwoven Pashmina Shawl",     price: "$85",  rating: 4.8, reviews: 96,  location: "Patan",     material: "Pashmina Wool", image: "/images/product2.jpg" },
  { id: 3, name: "Traditional Clay Pot",         price: "$45",  rating: 4.7, reviews: 54,  location: "Bhaktapur", material: "Clay",          image: "/images/product3.jpg" },
  { id: 4, name: "Silver Mandala Necklace",      price: "$95",  rating: 4.9, reviews: 210, location: "Patan",     material: "Sterling Silver", image: "/images/product4.jpg" },
  { id: 5, name: "Wooden Buddha Sculpture",      price: "$150", rating: 5.0, reviews: 76,  location: "Bhaktapur", material: "Sal Wood",      image: "/images/product5.jpg" },
  { id: 6, name: "Dhaka Fabric",                 price: "$65",  rating: 4.6, reviews: 42,  location: "Kathmandu", material: "Cotton",        image: "/images/product6.jpg" },
  { id: 7, name: "Felt Handmade Bag",            price: "$70",  rating: 4.8, reviews: 88,  location: "Lalitpur",  material: "Wool Felt",     image: "/images/product7.jpg" },
  { id: 8, name: "Khukuri Knife",                price: "$110", rating: 4.9, reviews: 65,  location: "Bhojpur",   material: "Steel & Wood",  image: "/images/product8.jpg" },
];

export default function Shop() {
  return (
    <div className="shop-page">
      {/* TOP BAR */}
      {/* <div className="top-bar">
        <div className="top-bar-inner">
          <p className="top-bar-note">✦ Free shipping worldwide on orders over $150</p>
          <div className="top-bar-links">
            <a href="#">Track Order</a>
            <a href="#">Help & Support</a>
            <a href="#">Vendors</a>
            <a href="#">Admin</a>
            <span className="divider">|</span>
            <a href="#" aria-label="Wishlist">♡</a>
            <a href="#" aria-label="Cart">🛒</a>
            <a href="#" aria-label="Account">👤</a>
          </div>
        </div>
      </div> */}

      {/* HEADER */}
      {/* <header className="site-header">
        <div className="logo">
          <h2>KALAKOSH</h2>
          <span>कलाकोष</span>
        </div>
        <nav className="main-nav">
          <a href="#">Home</a>
          <a href="#" className="active">Shop</a>
          <a href="#">Categories</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>
      </header> */}

      {/* HERO */}
      <section className="shop-hero">
        <p className="hero-subtitle">— ALL TREASURES —</p>
        <h1>Shop the Collection</h1>
        <p className="hero-text">
          Every piece is handmade in Nepal by master artisans and ships worldwide with care.
        </p>
      </section>

      {/* CONTENT */}
      <section className="shop-content">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="filter-top">
            <h3>Filters</h3>
            <button>Clear All</button>
          </div>
          <hr />

          <div className="filter-group">
            <h4>CATEGORY</h4>
            {["Paintings","Textiles","Pottery","Jewelry","Wood Crafts"].map(c => (
              <label key={c}><input type="checkbox" /> {c}</label>
            ))}
          </div>
          <hr />

          <div className="filter-group">
            <h4>PRICE RANGE</h4>
            <input type="range" min="0" max="300" defaultValue="150" />
            <div className="price"><span>$0</span><span>$300</span></div>
          </div>
          <hr />

          <div className="filter-group">
            <h4>REGION</h4>
            {["Kathmandu","Patan","Bhaktapur","Lalitpur"].map(c => (
              <label key={c}><input type="checkbox" /> {c}</label>
            ))}
          </div>
          <hr />

          <div className="filter-group">
            <h4>MATERIAL</h4>
            {["Cotton Canvas","Brass Alloy","Pashmina Wool","Sterling Silver","Clay"].map(c => (
              <label key={c}><input type="checkbox" /> {c}</label>
            ))}
          </div>
        </aside>

        {/* PRODUCTS */}
        <main className="products">
          <div className="products-header">
            <div>
              <h2>Featured Products</h2>
              <p className="results">Showing {products.length} of 48 treasures</p>
            </div>
            <select>
              <option>Sort by: Featured</option>
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          <div className="product-grid">
            {products.map((item) => (
              <div className="product-card" key={item.id}>
                <div className="image-box">
                  <Image src={item.image} alt={item.name} fill className="product-image" />
                  <button className="wish-btn" aria-label="Wishlist">♡</button>
                </div>
                <div className="card-body">
                  <div className="rating">
                    <span className="stars">★</span>
                    <span className="rating-num">{item.rating}</span>
                    <span className="rating-count">({item.reviews})</span>
                  </div>
                  <h3>{item.name}</h3>
                  <p className="meta">{item.location} • {item.material}</p>
                  <div className="card-footer">
                    <span className="price-tag">{item.price}</span>
                    <button className="add-btn">🛒 Add</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </section>

      {/* FOOTER */}
      {/* <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-col">
            <h2 className="footer-logo">KALAKOSH</h2>
            <span className="footer-sub">कलाकोष</span>
            <p>Preserving Nepal's rich heritage through authentic handcrafted treasures made by master artisans.</p>
          </div>
          <div className="footer-col">
            <h4>Categories</h4>
            <a href="#">Paintings</a>
            <a href="#">Textiles</a>
            <a href="#">Pottery</a>
            <a href="#">Jewelry</a>
            <a href="#">Wood Crafts</a>
          </div>
          <div className="footer-col">
            <h4>Customer Service</h4>
            <a href="#">Track Order</a>
            <a href="#">Shipping Info</a>
            <a href="#">Returns</a>
            <a href="#">Help & Support</a>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <a href="#">About Us</a>
            <a href="#">Our Artisans</a>
            <a href="#">Vendors</a>
            <a href="#">Blog</a>
          </div>
          <div className="footer-col">
            <h4>Contact Us</h4>
            <p>Thamel, Kathmandu, Nepal</p>
            <p>hello@kalakosh.com</p>
            <p>+977 1 4123456</p>
            <div className="socials">
              <a href="#">f</a><a href="#">ig</a><a href="#">yt</a><a href="#">in</a>
            </div>
            <div className="pay-badges">
              <span>eSewa</span><span>Khalti</span><span>VISA</span><span>MC</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Kalakosh. Handcrafted with love in Nepal.</p>
        </div>
      </footer> */}
    </div>
  );
}