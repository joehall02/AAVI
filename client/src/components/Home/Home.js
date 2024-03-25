import React, { useState } from "react";
import "./Home.css";

const HomePage = () => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    setFileName(e.target.files[0].name);
  };

  return (
    <div>
      <div className="d-flex justify-content-center">
        <h1 className="fw-bold">Home</h1>
      </div>

      <label className="d-flex flex-column justify-content-center align-items-center mt-3 text-white image-input">
        <input type="file" accept="image/*" capture="camera" className="d-none" onChange={handleFileChange} />
        <i className="bi bi-camera-fill" style={{ fontSize: 60 }}></i>
        <p className="fw-bold">Tap to scan image with your camera!</p>
        <p className="fw-bold">{fileName}</p>
      </label>

      <div className="d-flex justify-content-center">
        <div className="col-12 col-md-6">
          <button className="btn btn-lg btn-primary mt-3 fw-bold w-100">Results</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
