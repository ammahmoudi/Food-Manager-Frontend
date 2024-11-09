import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Spinner,
  Skeleton,
  CardHeader,
  Textarea,
} from "@nextui-org/react";
import DatasetImage from "@/app/humaani/interfaces/DatasetImage";
import {
  getImageById,
  getJob,
  requestPromptsForImage,
  updatePromptsForImage,
} from "@/app/humaani/services/aiApi";
import { toast } from "sonner";
import ImageComponent from "./ImageComponent";

interface DatasetImageInfoCardProps {
  imageId: number;
  onDeleteSuccess: () => void;
}

const DatasetImageInfoCard: React.FC<DatasetImageInfoCardProps> = ({
  imageId,
}) => {
  const [imageData, setImageData] = useState<DatasetImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFetchingPrompts, setIsFetchingPrompts] = useState(false);
  const [isUpdatingPrompts, setIsUpdatingPrompts] = useState(false);
  const [polling, setPolling] = useState(false);
  const [complexPrompt, setComplexPrompt] = useState<string>("");
  const [tagPrompt, setTagPrompt] = useState<string>("");
  const [negativePrompt, setNegativePrompt] = useState<string>("");

  const handleGetPrompts = async () => {
    try {
      setIsFetchingPrompts(true);
      const response = await requestPromptsForImage({
        dataset_image_id: imageId,
      });

      if (response.job_id) {
        toast.success("Prompt submitted successfully!");
        pollJobStatus(response.job_id);
      } else {
        toast.error("Failed to retrieve job ID.");
      }
    } catch (error) {
      console.error(
        `Error requesting prompts for image with ID ${imageId}:`,
        error
      );
      setIsFetchingPrompts(false);
    }
  };

  // update textarea fields
  const handleUpdateImageDataFields = (updatedImageData: DatasetImage) => {
    setImageData(updatedImageData);
    if (updatedImageData.complex_prompt) {
      setComplexPrompt(updatedImageData.complex_prompt);
    } else {
      setComplexPrompt("N/A");
    }
    if (updatedImageData.tag_prompt) {
      setTagPrompt(updatedImageData?.tag_prompt);
    } else {
      setTagPrompt("N/A");
    }
    if (updatedImageData.negative_prompt) {
      setNegativePrompt(updatedImageData?.negative_prompt);
    } else {
      setNegativePrompt("N/A");
    }
  };

  const handleUpdatePrompts = async () => {
    try {
      setIsUpdatingPrompts(true);
      const response = await updatePromptsForImage(
        imageId,
        complexPrompt,
        negativePrompt,
        tagPrompt
      );

      if (response) {
        toast.success("Prompt Updated successfully!");
        setIsUpdatingPrompts(false);
      } else {
        toast.error("Failed to Update Prompt.");
      }
    } catch (error) {
      console.error(
        `Error requesting prompts for image with ID ${imageId}:`,
        error
      );
    }
  };

  const pollJobStatus = async (jobId: number) => {
    setPolling(true);
    const fetchJobStatus = async () => {
      try {
        const jobData = await getJob(jobId);
        if (jobData.status === "completed") {
          setPolling(false);
          setIsFetchingPrompts(false);
          toast.success("Job completed and result is ready!");
          clearInterval(intervalId);
          const updatedImageData = await getImageById(imageId);
          handleUpdateImageDataFields(updatedImageData);
        } else if (jobData.status === "failed") {
          setPolling(false);
          setIsFetchingPrompts(false);
          toast.error("Job failed to complete.");
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Error fetching job status:", error);
        setPolling(false);
        setIsFetchingPrompts(false);
        clearInterval(intervalId);
        toast.error("Error fetching job status.");
      }
    };
    const intervalId = setInterval(fetchJobStatus, 5000);
    await fetchJobStatus();
    return () => clearInterval(intervalId);
  };

  useEffect(() => {
    const fetchImageData = async () => {
      setLoading(true);
      try {
        const data = await getImageById(imageId);
        setImageData(data);
        handleUpdateImageDataFields(data);
      } catch (error) {
        console.error(`Error fetching image with ID ${imageId}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchImageData();
  }, [imageId]);

  return (
    <>
      <Card className="mx-auto  w-full shadow-none">
        <CardHeader className="flex flex-col sm:flex-row gap-4 w-full items-start">
          <div className="w-full aspect-square sm:w-1/4">
            {loading ? (
              <div className="flex justify-center items-center w-full h-full z-10">
                <Spinner color="primary" size="lg" />
              </div>
            ) : (
              <Card>
                {imageData &&
                  <ImageComponent src_id={imageId} src_variant={"datasetImage"} isClickable={false}></ImageComponent>
                }
              </Card>
            )}
          </div>
          <div className="w-full flex flex-col flex-1">
            <div className="mb-4">
              <p className="text-xl font-bold">{imageData?.name}</p>
              <p className="text-sm text-gray-500">
                Job: {imageData?.job ?? "N/A"}
              </p>
            </div>
            <CardBody className="p-0 flex flex-col gap-2">
              <p className="text-sm">
                Character ID: {imageData?.character ?? "N/A"}
              </p>
            </CardBody>
          </div>
        </CardHeader>
        <CardBody className="flex flex-col sm:flex-row gap-4 w-full items-start">
          <div className="w-full flex flex-col flex-1">
            <CardBody className="p-0 flex flex-col gap-2">
              <>
                <Skeleton isLoaded={!isFetchingPrompts}>
                  {" "}
                  <Textarea
                    label="Complex Prompt"
                    variant="bordered"
                    labelPlacement="outside"
                    value={complexPrompt}
                    onValueChange={setComplexPrompt}
                    className="w-full"
                  />
                </Skeleton>
                <Skeleton isLoaded={!isFetchingPrompts}>
                  <Textarea
                    radius="full"
                    label="Tag Prompt"
                    variant="bordered"
                    labelPlacement="outside"
                    value={tagPrompt}
                    onValueChange={setTagPrompt}
                    className="w-full"
                  />
                </Skeleton>

                <Skeleton isLoaded={!isFetchingPrompts}>
                  <Textarea
                    label="Negative Prompt"
                    variant="bordered"
                    labelPlacement="outside"
                    value={negativePrompt}
                    onValueChange={setNegativePrompt}
                    className="w-full"
                  />
                </Skeleton>
              </>
            </CardBody>
          </div>
        </CardBody>

        <CardFooter className="flex justify-end gap-4">
          <Button
            color="primary"
            onClick={handleGetPrompts}
            disabled={isUpdatingPrompts || isFetchingPrompts || polling}
            isLoading={isUpdatingPrompts || isFetchingPrompts}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isFetchingPrompts ? "Fetching Prompts..." : "Get Prompts"}
          </Button>

          <Button
            color="secondary"
            onClick={handleUpdatePrompts}
            disabled={isUpdatingPrompts || isFetchingPrompts || polling}
            isLoading={isUpdatingPrompts || isFetchingPrompts}
          >
            {isUpdatingPrompts ? "Updating Prompts..." : "Update Prompts"}
          </Button>

        </CardFooter>
      </Card>
    </>
  );
};

export default DatasetImageInfoCard;
