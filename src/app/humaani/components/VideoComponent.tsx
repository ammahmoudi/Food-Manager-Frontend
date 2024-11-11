interface VideoComponentProps {
    src: string;
    className?: string; // Optional className prop
}

export default function VideoComponent({ src, className }: VideoComponentProps) {
    return (
        <video className={`w-full h-auto ${className || ""}`} controls>
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    );
}
