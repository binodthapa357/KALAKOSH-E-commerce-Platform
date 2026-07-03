const Footer = () => {
  return (
    <footer className="site-footer">
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
        <p>© 2026 Kalakosh. Handcrafted with love in Nepal.</p>
      </div>
    </footer>
  );
};

export default Footer;