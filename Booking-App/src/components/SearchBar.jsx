import "./SearchBar.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(
      `/rooms?location=${location}&checkIn=${checkIn}&checkOut=${checkOut}`
    );
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Enter city (Goa, Delhi...)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        type="date"
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
      />

      <input
        type="date"
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
      />

      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;