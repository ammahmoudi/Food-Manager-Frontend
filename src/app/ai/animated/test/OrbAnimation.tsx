"use client";

import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import orbData from "./orb.json";

export default function OrbAnimation() {
    const animationContainer = useRef(null);

    useEffect(() => {
        // Load the animation
        const animation = lottie.loadAnimation({
            container: animationContainer.current, // DOM element to contain the animation
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData: orbData, // Your JSON data
        });

        // Cleanup the animation when component unmounts
        return () => animation.destroy();
    }, []);

    return (
        <div
            ref={animationContainer}
            style={{
                position: "fixed", // Ensure it is fixed to the viewport
                top: 0,
                left: 0,
                width: "100vw", // Full viewport width
                height: "100vh", // Full viewport height
                display: "flex", // Flex to center if needed
                justifyContent: "center",
                alignItems: "center",
                zIndex: 0, // Keep it in the background, increase if needed

                overflow: "hidden", // Hide overflow content
            }}
        />
    );
}
