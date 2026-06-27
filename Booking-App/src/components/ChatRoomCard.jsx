import { useNavigate } from "react-router-dom";
import "./ChatRoomCard.css";

const fallbackImage =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80";

function ChatRoomCard({ room }) {
  const navigate = useNavigate();

  if (!room) return null;

  const image =
    room.images && room.images.length > 0
      ? room.images[0].image
      : fallbackImage;

  const price = room.pricePerNight ?? room.price;
  const amenities = [
    room.hasWifi && "WiFi",
    room.hasAC && "AC",
    room.hasParking && "Parking",
    room.hasBreakfast && "Breakfast",
    room.hasTV && "TV",
    room.hasPool && "Pool",
  ].filter(Boolean);

  return (
    <div className="chat-room-card">
      <img
        className="chat-room-img"
        src={image}
        alt={room.name || "Hotel room"}
      />

      <div className="chat-room-content">
        <div className="chat-room-top">
          <h3>{room.name}</h3>
          <span className="chat-room-rating">Star {room.rating || "N/A"}</span>
        </div>

        <p className="chat-room-city">{room.city || "India"}</p>

        {price && (
          <p className="chat-room-price">
            Rs {Number(price).toLocaleString("en-IN")}
            <span> /night</span>
          </p>
        )}

        {amenities.length > 0 && (
          <div className="chat-room-amenities">
            {amenities.slice(0, 4).map((amenity) => (
              <span key={amenity}>{amenity}</span>
            ))}
          </div>
        )}

        <button onClick={() => navigate(`/rooms/${room.id}`)}>
          View & Book
        </button>
      </div>
    </div>
  );
}

export default ChatRoomCard;
