import React, { useState, useContext } from "react";
import RoomImageSlider from "./RoomImageSlider";
import RoomInfo from "./Roominfo";
import "./RoomDetails.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext"; // ✅ import context

const RoomCard = ({ room }) => {
  const navigate            = useNavigate();
  const { user }            = useContext(UserContext); // ✅ get user
  const [wished, setWished] = useState(false);

  const isAdmin = user?.is_staff || user?.is_superuser; // ✅

  const goToRoom = () => navigate(`/rooms/${room.id}`);

  const imageList =
    room?.images && room.images.length > 0
      ? room.images.map(img => img.image)
      : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80"];

  const originalPrice = room.pricePerNight + 1500;
  const discountPct   = Math.round(((originalPrice - room.pricePerNight) / originalPrice) * 100);

  const amenities = [
    room.hasWifi      && { icon: "📶", label: "Free WiFi"  },
    room.hasAC        && { icon: "❄️",  label: "AC"         },
    room.hasParking   && { icon: "🅿️",  label: "Parking"   },
    room.hasBreakfast && { icon: "🍳",  label: "Breakfast" },
    room.hasTV        && { icon: "📺",  label: "TV"         },
    room.hasPool      && { icon: "🏊",  label: "Pool"       },
  ].filter(Boolean);

  return (
    <div className="room-card">

      {/* IMAGE */}
      <div
        className="room-card__img-wrap"
        style={{ cursor: "pointer" }}
        onClick={goToRoom}
      >
        <RoomImageSlider images={imageList} />
        <span className="room-card__badge">🏢 Company Serviced</span>
        <button
          className={`room-card__wish ${wished ? "room-card__wish--active" : ""}`}
          onClick={e => { e.stopPropagation(); setWished(!wished); }}
        >
          {wished ? "❤️" : "🤍"}
        </button>
        <span className="room-card__discount">{discountPct}% OFF</span>
      </div>

      {/* BODY */}
      <div className="room-card__body">

        {/* Rating */}
        <div className="room-card__rating">
          <span className="room-card__stars">★ {room.rating || 4.3}</span>
          <span className="room-card__reviews">({room.totalReviews || 128} reviews)</span>
          <span className="room-card__dot">·</span>
          <span className="room-card__type">{room.type}</span>
        </div>

        {/* Room name */}
        <div style={{ cursor: "pointer" }} onClick={goToRoom}>
          <RoomInfo room={room} />
        </div>

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="room-card__amenities">
            {amenities.slice(0, 3).map(a => (
              <span key={a.label}>{a.icon} {a.label}</span>
            ))}
            {amenities.length > 3 && (
              <span>+{amenities.length - 3} more</span>
            )}
          </div>
        )}

        <div className="room-card__divider" />

        {/* Price + Button */}
        <div className="room-card__footer">
          <div className="room-card__pricing">
            <div className="room-card__price-row">
              <span className="room-card__price">₹{room.pricePerNight}</span>
              <span className="room-card__night">/night</span>
            </div>
            <div className="room-card__old-row">
              <span className="room-card__old">₹{originalPrice}</span>
              <span className="room-card__saving">Save ₹1,500</span>
            </div>
            <span className="room-card__tax">+ taxes & fees</span>
          </div>

          {/* ✅ Hide View & Book for admin, show View Details instead */}
          {isAdmin ? (
            <button
              className="room-card__btn room-card__btn--search"
              onClick={goToRoom}
              style={{ background: "#666" }}
            >
              View Details
            </button>
          ) : (
            <button
              className="room-card__btn room-card__btn--search"
              onClick={goToRoom}
            >
              View & Book
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default RoomCard;