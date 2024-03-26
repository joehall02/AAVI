import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import React from "react";
import ReactDOM from "react-dom";
import Navbar from "./components/Navigation/Navigation";
import SignUpPage from "./components/SignUp";
import LoginPage from "./components/Login";
import HomePage from "./components/Home/Home";
import ScanResults from "./components/Scan Results/ScanResults";

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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/scan_results" element={<ScanResults />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Container>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
