import React, { useContext, useState } from "react";
import RoomImageSlider from "./RoomImageSlider";
import RoomInfo from "./Roominfo";
import "./RoomDetails.css";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

const RoomCard = ({ room, selectedDateRange, onBookingSuccess }) => {
  const { user } = useContext(UserContext);
  const navigate  = useNavigate();
  const [wished,  setWished]  = useState(false);
  const [booking, setBooking] = useState(false);
  const [booked,  setBooked]  = useState(false);
  const [error,   setError]   = useState("");

  const handleBooking = async () => {
    if (!user) {
      alert("Please login first");
      return navigate("/auth");
    }

    if (!selectedDateRange?.startDate) return;

    setBooking(true);
    setError("");

    try {
      const token  = user.token;
      const userId = user.user?.id;   // ← GET USER ID from context

      if (!token || !userId) {
        setError("Session expired. Please login again.");
        return navigate("/auth");
      }

      const startDate = new Date(selectedDateRange.startDate);
      const endDate   = new Date(selectedDateRange.endDate || selectedDateRange.startDate);

      // Generate all dates in range
      const dates = [];
      const current = new Date(startDate);
      while (current <= endDate) {
        dates.push(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }

      // Book each date
      const responses = await Promise.all(
        dates.map(date =>
          fetch("http://127.0.0.1:8000/api/occupied-dates/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Token ${token}`,
            },
            body: JSON.stringify({
              room: room.id,
              user: userId,   // ← SEND USER ID
              date: date,
            }),
          })
        )
      );

      // Check if any request failed
      const failed = responses.find(r => !r.ok);
      if (failed) {
        const errData = await failed.json();
        setError(errData?.detail || "Booking failed. Please try again.");
        return;
      }

      setBooked(true);
      if (onBookingSuccess) onBookingSuccess();
      setTimeout(() => setBooked(false), 3000);

    } catch (err) {
      console.error("Booking failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  const imageList =
    room?.images && room.images.length > 0
      ? room.images.map(img => img.image)
      : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80"];

  const originalPrice = room.pricePerNight + 1500;
  const discountPct   = Math.round(((originalPrice - room.pricePerNight) / originalPrice) * 100);

  const amenities = [
    room.hasWifi      && { icon: "📶", label: "Free WiFi"  },
    room.hasAC        && { icon: "❄️", label: "AC"          },
    room.hasParking   && { icon: "🅿️", label: "Parking"    },
    room.hasBreakfast && { icon: "🍳", label: "Breakfast"  },
    room.hasTV        && { icon: "📺", label: "TV"          },
    room.hasPool      && { icon: "🏊", label: "Pool"        },
  ].filter(Boolean);

  const nights = selectedDateRange?.startDate && selectedDateRange?.endDate
    ? Math.max(1, Math.ceil(
        (new Date(selectedDateRange.endDate) - new Date(selectedDateRange.startDate))
        / (1000 * 60 * 60 * 24)
      ))
    : 1;

  const totalPrice = room.pricePerNight * nights;

  return (
    <div className="room-card">

      {/* IMAGE */}
      <div className="room-card__img-wrap">
        <RoomImageSlider images={imageList} />
        <span className="room-card__badge">🏢 Company Serviced</span>
        <button
          className={`room-card__wish ${wished ? "room-card__wish--active" : ""}`}
          onClick={() => setWished(!wished)}
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

        {/* Info */}
        <RoomInfo room={room} />

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

        {/* Nights summary */}
        {selectedDateRange?.startDate && (
          <div className="room-card__nights">
            🗓️ {nights} night{nights > 1 ? "s" : ""} ·
            Total: <strong>₹{totalPrice.toLocaleString()}</strong>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="room-card__error">
            ⚠️ {error}
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
              <span className="room-card__saving">Save ₹1500</span>
            </div>
            <span className="room-card__tax">+ taxes & fees</span>
          </div>

          <button
            className={`room-card__btn ${
              !selectedDateRange?.startDate ? "room-card__btn--disabled" : ""
            } ${booked ? "room-card__btn--booked" : ""}`}
            onClick={handleBooking}
            disabled={!selectedDateRange?.startDate || booking}
          >
            {booked  ? "✅ Booked!"   :
             booking ? "Booking..."   :
             selectedDateRange?.startDate ? "Book Now" : "Select Dates"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default RoomCard;