// FeaturedRooms.jsx
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FeaturedRooms.css";

const FeaturedRooms = () => {
  const [rooms,   setRooms]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  const navigate   = useNavigate();

  // ✅ Animate section in when it scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/rooms/")
      .then(res => res.json())
      .then(data => { setRooms(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const originalPrice = p => p + 1500;
  const discountPct   = p => Math.round((1500 / (p + 1500)) * 100);

  const amenityIcons = {
    hasWifi:      { icon: "📶", label: "WiFi"      },
    hasAC:        { icon: "❄️",  label: "AC"         },
    hasParking:   { icon: "🅿️",  label: "Parking"   },
    hasBreakfast: { icon: "🍳",  label: "Breakfast" },
    hasTV:        { icon: "📺",  label: "TV"         },
    hasPool:      { icon: "🏊",  label: "Pool"       },
  };

  return (
    <section className="fr-section" ref={sectionRef}>

      {/* ── BOLD HEADER ── */}
      <div className={`fr-header ${visible ? "fr-header--visible" : ""}`}>
        <div className="fr-header__left">
          <span className="fr-badge">
            <span className="fr-badge__dot" />
            Handpicked for you
          </span>
          <h2 className="fr-title">
            Featured
            <span className="fr-title__accent"> Rooms</span>
          </h2>
          <p className="fr-subtitle">
            Top-rated stays — comfort, style & best prices guaranteed
          </p>
        </div>

        <div className="fr-header__right">
          {/* Stats row */}
          <div className="fr-stats">
            <div className="fr-stat">
              <span className="fr-stat__num">{rooms.length || "100"}+</span>
              <span className="fr-stat__lbl">Rooms</span>
            </div>
            <div className="fr-stat__div" />
            <div className="fr-stat">
              <span className="fr-stat__num">★ 4.5</span>
              <span className="fr-stat__lbl">Avg rating</span>
            </div>
            <div className="fr-stat__div" />
            <div className="fr-stat">
              <span className="fr-stat__num">70%</span>
              <span className="fr-stat__lbl">Max off</span>
            </div>
          </div>
          <Link to="/rooms" className="fr-viewall">
            View all rooms →
          </Link>
        </div>
      </div>

      {/* ── SKELETON ── */}
      {loading && (
        <div className="fr-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="fr-skel">
              <div className="fr-skel__img" />
              <div className="fr-skel__body">
                <div className="fr-skel__line fr-skel__line--t" />
                <div className="fr-skel__line fr-skel__line--s" />
                <div className="fr-skel__line fr-skel__line--p" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CARDS ── */}
      {!loading && rooms.length > 0 && (
        <div className="fr-grid">
          {rooms.slice(0, 6).map((room, i) => {
            const imageList = room.images?.length > 0
              ? room.images.map(img => img.image)
              : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80"];

            const amenities = Object.entries(amenityIcons)
              .filter(([key]) => room[key])
              .slice(0, 3);

            return (
              <div
                key={room.id}
                className={`fr-card ${visible ? "fr-card--visible" : ""}`}
                style={{ transitionDelay: `${i * 0.1}s` }}
                onClick={() => navigate(`/rooms/${room.id}`)}
              >
                {/* Image */}
                <div className="fr-card__img-wrap">
                  <img
                    src={imageList[0]}
                    alt={room.name}
                    className="fr-card__img"
                    loading="lazy"
                  />
                  <div className="fr-card__img-overlay" />
                  <span className="fr-card__discount">{discountPct(room.pricePerNight)}% OFF</span>
                  <span className="fr-card__type-badge">{room.type}</span>

                  {/* Hover reveal CTA */}
                  <div className="fr-card__hover-cta">
                    <span>View & Book</span>
                  </div>
                </div>

                {/* Body */}
                <div className="fr-card__body">

                  <div className="fr-card__top">
                    <h3 className="fr-card__name">{room.name}</h3>
                    <div className="fr-card__rating">
                      <span className="fr-card__star">★</span>
                      <span>{room.rating || 4.3}</span>
                    </div>
                  </div>

                  <div className="fr-card__meta">
                    <span>🏙️ {room.city || "India"}</span>
                    <span className="fr-card__dot">·</span>
                    <span>👥 {room.maxOccupancy} guests</span>
                  </div>

                  {amenities.length > 0 && (
                    <div className="fr-card__amenities">
                      {amenities.map(([key, { icon, label }]) => (
                        <span key={key} className="fr-card__amenity">
                          {icon} {label}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="fr-card__divider" />

                  <div className="fr-card__footer">
                    <div className="fr-card__pricing">
                      <div className="fr-card__price">
                        ₹{room.pricePerNight.toLocaleString("en-IN")}
                        <span>/night</span>
                      </div>
                      <div className="fr-card__original">
                        ₹{originalPrice(room.pricePerNight).toLocaleString("en-IN")}
                        <span className="fr-card__save">Save ₹1,500</span>
                      </div>
                    </div>

                    <button
                      className="fr-card__btn"
                      onClick={e => { e.stopPropagation(); navigate(`/rooms/${room.id}`); }}
                    >
                      View & Book
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── EMPTY ── */}
      {!loading && rooms.length === 0 && (
        <div className="fr-empty">
          <span>🏨</span>
          <p>No rooms available right now. Check back soon!</p>
        </div>
      )}

      {/* ── FOOTER CTA ── */}
      {!loading && rooms.length > 0 && (
        <div className="fr-footer">
          <Link to="/rooms" className="fr-cta">
            Explore All {rooms.length}+ Rooms
          </Link>
        </div>
      )}

    </section>
  );
};

export default FeaturedRooms;