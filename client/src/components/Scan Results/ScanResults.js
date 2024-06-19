import React, { useState, useEffect, useContext } from "react";
import UserContext from "../UserContext/UserContext";
import Message from "../Message/Message";
import "./ScanResults.css";
import "../../styles/global.css";

const ScanResults = () => {
  const { user, refreshToken } = useContext(UserContext); // Get the user state from the UserContext

  const [conversation, setConversation] = useState(null); // State to store the conversation data received from the server

  const [input, setInput] = useState(""); // State to store the user input
  const [messages, setMessages] = useState([]); // State to store the messages in the chat, initially empty

  const [isLoading, setIsLoading] = useState(false); // State to store the loading state in order to show loading message

  // Use the useEffect hook to fetch the data from the server
  useEffect(() => {
    document.title = "Scan Results";

    const apiCall = async () => {
      // Send a GET request to the server to get the scan results
      const response = await fetch(`/Image Analysis/scan_result/${user.accountId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Set the Authorization header with the access token
        },
      });

      return response;
    };

    const fetchData = async () => {
      // Send a GET request to the server to get the scan results
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
    };

    fetchData().catch((error) => {
      console.error(error);
    });
  }, []);

  // Use the useEffect hook to update the messages state with the summary from the server
  useEffect(() => {
    if (conversation) {
      setMessages([{ isUser: false, text: conversation.summary, audiosrc: conversation.tts_audio_path }]);
    }
  }, [conversation]);

  // Function to handle user input change
  const handleInputChange = (e) => {
    setInput(e.target.value); // Update the input state with the user input
  };

  // Function to handle user input when enter key is pressed
  const handleKeyPress = async (e) => {
    const userMessageApiCall = async () => {
      // Send a POST request to the server with the user input,
      await fetch(`Image Analysis/message/${conversation.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Set the Authorization header with the access token
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: input }),
      });

      return;
    };

    const aiMessageApiCall = async () => {
      // Send a GET request to the server to get the ai response
      const response = await fetch(`/Image Analysis/message/${conversation.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Set the Authorization header with the access token
        },
      });

      return response;
    };

    // If the enter key is pressed and shift key is not pressed, this allows for line breaks
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent the default form submission

      // Add users message to the messages state
      // prevMessages is the previous state of the messages, this stops the messages from being overwritten
      setMessages((prevMessages) => [...prevMessages, { isUser: true, text: input }]);

      setIsLoading(true); // Shows the loading message

      setInput(""); // Clear the input field

      // Send a POST request to the server with the user input
      let userMessageResponse = await userMessageApiCall();

      if (userMessageResponse && userMessageResponse.status === 401) {
        await refreshToken(); // Refresh the access token
        // Resend the request with the new access token
        userMessageResponse = await userMessageApiCall();
      }

      let aiMessageResponse = await aiMessageApiCall();

      if (aiMessageResponse && aiMessageResponse.status === 401) {
        await refreshToken(); // Refresh the access token
        // Resend the request with the new access token
        aiMessageResponse = await aiMessageApiCall();
      }

      const ai_message = await aiMessageResponse.json(); // Get the json data from the response

      setIsLoading(false); // Hide the loading message

      // Add the ai response to the messages state
      setMessages((prevMessages) => [...prevMessages, { isUser: false, text: ai_message.content, audiosrc: ai_message.tts_audio_path }]);
    }
  };

  // If no data is available or account Id  display a message
  if (!conversation || !user.accountId) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-center" aria-label="Page Title">
        <h1 className="fw-bold">Scan Results</h1>
      </div>

      {/* Display the scanned image if data is available */}
      <div className="d-flex justify-content-center mt-3" aria-label="Uploaded Image">
        <div className="col-12 col-lg-6 text-center">
          <div className="w-100">{conversation && <img src={`${conversation.image_path}`} className="img-fluid" style={{ maxHeight: "700px", borderRadius: "5px" }} alt="Scanned Image" />}</div>
        </div>
      </div>

      <div className="d-flex justify-content-center mt-5">
        <h1 className="fw-bold">Chatbot</h1>
      </div>

      <div className="d-flex justify-content-center mt-3">
        {/* Chatbot background */}
        <div className="d-flex col-12 col-lg-6 mb-4 justify-content-center chatbot-background">
          {/* Chatbot container */}
          <div className="d-flex justify-content-center flex-column col-12 col-lg-10">
            {/* Chatbot messages */}
            <div className="d-flex flex-column col-11 col-lg-12 overflow-auto mx-auto" style={{ maxHeight: "620px" }}>
              {/* Conversation title */}
              <div className="d-flex text-center flex-column py-4 col-12" aria-label="Conversation Title">
                <h5 className="text-white fw-bold mx-auto">{conversation.title}</h5>
              </div>
              {/* Maps all the messages to an array of message components and displays them */}
              {messages.map((message, index) => (
                <Message key={index} isUser={message.isUser} text={message.text} audiosrc={message.audiosrc} />
              ))}
              {isLoading && <Message isUser={false} text="Loading..." />}
            </div>
            {/* Chatbot input */}
            <div className="mt-auto col-11 col-lg-12 mb-3 mx-auto" aria-label="Chatbot Message Input">
              <input
                type="text"
                className="form-control text-white"
                placeholder="Type your response here"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                style={{ backgroundColor: "#808080" }}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanResults;
