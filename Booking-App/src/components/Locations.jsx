// Locations.jsx
import { useNavigate } from "react-router-dom";
import "./Locations.css";

const cities = [
  { name: "Goa",     emoji: "🏖️", tag: "Beach Vibes",    img: "https://images.unsplash.com/photo-1587922546307-776227941871?w=400&q=80" },
  { name: "Delhi",   emoji: "🏛️", tag: "Capital City",   img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80" },
  { name: "Mumbai",  emoji: "🌆", tag: "City of Dreams",  img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&q=80" },
  { name: "Jaipur",  emoji: "🏯", tag: "Pink City",       img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&q=80" },
  { name: "Manali",  emoji: "🏔️", tag: "Hill Station",    img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=80" },
  { name: "Kerala",  emoji: "🌴", tag: "God's Own Country",img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=80" },
];

const Locations = () => {
  const navigate = useNavigate();

  return (
    <section className="locations-section">

      {/* Header */}
      <div className="locations-header">
        <div className="locations-header__left">
          <span className="locations-badge">📍 Top Destinations</span>
          <h2 className="locations-title">Explore Locations</h2>
          <p className="locations-subtitle">
            From beaches to mountains — find your perfect escape across India.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="locations-grid">
        {cities.map((city, index) => (
          <div
            key={city.name}
            className="location-card"
            style={{ animationDelay: `${index * 0.07}s` }}
            onClick={() => navigate(`/rooms?city=${city.name}`)}
          >
            {/* Image */}
            <div className="location-card__img-wrap">
              <img
                src={city.img}
                alt={city.name}
                className="location-card__img"
              />
              <div className="location-card__overlay" />
            </div>

            {/* Content */}
            <div className="location-card__body">
              <span className="location-card__emoji">{city.emoji}</span>
              <div>
                <h3 className="location-card__name">{city.name}</h3>
                <span className="location-card__tag">{city.tag}</span>
              </div>
              <span className="location-card__arrow">→</span>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default Locations;