import Image from "next/image";
import Link from "next/link";
import "./about.css";

export const metadata = {
  title: "About Us | KALAKOSH — Living Nepalese Heritage",
  description: "Learn about the mission, values, and master artisans behind the Kalakosh e-commerce platform.",
};

const artisans = [
  {
    name: "Sita Tamang",
    role: "Pashmina Weaver",
    location: "Kathmandu, Nepal",
    img: "/images/artisan.jpg",
  },
  {
    name: "Krishna Shilpakar",
    role: "Wood Carver",
    location: "Bhaktapur, Nepal",
    img: "/images/artist.jpg",
  },
  {
    name: "Ratna Shakya",
    role: "Metal Smith",
    location: "Patan, Nepal",
    img: "/images/artisan.jpg",
  },
];

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* HERO */}
      <section className="about-hero">
        <div className="container">
          <p className="subtitle">कलाकोष · LIVING HERITAGE</p>
          <h1>About KALAKOSH</h1>
          <p className="hero-text">
            A sanctuary of authentic Nepali handicrafts bridging Himalayan artisans and
            a global audience that cherishes sacred devotion and handmade tradition over mass production.
          </p>
        </div>
      </section>

      {/* STORY */}
      <section className="story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-left">
              <h3>OUR STORY</h3>
              <h2>Born in the Foothills of the Himalayas</h2>

              <p>
                KalaKosh began with a simple devotion: the hands that have
                shaped Nepalese culture for centuries deserve a stage as wide
                as their craft is profound.
              </p>

              <p>
                From Bhaktapur clay potters to Patan metal sculptors and Solukhumbu weavers, we walk
                village to village listening, learning, and bringing their
                authentic work directly to conscious homes worldwide.
              </p>
            </div>

            <div className="story-image">
              <Image 
                src="/images/artisan.jpg" 
                alt="Nepalese artisan crafting" 
                fill 
                className="object-cover"
              />
            </div>
          </div>

          <div className="mission-grid">
            <div className="info-card">
              <h4>Our Mission</h4>
              <p>
                Promote sacred and traditional Nepali handicrafts globally while protecting authentic artisan lineages and fair pricing.
              </p>
            </div>

            <div className="info-card">
              <h4>Our Values</h4>
              <p>
                Fair trade, complete transparency, and unconditional dignity for every artisan community in our collective.
              </p>
            </div>

            <div className="info-card">
              <h4>Our Vision</h4>
              <p>
                A world where indigenous master crafts are treasured, protected, and sustained for generations to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ARTISANS */}
      <section className="artisan-section">
        <div className="container">
          <div className="section-title">
            <p>MEET THE ARTISANS</p>
            <h2>The Hands Behind the Craft</h2>
          </div>

          <div className="artisan-grid">
            {artisans.map((artisan) => (
              <div className="artisan-card" key={artisan.name}>
                <div className="relative w-[130px] h-[130px] mx-auto mb-4 rounded-full overflow-hidden border-4 border-[#f7efe7] shadow-sm">
                  <Image 
                    src={artisan.img} 
                    alt={artisan.name}
                    fill
                    className="object-cover"
                  />
                </div>
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
        <div className="container">
          <div className="cta-box">
            <h2>Bring a Piece of Nepal Home</h2>
            <p>Every purchase directly empowers a local artisan family and preserves centuries-old heritage.</p>
            <Link href="/shop" className="cta-btn">
              Explore Collection →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}