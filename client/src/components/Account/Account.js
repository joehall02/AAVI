import React, { useState, useEffect } from "react";
import "../../styles/global.css";

// Create a variable that contains an account id
const accountId = 2;

const AccountPage = () => {
  const [account, setAccount] = useState(null); // State to store the account data received from the server
  const [isLoading, setIsLoading] = useState(true); // State to store the loading state

  // States to store the editing state of the different account settings
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingOpenAIKey, setIsEditingOpenAIKey] = useState(false);

  // States to store the new values of different account settings
  const [newUsername, setNewUsername] = useState("");
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newOpenAIKey, setNewOpenAIKey] = useState("");

  // State for updateCount, used to trigger a re-render when the account data is updated
  const [updateCount, setUpdateCount] = useState(0);

  // State to store error messages
  const [errorMessage, setErrorMessage] = useState("");

  // Functions to handle the edit button click events
  const handleEditUsername = () => {
    setIsEditingUsername(true);
  };
  const handleEditName = () => {
    setIsEditingName(true);
  };
  const handleEditPassword = () => {
    setIsEditingPassword(true);
  };
  const handleEditOpenAIKey = () => {
    setIsEditingOpenAIKey(true);
  };

  // Function to handle the save button click events
  const handleSaveUsername = async () => {
    try {
      // Send a PUT request to the server to update the username
      const response = await fetch(`/Account/username/${accountId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: newUsername }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.message);
        throw new Error(data.message);
      }

      setIsEditingUsername(false);
      setUpdateCount(updateCount + 1);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  const handleSaveName = async () => {
    // Send a PUT request to the server to update the name
    const response = await fetch(`/Account/name/${accountId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newName }),
    });

    if (!response.ok) {
      const data = await response.json();
      setErrorMessage(data.message);
      throw new Error(data.message);
    }

    setIsEditingName(false);
    setUpdateCount(updateCount + 1);
    setErrorMessage("");
  };
  const handleSavePassword = async () => {
    // Send a PUT request to the server to update the password
    const response = await fetch(`/Account/password/${accountId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: newPassword }),
    });

    if (!response.ok) {
      const data = await response.json();
      setErrorMessage(data.message);
      throw new Error(data.message);
    }

    setIsEditingPassword(false);
    setUpdateCount(updateCount + 1);
    setErrorMessage("");
  };
  const handleSaveOpenAIKey = async () => {
    // Send a PUT request to the server to update the OpenAI API key
    const response = await fetch(`/Account/api_key/${accountId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ api_key: newOpenAIKey }),
    });

    if (!response.ok) {
      const data = await response.json();
      setErrorMessage(data.message);
      throw new Error(data.message);
    }

    setIsEditingOpenAIKey(false);
    setUpdateCount(updateCount + 1);
    setErrorMessage("");
  };

  useEffect(() => {
    const fetchData = async () => {
      // Send a GET request to the server to get the account data
      const response = await fetch(`/Account/${accountId}`);

      // If the response is not received, throw an error
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      const account = await response.json(); // Get the json data from the response
      setAccount(account); // Set the data to the data received from the server
      setIsLoading(false); // Set the loading state to false
    };

    fetchData().catch((error) => {
      console.error(error);
    });
  }, [updateCount]); // Add updateCount as a dependency to trigger a re-render when the account data is updated

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-center">
        <h1 className="fw-bold">Account</h1>
      </div>

      {/* Account settings container */}
      <div className="d-flex justify-content-center mx-auto mt-3">
        <div className="col-10 col-lg-6">
          {/* Username */}
          <div className="py-3">
            <h3 className="fw-bold">Username:</h3>
            {/* If isEditingUsername is true, show input field and save button. Else, show account account username and edit button */}
            {isEditingUsername ? <input type="text" onChange={(e) => setNewUsername(e.target.value)} /> : <p>{account.username}</p>}
            {isEditingUsername ? (
              <button className="btn btn-primary fw-bold" onClick={handleSaveUsername}>
                Save
              </button>
            ) : (
              <button className="btn btn-primary fw-bold" onClick={handleEditUsername}>
                Edit
              </button>
            )}
            {errorMessage && <p className="text-danger">{errorMessage}</p>} {/* If there is an error, display it */}
          </div>
          {/* Name */}
          <div className="py-3">
            <h3 className="fw-bold">Name:</h3>
            {/* If isEditingName is true, show input field and save button. Else, show account account name and edit button */}
            {isEditingName ? <input type="text" onChange={(e) => setNewName(e.target.value)} /> : <p>{account.name}</p>}
            {isEditingName ? (
              <button className="btn btn-primary fw-bold" onClick={handleSaveName}>
                Save
              </button>
            ) : (
              <button className="btn btn-primary fw-bold" onClick={handleEditName}>
                Edit
              </button>
            )}
          </div>
          {/* Password */}
          <div className="py-3">
            <h3 className="fw-bold">Password:</h3>
            {/* If isEditingPassword is true, show input field and save button. Else, show <p> tag and edit button */}
            {isEditingPassword ? <input type="password" onChange={(e) => setNewPassword(e.target.value)} /> : <p>*********</p>}
            {isEditingPassword ? (
              <button className="btn btn-primary fw-bold" onClick={handleSavePassword}>
                Save
              </button>
            ) : (
              <button className="btn btn-primary fw-bold" onClick={handleEditPassword}>
                Edit
              </button>
            )}
          </div>
          {/* API Key */}
          <div className="py-3">
            <h3 className="fw-bold">OpenAI API Key:</h3>
            {/* If isEditingOpenAIKey is true, show input field and save button. Else, show <p> tag and edit button */}
            {isEditingOpenAIKey ? <input type="text" onChange={(e) => setNewOpenAIKey(e.target.value)} /> : <p>*********</p>}
            {isEditingOpenAIKey ? (
              <button className="btn btn-primary fw-bold" onClick={handleSaveOpenAIKey}>
                Save
              </button>
            ) : (
              <button className="btn btn-primary fw-bold" onClick={handleEditOpenAIKey}>
                Edit
              </button>
            )}
          </div>
          {/* Delete Account */}
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
