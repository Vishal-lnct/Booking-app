import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import "./MyBookings.css";

const MyBookings = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [bookings,  setBookings]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!user) return navigate("/auth");

    fetch("http://127.0.0.1:8000/api/occupied-dates/", {
      headers: {
        "Authorization": `Token ${user.token}`,
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
      .then(data => {
        // Group by room
        const grouped = {};
        data.forEach(booking => {
          const key = `${booking.room}-${booking.user}`;
          if (!grouped[key]) {
            grouped[key] = {
              id:     booking.id,
              roomId: booking.room,
              dates:  [],
            };
          }
          grouped[key].dates.push(booking.date);
        });

        // Sort dates and build booking list
        const list = Object.values(grouped).map(b => {
          const sorted    = b.dates.sort();
          const checkIn   = sorted[0];
          const checkOut  = sorted[sorted.length - 1];
          const nights    = sorted.length;
          const today     = new Date().toISOString().split("T")[0];
          const status    = checkOut < today ? "completed" : "upcoming";
          return { ...b, checkIn, checkOut, nights, status };
        });

        setBookings(list);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, [user]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;
    setCancelling(bookingId);
    try {
      await fetch(`http://127.0.0.1:8000/api/occupied-dates/${bookingId}/`, {
        method: "DELETE",
        headers: { "Authorization": `Token ${user.token}` },
      });
      setBookings(prev => prev.filter(b => b.id !== bookingId));
    } catch (err) {
      console.log(err);
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

  return (
    <div className="mb-page">

      {/* ── Hero ── */}
      <div className="mb-hero">
        <div className="mb-hero__inner">
          <span className="mb-badge">📋 Your Trips</span>
          <h1 className="mb-title">My Bookings</h1>
          <p className="mb-sub">
            Track and manage all your hotel reservations in one place.
          </p>

          {/* Stats */}
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
                  {bookings.filter(b => b.status === "completed").length}
                </span>
                <span className="mb-stat__lbl">Completed</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mb-content">

        {/* Tabs */}
        <div className="mb-tabs">
          {["all", "upcoming", "completed"].map(tab => (
            <button
              key={tab}
              className={`mb-tab ${activeTab === tab ? "mb-tab--active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "all"       ? "All Bookings" :
               tab === "upcoming"  ? "✈️ Upcoming"   :
                                     "✅ Completed"}
              {tab !== "all" && (
                <span className="mb-tab__count">
                  {bookings.filter(b => b.status === tab).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading Skeleton */}
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

        {/* Booking Cards */}
        {!loading && filtered.length > 0 && (
          <div className="mb-list">
            {filtered.map((booking, i) => (
              <div
                key={booking.id}
                className="mb-card"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                {/* Left — icon */}
                <div className="mb-card__icon">
                  🏨
                </div>

                {/* Center — info */}
                <div className="mb-card__info">
                  <div className="mb-card__top">
                    <h3 className="mb-card__name">Room #{booking.roomId}</h3>
                    <span className={`mb-card__status mb-card__status--${booking.status}`}>
                      {booking.status === "upcoming" ? "✈️ Upcoming" : "✅ Completed"}
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
                    <span>🌙 {booking.nights} night{booking.nights > 1 ? "s" : ""}</span>
                    <span>📅 Booked ID: #{booking.id}</span>
                  </div>
                </div>

                {/* Right — actions */}
                <div className="mb-card__actions">
                  <button
                    className="mb-card__view"
                    onClick={() => navigate(`/rooms`)}
                  >
                    View Room
                  </button>
                  {booking.status === "upcoming" && (
                    <button
                      className="mb-card__cancel"
                      onClick={() => handleCancel(booking.id)}
                      disabled={cancelling === booking.id}
                    >
                      {cancelling === booking.id ? "Cancelling..." : "Cancel"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="mb-empty">
            <span className="mb-empty__icon">
              {activeTab === "upcoming"  ? "✈️" :
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