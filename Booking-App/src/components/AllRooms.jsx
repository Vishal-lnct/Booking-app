import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import RoomCard from "./RoomDetails/RoomCard";
import "./AllRooms.css";
import { aiSearch } from "../api/ai";

const ROOM_TYPES = ["Deluxe", "Standard", "Suite", "Premium"];
const AMENITIES  = ["Free WiFi", "AC", "Parking", "Breakfast", "TV", "Pool"];

function AllRooms() {
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading,       setLoading]       = useState(true);

  const locationHook  = useLocation();
  const queryParams   = new URLSearchParams(locationHook.search);
  const searchLocation = queryParams.get("location") || queryParams.get("city");
  const checkIn       = queryParams.get("checkIn");
  const checkOut      = queryParams.get("checkOut");
  const urlMaxPrice   = queryParams.get("maxPrice");

  const [maxPrice,          setMaxPrice]          = useState(urlMaxPrice ? Number(urlMaxPrice) : 10000);
  const [selectedTypes,     setSelectedTypes]     = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedOccupancy, setSelectedOccupancy] = useState(null);
  const [selectedRating,    setSelectedRating]    = useState(null);
  const [sidebarOpen,       setSidebarOpen]       = useState(false);

  // AI states
  const [aiQuery,   setAiQuery]   = useState("");
  const [isAISearch, setIsAISearch] = useState(false);

  // Normal filter fetch
  useEffect(() => {
    if (isAISearch) return;

    setLoading(true);
    const params = new URLSearchParams();

    if (searchLocation)   params.append("city",      searchLocation);
    if (maxPrice < 10000) params.append("maxPrice",  maxPrice);
    if (selectedOccupancy) params.append("occupancy", selectedOccupancy);
    if (selectedRating)   params.append("minRating", selectedRating);
    if (selectedTypes.length === 1) params.append("type", selectedTypes[0].toLowerCase());

    selectedAmenities.forEach((a) => {
      if (a === "Free WiFi") params.append("wifi",      "true");
      if (a === "AC")        params.append("ac",        "true");
      if (a === "Parking")   params.append("parking",   "true");
      if (a === "Breakfast") params.append("breakfast", "true");
      if (a === "Pool")      params.append("pool",      "true");
    });

    fetch(`http://127.0.0.1:8000/api/rooms/?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => { setFilteredRooms(data); setLoading(false); })
      .catch((err) => { console.log(err); setLoading(false); });
  }, [searchLocation, maxPrice, selectedTypes, selectedOccupancy, selectedAmenities, selectedRating, isAISearch]);

  // AI search
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

  const clearAISearch = () => {
    setIsAISearch(false);
    setAiQuery("");
  };

  const toggleType     = (t) => setSelectedTypes((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t]);
  const toggleAmenity  = (a) => setSelectedAmenities((p) => p.includes(a) ? p.filter((x) => x !== a) : [...p, a]);
  const toggleRating   = (r) => setSelectedRating((p) => (p === r ? null : r));

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
    (selectedRating    ? 1 : 0) +
    (maxPrice < 10000  ? 1 : 0);

  return (
    <div className="ar-page">

      {/* ── HERO ── */}
      <div className="ar-hero">
        <div className="ar-hero__inner">
          <span className="ar-badge">Browse &amp; Book</span>

          <h1 className="ar-title">
            {searchLocation ? `Rooms in ${searchLocation}` : "Available Rooms"}
          </h1>

          <p className="ar-sub">
            {searchLocation ? (
              <>
                Results for <strong>"{searchLocation}"</strong>
                {checkIn && checkOut && <> · {checkIn} → {checkOut}</>}
              </>
            ) : (
              "Handpicked stays at the best prices across India"
            )}
          </p>

          {/* AI Search */}
          <div className="ar-ai-row">
            <div className="ar-ai-input-wrap">
              <svg className="ar-ai-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                placeholder="Try: cheap hotel in Indore with wifi"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAISearch()}
                className="ar-ai-input"
              />
              {isAISearch && (
                <button className="ar-ai-clear" onClick={clearAISearch} aria-label="Clear search">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
            <button className="ar-ai-btn" onClick={handleAISearch}>
              Smart Search
            </button>
          </div>

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
            <span>Free Cancellation</span>
            <span>Pay at Hotel</span>
            <span>Secure Booking</span>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="ar-body">

        {/* Mobile filter toggle */}
        <button className="ar-filter-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
          Filters
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

          {/* Price */}
          <div className="ar-fg">
            <p className="ar-fl">Price per night</p>
            <div className="ar-price-row">
              <span>₹500</span>
              <span className="ar-price-to">Up to <strong>₹{maxPrice.toLocaleString("en-IN")}</strong></span>
            </div>
            <input
              type="range"
              min={500}
              max={10000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="ar-slider"
            />
            <div className="ar-ticks"><span>₹500</span><span>₹10,000</span></div>
          </div>

          {/* Room type */}
          <div className="ar-fg">
            <p className="ar-fl">Room type</p>
            <div className="ar-chips">
              {ROOM_TYPES.map((t) => (
                <button
                  key={t}
                  className={`ar-chip ${selectedTypes.includes(t) ? "ar-chip--on" : ""}`}
                  onClick={() => toggleType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Guests */}
          <div className="ar-fg">
            <p className="ar-fl">Guests</p>
            <div className="ar-chips">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  className={`ar-chip ${selectedOccupancy === n ? "ar-chip--on" : ""}`}
                  onClick={() => setSelectedOccupancy(selectedOccupancy === n ? null : n)}
                >
                  {n === 4 ? "4+" : n}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="ar-fg">
            <p className="ar-fl">Amenities</p>
            <div className="ar-checks">
              {AMENITIES.map((a) => (
                <label key={a} className="ar-check">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(a)}
                    onChange={() => toggleAmenity(a)}
                  />
                  <span className="ar-check__box" />
                  <span className="ar-check__lbl">{a}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="ar-fg">
            <p className="ar-fl">Min. rating</p>
            <div className="ar-chips">
              {[3, 3.5, 4, 4.5].map((r) => (
                <button
                  key={r}
                  className={`ar-chip ${selectedRating === r ? "ar-chip--on" : ""}`}
                  onClick={() => toggleRating(r)}
                >
                  ★ {r}+
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
                <span className="ar-result-loc">{searchLocation}</span>
              )}
              {activeCount > 0 && (
                <span className="ar-result-filters">
                  {activeCount} filter{activeCount > 1 ? "s" : ""} active
                  <button onClick={clearFilters}>✕</button>
                </span>
              )}
              {isAISearch && (
                <span className="ar-ai-badge">Smart Search active</span>
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
                  <RoomCard room={room} />
                </div>
              ))}
            </div>
          )}

          {!loading && filteredRooms.length === 0 && (
            <div className="ar-empty">
              <span>🏨</span>
              <h3>No rooms found</h3>
              <p>Try adjusting your filters or search query.</p>
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