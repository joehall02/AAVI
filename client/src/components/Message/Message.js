import React, { useRef } from "react";
import "./Message.css";

const Message = ({ isUser, text, audiosrc }) => {
  const audio = useRef(null); // Create a reference to the audio element

  const playAudio = () => {
    // If the audio is already playing, pause and reset the audio
    if (audio.current) {
      audio.current.pause();
      audio.current.currentTime = 0;
    }

    // Get the audio source and play the audio
    audio.current = new Audio(`${audiosrc}`);
    audio.current.play();
  };

  const messageStyle = isUser ? "user-message" : "chatbot-message";
  const justifyContent = isUser ? "justify-content-end" : "justify-content-start";
  const messageLabel = isUser ? "User Message" : "Chatbot Message";

  return (
    <div className={`d-flex ${justifyContent}`} aria-label={`${messageLabel}`}>
      <div className={`${messageStyle} text-white`}>
        <p>{text}</p>
        {audiosrc && (
          <button style={{ border: "none", background: "none", padding: 0, cursor: "pointer" }} onClick={playAudio} aria-label="Play message audio">
            <i className="bi bi-soundwave text-white custom-audio-icon" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;
