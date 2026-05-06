import { useNavigate } from "react-router-dom";
import "./ChatRoomCard.css";

function ChatRoomCard({ room }) {

  const navigate = useNavigate();

  const handleBook = () => {

    if (!room?.id) {
      alert("Room ID missing");
      return;
    }

    navigate(`/rooms/${room.id}`);
  };

  return (

    <div className="chat-room-card">

      {/* IMAGE */}
      <img
        src={
          room.images?.[0]?.image ||
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80"
        }
        alt={room.name}
        className="chat-room-img"
      />

      {/* INFO */}
      <div className="chat-room-content">

        <h3>{room.name}</h3>

        <p>📍 {room.city}</p>

        <p>💰 ₹{room.pricePerNight}</p>

        <p>⭐ {room.rating}</p>

        <button onClick={handleBook}>
          Book Now
        </button>

      </div>

    </div>
  );
}

export default ChatRoomCard;