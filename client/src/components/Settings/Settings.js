import React, { useState, useEffect, useContext } from "react";
import UserContext from "../UserContext/UserContext";
import "./Settings.css";

const Settings = () => {
  const { user, refreshToken } = useContext(UserContext); // Get the user state from the UserContext
  const [isAdmin, setIsAdmin] = useState(true); // State to check if the user is an admin
  const [isLoading, setIsLoading] = useState(true); // State to check if the data is loading
  const [users, setUsers] = useState([]); // State to store the users data
  const [updateCount, setUpdateCount] = useState(0); // State to update the users state
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false); // State to check if the create account window is open

  const [name, setName] = useState(""); // State to store the name of the new user
  const [username, setUsername] = useState(""); // State to store the username of the new user
  const [password, setPassword] = useState(""); // State to store the password of the new user
  const [role, setRole] = useState(""); // State to store the role of the new user
  const [confirmPassword, setConfirmPassword] = useState(""); // State to store the confirmed password of the new user

  const [errorMessage, setErrorMessage] = useState(""); // State to store the error message

  useEffect(() => {
    const loggedInUserApiCall = async () => {
      // Fetch the account data
      const response = await fetch(`/Account/${user.accountId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Set the Authorization header with the access token
        },
      });

      return response;
    };

    const accountsApiCall = async () => {
      // Fetch the users data for all accounts in the database
      const usersResponse = await fetch("/Admin Settings/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Set the Authorization header with the access token
        },
      });

      return usersResponse;
    };

    const fetchData = async () => {
      // Fetch the account data
      let response = await loggedInUserApiCall();

      if (response.status === 401) {
        await refreshToken(); // Refresh the access token
        // Resend the request with the new access token
        response = loggedInUserApiCall();
      }

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      const account = await response.json();

      // Check if the user is an admin
      if (account.role !== "Admin") {
        setIsAdmin(false);
      }

      // Fetch the users data for all accounts in the database
      const usersResponse = await accountsApiCall();

      if (usersResponse.status === 401) {
        await refreshToken(); // Refresh the access token
        // Resend the request with the new access token
        usersResponse = accountsApiCall();
      }

      if (!usersResponse.ok) {
        const message = `An error has occured: ${usersResponse.status}`;
        throw new Error(message);
      }
      const users = await usersResponse.json();
      setUsers(users);
      setIsLoading(false);
    };
    fetchData().catch((error) => {
      console.error(error);
    });
  }, [updateCount]); // Update the users state when the updateCount state changes

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    setErrorMessage(""); // Clear the error message

    // If states are empty, return error
    if (!name || !username || !password || !confirmPassword || !role) {
      setErrorMessage("Please fill in all fields.");
      return;
    } else if (password !== confirmPassword) {
      // If passwords do not match, return error
      setErrorMessage("Passwords do not match.");
      return;
    }

    const apiCall = async () => {
      // Send a POST request to the server with the user data
      const response = await fetch("/Admin Settings/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Set the Authorization header with the access token
        },
        body: JSON.stringify({ name: name, username: username, password: password, role: role }),
      });

      return response;
    };

    try {
      // Send a POST request to the server with the user data
      let response = await apiCall();

      if (response.status === 401) {
        await refreshToken(); // Refresh the access token
        // Resend the request with the new access token
        response = apiCall();
      }

      // If the response is not received, throw an error
      if (!response.ok) {
        const data = await response.json(); // Get the json data from the response
        throw new Error(data.message);
      }
    } catch (error) {
      setErrorMessage(error.message); // Set the error message
    }

    setUpdateCount(updateCount + 1); // Update the users state
    setIsCreateAccountOpen(false); // Close the create account window

    setName(""); // Clear the name state
    setUsername(""); // Clear the username state
    setPassword(""); // Clear the password state
    setConfirmPassword(""); // Clear the confirm password state
    setRole(""); // Clear the role state
  };

  const handleDelete = async (userId) => {
    const apiCall = async () => {
      // Delete the user
      const response = await fetch(`/Admin Settings/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Set the Authorization header with the access token
        },
      });
    };

    try {
      // Delete the user
      let response = await apiCall();

      if (response.status === 401) {
        await refreshToken(); // Refresh the access token
        // Resend the request with the new access token
        response = apiCall();
      }

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      // Update the users state
      setUpdateCount(updateCount + 1);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-center mb-3">
        <h1 className="fw-bold">Settings</h1>
      </div>

      <div className="d-flex justify-content-center mt-3">
        <div className="d-flex justify-content-center flex-column col-12 col-lg-6 mb-3">
          {/* If the account is an admin, show settings. If not, show access denied */}
          {isAdmin ? (
            <div className="d-flex flex-column mx-auto col-11 col-lg-12">
              {/* Create account window */}
              {isCreateAccountOpen && (
                <div className="create-account-overlay">
                  <div className="d-flex justify-content-center flex-column col-11 col-lg-6 py-4" style={{ backgroundColor: "#1E1E1E", borderRadius: "5px" }}>
                    <div className="d-flex justify-content-center">
                      <h1>Create Account</h1>
                    </div>
                    <div className="d-flex justify-content-center mt-3">
                      <div className="col-10 col-lg-6">
                        <form onSubmit={handleSubmit}>
                          <input type="text" className="form-control text-white mb-3 custom-input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                          <input type="text" className="form-control text-white mb-3 custom-input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                          <input type="password" className="form-control text-white mb-3 custom-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                          <input
                            type="password"
                            className="form-control text-white mb-3 custom-input"
                            placeholder="Re-type Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                          <div>
                            <select type="text" className="form-control text-white mb-3 custom-input" placeholder="Role" onChange={(e) => setRole(e.target.value)}>
                              <option value="">Select an option</option>
                              <option value="User">User</option>
                              <option value="Admin">Admin</option>
                            </select>
                          </div>
                          {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
                          <button type="submit" className="btn btn-lg btn-primary fw-bold w-100 my-3">
                            Create Account
                          </button>
                          <button to="/" className="btn btn-lg btn-secondary fw-bold w-100" onClick={() => setIsCreateAccountOpen(false)}>
                            Cancel
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="d-flex justify-content-between my-3">
                <h2>Users</h2>

                <button className="btn btn-primary" type="button" onClick={() => setIsCreateAccountOpen(true)}>
                  <i className="bi bi-plus"></i> Add User
                </button>
              </div>
              <table className="table mt-3">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="text-break">{user.username}</td>
                      <td className="text-break">{user.name}</td>
                      <td>{user.role}</td>
                      <td>
                        {/* Create a dialog box to confirm the account deletion */}
                        <button
                          className="btn btn-danger"
                          type="button"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this user?")) {
                              handleDelete(user.id);
                            }
                          }}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mx-auto">
              <h1 className="text-danger">Access Denied</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
