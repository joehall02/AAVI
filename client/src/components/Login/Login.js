import React, { useState, useContext } from "react";
import UserContext from "../UserContext/UserContext";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = useContext(UserContext);

  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!username || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      // Send a POST request to the server to login
      const response = await fetch("/Authentification/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Store the tokens in the local storage
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

        // Set the user state with the user data
        setUser(data.user);

        // Redirect to the home page
        navigate("/home_page");
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage("An error has occurred. Please try again.");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-center">
        <div className="d-flex justify-content-center flex-column col-12 col-lg-6 text-white mb-3 py-3" style={{ backgroundColor: "#1E1E1E", borderRadius: "5px", height: "400px" }}>
          <div className="d-flex justify-content-center my-4">
            <h1 className="fw-bold">Login</h1>
          </div>

          <div className="d-flex justify-content-center">
            <div className="col-10 col-lg-6">
              <form onSubmit={handleSubmit}>
                <input type="text" className="form-control text-white mb-3 custom-input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" className="form-control text-white mb-3 custom-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
                <button type="submit" className="btn btn-lg btn-primary fw-bold w-100 my-3">
                  Login
                </button>
                {/* link to the sign up page */}
                <Link to="/signup" className="btn btn-lg btn-secondary fw-bold w-100">
                  Sign Up
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
