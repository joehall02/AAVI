import React, { useState, useEffect } from "react";
import Message from "../Message/Message";
import "./ScanResults.css";

const ScanResults = () => {
  const [data, setData] = useState(null);

  // Use the useEffect hook to fetch the data from the server
  useEffect(() => {
    const fetchData = async () => {
      // Send a GET request to the server to get the scan results
      const response = await fetch("/Image Analysis/scan_result/2");

      // If the response is received, throw an error
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      const data = await response.json(); // Get the json data from the response

      setData(data); // Set the data to the data received from the server
    };

    fetchData().catch((error) => {
      console.error(error);
    });
  }, []);

  // If no data is available, display a message
  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-center">
        <h1 className="fw-bold">Scan Results</h1>
      </div>

      {/* Display the scan results if data is available */}
      <div className="d-flex justify-content-center mt-3">
        <div className="col-12 col-lg-6 text-center">
          <div className="w-100">
            {data && <img src={`http://127.0.0.1:5000/Images/${data.image_path}`} className="img-fluid" style={{ maxHeight: "700px", borderRadius: "5px" }} alt="Scanned Image" />}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center mt-5">
        <h1 className="fw-bold">Chatbot</h1>
      </div>

      <div className="d-flex justify-content-center mt-3">
        {/* Chatbot background */}
        <div className="d-flex col-12 col-lg-6 mb-4 justify-content-center chatbot-background">
          {/* Chatbot container */}
          <div className="d-flex justify-content-center flex-column col-12 col-lg-10">
            {/* Chatbot messages */}
            <div className="d-flex flex-column col-11 col-lg-12 overflow-auto mx-auto custom-scrollbar" style={{ maxHeight: "620px" }}>
              <Message isUser={false} text={data.summary} />
              <Message isUser={false} text={data.summary} />
              <Message isUser={false} text={data.summary} />
              <Message isUser={false} text={data.summary} />
              <Message isUser={false} text={data.summary} />
              <Message isUser={true} text="Hello" />
              <Message isUser={false} text="Hello" />
            </div>
            {/* Chatbot input */}
            <div className="mt-auto col-11 col-lg-12 mb-3 mx-auto">
              <input type="text" className="form-control text-white" placeholder="Type your response here" style={{ backgroundColor: "#808080" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanResults;
