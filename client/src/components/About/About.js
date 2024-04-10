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
      <div className="d-flex justify-content-center mb-3">
        <h1 className="fw-bold">About</h1>
      </div>

      <div className="d-flex justify-content-center flex-column col-11 col-lg-6 mb-3 mx-auto">
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

      <div className="d-flex justify-content-center flex-column col-11 col-lg-6 mt-5 mx-auto">
        <div className="d-flex justify-content-center">
          <h2 className="fw-bold">How To Use</h2>
        </div>

        <div className="d-flex justify-content-start flex-column my-3">
          <h5 className="fw-bold mb-4">Step 1: Enter valid OpenAI API key</h5>
          <div className="d-flex justify-content-between">
            <div className="col" style={{ marginRight: "20px" }}>
              <img className="img-fluid" src={`${process.env.PUBLIC_URL}/AboutImages/Step1-1.png`} alt="Step 1" style={{ borderRadius: "10px" }} />
            </div>
            <div className="col">
              <img className="img-fluid" src={`${process.env.PUBLIC_URL}/AboutImages/Step1-2.png`} alt="Step 2" style={{ borderRadius: "10px" }} />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-start flex-column my-3">
          <h5 className="fw-bold mb-4">Step 2: Scan image using your camera or upload an image</h5>
          <div className="d-flex justify-content-between">
            <div className="col" style={{ marginRight: "20px" }}>
              <img className="img-fluid" src={`${process.env.PUBLIC_URL}/AboutImages/Step2-1.png`} alt="Step 1" style={{ borderRadius: "10px" }} />
            </div>
            <div className="col">
              <img className="img-fluid" src={`${process.env.PUBLIC_URL}/AboutImages/Step2-2.png`} alt="Step 2" style={{ borderRadius: "10px" }} />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-start flex-column my-3">
          <h5 className="fw-bold mb-4">Step 3: Talk to the chatbot!</h5>
          <div className="d-flex justify-content-between">
            <div className="col" style={{ marginRight: "20px" }}>
              <img className="img-fluid" src={`${process.env.PUBLIC_URL}/AboutImages/Step3-1.png`} alt="Step 1" style={{ borderRadius: "10px" }} />
            </div>
            <div className="col">
              <img className="img-fluid" src={`${process.env.PUBLIC_URL}/AboutImages/Step3-2.png`} alt="Step 2" style={{ borderRadius: "10px" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
