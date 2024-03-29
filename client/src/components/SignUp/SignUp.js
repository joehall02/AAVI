import React from "react";
import "./SignUp.css";

const SignUpPage = () => {
  return (
    <div>
      <div className="d-flex justify-content-center">
        <div className="d-flex justify-content-center flex-column col-12 col-lg-6 text-white mb-3 py-3" style={{ backgroundColor: "#1E1E1E", borderRadius: "5px", height: "600px" }}>
          <div className="d-flex justify-content-center my-4">
            <h1 className="fw-bold">Sign Up</h1>
          </div>

          <div className="d-flex justify-content-center">
            <div className="col-10 col-lg-6">
              <input type="text" className="form-control text-white mb-3 custom-input" placeholder="Name" />
              <input type="text" className="form-control text-white mb-3 custom-input" placeholder="Username" />
              <input type="email" className="form-control text-white mb-3 custom-input" placeholder="Email" />
              <input type="password" className="form-control text-white mb-3 custom-input" placeholder="Password" />
              <input type="password" className="form-control text-white mb-3 custom-input" placeholder="Re-type Password" />
            </div>
          </div>

          <div className="d-flex justify-content-center my-3">
            <div className="col-10 col-lg-6">
              <button className="btn btn-lg btn-primary fw-bold w-100 mb-3">Sign Up</button>
              <button className="btn btn-lg btn-secondary fw-bold w-100">Back</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
