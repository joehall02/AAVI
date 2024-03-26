import React, { useState, useEffect } from "react";
import Message from "../Message/Message";
import "./ScanResults.css";

const ScanResults = () => {
  const [data, setData] = useState(null); // State to store the conversation data received from the server

  const [input, setInput] = useState(""); // State to store the user input
  const [messages, setMessages] = useState([]); // State to store the messages in the chat, initially empty

  // Use the useEffect hook to fetch the data from the server
  useEffect(() => {
    const fetchData = async () => {
      // Send a GET request to the server to get the scan results
      const response = await fetch("/Image Analysis/scan_result/2");

      // If the response is received, throw an error
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      const data = await response.json(); // Get the json data from the response

      setData(data); // Set the data to the data received from the server
    };

    fetchData().catch((error) => {
      console.error(error);
    });
  }, []);

  // Use the useEffect hook to update the messages state with the summary from the server
  useEffect(() => {
    if (data) {
      setMessages([{ isUser: false, text: data.summary }]);
    }
  }, [data]);

  // Function to handle user input change
  const handleInputChange = (e) => {
    setInput(e.target.value); // Update the input state with the user input
  };

  // Function to handle user input when enter key is pressed
  const handleKeyPress = async (e) => {
    // If the enter key is pressed and shift key is not pressed, this allows for line breaks
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent the default form submission

      // Add users message to the messages state
      // prevMessages is the previous state of the messages, this stops the messages from being overwritten
      setMessages((prevMessages) => [...prevMessages, { isUser: true, text: input }]);

      // Send a POST request to the server with the user input
      await fetch("Image Analysis/message/18", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: input }),
      });

      setInput(""); // Clear the input field

      // Send a GET request to the server to get the ai response
      const response = await fetch("/Image Analysis/message/18");
      const data = await response.json(); // Get the json data from the response

      // Add the ai response to the messages state
      setMessages((prevMessages) => [...prevMessages, { isUser: false, text: data.content }]);
    }
  };

  // If no data is available, display a message
  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-center">
        <h1 className="fw-bold">Scan Results</h1>
      </div>

      {/* Display the scan results if data is available */}
      <div className="d-flex justify-content-center mt-3">
        <div className="col-12 col-lg-6 text-center">
          <div className="w-100">
            {data && <img src={`http://127.0.0.1:5000/Images/${data.image_path}`} className="img-fluid" style={{ maxHeight: "700px", borderRadius: "5px" }} alt="Scanned Image" />}
          </div>
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
            <div className="d-flex flex-column col-11 col-lg-12 overflow-auto mx-auto custom-scrollbar" style={{ maxHeight: "620px" }}>
              {/* Maps all the messages to an array of message components and displays them */}
              {messages.map((message, index) => (
                <Message key={index} isUser={message.isUser} text={message.text} />
              ))}
            </div>
            {/* Chatbot input */}
            <div className="mt-auto col-11 col-lg-12 mb-3 mx-auto">
              <input
                type="text"
                className="form-control text-white"
                placeholder="Type your response here"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                style={{ backgroundColor: "#808080" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanResults;
