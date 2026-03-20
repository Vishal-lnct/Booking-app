import { useEffect, useState } from "react";
import RoomCard from "./RoomDetails/RoomCard";

const FeaturedRooms = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/rooms/")
      .then(res => res.json())
      .then(data => setRooms(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Featured Rooms</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px"
      }}>
        {rooms.slice(0, 6).map(room => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedRooms;