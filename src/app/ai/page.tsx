/* eslint-disable @next/next/no-page-custom-font */
"use client";

import React, { useEffect } from "react";
import OrbAnimation from "./animated/OrbAnimation";


const MainPage: React.FC = () => {
  useEffect(() => {
    // Disable scrolling for the entire page
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      // Re-enable scrolling when component unmounts
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      {/* Include fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
        rel="stylesheet"
      />

      <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
        {/* Background image using a div */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/maani_bg_1.png')",
            backgroundAttachment: "fixed",
          }} // Update with your image path
        ></div>

        {/* Overlay for better text visibility */}
        <div className="absolute inset-0  z-10" />

        {/* Render the Lottie animation fullscreen */}
        <OrbAnimation />

        {/* Motto at the center of the page */}
        <div
          style={{
            position: "absolute",
            top: "45%", // Vertical center
            left: "50%", // Horizontal center
            transform: "translate(-50%, -50%)", // Center both vertically and horizontally
            zIndex: 2, // Ensure it's on top of the animation
            fontFamily: "'Orbitron', sans-serif", // Robotic font for motto
            fontSize: "3rem", // Larger font for the motto
            fontWeight: "bold", // Bold text
            textAlign: "center", // Center the text
            textTransform: "uppercase", // Make it uppercase for a futuristic feel
            color: "#fff",
          }}
        >
          <h5>Art redefined: Your vision, our AI</h5>
        </div>

        {/* Description at the bottom of the page */}
        <div
          style={{
            position: "absolute",
            bottom: "100px", // Small gap from the bottom of the page
            width: "100%", // Full width
            textAlign: "center", // Center the text
            zIndex: 2, // Keep it above the animation
            fontFamily: "'Roboto', sans-serif", // Description stays with Roboto
            fontSize: "1.5rem", // Smaller font for description
            padding: "0 20px", // Small padding for mobile view
            color: "#fff",
          }}
        >
          <p>
            At Maani, we transform your creative visions into breathtaking visuals, powered by cutting-edge AI technology, where artificial intelligence meets the art of visual storytelling.
          </p>
        </div>
      </div>
    </>
  );
};

export default MainPage;
