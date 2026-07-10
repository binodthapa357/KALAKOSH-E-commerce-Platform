
import "./contact.css";

export const metadata = {
  title: "Contact | KALAKOSH",
};

export default function ContactPage() {
  return (
    <>
      

      {/* HERO */}
      <section className="contact-hero">
        <p>GET IN TOUCH</p>
        <h1>Contact Us</h1>
        <span>
          We&apos;d love to hear from you — about products, partnerships, or
          just to say नमस्ते.
        </span>
      </section>

      {/* CONTACT */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* FORM */}
            <div className="form-card">
              <h2>Send a message</h2>

              <div className="form-row">
                <div className="input-group">
                  <label>Name</label>
                  <input type="text" />
                </div>

                <div className="input-group">
                  <label>Email</label>
                  <input type="email" />
                </div>
              </div>

              <div className="input-group">
                <label>Subject</label>
                <input type="text" />
              </div>

              <div className="input-group">
                <label>Message</label>
                <textarea></textarea>
              </div>

              <button className="send-btn">Send Message</button>
            </div>

            {/* RIGHT */}
            <div className="side-column">
              <div className="contact-card">
                <h3>Reach us</h3>

                <div className="contact-info">
                  <i className="fa-solid fa-location-dot"></i>
                  <span>Thamel, Kathmandu, Nepal 44600</span>
                </div>

                <div className="contact-info">
                  <i className="fa-solid fa-phone"></i>
                  <span>+977 1 234567</span>
                </div>

                <div className="contact-info">
                  <i className="fa-regular fa-envelope"></i>
                  <span>hello@kalakosh.com</span>
                </div>

                <div className="socials">
                  <div><i className="fa-brands fa-facebook-f"></i></div>
                  <div><i className="fa-brands fa-instagram"></i></div>
                </div>
              </div>

              <div className="map-card">
                <iframe
                  src="https://maps.google.com/maps?q=thamel%20kathmandu&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  title="Map"
                ></iframe>
                <p>Visit us in Thamel, the cultural heart of Kathmandu.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </>
  );
}