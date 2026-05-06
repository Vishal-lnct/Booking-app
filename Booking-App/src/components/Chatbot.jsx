import { useState, useRef, useEffect } from "react";
import { sendMessage } from "../api/chat";
import ChatRoomCard from "./ChatRoomCard";
import "./Chatbot.css";

function Chatbot() {

  // ================== STATES ==================
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      text: "Hi 👋 Ask me for hotel suggestions!",
      sender: "bot",
    },
  ]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);



  // ================== AUTO SCROLL ==================
  useEffect(() => {

    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);



  // ================== SEND MESSAGE ==================
  const handleSend = async () => {

    // prevent empty input
    if (!input.trim() || loading) return;

    // save current message
    const currentMessage = input;

    // ================== USER MESSAGE ==================
    const userMsg = {
      text: currentMessage,
      sender: "user",
    };

    // add user message
    setMessages((prev) => [
      ...prev,
      userMsg,
    ]);

    // clear input
    setInput("");

    // loading ON
    setLoading(true);

    try {

      // ================== API CALL ==================
      const res = await sendMessage(currentMessage);

      console.log("FULL API RESPONSE:", res);

      // ================== COMBINED BOT RESPONSE ==================
      const botMessage = {
        text: res.reply || "",
        rooms: res.rooms || [],
        sender: "bot",
      };

      setMessages((prev) => [
        ...prev,
        botMessage,
      ]);

    } catch (error) {

      console.log("CHATBOT ERROR:", error);

      setMessages((prev) => [
        ...prev,
        {
          text: "⚠️ Something went wrong.",
          sender: "bot",
        },
      ]);

    } finally {

      // loading OFF
      setLoading(false);
    }
  };



  // ================== ENTER KEY ==================
  const handleKeyDown = (e) => {

    if (e.key === "Enter") {
      handleSend();
    }
  };



  // ================== RENDER ==================
  return (
    

    <div className="chatbot">

      {/* ================== TOGGLE BUTTON ================== */}
      <button
        className="chat-toggle"
        onClick={() => setOpen(!open)}
      >
        💬
      </button>



      {/* ================== CHAT WINDOW ================== */}
      {open && (

        <div className="chat-window">

          {/* HEADER */}
          <div className="chat-header">
            AI Assistant
          </div>



          {/* ================== CHAT BODY ================== */}
          <div className="chat-body">

            {messages.map((msg, i) => (

              <div
                key={i}
                className={`msg ${msg.sender}`}
              >

                {/* ================== NORMAL TEXT ================== */}
                {msg.text && (
                  <div className="msg-text">
                    <p>{msg.text}</p>
                  </div>
                )}



                {/* ================== ROOM CARDS ================== */}
                {msg.rooms &&
                  Array.isArray(msg.rooms) &&
                  msg.rooms.length > 0 && (

                    <div className="room-results">

        {msg.rooms.map((room, idx) => {

  console.log("ROOM DATA:", room);

  return (
    <ChatRoomCard
      key={idx}
      room={room}
    />
  );

})}

                    </div>
                  )}

              </div>
            ))}



            {/* ================== LOADING ================== */}
            {loading && (

              <div className="msg bot">

                <div className="typing">

                  <span></span>
                  <span></span>
                  <span></span>

                </div>

              </div>
            )}



            {/* AUTO SCROLL TARGET */}
            <div ref={chatEndRef} />

          </div>



          {/* ================== INPUT AREA ================== */}
          <div className="chat-input">

            <input
              type="text"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button
              onClick={handleSend}
              disabled={loading}
            >
              Send
            </button>

          </div>

        </div>
      )}

    </div>
    
  );
}

export default Chatbot;