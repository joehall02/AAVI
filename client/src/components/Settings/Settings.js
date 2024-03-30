import React, { useState, useEffect } from "react";

const accountId = 2;

const Settings = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch the account data
      const response = await fetch(`/Account/${accountId}`);
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
      const usersResponse = await fetch("/Admin Settings/");
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
  }, []);

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
              <div className="d-flex justify-content-between my-3">
                <h2>Users</h2>
                <div className="d-flex">
                  <div className="input-group">
                    <input type="text" placeholder="Search" className="form-control" />
                    <button className="btn btn-primary" type="button">
                      <i className="bi bi-search"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="d-flex">
                <button className="btn btn-primary" type="button">
                  <i className="bi bi-plus"></i> Add User
                </button>
              </div>
              <table className="table mt-3">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.name}</td>
                      <td>{user.role}</td>
                      <td>
                        <button className="btn btn-danger" type="button">
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
