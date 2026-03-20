import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (city.trim()) {
      navigate(`/rooms?city=${city}&checkIn=${checkIn}&checkOut=${checkOut}`);
    }
  }

  return (
    <section className="hero">
      <div className="hero-content">

        {/* Badge */}
        <div className="hero-badge">🏨 India's Trusted Hotel Booking</div>

        {/* Heading */}
        <h1 className="hero-title">
          Find Your <span>Perfect</span><br />Stay
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Book hotels at the best prices — comfort, style & savings guaranteed.
        </p>

        {/* Search Bar */}
        <form className="hero-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="🔍  Enter city (Goa, Delhi...)"
            value={city}
            onChange={e => setCity(e.target.value)}
          />
          <div className="hero-search-divider" />
          <input
            type="date"
            value={checkIn}
            onChange={e => setCheckIn(e.target.value)}
          />
          <div className="hero-search-divider" />
          <input
            type="date"
            value={checkOut}
            onChange={e => setCheckOut(e.target.value)}
          />
          <button type="submit" className="hero-search-btn">
            Search
          </button>
        </form>

        {/* Trust Badges */}
        <div className="hero-trust">
          <div className="hero-trust-item">
            <span>✅</span>
            <span>Free Cancellation</span>
          </div>
          <div className="hero-trust-item">
            <span>💳</span>
            <span>Pay at Hotel</span>
          </div>
          <div className="hero-trust-item">
            <span>🔒</span>
            <span>Secure Booking</span>
          </div>
          <div className="hero-trust-item">
            <span>📞</span>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="hero-stats">
        <div className="hero-stat">
          <div className="hero-stat__number">10,000+</div>
          <div className="hero-stat__label">Hotels</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat__number">500+</div>
          <div className="hero-stat__label">Cities</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat__number">2M+</div>
          <div className="hero-stat__label">Happy Guests</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat__number">4.8★</div>
          <div className="hero-stat__label">Avg Rating</div>
        </div>
      </div>
    </section>
  );
};

export default Hero;