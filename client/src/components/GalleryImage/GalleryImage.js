import React from "react";

const GalleryImage = ({ conversation, handleImageClick }) => {
  // Display the image and title of the conversation
  // When the image is clicked, call the handleImageClick function, passing the conversation object as an argument
  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="card mb-4" onClick={() => handleImageClick(conversation)} style={{ cursor: "pointer" }}>
        <img src={`http://127.0.0.1:5000/Images/${conversation.image_path}`} className="card-img-top" alt={`${conversation.title}`} style={{ height: "300px" }} />
        <div className="card-body text-center text-white" style={{ backgroundColor: "#1E1E1E", whiteSpace: "nowrap" }}>
          <h6 className="card-title">{conversation.title}</h6>
        </div>
      </div>
    </div>
  );
};

export default GalleryImage;
