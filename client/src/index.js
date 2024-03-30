import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import React from "react";
import ReactDOM from "react-dom";

import Navbar from "./components/Navigation/Navigation";
import SignUpPage from "./components/SignUp/SignUp";
import LoginPage from "./components/Login/Login";
import HomePage from "./components/Home/Home";
import ScanResults from "./components/Scan Results/ScanResults";
import GalleryPage from "./components/Gallery/Gallery";
import ConversationPage from "./components/Conversation/Conversation";
import AccountPage from "./components/Account/Account";

import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// App component, contains the Navbar and the Routes for the different pages
const App = () => {
  return (
    <Router>
      <Navbar />
      <Container className="vh-100 mt-5">
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/scan_results" element={<ScanResults />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/conversation" element={<ConversationPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/home_page" element={<HomePage />} />
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </Container>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
