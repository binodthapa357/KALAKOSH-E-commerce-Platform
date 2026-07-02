/*const Footer = () => {
  return (
    <nav>
      <h1>Footer</h1>
    </nav>
  );
};

export default Footer;*/

import "./Footer.css";

export default function Footer() {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <div className="footer-logo">
            <div className="footer-logo-circle">क</div>
            <div>
              <h2>KALAKOSH</h2>
              <small>हस्त कला कोष</small>
            </div>
          </div>

          <p>
            A platform dedicated to preserving and promoting authentic
            Nepali handicrafts worldwide.
          </p>

          <div className="footer-socials">
            <div><i className="fa-brands fa-facebook-f"></i></div>
            <div><i className="fa-brands fa-instagram"></i></div>
            <div><i className="fa-brands fa-youtube"></i></div>
            <div><i className="fa-brands fa-twitter"></i></div>
          </div>
        </div>

        <div>
          <h3>Categories</h3>
          <ul>
            <li>Paintings</li>
            <li>Textiles</li>
            <li>Pottery</li>
            <li>Jewelry</li>
            <li>Wood Crafts</li>
          </ul>
        </div>

        <div>
          <h3>Customer Service</h3>
          <ul>
            <li>About Us</li>
            <li>Contact Us</li>
            <li>Track Order</li>
            <li>Shipping &amp; Delivery</li>
            <li>Returns &amp; Refunds</li>
          </ul>
        </div>

        <div>
          <h3>Quick Links</h3>
          <ul>
            <li>My Account</li>
            <li>Wishlist</li>
            <li>Cart</li>
            <li>Terms &amp; Conditions</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div>
          <h3>Contact Us</h3>
          <ul>
            <li>📞 +977 1 1234567</li>
            <li>✉ info@kalakosh.com</li>
            <li>📍 Kathmandu, Nepal</li>
          </ul>

          <div className="payments">
            <span>eSewa</span>
            <span>Khalti</span>
            <span>VISA</span>
            <span>MC</span>
          </div>
        </div>
      </div>
    </footer>
  );
}