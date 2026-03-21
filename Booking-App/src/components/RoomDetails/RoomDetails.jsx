import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import RoomImageSlider from "./RoomImageSlider";
import "./RoomDetails.css";

const AMENITY_MAP = [
  { key: "hasWifi",      icon: "📶", label: "Free WiFi"         },
  { key: "hasAC",        icon: "❄️",  label: "Air Conditioning"  },
  { key: "hasParking",   icon: "🅿️",  label: "Free Parking"      },
  { key: "hasBreakfast", icon: "🍳",  label: "Breakfast"          },
  { key: "hasTV",        icon: "📺",  label: "Smart TV"           },
  { key: "hasPool",      icon: "🏊",  label: "Swimming Pool"      },
];

const RoomDetails = () => {
  const { id }          = useParams();
  const { user, token } = useContext(UserContext);
  const navigate        = useNavigate();

  const [room,    setRoom]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/rooms/${id}/`)
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => { setRoom(data); setLoading(false); })
      .catch(() => { setError("Room not found."); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div className="rd-loading">
      <div className="rd-spinner" />
      <p>Loading room details...</p>
    </div>
  );

  if (error) return (
    <div className="rd-error-page">
      <span>😔</span>
      <h3>Room not found</h3>
      <button onClick={() => navigate("/rooms")}>Browse All Rooms</button>
    </div>
  );

  const imageList = room.images?.length > 0
    ? room.images.map(img => img.image)
    : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"];

  const amenities     = AMENITY_MAP.filter(a => room[a.key]);
  const originalPrice = room.pricePerNight + 1500;
  const discountPct   = Math.round(((originalPrice - room.pricePerNight) / originalPrice) * 100);
  const savings       = originalPrice - room.pricePerNight;

  return (
    <div className="rd-page">

      {/* ── BACK ── */}
      <div className="rd-back-wrap">
        <button className="rd-back" onClick={() => navigate(-1)}>
          ← Back to rooms
        </button>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="rd-hero">

        {/* LEFT — Images + Details */}
        <div className="rd-hero__left">

          {/* Image slider */}
          <div className="rd-hero__img">
            <RoomImageSlider images={imageList} />
            <span className="rd-discount-badge">{discountPct}% OFF</span>
          </div>

          {/* Room type pill */}
          <div className="rd-type-pill">{room.type}</div>

          {/* Name */}
          <h1 className="rd-name">{room.name}</h1>

          {/* Meta */}
          <div className="rd-meta">
            <span>🏙️ {room.city || "India"}</span>
            <span className="rd-meta__dot">·</span>
            <span>👥 Up to {room.maxOccupancy} guests</span>
            <span className="rd-meta__dot">·</span>
            <span>🛏️ {room.type}</span>
          </div>

          {/* Rating */}
          <div className="rd-rating">
            <div className="rd-rating__stars">
              {"★".repeat(Math.round(room.rating || 4))}
              {"☆".repeat(5 - Math.round(room.rating || 4))}
            </div>
            <span className="rd-rating__score">{room.rating || 4.3}</span>
            <span className="rd-rating__count">({room.totalReviews || 0} reviews)</span>
          </div>

          {/* Divider */}
          <div className="rd-section-divider" />

          {/* Description */}
          {room.description && (
            <>
              <h3 className="rd-section-title">About this room</h3>
              <p className="rd-desc">{room.description}</p>
            </>
          )}

          {/* Divider */}
          <div className="rd-section-divider" />

          {/* Amenities */}
          {amenities.length > 0 && (
            <>
              <h3 className="rd-section-title">What this place offers</h3>
              <div className="rd-amenities">
                {amenities.map(a => (
                  <div key={a.key} className="rd-amenity">
                    <span className="rd-amenity__icon">{a.icon}</span>
                    <span className="rd-amenity__label">{a.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Divider */}
          <div className="rd-section-divider" />

          {/* Trust badges */}
          <div className="rd-trust">
            <div className="rd-trust__item">
              <span>✅</span>
              <div>
                <strong>Free cancellation</strong>
                <p>Cancel anytime before check-in</p>
              </div>
            </div>
            <div className="rd-trust__item">
              <span>💳</span>
              <div>
                <strong>Pay at hotel</strong>
                <p>No upfront payment required</p>
              </div>
            </div>
            <div className="rd-trust__item">
              <span>🔒</span>
              <div>
                <strong>Secure booking</strong>
                <p>Your data is safe with us</p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT — Sticky booking card */}
        <div className="rd-hero__right">
          <div className="rd-sticky-card">

            {/* Price header */}
            <div className="rd-sticky-card__header">
              <div>
                <div className="rd-sticky-card__price">
                  ₹{room.pricePerNight.toLocaleString("en-IN")}
                  <span>/night</span>
                </div>
                <div className="rd-sticky-card__original">
                  <s>₹{originalPrice.toLocaleString("en-IN")}</s>
                  <span className="rd-sticky-card__save">Save ₹{savings.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <div className="rd-sticky-card__rating">
                <span>★</span>
                <strong>{room.rating || 4.3}</strong>
                <span>({room.totalReviews || 0})</span>
              </div>
            </div>

            {/* ✅ Booking form directly here — no scroll needed */}
            {user ? (
              <SingleRoomBooking room={room} token={token} />
            ) : (
              <div className="rd-login-prompt">
                <span className="rd-login-prompt__icon">🔐</span>
                <h3>Login to book</h3>
                <p>Sign in to your StayEase account</p>
                <button onClick={() => navigate("/auth")}>
                  Sign In / Register
                </button>
              </div>
            )}

            {/* Tax note */}
            <p className="rd-sticky-card__tax">
              + taxes & fees · You won't be charged yet
            </p>

          </div>
        </div>

      </div>

    </div>
  );
};


// ── Booking Form ─────────────────────────────────────────────────
const SingleRoomBooking = ({ room, token }) => {
  const navigate = useNavigate();
  const [checkIn,  setCheckIn]  = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [booking,  setBooking]  = useState(false);
  const [booked,   setBooked]   = useState(false);
  const [error,    setError]    = useState("");

  const today  = new Date().toISOString().split("T")[0];
  const nights = checkIn && checkOut
    ? Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000)
    : 0;
  const totalPrice = nights > 0 ? nights * room.pricePerNight : 0;

  const handleBook = async () => {
    if (!checkIn || !checkOut) { setError("Please select both dates."); return; }
    if (nights <= 0)           { setError("Check-out must be after check-in."); return; }

    setBooking(true); setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/bookings/", {
        method: "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Token ${token}`,
        },
        body: JSON.stringify({
          room:      room.id,
          check_in:  checkIn,
          check_out: checkOut,
        }),
      });

      if (!res.ok) {
        const e = await res.json();
        setError(
          e?.detail ||
          e?.non_field_errors?.[0] ||
          e?.check_in?.[0] ||
          e?.check_out?.[0] ||
          "Booking failed. Please try again."
        );
        return;
      }

      setBooked(true);
      setTimeout(() => navigate("/my-bookings"), 2500);

    } catch { setError("Something went wrong. Please try again."); }
    finally  { setBooking(false); }
  };

  if (booked) return (
    <div className="rd-booked-success">
      <div className="rd-booked-success__icon">🎉</div>
      <h3>Booking Confirmed!</h3>
      <p>Redirecting to your bookings...</p>
      <div className="rd-booked-success__bar" />
    </div>
  );

  return (
    <div className="rd-form">

      {/* Date pickers */}
      <div className="rd-form__dates">
        <div className="rd-form__date-field">
          <label>CHECK-IN</label>
          <input
            type="date"
            min={today}
            value={checkIn}
            onChange={e => { setCheckIn(e.target.value); setError(""); }}
          />
        </div>
        <div className="rd-form__divider" />
        <div className="rd-form__date-field">
          <label>CHECK-OUT</label>
          <input
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={e => { setCheckOut(e.target.value); setError(""); }}
          />
        </div>
      </div>

      {/* Price breakdown */}
      {nights > 0 && (
        <div className="rd-form__breakdown">
          <div className="rd-form__breakdown-row">
            <span>₹{room.pricePerNight.toLocaleString("en-IN")} × {nights} night{nights > 1 ? "s" : ""}</span>
            <span>₹{totalPrice.toLocaleString("en-IN")}</span>
          </div>
          <div className="rd-form__breakdown-row rd-form__breakdown-row--total">
            <span>Total</span>
            <span>₹{totalPrice.toLocaleString("en-IN")}</span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && <div className="rd-form__error">⚠️ {error}</div>}

      {/* Submit */}
      <button
        className="rd-form__btn"
        onClick={handleBook}
        disabled={booking}
      >
        {booking
          ? "Confirming..."
          : nights > 0
            ? `Confirm — ₹${totalPrice.toLocaleString("en-IN")}`
            : "Select dates to book"}
      </button>

    </div>
  );
};

export default RoomDetails;