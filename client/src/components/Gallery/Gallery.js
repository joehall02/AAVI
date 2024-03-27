import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Gallery.css";
import "../../styles/global.css";
import GalleryImage from "../GalleryImage/GalleryImage";

const GalleryPage = () => {
  const [conversations, setConversations] = useState([]); // State to store the conversation objects received from the server

  const accountId = 2;

  const navigate = useNavigate();

  // Function to handle the image click event, takes in conversation object passed from GalleryImage component
  // Passes conversationid to gallery_image page
  const handleImageClick = (conversation) => {
    navigate("/conversation", { state: { conversationid: conversation.id } });
  };

  // Use the useEffect hook to fetch the data from the server
  useEffect(() => {
    const fetchData = async () => {
      // Send a GET request to the server to get all conversations associated with the account
      const response = await fetch(`/Gallery/${accountId}`);

      // If the response is not received, throw an error
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      const conversations = await response.json(); // Get the json data from the response

      setConversations(conversations); // Set the data to the data received from the server
    };

    fetchData().catch((error) => {
      console.error(error);
    });
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-center mb-3">
        <h1 className="fw-bold">Gallery</h1>
      </div>

      <div className="row">
        {/* Map through the conversations and display the images */}
        {conversations.map((conversation, index) => (
          <GalleryImage key={index} conversation={conversation} handleImageClick={handleImageClick} />
        ))}

        {/* If no conversation are found, return error */}
        {conversations.length === 0 && (
          <div className="d-flex justify-content-center">
            <p>No images found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
