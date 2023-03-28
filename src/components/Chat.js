import { useLocation, useNavigate } from "react-router-dom";
import supabaseClient from "../config/supabaseClient";
import { useEffect, useState } from "react";
import "./Chat.css";

function Chat() {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [chatData, setData] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabaseClient
        .from("Messages")
        .select("*")
        .eq("room_name", location.state.room);
      setData(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Create a new channel for our room
    const channel = supabaseClient
      .channel(location.state.room)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Messages",
          filter: `room_name=eq.${location.state.room}`,
        },
        (payload) => {
          let newData = [...chatData];
          console.log(payload);
          newData.push(payload.new);
          setData(newData);
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [supabaseClient, chatData]);

  const onClickHandler = async () => {
    setMessage("");
    await supabaseClient.from("Messages").insert([
      {
        room_name: location.state.room,
        username: location.state.username,
        message: message,
      },
    ]);
  };

  const exitHandler = () => {
    navigate("/", { state: { username: "", room: "" } });
  };
  return (
    <>
      <button onClick={exitHandler}>Exit</button>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "10vh",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "60vw",
            height: "70vh",
            border: "3px solid black",
            overflow: "auto",
          }}
        >
          <div>
            {chatData &&
              chatData.map((obj, idx) => {
                return (
                  <div className="speech-wrapper" style={{ overflow: "auto" }}>
                    <div className="chatbox triangle right-top alt">
                      <div className="txt">
                        <p className="name" style={{ fontWeight: "bold" }}>
                          <h4>{obj.username}</h4>
                        </p>
                        {obj.message}
                        <br />
                        <span className="timestamp">
                          {new Date(obj.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div style={{ position: "fixed", bottom: "8rem", margin: "2px" }}>
            <input
              style={{ minWidth: "55vw", border: "2px solid black" }}
              value={message}
              placeholder="enter Message"
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <button style={{ margin: "3px" }} onClick={onClickHandler}>
              Send
            </button>
          </div>
        </div>
      </div>

      <h1 style={{ display: "grid", placeSelf: "auto" }}>
        Room Name:{location.state.room}
      </h1>
      <h1 style={{ display: "grid", placeSelf: "auto" }}>
        User Name:{location.state.username}
      </h1>
    </>
  );
}

export default Chat;
