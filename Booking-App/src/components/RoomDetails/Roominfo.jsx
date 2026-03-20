import React from "react";

const RoomInfo = ({ room }) => {
  return (
    <div className="room-info">
      <h3 className="room-info__name">{room.name}</h3>
      <div className="room-info__meta">
        <span>🏙️ {room.city || "India"}</span>
        <span>👥 {room.maxOccupancy} guests</span>
        <span>🛏️ {room.type}</span>
      </div>
    </div>
  );
};

export default RoomInfo;