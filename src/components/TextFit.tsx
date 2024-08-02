import React, { useState, useEffect, useRef } from 'react';

interface TextFitProps {
  text: string;
}

const TextFit: React.FC<TextFitProps> = ({ text }) => {
  const [fontSize, setFontSize] = useState(16); // Initial font size
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const adjustFontSize = () => {
      if (textRef.current) {
        let currentFontSize = fontSize;
        const { clientWidth, scrollWidth } = textRef.current;

        while (scrollWidth > clientWidth && currentFontSize > 0) {
          currentFontSize -= 1;
          textRef.current.style.fontSize = `${currentFontSize}px`;
        }

        setFontSize(currentFontSize);
      }
    };

    adjustFontSize();
  }, [text, fontSize]);

  return (
    // <div className="w-full h-full flex items-center justify-center">
      <p
        ref={textRef}
        className="overflow-hidden whitespace-nowrap"
        style={{ fontSize: `${fontSize}px` }}
      >
        {text}
      </p>
    // </div>
  );
};

export default TextFit;
