// Hero.jsx
import { useNavigate } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">

      {/* Animated background overlay */}
      <div className="hero__overlay" />

      <div className="hero__content">

        {/* Badge */}
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          India's Most Trusted Hotel Booking
        </div>

        {/* Headline */}
        <h1 className="hero__title">
          Find Your<br />
          <span className="hero__title-accent">Perfect Stay</span>
        </h1>

        {/* Subtitle */}
        <p className="hero__subtitle">
          Discover handpicked hotels across 500+ cities —
          best prices, free cancellation, instant confirmation.
        </p>

        {/* CTA Buttons */}
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
  View Deals →
</button>
        </div>

        {/* Trust badges */}
        <div className="hero__trust">
          <div className="hero__trust-item"><span>✅</span> Free Cancellation</div>
          <div className="hero__trust-item"><span>💳</span> Pay at Hotel</div>
          <div className="hero__trust-item"><span>🔒</span> Secure Booking</div>
          <div className="hero__trust-item"><span>📞</span> 24/7 Support</div>
        </div>

      </div>

      {/* Stats strip */}
      <div className="hero__stats">
        <div className="hero__stat">
          <div className="hero__stat-num">100+</div>
          <div className="hero__stat-lbl">Rooms</div>
        </div>
        <div className="hero__stat-div" />
        <div className="hero__stat">
          <div className="hero__stat-num">50+</div>
          <div className="hero__stat-lbl">Cities</div>
        </div>
        <div className="hero__stat-div" />
        <div className="hero__stat">
          <div className="hero__stat-num">2M+</div>
          <div className="hero__stat-lbl">Happy guests</div>
        </div>
        <div className="hero__stat-div" />
        <div className="hero__stat">
          <div className="hero__stat-num">4.8 ★</div>
          <div className="hero__stat-lbl">Avg rating</div>
        </div>
      </div>

    </section>
  );
};

export default Hero;