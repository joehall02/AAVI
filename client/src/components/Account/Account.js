import React, { useState, useEffect } from "react";
import "../../styles/global.css";

// Create a variable that contains an account id
const accountId = 2;

const AccountPage = () => {
  return (
    <div>
      <div className="d-flex justify-content-center">
        <h1 className="fw-bold">Account</h1>
      </div>

      {/* Account settings container */}
      <div className="d-flex justify-content-center mx-auto mt-3">
        <div className="col-10 col-lg-6">
          <div className="py-3">
            <h3 className="fw-bold">Username:</h3>
            <p>JohnDoe12345</p>
            <button className="btn btn-primary fw-bold">Edit</button>
          </div>
          <div className="py-3">
            <h3 className="fw-bold">Name:</h3>
            <p>JohnDoe</p>
            <button className="btn btn-primary fw-bold">Edit</button>
          </div>
          <div className="py-3">
            <h3 className="fw-bold">Password:</h3>
            <p>******</p>
            <button className="btn btn-primary fw-bold">Edit</button>
          </div>
          <div className="py-3">
            <h3 className="fw-bold">OpenAI API Key:</h3>
            <p>JohnDoe</p>
            <button className="btn btn-primary fw-bold">Edit</button>
          </div>
          <div className="py-3">
            <h3 className="fw-bold">Remove Account</h3>
            <button className="btn btn-danger fw-bold">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
