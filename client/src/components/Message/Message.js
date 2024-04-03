import React, { useEffect, useRef } from "react";
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
    audio.current = new Audio(`http://127.0.0.1:5000/Audio/${audiosrc}`);
    audio.current.play();
  };

  const messageStyle = isUser ? "user-message" : "chatbot-message";
  const justifyContent = isUser ? "justify-content-end" : "justify-content-start";

  return (
    <div className={`d-flex ${justifyContent}`}>
      <div className={`${messageStyle} text-white`}>
        <p>{text}</p>
        {audiosrc && <i className="bi bi-soundwave custom-audio-icon" onClick={playAudio} />}
      </div>
    </div>
  );
};

export default Message;
