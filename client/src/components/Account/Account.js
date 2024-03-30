import React, { useState, useEffect } from "react";
import "../../styles/global.css";
import { useNavigate } from "react-router-dom";
import "./Account.css";

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

  // State to store isDeleting state
  const [isDeleting, setIsDeleting] = useState(false);

  // Functions to handle the edit button click events
  // Each function sets their respective isEditing state to true and the other isEditing states to false
  const handleEditUsername = () => {
    setNewUsername("");
    setIsEditingUsername(true);
    setIsEditingName(false);
    setIsEditingPassword(false);
    setIsEditingOpenAIKey(false);
  };
  const handleEditName = () => {
    setNewName("");
    setIsEditingName(true);
    setIsEditingUsername(false);
    setIsEditingPassword(false);
    setIsEditingOpenAIKey(false);
  };
  const handleEditPassword = () => {
    setNewPassword("");
    setIsEditingPassword(true);
    setIsEditingUsername(false);
    setIsEditingName(false);
    setIsEditingOpenAIKey(false);
  };
  const handleEditOpenAIKey = () => {
    setNewOpenAIKey("");
    setIsEditingOpenAIKey(true);
    setIsEditingUsername(false);
    setIsEditingName(false);
    setIsEditingPassword(false);
  };

  const handleDeleteAccountPrompt = () => {
    setIsDeleting(true);
    setIsEditingOpenAIKey(false);
    setIsEditingUsername(false);
    setIsEditingName(false);
    setIsEditingPassword(false);
  };

  // Function to handle the save button click events
  const handleSaveUsername = async () => {
    // If the new username is empty, set the error message and return
    if (!newUsername) {
      setErrorMessage("Username cannot be empty");
      return;
    }

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
    if (!newName) {
      setErrorMessage("Username cannot be empty");
      return;
    }
    try {
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
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  const handleSavePassword = async () => {
    if (!newPassword) {
      setErrorMessage("Password cannot be empty");
      return;
    }
    try {
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
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleSaveOpenAIKey = async () => {
    if (!newOpenAIKey) {
      setErrorMessage("OpenAI API Key cannot be empty");
      return;
    }
    try {
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
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // Get the navigate object from the useNavigate hook
  const navigate = useNavigate();

  // Function to handle the delete account button click event
  const handleDeleteAccount = async () => {
    try {
      // Send a DELETE request to the server to delete the account
      const response = await fetch(`/Account/${accountId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.message);
        throw new Error(data.message);
      }

      // Redirect to the login page
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message);
    }
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
          {/* Delete Account confirmation */}
          {isDeleting && (
            <div className="delete-overlay">
              <div className="d-flex justify-content-center">
                <div className="col-10 col-lg-6 text-center p-4" style={{ backgroundColor: "#1E1E1E", borderRadius: "5px" }}>
                  <h2>Are you sure?</h2>
                  <h4 className="py-5">If you delete your account you will not be able to recover any of your data and your account will be deleted forever.</h4>
                  <div className="d-flex justify-content-center mt-3">
                    <button className="btn btn-danger fw-bold" onClick={handleDeleteAccount} style={{ width: "200px" }}>
                      Delete Account
                    </button>
                    <button
                      className="btn btn-secondary fw-bold ms-2"
                      onClick={() => {
                        setIsDeleting(false);
                        setErrorMessage("");
                      }}
                      style={{ width: "200px" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Username */}
          <div className="my-4">
            <h3 className="fw-bold">Username:</h3>
            {/* If isEditingUsername is true, show input field and save button. Else, show account account username and edit button */}
            {isEditingUsername ? (
              <div>
                <div>
                  <input type="text" onChange={(e) => setNewUsername(e.target.value)} style={{ width: "210px" }} />
                </div>
                <div className="mt-2">
                  <button className="btn btn-primary fw-bold" onClick={handleSaveUsername} style={{ width: "100px" }}>
                    Save
                  </button>
                  <button
                    className="btn btn-secondary fw-bold ms-2"
                    onClick={() => {
                      setIsEditingUsername(false);
                      setErrorMessage("");
                    }}
                    style={{ width: "100px" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div>
                  <p>{account.username}</p>
                </div>
                <div className="mt-2">
                  <button className="btn btn-primary fw-bold" onClick={handleEditUsername} style={{ width: "100px" }}>
                    Edit
                  </button>
                </div>
              </div>
            )}
            {errorMessage && isEditingUsername && <p className="text-danger">{errorMessage}</p>} {/* If there is an error, display it */}
          </div>
          {/* Name */}
          <div className="my-4">
            <h3 className="fw-bold">Name:</h3>
            {/* If isEditingName is true, show input field and save button. Else, show account account name and edit button */}
            {isEditingName ? (
              <div>
                <div>
                  <input type="text" onChange={(e) => setNewName(e.target.value)} style={{ width: "210px" }} />
                </div>
                <div className="mt-2">
                  <button className="btn btn-primary fw-bold" onClick={handleSaveName} style={{ width: "100px" }}>
                    Save
                  </button>
                  <button
                    className="btn btn-secondary fw-bold ms-2"
                    onClick={() => {
                      setIsEditingName(false);
                      setErrorMessage("");
                    }}
                    style={{ width: "100px" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div>
                  <p>{account.name}</p>
                </div>
                <div className="mt-2">
                  <button className="btn btn-primary fw-bold" onClick={handleEditName} style={{ width: "100px" }}>
                    Edit
                  </button>
                </div>
              </div>
            )}
            {errorMessage && isEditingName && <p className="text-danger">{errorMessage}</p>} {/* If there is an error, display it */}
          </div>
          {/* Password */}
          <div className="my-4">
            <h3 className="fw-bold">Password:</h3>
            {/* If isEditingPassword is true, show input field and save button. Else, show <p> tag and edit button */}
            {isEditingPassword ? (
              <div>
                <div>
                  <input type="password" onChange={(e) => setNewPassword(e.target.value)} style={{ width: "210px" }} />
                </div>
                <div className="mt-2">
                  <button className="btn btn-primary fw-bold" onClick={handleSavePassword} style={{ width: "100px" }}>
                    Save
                  </button>
                  <button
                    className="btn btn-secondary fw-bold ms-2"
                    onClick={() => {
                      setIsEditingPassword(false);
                      setErrorMessage("");
                    }}
                    style={{ width: "100px" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div>
                  <p>*********</p>
                </div>
                <div className="mt-2">
                  <button className="btn btn-primary fw-bold" onClick={handleEditPassword} style={{ width: "100px" }}>
                    Edit
                  </button>
                </div>
              </div>
            )}
            {errorMessage && isEditingPassword && <p className="text-danger">{errorMessage}</p>} {/* If there is an error, display it */}
          </div>
          {/* API Key */}
          <div className="my-4">
            <h3 className="fw-bold">OpenAI API Key:</h3>
            {/* If isEditingOpenAIKey is true, show input field and save button. Else, show <p> tag and edit button */}
            {isEditingOpenAIKey ? (
              <div>
                <div>
                  <input type="text" onChange={(e) => setNewOpenAIKey(e.target.value)} style={{ width: "210px" }} />
                </div>
                <div className="mt-2">
                  <button className="btn btn-primary fw-bold" onClick={handleSaveOpenAIKey} style={{ width: "100px" }}>
                    Save
                  </button>
                  <button
                    className="btn btn-secondary fw-bold ms-2"
                    onClick={() => {
                      setIsEditingOpenAIKey(false);
                      setErrorMessage("");
                    }}
                    style={{ width: "100px" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div>
                  <p>*********</p>
                </div>
                <div className="mt-2">
                  <button className="btn btn-primary fw-bold" onClick={handleEditOpenAIKey} style={{ width: "100px" }}>
                    Edit
                  </button>
                </div>
              </div>
            )}
            {errorMessage && isEditingOpenAIKey && <p className="text-danger">{errorMessage}</p>} {/* If there is an error, display it */}
          </div>
          {/* Delete Account */}
          <div className="my-4">
            <h3 className="fw-bold">Remove Account</h3>
            <div className="mt-2">
              <button
                className="btn btn-danger fw-bold"
                onClick={() => {
                  handleDeleteAccountPrompt(true);
                  setErrorMessage("");
                }}
                style={{ width: "200px" }}
              >
                Delete Account
              </button>
            </div>
            {errorMessage && isDeleting && <p className="text-danger">{errorMessage}</p>} {/* If there is an error, display it */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
