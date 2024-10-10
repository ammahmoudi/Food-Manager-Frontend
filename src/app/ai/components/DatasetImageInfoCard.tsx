import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
} from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/react";
import DatasetImage from "@/app/ai/interfaces/DatasetImage";
import {
  getImageById,
  deleteImageById,
  getJob,
  requestPromptsForImage,
} from "@/app/ai/services/aiApi";
import { Job } from "../interfaces/Job";
import { toast } from "sonner";

interface DatasetImageInfoCardProps {
  imageId: number;
  onDeleteSuccess: () => void;
}

const DatasetImageInfoCard: React.FC<DatasetImageInfoCardProps> = ({
  imageId,
  onDeleteSuccess,
}) => {
  const [imageData, setImageData] = useState<DatasetImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [isFetchingPrompts, setIsFetchingPrompts] = useState(false);
  const [polling, setPolling] = useState(false);

  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useDisclosure();

  const fetchImageData = async () => {
    try {
      const data = await getImageById(imageId);
      setImageData(data);
    } catch (error) {
      console.error(`Error fetching image with ID ${imageId}:`, error);
      setError("Failed to load image data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteImageById(imageId);
      onDeleteSuccess();
    } catch (error) {
      console.error(`Error deleting image with ID ${imageId}:`, error);
      setError("Failed to delete image.");
    } finally {
      closeDeleteModal();
    }
  };

  const handleGetPrompts = async () => {
    try {
      setIsFetchingPrompts(true);
      setJob(null); // Clear previous job data
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
      setError("Failed to request prompts.");
      setIsFetchingPrompts(false);
    }
  };

  const pollJobStatus = async (jobId: number) => {
    setPolling(true);

    const fetchJobStatus = async () => {
      try {
        const jobData = await getJob(jobId);
        setJob(jobData); // Store the full job object

        if (jobData.status === "completed") {
          setPolling(false);
          setIsFetchingPrompts(false);
          clearInterval(intervalId); // Stop polling when job is completed
          fetchImageData(); // Refresh image data
          toast.success("Job completed and result is ready!");
        } else if (jobData.status === "failed") {
          setPolling(false);
          setIsFetchingPrompts(false);
          clearInterval(intervalId); // Stop polling when job has failed
          toast.error("Job failed to complete.");
        }
      } catch (error) {
        console.error("Error fetching job status:", error);
        setPolling(false);
        setIsFetchingPrompts(false);
        clearInterval(intervalId); // Stop polling in case of error
        toast.error("Error fetching job status.");
      }
    };

    // Call the function immediately for the first time
    await fetchJobStatus();

    // Set up the interval for subsequent polling
    const intervalId = setInterval(async () => {
      await fetchJobStatus();
    }, 5000); // Poll every 5 seconds
  };

  useEffect(() => {
    fetchImageData();
  }, [imageId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <>
      <Card className="mx-auto shadow-lg w-full">
        <div className="flex flex-col lg:flex-row gap-4 w-full items-start">
          <div className="w-full lg:w-1/2">
            <Image
              alt={imageData?.name ?? "Image"}
              src={imageData?.image ?? ""}
              className="h-auto aspect-square rounded-md object-cover"
            />
          </div>
          <div className="w-full flex flex-col flex-1">
            <div className="mb-4">
              <p className="text-xl font-bold">{imageData?.name}</p>
              <p className="text-sm text-gray-500">
                Job: {imageData?.job ?? "N/A"}
              </p>
            </div>
            <CardBody className="p-0">
              <p className="text-sm">
                Character ID: {imageData?.character ?? "N/A"}
              </p>
              <Textarea
                isReadOnly
                label="Complex Prompt"
                variant="bordered"
                labelPlacement="outside"
                placeholder="Enter your description"
                defaultValue={imageData?.complex_prompt ?? "N/A"}
                className="w-full"
              />
              <Textarea
                isReadOnly
                label="Tag Prompt"
                variant="bordered"
                labelPlacement="outside"
                placeholder="Enter your description"
                defaultValue={imageData?.tag_prompt ?? "N/A"}
                className="w-full"
              />
              <Textarea
                isReadOnly
                label="Negative Prompt"
                variant="bordered"
                labelPlacement="outside"
                placeholder="Enter your description"
                defaultValue={imageData?.negative_prompt ?? "N/A"}
                className="w-full"
              />
            </CardBody>
          </div>
        </div>

        <CardFooter className="flex justify-end gap-4">
          <Button
            color="primary"
            onClick={handleGetPrompts}
            disabled={isFetchingPrompts || polling}
            isLoading={isFetchingPrompts}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isFetchingPrompts ? "Fetching Prompts..." : "Get Prompts"}
          </Button>
          <Button
            color="danger"
            onClick={openDeleteModal}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete Image
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onOpenChange={closeDeleteModal}>
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this image?</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={closeDeleteModal}
              className="bg-gray-500 hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Yes, Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DatasetImageInfoCard;
