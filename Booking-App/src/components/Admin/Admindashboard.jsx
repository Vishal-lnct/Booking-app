import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Admindashboard.css";

const AdminDashboard = () => {
  const { user, token } = useContext(UserContext);
  const navigate = useNavigate();

  const [rooms,      setRooms]      = useState([]);
  const [bookings,   setBookings]   = useState([]);
  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [activeTab,  setActiveTab]  = useState("overview");

  // ✅ Add Room form state
  const [showAddRoom,  setShowAddRoom]  = useState(false);
  const [newRoom,      setNewRoom]      = useState({
    name: "", city: "", type: "standard",
    pricePerNight: "", maxOccupancy: "",
    description: "", currency: "INR",
    hasWifi: true, hasAC: true, hasTV: true,
    hasParking: false, hasBreakfast: false, hasPool: false,
  });
  const [addingRoom,   setAddingRoom]   = useState(false);
  const [actionMsg,    setActionMsg]    = useState("");

  const headers = {
    "Authorization": `Token ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    if (!user) return navigate("/auth");
  }, [user]);

  const fetchAll = () => {
    if (!token) return;
    Promise.all([
      axios.get("http://127.0.0.1:8000/api/rooms/",    { headers }),
      axios.get("http://127.0.0.1:8000/api/bookings/", { headers }),
      axios.get("http://127.0.0.1:8000/api/users/",    { headers }),
    ]).then(([roomsRes, bookingsRes, usersRes]) => {
      setRooms(Array.isArray(roomsRes.data)       ? roomsRes.data    : []);
      setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
      setUsers(Array.isArray(usersRes.data)       ? usersRes.data    : []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => { fetchAll(); }, [token]);

  const showMsg = msg => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(""), 3000);
  };

  // ✅ Toggle room availability
  const handleToggleRoom = async (roomId) => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/admin/rooms/${roomId}/toggle/`,
        {},
        { headers }
      );
      const data = res.data;
      setRooms(prev => prev.map(r =>
        r.id === roomId ? { ...r, isAvailable: data.isAvailable } : r
      ));
      showMsg(` ${data.detail}`);
    } catch {
      showMsg(" Failed to toggle room.");
    }
  };

  // Delete room
  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Delete this room permanently?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/rooms/${roomId}/`, { headers });
      setRooms(prev => prev.filter(r => r.id !== roomId));
      showMsg("✅ Room deleted successfully.");
    } catch {
      showMsg(" Failed to delete room.");
    }
  };

  // ✅ Cancel any booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/admin/bookings/${bookingId}/cancel/`,
        {},
        { headers }
      );
      const data = res.data;
      setBookings(prev => prev.map(b =>
        b.id === bookingId ? { ...b, status: "cancelled" } : b
      ));
      showMsg(`✅ ${data.detail}`);
    } catch {
      showMsg("❌ Failed to cancel booking.");
    }
  };

  // ✅ Add new room
  const handleAddRoom = async () => {
    setAddingRoom(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/rooms/",
        {
          ...newRoom,
          pricePerNight: Number(newRoom.pricePerNight),
          maxOccupancy:  Number(newRoom.maxOccupancy),
          rating: 4.0,
          totalReviews: 0,
          isAvailable: true,
        },
        { headers }
      );
      setRooms(prev => [...prev, res.data]);
      setShowAddRoom(false);
      setNewRoom({
        name: "", city: "", type: "standard",
        pricePerNight: "", maxOccupancy: "",
        description: "", currency: "INR",
        hasWifi: true, hasAC: true, hasTV: true,
        hasParking: false, hasBreakfast: false, hasPool: false,
      });
      showMsg("✅ Room added successfully!");
    } catch (err) {
      const errData = err.response?.data;
      showMsg("❌ " + (errData ? JSON.stringify(errData) : "Failed to add room."));
    } finally {
      setAddingRoom(false);
    }
  };

  const totalUpcoming  = bookings.filter(b => b.status === "upcoming").length;

  const formatDate = d => new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  });

  if (loading) return (
    <div className="ad-loading">
      <div className="ad-spinner" />
      <p>Loading dashboard...</p>
    </div>
  );

  return (
    <div className="ad-page">

      {/* HEADER */}
      <div className="ad-header">
        <div className="ad-header__left">
          <h1 className="ad-header__title">🛠️ Admin Dashboard</h1>
          <p className="ad-header__sub">Welcome back, {user?.username}</p>
        </div>
        <button className="ad-back-btn" onClick={() => navigate("/")}>
          ← Back to Site
        </button>
      </div>

      {/* ✅ Action message banner */}
      {actionMsg && (
        <div className="ad-action-msg">{actionMsg}</div>
      )}

      {/* STATS */}
      <div className="ad-stats">
        <div className="ad-stat-card ad-stat-card--blue">
          <span className="ad-stat-card__icon">🏨</span>
          <div>
            <p className="ad-stat-card__num">{rooms.length}</p>
            <p className="ad-stat-card__lbl">Total Rooms</p>
          </div>
        </div>
        <div className="ad-stat-card ad-stat-card--green">
          <span className="ad-stat-card__icon">📋</span>
          <div>
            <p className="ad-stat-card__num">{bookings.length}</p>
            <p className="ad-stat-card__lbl">Total Bookings</p>
          </div>
        </div>
        <div className="ad-stat-card ad-stat-card--orange">
          <span className="ad-stat-card__icon">✈️</span>
          <div>
            <p className="ad-stat-card__num">{totalUpcoming}</p>
            <p className="ad-stat-card__lbl">Upcoming</p>
          </div>
        </div>
        <div className="ad-stat-card ad-stat-card--red">
          <span className="ad-stat-card__icon">👥</span>
          <div>
            <p className="ad-stat-card__num">{users.length}</p>
            <p className="ad-stat-card__lbl">Total Users</p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="ad-tabs">
        {["overview", "bookings", "rooms", "users"].map(tab => (
          <button
            key={tab}
            className={`ad-tab ${activeTab === tab ? "ad-tab--active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "overview" ? "📊 Overview" :
             tab === "bookings" ? "📋 Bookings" :
             tab === "rooms"    ? "🏨 Rooms"    :
                                  "👥 Users"}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="ad-overview">
          <div className="ad-overview__card">
            <h3>📋 Recent Bookings</h3>
            <table className="ad-table">
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Room</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map(b => (
                  <tr key={b.id}>
                    <td>#{b.id}</td>
                    <td>{b.room_name || `Room #${b.room}`}</td>
                    <td>{formatDate(b.check_in)}</td>
                    <td>{formatDate(b.check_out)}</td>
                    <td>
                      <span className={`ad-badge ad-badge--${b.status}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BOOKINGS TAB */}
      {activeTab === "bookings" && (
        <div className="ad-section">
          <h3 className="ad-section__title">
            All Bookings ({bookings.length})
          </h3>
          <table className="ad-table">
            <thead>
              <tr>
                <th>#ID</th>
                <th>Room</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td>{b.room_name || `Room #${b.room}`}</td>
                  <td>{formatDate(b.check_in)}</td>
                  <td>{formatDate(b.check_out)}</td>
                  <td>
                    <span className={`ad-badge ad-badge--${b.status}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>{formatDate(b.created_at)}</td>
                  <td>
                    {/* ✅ Cancel button */}
                    {b.status === "upcoming" && (
                      <button
                        className="ad-btn ad-btn--red"
                        onClick={() => handleCancelBooking(b.id)}
                      >
                        ❌ Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ROOMS TAB */}
      {activeTab === "rooms" && (
        <div className="ad-section">
          <div className="ad-section__head">
            <h3 className="ad-section__title">
              All Rooms ({rooms.length})
            </h3>
            {/* ✅ Add Room button */}
            <button
              className="ad-btn ad-btn--green"
              onClick={() => setShowAddRoom(!showAddRoom)}
            >
              ➕ Add New Room
            </button>
          </div>

          {/* ✅ Add Room Form */}
          {showAddRoom && (
            <div className="ad-add-form">
              <h4>➕ Add New Room</h4>
              <div className="ad-form-grid">
                <input
                  className="ad-input"
                  placeholder="Room Name"
                  value={newRoom.name}
                  onChange={e => setNewRoom({...newRoom, name: e.target.value})}
                />
                <input
                  className="ad-input"
                  placeholder="City"
                  value={newRoom.city}
                  onChange={e => setNewRoom({...newRoom, city: e.target.value})}
                />
                <select
                  className="ad-input"
                  value={newRoom.type}
                  onChange={e => setNewRoom({...newRoom, type: e.target.value})}
                >
                  <option value="standard">Standard</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="premium">Premium</option>
                  <option value="suite">Suite</option>
                </select>
                <input
                  className="ad-input"
                  placeholder="Price per Night (₹)"
                  type="number"
                  value={newRoom.pricePerNight}
                  onChange={e => setNewRoom({...newRoom, pricePerNight: e.target.value})}
                />
                <input
                  className="ad-input"
                  placeholder="Max Occupancy"
                  type="number"
                  value={newRoom.maxOccupancy}
                  onChange={e => setNewRoom({...newRoom, maxOccupancy: e.target.value})}
                />
                <textarea
                  className="ad-input"
                  placeholder="Description"
                  rows={3}
                  value={newRoom.description}
                  onChange={e => setNewRoom({...newRoom, description: e.target.value})}
                  style={{ gridColumn: "1 / -1" }}
                />
              </div>

              {/* Amenities */}
              <div className="ad-amenities">
                {[
                  ["hasWifi",      "WiFi"],
                  ["hasAC",        "AC"],
                  ["hasTV",        "TV"],
                  ["hasParking",   "Parking"],
                  ["hasBreakfast", "Breakfast"],
                  ["hasPool",      "Pool"],
                ].map(([key, label]) => (
                  <label key={key} className="ad-check">
                    <input
                      type="checkbox"
                      checked={newRoom[key]}
                      onChange={e => setNewRoom({...newRoom, [key]: e.target.checked})}
                    />
                    {label}
                  </label>
                ))}
              </div>

              <div className="ad-form-actions">
                <button
                  className="ad-btn ad-btn--green"
                  onClick={handleAddRoom}
                  disabled={addingRoom}
                >
                  {addingRoom ? "Adding..." : "✅ Save Room"}
                </button>
                <button
                  className="ad-btn ad-btn--grey"
                  onClick={() => setShowAddRoom(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <table className="ad-table">
            <thead>
              <tr>
                <th>#ID</th>
                <th>Name</th>
                <th>City</th>
                <th>Type</th>
                <th>Price/Night</th>
                <th>Rating</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(r => (
                <tr key={r.id}>
                  <td>#{r.id}</td>
                  <td>{r.name}</td>
                  <td>{r.city}</td>
                  <td>{r.type}</td>
                  <td>₹{r.pricePerNight?.toLocaleString()}</td>
                  <td>⭐ {r.rating}</td>
                  <td>
                    <span className={`ad-badge ${r.isAvailable
                      ? "ad-badge--upcoming"
                      : "ad-badge--cancelled"}`}>
                      {r.isAvailable ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="ad-actions">
                    {/* ✅ Toggle button */}
                    <button
                      className={`ad-btn ${r.isAvailable
                        ? "ad-btn--orange"
                        : "ad-btn--green"}`}
                      onClick={() => handleToggleRoom(r.id)}
                    >
                      {r.isAvailable ? "🔴 Disable" : "🟢 Enable"}
                    </button>
                    {/* ✅ Delete button */}
                    <button
                      className="ad-btn ad-btn--red"
                      onClick={() => handleDeleteRoom(r.id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === "users" && (
        <div className="ad-section">
          <h3 className="ad-section__title">All Users ({users.length})</h3>
          <table className="ad-table">
            <thead>
              <tr>
                <th>#ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Full Name</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>#{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.full_name || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;