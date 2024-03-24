import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const App = () => {
  useEffect(() => {
    fetch("/Gallery/conversation/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);
  const [message, setMessage] = useState("Loading...");
  return <div className="app">{message}</div>;
};

ReactDOM.render(<App />, document.getElementById("root"));
