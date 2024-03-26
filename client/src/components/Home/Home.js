import React, { useState } from "react";
import "./Home.css";

const HomePage = () => {
  // defining a state variable fileName and a function setFileName to store the name of the file uploaded by the user
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);

  // function to handle the file change event
  const handleFileChange = (e) => {
    if (!e.target.files.length) return; // if no files are selected, return
    setFileName(e.target.files[0].name); // set the file name to the name of the file uploaded by the user
    setFile(e.target.files[0]); // Set the file to the file uploaded by the user
  };

  const handleButtonClick = async () => {
    if (!file) return; // If no file is selected, return

    const formData = new FormData(); // Create a new FormData object
    formData.append("photo", file); // Append the file to the FormData object

    // Send a POST request to the server with the file
    const response = await fetch("/Image Analysis/upload/2", {
      method: "POST",
      body: formData,
    });

    // If the response is not ok, throw an error
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }

    // If response is okay, get the json data
    const data = await response.json();
    console.log(data);
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
          <button className="btn btn-lg btn-primary mt-3 fw-bold w-100" onClick={handleButtonClick}>
            Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
