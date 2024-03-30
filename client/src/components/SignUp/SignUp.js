import React, { useState } from "react";
import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    setErrorMessage(""); // Clear the error message

    // If states are empty, return error
    if (!name || !username || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    } else if (password !== confirmPassword) {
      // If passwords do not match, return error
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      // Send a POST request to the server with the user data
      console.log({ name: name, username: username, email: email, password: password });
      const response = await fetch("/Authentification/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name, username: username, email: email, password: password }),
      });

      // If the response is not received, throw an error
      if (!response.ok) {
        const data = await response.json(); // Get the json data from the response
        throw new Error(data.message);
      }

      // Redirect to the login page
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message); // Set the error message
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-center">
        <div className="d-flex justify-content-center flex-column col-12 col-lg-6 text-white mb-3 py-3" style={{ backgroundColor: "#1E1E1E", borderRadius: "5px", height: "600px" }}>
          <div className="d-flex justify-content-center my-4">
            <h1 className="fw-bold">Sign Up</h1>
          </div>

          <div className="d-flex justify-content-center">
            <div className="col-10 col-lg-6">
              <form onSubmit={handleSubmit}>
                <input type="text" className="form-control text-white mb-3 custom-input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" className="form-control text-white mb-3 custom-input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="email" className="form-control text-white mb-3 custom-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" className="form-control text-white mb-3 custom-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input
                  type="password"
                  className="form-control text-white mb-3 custom-input"
                  placeholder="Re-type Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
                <button type="submit" className="btn btn-lg btn-primary fw-bold w-100 my-3">
                  Sign Up
                </button>
                <Link to="/" className="btn btn-lg btn-secondary fw-bold w-100">
                  Back
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
