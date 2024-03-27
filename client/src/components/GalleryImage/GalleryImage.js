import React from "react";
import "./GalleryImage.css";

const GalleryImage = ({ conversation }) => {
  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="card mb-4">
        <img src={`http://127.0.0.1:5000/Images/${conversation.image_path}`} className="card-img-top" alt={`${conversation.title}`} style={{ height: "300px" }} />
        <div className="card-body text-center text-white" style={{ backgroundColor: "#1E1E1E", whiteSpace: "nowrap" }}>
          <h6 className="card-title">{conversation.title}</h6>
        </div>
      </div>
    </div>
  );
};

export default GalleryImage;
