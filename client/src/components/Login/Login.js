import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!username || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
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
