import React from "react";

const GalleryImage = ({ conversation, handleImageClick }) => {
  // Display the image and title of the conversation
  // When the image is clicked, call the handleImageClick function, passing the conversation object as an argument
  return (
    <div className="col-12 col-md-6 col-lg-4" aria-label="Gallery Image">
      <div className="card mb-4" onClick={() => handleImageClick(conversation)} style={{ cursor: "pointer" }}>
        <div
          style={{
            height: "300px",
            backgroundImage: `url(${conversation.image_path})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
          className="card-img-top"
          alt={`${conversation.title}`}
        />
        <div className="card-body text-center text-white" style={{ backgroundColor: "#1E1E1E", whiteSpace: "nowrap" }}>
          <h6 className="card-title">{conversation.title}</h6>
        </div>
      </div>
    </div>
  );
};

export default GalleryImage;
