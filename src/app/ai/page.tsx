/* eslint-disable @next/next/no-page-custom-font */
"use client";

import OrbAnimation from "./animated/test/OrbAnimation";

const MainPage: React.FC = () => {
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

      <div className="relative flex flex-col items-center justify-center h-screen bg-gray-100 overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/maani_bg_1.png')",
            backgroundAttachment: "fixed",
          }} // Update with your image path
        ></div>

        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-black opacity-50 z-10" />

        {/* Orb Animation */}
        <div className="z-20">
          <OrbAnimation />
        </div>

        {/* Motto */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 text-white text-3xl font-bold text-center uppercase font-orbitron">
          <h5>Art redefined: Your vision, our AI</h5>
        </div>

        {/* Description at the bottom */}
        <div className="absolute bottom-24 w-full text-center z-30 text-white text-lg px-5 font-roboto">
          <p>
            At Maani, we transform your creative visions into breathtaking
            visuals, powered by cutting-edge AI technology, where artificial
            intelligence meets the art of visual storytelling.
          </p>
        </div>
      </div>
    </>
  );
};

export default MainPage;
