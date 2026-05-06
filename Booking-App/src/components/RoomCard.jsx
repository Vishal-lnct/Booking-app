const RoomCard = ({ room }) => {
  return (
    <div style={{
      border: "1px solid #ddd",
      padding: "12px",
      margin: "10px",
      borderRadius: "10px"
    }}>
      <h3>{room.name}</h3>
      <p>📍 {room.city}</p>
      <p>💰 ₹{room.price}</p>
      <p>⭐ {room.rating}</p>
      <button>Book Now</button>
    </div>
  );
};

export default RoomCard;