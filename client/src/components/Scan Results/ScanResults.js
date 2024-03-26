import React, { useState, useEffect } from "react";
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

  return (
    <div>
      <div className="d-flex justify-content-between">
        <h1 className="fw-bold">Scan Results</h1>
      </div>

      <div className="d-flex justify-content-center mt-3">
        <div className="w-100">{data && <img src={`http://127.0.0.1:5000/Images/${data.image_path}`} className="img-fluid" alt="Scanned Image" />}</div>
        {/* <div className="w-100">
          <img src={`http://127.0.0.1:5000/Images/IMG_6818.jpeg`} className="img-fluid" alt="Scanned Image" />
        </div> */}
      </div>
    </div>
  );
};

export default ScanResults;
