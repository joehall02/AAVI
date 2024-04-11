import React, { useState, useEffect, useRef, useContext } from "react";
import UserContext from "../UserContext/UserContext";
import { useLocation } from "react-router-dom";
import Message from "../Message/Message";
import "./Conversation.css";

const Conversation = () => {
  const { refreshToken } = useContext(UserContext); // Get the refreshToken function from the UserContext
  const location = useLocation();
  const conversationId = location.state.conversationid;

  const [isLoading, setIsLoading] = useState(true); // State to store the loading state
  const [conversation, setConversation] = useState(null); // State to store the conversation data received from the server

  // Use the useEffect hook to fetch the conversation from the server
  useEffect(() => {
    document.title = "Conversation";

    const apiCall = async () => {
      // Send a GET request to the server to get the conversation
      const response = await fetch(`/Gallery/conversation/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Set the Authorization header with the access token
        },
      });

      return response;
    };

    const fetchData = async () => {
      // Send a GET request to the server to get the conversation
      let response = await apiCall();

      if (response.status === 401) {
        await refreshToken(); // Refresh the access token
        // Resend the request with the new access token
        response = await apiCall();
      }

      // If the response is not received, throw an error
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      const conversation = await response.json(); // Get the json data from the response
      setConversation(conversation); // Set the data to the data received from the server
      setIsLoading(false); // Set the loading state to false
    };

    fetchData().catch((error) => {
      console.error(error);
    });
  }, []);

  // Function to play the audio
  const audio = useRef(null);

  const playAudio = (audiosrc) => {
    // If the audio is already playing, pause and reset the audio
    if (audio.current) {
      audio.current.pause();
      audio.current.currentTime = 0;
    }

    // Get the audio source and play the audio
    audio.current = new Audio(`http://127.0.0.1:5000/Audio/${audiosrc}`);
    audio.current.play();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <div className="d-flex justify-content-center mb-3" aria-label="Page Title">
        <h1 className="fw-bold">Conversation Page</h1>
      </div>
      {/* Conversation container  */}
      <div className="d-flex justify-content-center mt-3">
        {/* Conversation background */}
        <div className="d-flex justify-content-center flex-column col-12 col-lg-6 text-white mb-3" style={{ backgroundColor: "#1E1E1E", borderRadius: "5px" }}>
          {/* Conversation content */}
          <div className="d-flex flex-column mx-auto col-11 col-lg-12">
            {/* Conversation title */}
            <div className="d-flex text-center flex-column py-4" aria-label="Conversation Title">
              <h5 className="fw-bold mx-auto">{conversation.title}</h5>
            </div>
            {/* Conversation image */}
            <div className="col-10 mx-auto mb-3" aria-label="Conversation Image">
              <div className="w-100 text-center">
                <img src={`http://127.0.0.1:5000/Images/${conversation.image_path}`} className="img-fluid" style={{ maxHeight: "700px", borderRadius: "5px" }} alt="Scanned Image" />
              </div>
            </div>
            {/* Date and summary */}
            <div className="col-10 mx-auto mb-3" aria-label="Date and Summary">
              <p>
                <strong>Date:</strong> {conversation.date_created}
              </p>
              <p>
                <strong>Summary:</strong> {conversation.summary}
              </p>
              <button style={{ border: "none", background: "none", padding: 0, cursor: "pointer" }} onClick={() => playAudio(conversation.tts_audio_path)} aria-label="Play summary audio">
                <i className="bi bi-soundwave text-white custom-audio-icon"></i>
              </button>
            </div>

            {/* Chatbot title */}
            {/* If there are no messages, dont show */}
            {conversation.messages && conversation.messages.length > 0 && (
              <div className="d-flex text-center flex-column py-4 col-12" aria-label="Chatbot Title">
                <h1 className="fw-bold mx-auto">Chatbot</h1>
              </div>
            )}

            {/* Chatbot container */}
            <div className="d-flex flex-column col-11 overflow-auto mx-auto" style={{ maxHeight: "620px" }} aria-label="Chatbot Messages">
              {/* Chatbot messages */}
              {/* Maps all the messages to an array of message components and displays them, checks message type to 
              determine if it is a user message or ai message */}
              {conversation.messages?.map((message, index) => {
                if (message.type === "User") {
                  return <Message key={index} isUser={true} text={message.content} audiosrc={message.tts_audio_path} />;
                } else {
                  return <Message key={index} isUser={false} text={message.content} audiosrc={message.tts_audio_path} />;
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
