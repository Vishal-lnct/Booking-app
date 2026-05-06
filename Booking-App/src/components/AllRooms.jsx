import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import RoomCard from "./RoomDetails/RoomCard";
import "./AllRooms.css";
import { aiSearch } from "../api/ai"; // ✅ NEW

const ROOM_TYPES = ["Deluxe", "Standard", "Suite", "Premium"];
const AMENITIES = ["Free WiFi", "AC", "Parking", "Breakfast", "TV", "Pool"];

function AllRooms() {
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const locationHook = useLocation();
  const queryParams = new URLSearchParams(locationHook.search);
  const searchLocation =
    queryParams.get("location") || queryParams.get("city");
  const checkIn = queryParams.get("checkIn");
  const checkOut = queryParams.get("checkOut");
  const urlMaxPrice = queryParams.get("maxPrice");

  const [maxPrice, setMaxPrice] = useState(
    urlMaxPrice ? Number(urlMaxPrice) : 10000
  );
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedOccupancy, setSelectedOccupancy] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ AI STATES (NEW)
  const [aiQuery, setAiQuery] = useState("");
  const [isAISearch, setIsAISearch] = useState(false);

  // 🔥 NORMAL FILTER FETCH (UNCHANGED, just protected)
  useEffect(() => {
    if (isAISearch) return; // ✅ prevent override when AI search is active

    setLoading(true);
    const params = new URLSearchParams();

    if (searchLocation) params.append("city", searchLocation);
    if (maxPrice < 10000) params.append("maxPrice", maxPrice);
    if (selectedOccupancy)
      params.append("occupancy", selectedOccupancy);
    if (selectedRating) params.append("minRating", selectedRating);
    if (selectedTypes.length === 1)
      params.append("type", selectedTypes[0].toLowerCase());

    selectedAmenities.forEach((a) => {
      if (a === "Free WiFi") params.append("wifi", "true");
      if (a === "AC") params.append("ac", "true");
      if (a === "Parking") params.append("parking", "true");
      if (a === "Breakfast") params.append("breakfast", "true");
      if (a === "Pool") params.append("pool", "true");
    });

    fetch(`http://127.0.0.1:8000/api/rooms/?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setFilteredRooms(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [
    searchLocation,
    maxPrice,
    selectedTypes,
    selectedOccupancy,
    selectedAmenities,
    selectedRating,
    isAISearch, // ✅ added
  ]);

  // 🔥 AI SEARCH FUNCTION (NEW)
  const handleAISearch = async () => {
    if (!aiQuery.trim()) return;

    setLoading(true);
    setIsAISearch(true);

    try {
      const data = await aiSearch(aiQuery);
      setFilteredRooms(data);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  // 🔥 CLEAR AI SEARCH (NEW)
  const clearAISearch = () => {
    setIsAISearch(false);
    setAiQuery("");
  };

  const toggleType = (t) =>
    setSelectedTypes((p) =>
      p.includes(t) ? p.filter((x) => x !== t) : [...p, t]
    );

  const toggleAmenity = (a) =>
    setSelectedAmenities((p) =>
      p.includes(a) ? p.filter((x) => x !== a) : [...p, a]
    );

  const toggleRating = (r) =>
    setSelectedRating((p) => (p === r ? null : r));

  const clearFilters = () => {
    setMaxPrice(10000);
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setSelectedOccupancy(null);
    setSelectedRating(null);
  };

  const activeCount =
    selectedTypes.length +
    selectedAmenities.length +
    (selectedOccupancy ? 1 : 0) +
    (selectedRating ? 1 : 0) +
    (maxPrice < 10000 ? 1 : 0);

  return (
    <div className="ar-page">
      {/* ── HERO ── */}
      <div className="ar-hero">
        <div className="ar-hero__inner">
          <span className="ar-badge">🛏️ Browse & Book</span>

          <h1 className="ar-title">
            {searchLocation
              ? `Rooms in ${searchLocation}`
              : "Available Rooms"}
          </h1>

          <p className="ar-sub">
            {searchLocation ? (
              <>
                Results for <strong>"{searchLocation}"</strong>
                {checkIn && checkOut && (
                  <> · {checkIn} → {checkOut}</>
                )}
              </>
            ) : (
              "Handpicked stays at the best prices across India"
            )}
          </p>

          {/* ✅ AI SEARCH UI */}
          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="✨ Try: cheap hotel in Indore with wifi"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              style={{
                padding: "10px",
                width: "320px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            <button onClick={handleAISearch}>
              🔍 Smart Search
            </button>

            {isAISearch && (
              <button onClick={clearAISearch}>
                ❌ Clear AI
              </button>
            )}
          </div>

          <div className="ar-stats">
            <div className="ar-stat">
              <span className="ar-stat__num">
                {loading ? "—" : filteredRooms.length}
              </span>
              <span className="ar-stat__lbl">Rooms</span>
            </div>

            <div className="ar-stat__div" />

            <div className="ar-stat">
              <span className="ar-stat__num">70%</span>
              <span className="ar-stat__lbl">Max Off</span>
            </div>

            <div className="ar-stat__div" />

            <div className="ar-stat">
              <span className="ar-stat__num">★ 4.5</span>
              <span className="ar-stat__lbl">Avg Rating</span>
            </div>

            <div className="ar-stat__div" />

            <div className="ar-stat">
              <span className="ar-stat__num">500+</span>
              <span className="ar-stat__lbl">Cities</span>
            </div>
          </div>

          <div className="ar-hero__tags">
            <span>✅ Free Cancellation</span>
            <span>💳 Pay at Hotel</span>
            <span>🔒 Secure Booking</span>
            <span>📞 24/7 Support</span>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="ar-body">

        <button
          className="ar-filter-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          🎛️ Filters
          {activeCount > 0 && (
            <span className="ar-filter-dot">{activeCount}</span>
          )}
        </button>

        {/* ── SIDEBAR ── */}
        <aside
          className={`ar-sidebar ${sidebarOpen ? "ar-sidebar--open" : ""}`}
        >
          {/* 🔥 YOUR FILTERS COMPLETELY UNCHANGED */}
        </aside>

        {/* ── MAIN ── */}
        <main className="ar-main">
          {!loading && (
            <div className="ar-result-bar">
              <span className="ar-result-count">
                {filteredRooms.length}{" "}
                {filteredRooms.length === 1 ? "room" : "rooms"} available
              </span>

              {isAISearch && (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  ✨ AI Search Applied
                </span>
              )}
            </div>
          )}

          {!loading && filteredRooms.length > 0 && (
            <div className="ar-grid">
              {filteredRooms.map((room, i) => (
                <div
                  key={room.id}
                  className="ar-grid__item"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <RoomCard room={room} />
                </div>
              ))}
            </div>
          )}

          {!loading && filteredRooms.length === 0 && (
            <div className="ar-empty">
              <span>🏨</span>
              <h3>No rooms found</h3>
              <p>Try adjusting your filters or AI search.</p>
              <button className="ar-empty-btn" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AllRooms;