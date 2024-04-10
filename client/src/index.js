import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import Navbar from "./components/Navigation/Navigation";
import SignUpPage from "./components/SignUp/SignUp";
import LoginPage from "./components/Login/Login";
import HomePage from "./components/Home/Home";
import ScanResults from "./components/Scan Results/ScanResults";
import GalleryPage from "./components/Gallery/Gallery";
import ConversationPage from "./components/Conversation/Conversation";
import AccountPage from "./components/Account/Account";
import Settings from "./components/Settings/Settings";

import UserContext from "./components/UserContext/UserContext";

import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// App component, contains the Navbar and the Routes for the different pages
const App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user"))); // Add a user state to store the user data

  // Use the useEffect hook to check if the user is logged in
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user)); // Store the user data in the local storage
  }, [user]);

  // Function to logout the user
  const logout = () => {
    setUser(null); // Set the user state to null

    // Clear the user access token and refresh token from the local storage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  // Function to refresh the access token when it expires
  const refreshToken = async () => {
    console.log("Refreshing token");
    const response = await fetch("/Authentification/refresh", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Token refreshed");
      localStorage.setItem("access_token", data.access_token);
    } else {
      logout();
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, refreshToken }}>
      {/* Provide the user state, logout function and refresh token function to the components */}
      <Router>
        <Navbar />
        <Container className="vh-100 mt-5">
          <Routes>
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/scan_results" element={<ScanResults />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/conversation" element={<ConversationPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/home_page" element={<HomePage />} />
            <Route path="/" element={<LoginPage />} />
          </Routes>
        </Container>
      </Router>
    </UserContext.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
