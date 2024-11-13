import React, { useState, ChangeEvent } from "react";
import { Image, Spinner, Card } from "@nextui-org/react";
import { toast } from "sonner";
import { DatasetVideo } from "../interfaces/DatasetVideo";
import { uploadTempVideo } from "../services/aiApi";
import { HiPlay } from "react-icons/hi";


const ImageUploadComponent = () => {
    const [video, setVideo] = useState<DatasetVideo | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleVideoChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLoading(true);
            await handleUploadToBackend(file);
            setLoading(false);
        }
    };

    const handleUploadToBackend = async (file: File) => {
        setLoading(true);
        try {
            const uploadedVideo: DatasetVideo = await uploadTempVideo(file);
            console.log(uploadedVideo)
            setVideo(uploadedVideo);
            toast.success("Video uploaded successfully!");
        } catch (error) {
            console.error("Error uploading video:", error);
            toast.error("Failed to upload video.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full h-full">
            {loading ? (
                <Card className="flex flex-grow justify-center items-center w-full h-full bg-gray-100 aspect-square">
                    <Spinner color="primary" size="lg" />
                </Card>
            ) : (
                    <div className="relative z-10">
                        <Card
                            isPressable
                            onClick={() => document.getElementById("user-video-input")?.click()}
                            className={`w-full aspect-square bg-gray-200 relative items-center justify-center ${
                                video ? "bg-transparent" : ""
                            }`}
                        >
                        {video && video.cover_image ? (
                            <>
                                <div className="absolute inset-0 z-0">
                            <Image
                                alt="User Video"
                                className="w-full h-full object-cover blur-md"
                                classNames={{ wrapper: "w-full h-full aspect-square " }}
                                src={video.cover_image}
                            />
                        </div>
                                <Image
                                    src={video.cover_image}
                                    alt="User Video"
                                    className="w-full h-full object-cover rounded-none"
                                />
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <HiPlay className="text-white text-6xl opacity-80" />
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center w-full h-full">
                                <p className="text-gray-500">Click to upload an video</p>
                            </div>
                        )}
                        <input
                            type="file"
                            id="user-video-input"
                            className="hidden"
                            accept="video/*"
                            onChange={handleVideoChange}
                        />
                        </Card>
                    </div>
            )}
        </div>
    );
};

export default ImageUploadComponent;
