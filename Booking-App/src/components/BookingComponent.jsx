import React, { useEffect, useState, useContext } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import RoomCard from "./RoomDetails/RoomCard";
import { getRooms } from "../api/bookingService";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom"; // ✅ added
import "./BookingComponent.css";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const BookingComponent = () => {
  const { user, token } = useContext(UserContext);
  const navigate        = useNavigate(); // ✅ added

  const isAdmin = user?.is_staff || user?.is_superuser; // ✅ added

  const [selectedDates, setSelectedDates] = useState({ startDate: null, endDate: null });
  const [currentDate,   setCurrentDate]   = useState(new Date());
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [isFiltered,    setIsFiltered]    = useState(false);
  const [error,         setError]         = useState("");
  const [success,       setSuccess]       = useState("");
  const [roomData,      setRoomData]      = useState([]);
  const [occupiedDates, setOccupiedDates] = useState([]);
  const [loading,       setLoading]       = useState(false);

  useEffect(() => {
    getRooms()
      .then(data => setRoomData(data))
      .catch(err => console.error("Error fetching rooms:", err));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/occupied-dates/", {
      headers: { "Content-Type": "application/json" },
    })
      .then(res => res.json())
      .then(data => setOccupiedDates(data))
      .catch(err => console.error("Error fetching occupied dates:", err));
  }, []);

  const handleDateClick = (day, monthOffset = 0) => {
    const clicked = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + monthOffset,
      day
    );
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (clicked < today) return;

    if (!selectedDates.startDate || selectedDates.endDate) {
      setSelectedDates({ startDate: clicked, endDate: null });
    } else if (clicked.getTime() === selectedDates.startDate.getTime()) {
      setSelectedDates({ startDate: clicked, endDate: clicked });
    } else if (clicked > selectedDates.startDate) {
      setSelectedDates({ ...selectedDates, endDate: clicked });
    } else {
      setSelectedDates({ startDate: clicked, endDate: selectedDates.startDate });
    }
    setError("");
  };

  const handleMonthChange = inc => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + inc);
    setCurrentDate(d);
  };

  const generateCalendarDays = () => {
    const year  = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth     = new Date(year, month + 1, 0).getDate();
    const startOfMonth    = new Date(year, month, 1).getDay();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const days = [];

    for (let i = startOfMonth - 1; i >= 0; i--)
      days.push({ day: daysInPrevMonth - i, monthOffset: -1 });
    for (let i = 1; i <= daysInMonth; i++)
      days.push({ day: i, monthOffset: 0 });
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++)
      days.push({ day: i, monthOffset: 1 });

    return days;
  };

  const getDateStatus = (day, monthOffset) => {
    const date  = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, day);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const { startDate, endDate } = selectedDates;

    if (date < today)  return "past";
    if (startDate && date.getTime() === startDate.getTime()) return "start";
    if (endDate   && date.getTime() === endDate.getTime())   return "end";
    if (startDate && endDate && date > startDate && date < endDate) return "range";
    return "";
  };

  const isDateOccupied = (roomId, date) => {
    const dateStr = date.toISOString().split("T")[0];
    return occupiedDates.some(
      occ => String(occ.room) === String(roomId) && occ.date === dateStr
    );
  };

  const getDateRange = (start, end) => {
    const dates = [];
    const current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const nights = selectedDates.startDate && selectedDates.endDate
    ? Math.max(1, Math.ceil(
        (selectedDates.endDate - selectedDates.startDate) / (1000 * 60 * 60 * 24)
      ))
    : 0;

  const handleFilterRooms = () => {
    if (!selectedDates.startDate) { setError("Please select a check-in date."); return; }
    if (!selectedDates.endDate)   { setError("Please select a check-out date."); return; }
    if (selectedDates.startDate.getTime() === selectedDates.endDate.getTime()) {
      setError("Check-out must be after check-in."); return;
    }

    setLoading(true);
    const range    = getDateRange(selectedDates.startDate, selectedDates.endDate);
    const available = roomData.filter(room =>
      range.every(date => !isDateOccupied(room.id, date))
    );

    setTimeout(() => {
      setFilteredRooms(available);
      setIsFiltered(true);
      setError("");
      setLoading(false);
    }, 600);
  };

  const days      = generateCalendarDays();
  const formatDate = d => d
    ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : "—";

  // ✅ Show admin message instead of booking calendar
  if (isAdmin) {
    return (
      <div style={{
        textAlign: "center",
        padding: "3rem 2rem",
        background: "linear-gradient(135deg, #fff8f8, #fff)",
        borderRadius: "16px",
        margin: "2rem auto",
        maxWidth: "500px",
        boxShadow: "0 4px 20px rgba(230,0,35,0.08)",
        border: "1px solid rgba(230,0,35,0.1)"
      }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛠️</div>
        <h3 style={{
          color: "#e60023",
          fontSize: "1.3rem",
          fontWeight: "700",
          margin: "0 0 0.5rem"
        }}>
          Admin Mode Active
        </h3>
        <p style={{
          color: "#666",
          fontSize: "14px",
          lineHeight: "1.6",
          margin: "0 0 1.5rem"
        }}>
          Admins cannot make bookings. Use the Admin Dashboard
          to manage rooms, bookings and users.
        </p>
        <button
          onClick={() => navigate("/admin")}
          style={{
            background: "#e60023",
            color: "white",
            border: "none",
            padding: "12px 28px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            transition: "opacity 0.2s"
          }}
          onMouseOver={e => e.target.style.opacity = "0.85"}
          onMouseOut={e  => e.target.style.opacity = "1"}
        >
          Go to Admin Dashboard →
        </button>
      </div>
    );
  }

  return (
    <div className="bc-wrap">

      {/* Header */}
      <div className="bc-header">
        <div className="bc-header__left">
          <span className="bc-badge">📅 Check Availability</span>
          <h2 className="bc-title">Pick Your Dates</h2>
          <p className="bc-sub">Select check-in & check-out to see available rooms</p>
        </div>
        {user && (
          <div className="bc-header__right" style={{ fontSize: "14px", color: "#666" }}>
            👋 Hi, {user.username}
          </div>
        )}
      </div>

      <div className="bc-body">
        <div className="bc-calendar-card">

          <div className="bc-date-summary">
            <div className={`bc-date-box ${selectedDates.startDate ? "bc-date-box--active" : ""}`}>
              <span className="bc-date-box__label">CHECK-IN</span>
              <span className="bc-date-box__val">{formatDate(selectedDates.startDate)}</span>
            </div>
            <div className="bc-date-arrow">→</div>
            <div className={`bc-date-box ${selectedDates.endDate ? "bc-date-box--active" : ""}`}>
              <span className="bc-date-box__label">CHECK-OUT</span>
              <span className="bc-date-box__val">{formatDate(selectedDates.endDate)}</span>
            </div>
            {nights > 0 && (
              <div className="bc-nights-pill">{nights} night{nights > 1 ? "s" : ""}</div>
            )}
          </div>

          <div className="bc-cal-nav">
            <button className="bc-nav-btn" onClick={() => handleMonthChange(-1)}>
              <FaChevronLeft />
            </button>
            <span className="bc-cal-month">
              {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
            </span>
            <button className="bc-nav-btn" onClick={() => handleMonthChange(1)}>
              <FaChevronRight />
            </button>
          </div>

          <div className="bc-weekdays">
            {WEEKDAYS.map(d => <span key={d}>{d}</span>)}
          </div>

          <div className="bc-days">
            {days.map(({ day, monthOffset }, i) => {
              const status = getDateStatus(day, monthOffset);
              return (
                <div
                  key={i}
                  className={`bc-day
                    ${monthOffset !== 0  ? "bc-day--overflow" : ""}
                    ${status === "past"  ? "bc-day--past"     : ""}
                    ${status === "start" ? "bc-day--start"    : ""}
                    ${status === "end"   ? "bc-day--end"      : ""}
                    ${status === "range" ? "bc-day--range"    : ""}
                  `}
                  onClick={() => handleDateClick(day, monthOffset)}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {error && <p className="bc-error">{error}</p>}

          <button
            className="bc-search-btn"
            onClick={handleFilterRooms}
            disabled={!selectedDates.startDate || !selectedDates.endDate || loading}
          >
            {loading ? "Searching..." : "🔍 Search Available Rooms"}
          </button>
        </div>
      </div>

      {/* Results */}
      {isFiltered && (
        <div className="bc-results">
          <div className="bc-results__header">
            <h3 className="bc-results__title">
              {filteredRooms.length > 0
                ? `${filteredRooms.length} Room${filteredRooms.length > 1 ? "s" : ""} Available`
                : "No Rooms Available"}
            </h3>
            {nights > 0 && (
              <span className="bc-results__sub">
                {formatDate(selectedDates.startDate)} → {formatDate(selectedDates.endDate)} · {nights} nights
              </span>
            )}
          </div>

          {filteredRooms.length > 0 ? (
            <div className="bc-rooms-grid">
              {filteredRooms.map(room => (
                <RoomCard
                  key={room.id}
                  room={room}
                  selectedDateRange={selectedDates}
                  currentUser={user}
                  token={token}
                  onBookingSuccess={() => {
                    setSelectedDates({ startDate: null, endDate: null });
                    setFilteredRooms([]);
                    setIsFiltered(false);
                    setSuccess("🎉 Booking Confirmed!");
                    setTimeout(() => setSuccess(""), 4000);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="bc-empty">
              <span>😔</span>
              <p>No rooms available for the selected dates.</p>
              <button
                className="bc-empty-btn"
                onClick={() => {
                  setIsFiltered(false);
                  setSelectedDates({ startDate: null, endDate: null });
                }}
              >
                Try Different Dates
              </button>
            </div>
          )}
        </div>
      )}

      {success && <div className="bc-success">{success}</div>}
    </div>
  );
};

export default BookingComponent;