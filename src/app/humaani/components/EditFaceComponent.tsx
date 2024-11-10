import React, { useState } from "react";
import { Card, Button, Slider, CardFooter, CircularProgress } from "@nextui-org/react";
import { toast } from "sonner";
import DatasetImage from "../interfaces/DatasetImage";
import { editFaceById } from "../services/aiApi";
import ImageComponent from "./ImageComponent";

interface EditFaceComponentProps {
    initialImage: DatasetImage | null;
    onClose: () => void;
}

const EditFaceComponent: React.FC<EditFaceComponentProps> = ({ initialImage, onClose }) => {
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
    const [jobId, setJobId] = useState<number | null>(null);

    const handleUpdate = async () => {
        if (!initialImage) return;

        setUpdating(true);
        setJobId(null)

        try {
            // Send the original image along with the current slider values to the API
            const response = await editFaceById({
                image_id: initialImage?.id,
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
                toast.success("Request submitted successfully. Job is processing...");
                setJobId(response);  // Set jobId after submission
            } else {
                throw new Error("No job ID returned");
            }
        } catch (error) {
            toast.error("Failed to submit update.");
            console.error("Error submitting update:", error);
        } finally {
            setUpdating(false); // Ensure that the button loading state is reset
        }
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
                fillOffset={0}
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
        <Card className="shadow-none">
            <div className="flex flex-col sm:flex-row w-full h-full">
                <div className="w-full items-center sm:w-1/2 ml-5 mt-1 p-2 flex flex-col m-1">
                    {updating ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <CircularProgress
                                color="success"
                                label="Processing"
                                size="lg"
                                showValueLabel
                                value={0}
                            />
                        </div>
                    ) : jobId ? (  // Show the processed job image after it's completed
                        <ImageComponent
                            src_id={jobId}
                            src_variant="job"
                            className="w-full h-full"
                            isClickable={true}
                        />
                    ) : initialImage ? (  // Show the original image before submitting the job
                        <ImageComponent
                            src_id={initialImage.id}
                            src_variant="datasetImage"
                            className="w-full h-full"
                            isClickable={true}
                        />
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
