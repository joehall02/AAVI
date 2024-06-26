import React, { useState, useContext, useEffect } from "react";
import UserContext from "../UserContext/UserContext";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import "../../styles/global.css";

const HomePage = () => {
  const { user, refreshToken } = useContext(UserContext); // Get the user state from the UserContext
  const [isLoading, setIsLoading] = useState(false); // defining a state variable isLoading and a function setIsLoading to store the loading state of the page
  const [fileName, setFileName] = useState(""); // defining a state variable fileName and a function setFileName to store the name of the file uploaded by the user
  const [file, setFile] = useState(null); // defining a state variable file and a function setFile to store the file uploaded by the user

  const [errorMessage, setErrorMessage] = useState(""); // defining a state variable errorMessage and a function setErrorMessage to store the error message if an error occurs

  // function to handle the file change event
  const handleFileChange = (e) => {
    if (!e.target.files.length) return; // if no files are selected, return
    setFileName(e.target.files[0].name); // set the file name to the name of the file uploaded by the user
    setFile(e.target.files[0]); // Set the file to the file uploaded by the user
  };

  useEffect(() => {
    document.title = "Home";
  }, []);

  // Get the navigate object from the useNavigate hook
  const navigate = useNavigate();

  // function to handle the button click event
  const handleButtonClick = async () => {
    if (!file) return; // If no file is selected, return

    setIsLoading(true); // Set the loading state to true

    const formData = new FormData(); // Create a new FormData object
    formData.append("photo", file); // Append the file to the FormData object

    const apiCall = async () => {
      // Send a POST request to the server with the file
      const response = await fetch(`/Image Analysis/upload/${user.accountId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Set the Authorization header with the access token
        },
        body: formData,
      });

      return response;
    };

    try {
      // Send a POST request to the server with the file
      let response = await apiCall();

      if (response.status === 401) {
        await refreshToken(); // Refresh the access token
        // Resend the request with the new access token
        response = await apiCall();
      }

      // If the response is not received, throw an error
      if (!response.ok) {
        const data = await response.json(); // Get the json data from the response
        throw new Error(data.message);
      }

      setIsLoading(false); // Set the loading state to false

      // Navigate to the scan results, passing the account id as a parameter
      navigate("/scan_results");
    } catch (error) {
      setIsLoading(false); // Set the loading state to false
      setErrorMessage(error.message); // Set the error message
    }
  };

  return (
    <div>
      {isLoading && (
        <div className="loading-overlay" aria-label="Loading Message">
          Loading...
        </div>
      )}
      <div className="d-flex justify-content-center" aria-label="Page Title">
        <h1 className="fw-bold">Home</h1>
      </div>

      <label className="d-flex flex-column justify-content-center align-items-center mt-3 text-white image-input" aria-label="Image input">
        <input type="file" accept="image/*" capture="camera" className="d-none" onChange={handleFileChange} aria-label="File Input for image" />
        <i className="bi bi-camera-fill" style={{ fontSize: 60 }}></i>
        <p className="fw-bold">Tap to scan image with your camera!</p>
        <p className="fw-bold text-center">{fileName}</p>
      </label>

      <div className="d-flex justify-content-center">
        <div className="col-12 col-md-6">
          <button className="btn btn-lg btn-primary mt-3 fw-bold w-100" onClick={handleButtonClick} aria-label="Scan Results button">
            Results
          </button>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        {errorMessage && (
          <p className="text-danger" aria-label="Error Message">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
