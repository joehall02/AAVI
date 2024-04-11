import React, { useEffect } from "react";

const AboutPage = () => {
  useEffect(() => {
    document.body.style.backgroundColor = "#1E1E1E";

    document.title = "About";

    return () => {
      document.body.style.backgroundColor = null;
    };
  }, []);

  return (
    <div className="text-white">
      <div className="d-flex justify-content-center mb-3" aria-label="Page Title">
        <h1 className="fw-bold">About</h1>
      </div>

      <div className="d-flex justify-content-center flex-column col-11 col-lg-6 mb-3 mx-auto" aria-label="About us">
        <div className="d-flex justify-content-center">
          <div className="text-center">
            <p>
              AAVI, or AI Assistant for the Visually Impaired, is a web application designed with accessibility at its core. Our mission is to empower visually impaired individuals by providing them
              with a tool that enhances their interaction with the world. Leveraging the power of OpenAI's state-of-the-art GPT-4-Vision model, AAVI offers advanced image processing capabilities.
            </p>
            <p>
              Users can upload images, which are then analysed and interpreted using AI. The AI's interpretation is then conveyed to the user through text-to-speech technology, providing a verbal
              description of the image's content. Whether it's reading text from a photo, identifying objects, or describing a complex scene, AAVI aims to provide visually impaired users a new
              perspective. Our goal is to bridge the gap between visual content and those who cannot see it, opening up a world of possibilities.
            </p>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center flex-column col-11 col-lg-6 mt-5 mx-auto" aria-label="How to use section">
        <div className="d-flex justify-content-center">
          <h2 className="fw-bold">How To Use</h2>
        </div>

        <div className="d-flex justify-content-start flex-column my-3">
          <h5 className="fw-bold mb-4">Step 1: Enter valid OpenAI API key</h5>
          <div className="d-flex justify-content-between">
            <div className="col" style={{ marginRight: "20px" }}>
              <img className="img-fluid" src={`${process.env.PUBLIC_URL}/AboutImages/Step1-1.png`} alt="Step 1 - Navigate to account tab." style={{ borderRadius: "10px" }} />
            </div>
            <div className="col">
              <img className="img-fluid" src={`${process.env.PUBLIC_URL}/AboutImages/Step1-2.png`} alt="Step 2 - Enter OpenAI API Key into input field." style={{ borderRadius: "10px" }} />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-start flex-column my-3">
          <h5 className="fw-bold mb-4">Step 2: Scan image using your camera or upload an image</h5>
          <div className="d-flex justify-content-between">
            <div className="col" style={{ marginRight: "20px" }}>
              <img
                className="img-fluid"
                src={`${process.env.PUBLIC_URL}/AboutImages/Step2-1.png`}
                alt="Step 3 - From the home screen, input image into input field and press the results button."
                style={{ borderRadius: "10px" }}
              />
            </div>
            <div className="col">
              <img
                className="img-fluid"
                src={`${process.env.PUBLIC_URL}/AboutImages/Step2-2.png`}
                alt="Step 4 - Wait until the image has processed and opened into the scan results page."
                style={{ borderRadius: "10px" }}
              />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-start flex-column my-3">
          <h5 className="fw-bold mb-4">Step 3: Talk to the chatbot!</h5>
          <div className="d-flex justify-content-between">
            <div className="col" style={{ marginRight: "20px" }}>
              <img
                className="img-fluid"
                src={`${process.env.PUBLIC_URL}/AboutImages/Step3-1.png`}
                alt="Step 5 - Press the text to speech button under the message to hear the summary."
                style={{ borderRadius: "10px" }}
              />
            </div>
            <div className="col">
              <img
                className="img-fluid"
                src={`${process.env.PUBLIC_URL}/AboutImages/Step3-2.png`}
                alt="Step 6 - Converse with the chatbot by asking questions in the input field."
                style={{ borderRadius: "10px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
