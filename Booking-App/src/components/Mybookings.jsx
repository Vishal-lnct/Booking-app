import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import "./MyBookings.css";
import axios from "axios";

const MyBookings = () => {
  const { user, token } = useContext(UserContext);
  const navigate = useNavigate();
  const [bookings,    setBookings]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [cancelling,  setCancelling]  = useState(null);
  const [cancelError, setCancelError] = useState("");
  const [activeTab,   setActiveTab]   = useState("all");

  useEffect(() => {
    if (!user || !token) return navigate("/auth");

    axios.get("http://127.0.0.1:8000/api/bookings/", {
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(({ data }) => {
        const today = new Date().toISOString().split("T")[0];

        const list = data.map(booking => {
          const checkIn  = booking.check_in  || booking.checkIn;
          const checkOut = booking.check_out || booking.checkOut;
          const nights   = Math.round(
            (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
          );

          // ✅ Trust backend status first, fallback to date-based logic
          const status =
            booking.status === "cancelled"
              ? "cancelled"
              : checkOut < today
              ? "completed"
              : "upcoming";

          return {
            id:         booking.id,
            roomId:     booking.room || booking.room_id,
            roomName:   booking.room_name || `Room #${booking.room || booking.room_id}`,
            checkIn,
            checkOut,
            nights,
            status,
            totalPrice: booking.total_price || booking.totalPrice || null,
          };
        });

        list.sort((a, b) => {
          const order = { upcoming: 0, cancelled: 1, completed: 2 };
          if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
          return new Date(a.checkIn) - new Date(b.checkIn);
        });

        setBookings(list);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Could not load bookings. Please try again.");
        setLoading(false);
      });
  }, [user, token]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    setCancelling(bookingId);
    setCancelError("");

    try {
      await axios.delete(`http://127.0.0.1:8000/api/bookings/${bookingId}/`, {
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      // ✅ Mark as cancelled instead of removing from list
      setBookings(prev =>
        prev.map(b => b.id === bookingId ? { ...b, status: "cancelled" } : b)
      );

    } catch (err) {
      console.error("Cancel error:", err);

      if (err.response) {
        const message = err.response.data?.detail || "Could not cancel booking.";
        setCancelError(message);
        alert(message);
      } else {
        alert("Network error. Please check your connection and try again.");
      }
    } finally {
      setCancelling(null);
    }
  };

  const formatDate = d => new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  });

  const filtered = activeTab === "all"
    ? bookings
    : bookings.filter(b => b.status === activeTab);

  const statusLabel = (status) => {
  if (status === "upcoming") return "Upcoming";
  if (status === "cancelled") return "Cancelled";
  return "Completed";
};

  return (
    <div className="mb-page">

      {/* ── HERO ── */}
      <div className="mb-hero">
        <div className="mb-hero__inner">
          <span className="mb-badge">📋 Your Trips</span>
          <h1 className="mb-title">My Bookings</h1>
          <p className="mb-sub">
            Track and manage all your hotel reservations in one place.
          </p>

          {!loading && (
            <div className="mb-stats">
              <div className="mb-stat">
                <span className="mb-stat__num">{bookings.length}</span>
                <span className="mb-stat__lbl">Total</span>
              </div>
              <div className="mb-stat__div" />
              <div className="mb-stat">
                <span className="mb-stat__num">
                  {bookings.filter(b => b.status === "upcoming").length}
                </span>
                <span className="mb-stat__lbl">Upcoming</span>
              </div>
              <div className="mb-stat__div" />
              <div className="mb-stat">
                <span className="mb-stat__num">
                  {bookings.filter(b => b.status === "cancelled").length}
                </span>
                <span className="mb-stat__lbl">Cancelled</span>
              </div>
              <div className="mb-stat__div" />
              <div className="mb-stat">
                <span className="mb-stat__num">
                  {bookings.filter(b => b.status === "completed").length}
                </span>
                <span className="mb-stat__lbl">Completed</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="mb-content">

        {/* ✅ Tabs — now includes Cancelled */}
        <div className="mb-tabs">
          {["all", "upcoming", "cancelled", "completed"].map(tab => (
            <button
              key={tab}
              className={`mb-tab ${activeTab === tab ? "mb-tab--active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "all"       ? "All Bookings" :
 tab === "upcoming"  ? "Upcoming" :
 tab === "cancelled" ? "Cancelled" :
                       "Completed"}
              {tab !== "all" && (
                <span className="mb-tab__count">
                  {bookings.filter(b => b.status === tab).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Cancel error banner */}
        {cancelError && (
          <div style={{
            background: "#fff0f2",
            border: "1px solid rgba(230,0,35,0.2)",
            borderRadius: "8px", padding: "12px 16px",
            margin: "0 0 1rem", color: "#e60023", fontSize: "14px"
          }}>
            ⚠️ {cancelError}
          </div>
        )}

        {/* Fetch error */}
        {error && (
          <div style={{
            textAlign: "center", padding: "2rem",
            color: "#e60023", fontSize: "14px"
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="mb-list">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="mb-skeleton">
                <div className="mb-skeleton__img" />
                <div className="mb-skeleton__body">
                  <div className="mb-skeleton__line mb-skeleton__line--t" />
                  <div className="mb-skeleton__line mb-skeleton__line--s" />
                  <div className="mb-skeleton__line mb-skeleton__line--s" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking cards */}
        {!loading && !error && filtered.length > 0 && (
          <div className="mb-list">
            {filtered.map((booking, i) => (
              <div
                key={booking.id}
                className={`mb-card ${booking.status === "cancelled" ? "mb-card--cancelled" : ""}`}
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className="mb-card__icon">🏨</div>

                <div className="mb-card__info">
                  <div className="mb-card__top">
                    <h3 className="mb-card__name">{booking.roomName}</h3>
                    {/* ✅ Status badge now handles cancelled */}
                    <span className={`mb-card__status mb-card__status--${booking.status}`}>
                      {statusLabel(booking.status)}
                    </span>
                  </div>

                  <div className="mb-card__dates">
                    <div className="mb-card__date-block">
                      <span className="mb-card__date-label">CHECK-IN</span>
                      <span className="mb-card__date-val">{formatDate(booking.checkIn)}</span>
                    </div>
                    <div className="mb-card__date-arrow">→</div>
                    <div className="mb-card__date-block">
                      <span className="mb-card__date-label">CHECK-OUT</span>
                      <span className="mb-card__date-val">{formatDate(booking.checkOut)}</span>
                    </div>
                  </div>

                  <div className="mb-card__meta">
                   <span>{booking.nights} night{booking.nights > 1 ? "s" : ""}</span>
                    {booking.totalPrice && (
                    <span>₹{Number(booking.totalPrice).toLocaleString("en-IN")}</span>
                    )}
<span>Booking #{booking.id}</span>
                  </div>
                </div>

                <div className="mb-card__actions">
                  <button
                    className="mb-card__view"
                    onClick={() => navigate(`/rooms/${booking.roomId}`)}
                  >
                    View Room
                  </button>

                  {/* ✅ Cancel button only for upcoming */}
                  {booking.status === "upcoming" && (
                    <button
                      className="mb-card__cancel"
                      onClick={() => handleCancel(booking.id)}
                      disabled={cancelling === booking.id}
                    >
                      {cancelling === booking.id ? (
                        <span style={{
                          display: "flex", alignItems: "center", gap: "6px"
                        }}>
                          <span style={{
                            width: "12px", height: "12px",
                            border: "2px solid rgba(255,255,255,0.4)",
                            borderTop: "2px solid #fff",
                            borderRadius: "50%",
                            animation: "spin 0.7s linear infinite",
                            display: "inline-block"
                          }} />
                          Cancelling...
                        </span>
                      ) : "Cancel Booking"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="mb-empty">
            <span className="mb-empty__icon">
              {activeTab === "upcoming"  ? "✈️" :
               activeTab === "cancelled" ? "❌" :
               activeTab === "completed" ? "✅" : "🏨"}
            </span>
            <h3>
              {activeTab === "all"
                ? "No bookings yet"
                : `No ${activeTab} bookings`}
            </h3>
            <p>
              {activeTab === "all"
                ? "You haven't booked any rooms yet. Start exploring!"
                : `You have no ${activeTab} trips right now.`}
            </p>
            <button
              className="mb-empty__btn"
              onClick={() => navigate("/rooms")}
            >
              Browse Rooms
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyBookings;