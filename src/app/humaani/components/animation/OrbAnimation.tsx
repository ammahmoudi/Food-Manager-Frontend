import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import orbData from "./orb.json";

export default function OrbAnimation() {
    const animationContainer = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (animationContainer.current) {

            const animation = lottie.loadAnimation({
                container: animationContainer.current,
                renderer: "svg",
                loop: true,
                autoplay: true,
                animationData: orbData,
            });
            return () => animation.destroy();
        }
    }, []);

    return (
        <div
            ref={animationContainer}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 0,
                overflow: "hidden",
            }}
        />
    );
}
