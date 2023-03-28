import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [userName, setUserName] = useState(null);
  const [room, setRoom] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (userName === null) {
      alert("please enter a username");
    } else {
      navigate(`/${room}`, { state: { username: userName, room: room } });
    }
  };
  return (
    <div style={{ display: "grid", placeItems: "center", color: "black" }}>
      <h2>Enter Your Username:</h2>
      <input
        type="text"
        placeholder="username"
        value={userName}
        onChange={(e) => {
          setUserName(e.target.value);
        }}
        style={{ border: "2px solid grey" }}
      />
      <h2>Enter RoomName:</h2>
      <input
        type="text"
        placeholder="Room"
        value={room}
        onChange={(e) => {
          setRoom(e.target.value);
        }}
        style={{ border: "2px solid grey" }}
      />

      <button onClick={handleSubmit}>Start Chat</button>
    </div>
  );
};

export default HomePage;
