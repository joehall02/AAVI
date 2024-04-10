import React from "react";

const UserContext = React.createContext({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export default UserContext;
