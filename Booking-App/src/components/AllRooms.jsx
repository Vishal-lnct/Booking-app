import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // ✅ removed useNavigate — not needed anymore
import RoomCard from "./RoomDetails/RoomCard";
import "./AllRooms.css";

const ROOM_TYPES = ["Deluxe", "Standard", "Suite", "Premium"];
const AMENITIES  = ["Free WiFi", "AC", "Parking", "Breakfast", "TV", "Pool"];

function AllRooms() {
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading,       setLoading]       = useState(true);

  const [maxPrice,          setMaxPrice]          = useState(10000);
  const [selectedTypes,     setSelectedTypes]     = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedOccupancy, setSelectedOccupancy] = useState(null);
  const [selectedRating,    setSelectedRating]    = useState(null);
  const [sidebarOpen,       setSidebarOpen]       = useState(false);

  const locationHook   = useLocation();
  const queryParams    = new URLSearchParams(locationHook.search);
  const searchLocation = queryParams.get("location") || queryParams.get("city");
  const checkIn        = queryParams.get("checkIn");
  const checkOut       = queryParams.get("checkOut");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();

    if (searchLocation)             params.append("city",      searchLocation);
    if (maxPrice < 10000)           params.append("maxPrice",  maxPrice);
    if (selectedOccupancy)          params.append("occupancy", selectedOccupancy);
    if (selectedRating)             params.append("minRating", selectedRating);
    if (selectedTypes.length === 1) params.append("type",      selectedTypes[0].toLowerCase());

    selectedAmenities.forEach(a => {
      if (a === "Free WiFi") params.append("wifi",      "true");
      if (a === "AC")        params.append("ac",        "true");
      if (a === "Parking")   params.append("parking",   "true");
      if (a === "Breakfast") params.append("breakfast", "true");
      if (a === "Pool")      params.append("pool",      "true");
    });

    fetch(`http://127.0.0.1:8000/api/rooms/?${params.toString()}`)
      .then(res => res.json())
      .then(data => { setFilteredRooms(data); setLoading(false); })
      .catch(err  => { console.log(err);      setLoading(false); });

  }, [searchLocation, maxPrice, selectedTypes, selectedOccupancy, selectedAmenities, selectedRating]);

  const toggleType    = t => setSelectedTypes(p =>
    p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
  const toggleAmenity = a => setSelectedAmenities(p =>
    p.includes(a) ? p.filter(x => x !== a) : [...p, a]);
  const toggleRating  = r => setSelectedRating(p => p === r ? null : r);
  const clearFilters  = () => {
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
    (selectedRating    ? 1 : 0) +
    (maxPrice < 10000  ? 1 : 0);

  return (
    <div className="ar-page">

      {/* ── HERO ── */}
      <div className="ar-hero">
        <div className="ar-hero__inner">
          <span className="ar-badge">🛏️ Browse &amp; Book</span>
          <h1 className="ar-title">
            {searchLocation ? `Rooms in ${searchLocation}` : "Available Rooms"}
          </h1>
          <p className="ar-sub">
            {searchLocation ? (
              <>
                Results for <strong>"{searchLocation}"</strong>
                {checkIn && checkOut && <> &middot; {checkIn} → {checkOut}</>}
              </>
            ) : (
              "Handpicked stays at the best prices across India"
            )}
          </p>

          <div className="ar-stats">
            <div className="ar-stat">
              <span className="ar-stat__num">{loading ? "—" : filteredRooms.length}</span>
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

        <button className="ar-filter-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          🎛️ Filters
          {activeCount > 0 && <span className="ar-filter-dot">{activeCount}</span>}
        </button>

        {/* ── SIDEBAR ── */}
        <aside className={`ar-sidebar ${sidebarOpen ? "ar-sidebar--open" : ""}`}>
          <div className="ar-sidebar__head">
            <span className="ar-sidebar__title">Filters</span>
            {activeCount > 0 && (
              <button className="ar-clear" onClick={clearFilters}>Clear all</button>
            )}
          </div>

          <div className="ar-fg">
            <h4 className="ar-fl">💰 Price per Night</h4>
            <div className="ar-price-row">
              <span className="ar-price-from">₹500</span>
              <span className="ar-price-to">up to <strong>₹{maxPrice.toLocaleString()}</strong></span>
            </div>
            <input type="range" min={500} max={10000} step={100}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="ar-slider" />
            <div className="ar-ticks"><span>₹500</span><span>₹10,000</span></div>
          </div>

          <div className="ar-fg">
            <h4 className="ar-fl">🏨 Room Type</h4>
            <div className="ar-chips">
              {ROOM_TYPES.map(t => (
                <button key={t}
                  className={`ar-chip ${selectedTypes.includes(t) ? "ar-chip--on" : ""}`}
                  onClick={() => toggleType(t)}>{t}
                </button>
              ))}
            </div>
          </div>

          <div className="ar-fg">
            <h4 className="ar-fl">👥 Min Guests</h4>
            <div className="ar-chips">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n}
                  className={`ar-chip ${selectedOccupancy === n ? "ar-chip--on" : ""}`}
                  onClick={() => setSelectedOccupancy(selectedOccupancy === n ? null : n)}>{n}+
                </button>
              ))}
            </div>
          </div>

          <div className="ar-fg">
            <h4 className="ar-fl">✨ Amenities</h4>
            <div className="ar-checks">
              {AMENITIES.map(a => (
                <label key={a} className="ar-check">
                  <input type="checkbox"
                    checked={selectedAmenities.includes(a)}
                    onChange={() => toggleAmenity(a)} />
                  <span className="ar-check__box" />
                  <span className="ar-check__lbl">{a}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="ar-fg">
            <h4 className="ar-fl">⭐ Min Rating</h4>
            <div className="ar-chips">
              {[["3+", 3], ["3.5+", 3.5], ["4+", 4], ["4.5+", 4.5]].map(([label, val]) => (
                <button key={label}
                  className={`ar-chip ${selectedRating === val ? "ar-chip--on" : ""}`}
                  onClick={() => toggleRating(val)}>{label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="ar-main">
          {!loading && (
            <div className="ar-result-bar">
              <span className="ar-result-count">
                {filteredRooms.length} {filteredRooms.length === 1 ? "room" : "rooms"} available
              </span>
              {searchLocation && (
                <span className="ar-result-loc">📍 {searchLocation}</span>
              )}
              {activeCount > 0 && (
                <span className="ar-result-filters">
                  {activeCount} filter{activeCount > 1 ? "s" : ""} applied
                  <button onClick={clearFilters}>✕</button>
                </span>
              )}
            </div>
          )}

          {loading && (
            <div className="ar-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="ar-skel">
                  <div className="ar-skel__img" />
                  <div className="ar-skel__body">
                    <div className="ar-skel__line ar-skel__line--t" />
                    <div className="ar-skel__line ar-skel__line--s" />
                    <div className="ar-skel__line ar-skel__line--p" />
                  </div>
                </div>
              ))}
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
                  {/* ✅ Only pass room — RoomCard handles navigation internally */}
                  <RoomCard room={room} />
                </div>
              ))}
            </div>
          )}

          {!loading && filteredRooms.length === 0 && (
            <div className="ar-empty">
              <span>🏨</span>
              <h3>No rooms found</h3>
              <p>Try adjusting your filters or search a different city.</p>
              <button className="ar-empty-btn" onClick={clearFilters}>Clear Filters</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AllRooms;