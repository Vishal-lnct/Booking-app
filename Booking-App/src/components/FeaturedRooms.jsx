import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RoomCard from "./RoomDetails/RoomCard";
import "./FeaturedRooms.css";

const FeaturedRooms = () => {
  const [rooms,   setRooms]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/rooms/")
      .then(res => res.json())
      .then(data => { setRooms(data); setLoading(false); })
      .catch(err  => { console.log(err); setLoading(false); });
  }, []);

  return (
    <section className="featured-section">

      {/* Header */}
      <div className="featured-header">
        <div className="featured-header__left">
          <span className="featured-badge">✦ Handpicked for you</span>
          <h2 className="featured-title">Featured Rooms</h2>
          <p className="featured-subtitle">
            Discover our top-rated stays — comfort, style & best prices guaranteed.
          </p>
        </div>
        <Link to="/rooms" className="featured-viewall">
          View All Rooms →
        </Link>
      </div>

      {/* Info strip */}
      <div className="featured-info-strip">
        <span>💡 Search with dates in the bar above to enable instant booking</span>
        <Link to="/rooms" className="featured-info-strip__link">
          Browse all rooms →
        </Link>
      </div>

      {/* Skeleton */}
      {loading && (
        <div className="featured-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-img" />
              <div className="skeleton-body">
                <div className="skeleton-line skeleton-line--title" />
                <div className="skeleton-line skeleton-line--short" />
                <div className="skeleton-line skeleton-line--price" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cards — no dates passed, cards show "Search to Book" */}
      {!loading && rooms.length > 0 && (
        <div className="featured-grid">
          {rooms.slice(0, 6).map((room, index) => (
            <div
              key={room.id}
              className="featured-card-wrapper"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <RoomCard
                room={room}
                selectedDateRange={{ startDate: null, endDate: null }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && rooms.length === 0 && (
        <div className="featured-empty">
          <span className="featured-empty__icon">🏨</span>
          <p>No rooms available right now. Check back soon!</p>
        </div>
      )}

      {/* CTA */}
      {!loading && rooms.length > 0 && (
        <div className="featured-footer">
          <Link to="/rooms" className="featured-cta">
            Explore All Rooms
          </Link>
        </div>
      )}

    </section>
  );
};

export default FeaturedRooms;