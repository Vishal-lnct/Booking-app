import { useNavigate } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      {/* Visual Depth Elements */}
      <div className="hero__background">
        <div className="hero__blob hero__blob--1" />
        <div className="hero__blob hero__blob--2" />
        <div className="hero__overlay" />
      </div>

      <div className="hero__container">
        <div className="hero__content">
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            <span className="hero__badge-text">India's Most Trusted Hotel Booking</span>
          </div>

          <h1 className="hero__title">
            Find Your <br />
            <span className="hero__title-accent">Perfect Stay</span>
          </h1>

          <p className="hero__subtitle">
  Your next memory is just a few clicks away. Explore a curated collection 
  of stays across India, designed to fit your <strong>vibe and your budget</strong> 
  perfectly.
</p>

          <div className="hero__actions">
            <button
              className="hero__btn hero__btn--primary"
              onClick={() => navigate("/rooms")}
            >
              Explore Rooms
            </button>
            <button
              className="hero__btn hero__btn--secondary"
              onClick={() => navigate("/rooms?maxPrice=3000")}
            >
              View Deals 
              <span className="hero__btn-icon">→</span>
            </button>
          </div>
        </div>

        {/* Stats Strip - Integrated with a "Glassmorphism" look */}
        <div className="hero__stats-card">
          <div className="hero__stat">
            <span className="hero__stat-num">100+</span>
            <span className="hero__stat-lbl">Premium Rooms</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-num">50+</span>
            <span className="hero__stat-lbl">Active Cities</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-num">2M+</span>
            <span className="hero__stat-lbl">Happy Guests</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-num">4.8★</span>
            <span className="hero__stat-lbl">User Rating</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;