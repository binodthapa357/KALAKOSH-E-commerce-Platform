import "./about.css";

export const metadata = {
  title: "About Us | KALAKOSH",
};

const artisans = [
  {
    name: "Sita Tamang",
    role: "Pashmina Weaver",
    location: "Kathmandu, Nepal",
    img: "images/artisian1.jpg",
  },
  {
    name: "Krishna Shilpakar",
    role: "Wood Carver",
    location: "Bhaktapur, Nepal",
    img: "images/artisian2.jpg",
  },
  {
    name: "Ratna Shakya",
    role: "Metal Smith",
    location: "Patan, Nepal",
    img: "images/artisan3.jpg",
  },
];

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* HERO */}
      <section className="about-hero">
        <div className="about-container">
          <p className="subtitle">कलाकोष</p>
          <h2>About KALAKOSH</h2>
          <p className="hero-text">
            A treasure of Nepali handicrafts bridging Himalayan artisans and
            a global audience that cherishes meaning over mass.
          </p>
        </div>
      </section>

      {/* STORY */}
      <section className="story-section">
        <div className="about-container">
          <div className="story-grid">
            <div className="story-left">
              <h3>OUR STORY</h3>
              <h2>Born in the foothills</h2>

              <p>
                KalaKosh began with a simple thought: the hands that have
                shaped Nepali culture for centuries deserve a stage as wide
                as their craft is deep.
              </p>

              <p>
                From Bhaktapur potters to Patan silversmiths, we walk
                village to village listening, learning and bringing their
                work unaltered and fairly priced to the world.
              </p>
            </div>

            <div className="story-image">
              <img src="/images/story.jpg" alt="Story" />
            </div>
          </div>

          <div className="mission-grid">
            <div className="info-card">
              <h4>Our Mission</h4>
              <p>
                Promote Nepali handicrafts globally without compromising
                authenticity.
              </p>
            </div>

            <div className="info-card">
              <h4>Our Values</h4>
              <p>
                Fair trade, transparency and dignity for every artisan in
                our network.
              </p>
            </div>

            <div className="info-card">
              <h4>Our Vision</h4>
              <p>
                A world where heritage craft is treasured as much as it is
                created.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ARTISANS */}
      <section className="artisan-section">
        <div className="about-container">
          <div className="section-title">
            <p>MEET THE ARTISANS</p>
            <h2>The hands behind the craft</h2>
          </div>

          <div className="artisan-grid">
            {artisans.map((artisan) => (
              <div className="artisan-card" key={artisan.name}>
                <img src={artisan.img} alt="Artisan" />
                <h3>{artisan.name}</h3>
                <span>{artisan.role}</span>
                <p>{artisan.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="about-container">
          <div className="cta-box">
            <h2>Bring a piece of Nepal home</h2>
            <p>Every order weaves you into a story centuries in the making</p>
            <button className="cta-btn">Explore Products →</button>
          </div>
        </div>
      </section>
    </div>
  );
}