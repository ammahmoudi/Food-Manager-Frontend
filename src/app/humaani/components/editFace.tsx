import React, { useState } from "react";
import { Card, Button, Slider, CardFooter, CircularProgress } from "@nextui-org/react";
import { toast } from "sonner";
import { Job } from "../interfaces/Job";
import DatasetImage from "../interfaces/DatasetImage";
import { editFaceById, getImageById, getJob } from "../services/aiApi";
import ImageComponent from "./ImageComponent";

interface EditFaceComponentProps {
    initialImage: DatasetImage | null;
    onClose: () => void;
}

const EditFaceComponent: React.FC<EditFaceComponentProps> = ({ initialImage, onClose }) => {
    const [image, setImage] = useState<DatasetImage | null>(initialImage);
    const [rotatePitch, setRotatePitch] = useState(0);
    const [rotateYaw, setRotateYaw] = useState(0);
    const [rotateRoll, setRotateRoll] = useState(0);
    const [blink, setBlink] = useState(0);
    const [eyebrow, setEyebrow] = useState(0);
    const [wink, setWink] = useState(0);
    const [pupilX, setPupilX] = useState(0);
    const [pupilY, setPupilY] = useState(0);
    const [aaa, setAaa] = useState(0);
    const [eee, setEee] = useState(0);
    const [woo, setWoo] = useState(0);
    const [smile, setSmile] = useState(0);
    const [updating, setUpdating] = useState(false);
    const [job, setJob] = useState<Job | null>(null);

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            if(image){

                const response = await editFaceById({
                    image_id: image?.id,
                    rotate_pitch: String(rotatePitch),
                    rotate_yaw: String(rotateYaw),
                    rotate_roll: String(rotateRoll),
                    blink: String(blink),
                    eyebrow: String(eyebrow),
                    wink: String(wink),
                    pupil_x: String(pupilX),
                    pupil_y: String(pupilY),
                    aaa: String(aaa),
                    eee: String(eee),
                    woo: String(woo),
                    smile: String(smile),
                });

                if (response) {
                    toast.success("Request submitted successfully. Polling job status...");
                    pollJobStatus(response);
                } else {
                    throw new Error("No job ID returned");
                }
            }
        } catch (error) {
            toast.error("Failed to submit update.");
            console.error("Error submitting update:", error);
            setUpdating(false);
        }
    };

    const pollJobStatus = (jobId: number) => {
        let polling = true;

        const fetchJobStatus = async () => {
            try {
                const jobData = await getJob(jobId);
                setJob(jobData);
                if (jobData.status === "completed") {
                    await fetchImageData(jobData.images[0]);
                    toast.success("Job completed and result is ready!");
                    polling = false;
                } else if (jobData.status === "failed") {
                    toast.error("Job failed to complete.");
                    polling = false;
                }
            } catch (error) {
                console.error("Error fetching job status:", error);
                toast.error("Error fetching job status.");
                polling = false;
            }
        };

        const fetchImageData = async (imageId: number) => {
            try {
                const updatedImage = await getImageById(imageId);
                setImage(updatedImage);
                setUpdating(false);
            } catch (error) {
                console.error(`Error fetching image with ID ${imageId}:`, error);
            }
        };

        const intervalId = setInterval(async () => {
            if (polling) {
                await fetchJobStatus();
            } else {
                clearInterval(intervalId);
                setUpdating(false);
            }
        }, 5000);
    };

    const handleCancel = () => {
        setRotatePitch(0);
        setRotateYaw(0);
        setRotateRoll(0);
        setBlink(0);
        setEyebrow(0);
        setWink(0);
        setPupilX(0);
        setPupilY(0);
        setAaa(0);
        setEee(0);
        setWoo(0);
        setSmile(0);
        setUpdating(false);
        onClose();
        toast.info("Changes canceled.");
    };

    const renderSlider = (
        label: string,
        value: number,
        onChange: (value: number) => void,
        min: number,
        max: number,
        step: number
    ) => (
        <div className="flex flex-col gap-2 w-full h-full max-w-md items-start justify-center">
            <Slider
                size="sm"
                aria-label={label}
                value={value}
                defaultValue={value}
                onChange={(val) => onChange(val as number)}
                minValue={min}
                maxValue={max}
                step={step}
                color="foreground"
                className="max-w-md"
            />
            <p className="text-default-500 font-medium text-small">
                {label}: {value}
            </p>
        </div>
    );

    return (
        <Card>
            <div className="flex flex-col sm:flex-row w-full h-full">
                <div className="w-full items-center sm:w-1/2 ml-5 mt-1 p-2 flex flex-col m-1">
                    {updating && image ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <CircularProgress
                                color="success"
                                label={job?.status}
                                size="lg"
                                showValueLabel
                                value={(job?.progress || 0) * 100}
                            />
                        </div>
                    ) : image ? (
                        <ImageComponent src_id={image.id} src_variant={"datasetImage"} />
                    ) : (
                        <p>No image available</p>
                    )}
                </div>
                <div className="w-full sm:w-1/2 p-5 gap-5 flex flex-col m-5">
                    <div className="grid grid-cols-2 gap-4">
                        {renderSlider("Rotate Pitch", rotatePitch, setRotatePitch, -20, 20, 0.5)}
                        {renderSlider("Rotate Yaw", rotateYaw, setRotateYaw, -20, 20, 0.5)}
                        {renderSlider("Rotate Roll", rotateRoll, setRotateRoll, -20, 20, 0.5)}
                        {renderSlider("Blink", blink, setBlink, -20, 5, 0.5)}
                        {renderSlider("Eyebrow", eyebrow, setEyebrow, -10, 15, 0.5)}
                        {renderSlider("Wink", wink, setWink, 0, 25, 0.5)}
                        {renderSlider("Pupil X", pupilX, setPupilX, -15, 15, 0.5)}
                        {renderSlider("Pupil Y", pupilY, setPupilY, -15, 15, 0.5)}
                        {renderSlider("AAA", aaa, setAaa, -30, 120, 1)}
                        {renderSlider("EEE", eee, setEee, -20, 15, 0.2)}
                        {renderSlider("WOO", woo, setWoo, -20, 15, 0.2)}
                        {renderSlider("Smile", smile, setSmile, -0.3, 1.3, 0.01)}
                    </div>
                </div>
            </div>
            <CardFooter className="w-full flex justify-between mt-0">
                <Button color="danger" variant="light" onClick={handleCancel} disabled={updating}>
                    Cancel
                </Button>
                <Button color="success" onClick={handleUpdate} isLoading={updating}>
                    Update Changes
                </Button>
            </CardFooter>
        </Card>
    );
};

export default EditFaceComponent;