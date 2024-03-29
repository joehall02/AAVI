import React from "react";
import "./Login.css";

const LoginPage = () => {
  return (
    <div>
      <div className="d-flex justify-content-center">
        <div className="d-flex justify-content-center flex-column col-12 col-lg-6 text-white mb-3 py-3" style={{ backgroundColor: "#1E1E1E", borderRadius: "5px", height: "400px" }}>
          <div className="d-flex justify-content-center my-4">
            <h1 className="fw-bold">Login</h1>
          </div>

          <div className="d-flex justify-content-center">
            <div className="col-10 col-lg-6">
              <input type="text" className="form-control text-white mb-3 custom-input" placeholder="Username" />
              <input type="password" className="form-control text-white mb-3 custom-input" placeholder="Password" />
            </div>
          </div>

          <div className="d-flex justify-content-center my-3">
            <div className="col-10 col-lg-6">
              <button className="btn btn-lg btn-primary fw-bold w-100 mb-3">Login</button>
              <button className="btn btn-lg btn-secondary fw-bold w-100">Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
