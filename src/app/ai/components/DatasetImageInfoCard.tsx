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
	Spinner,
	Skeleton,
} from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/react";
import DatasetImage from "@/app/ai/interfaces/DatasetImage";
import {
	getImageById,
	deleteImageById,
	getJob,
	requestPromptsForImage,
} from "@/app/ai/services/aiApi";
import { toast } from "sonner";

const fallbackImage =
	process.env.NEXT_PUBLIC_MAANI_SQUARE_FALLBACK_IMAGE_URL ||
	"/images/ai/manani_fallback_square.png";

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
	const [isFetchingPrompts, setIsFetchingPrompts] = useState(false);
	const [polling, setPolling] = useState(false);
	const [imageError, setImageError] = useState(false); // Track image load errors

	const {
		isOpen: isDeleteModalOpen,
		onOpen: openDeleteModal,
		onClose: closeDeleteModal,
	} = useDisclosure();

	useEffect(() => {
		const fetchImageData = async () => {
			setLoading(true);
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

		fetchImageData();
	}, [imageId]);

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
  
        if (jobData.status === "completed") {
          setPolling(false);
          setIsFetchingPrompts(false);
          toast.success("Job completed and result is ready!");
          clearInterval(intervalId); // Stop polling when job is completed
          // Fetch the latest image data to update prompts
          const updatedImageData = await getImageById(imageId);
          setImageData(updatedImageData); // Update state with new prompts
        } else if (jobData.status === "failed") {
          setPolling(false);
          setIsFetchingPrompts(false);
          toast.error("Job failed to complete.");
          clearInterval(intervalId); // Stop polling if job failed
        }
      } catch (error) {
        console.error("Error fetching job status:", error);
        setPolling(false);
        setIsFetchingPrompts(false);
        clearInterval(intervalId); // Stop polling in case of an error
        toast.error("Error fetching job status.");
      }
    };
  
    // Poll every 5 seconds
    const intervalId = setInterval(fetchJobStatus, 5000); // Save interval ID
  
    // Initial fetch
    await fetchJobStatus(); 
  
    // Ensure the interval is cleaned up on component unmount or when polling stops
    return () => clearInterval(intervalId);
  };
  

	// Unified Image Component for both modes with fallback handling
	const RenderImage = (props: { src: string | null; alt: string }) => {
		const [imageSrc, setImageSrc] = useState<string | null>(props.src);

		const handleImageError = () => {
			setImageSrc(fallbackImage); // Use fallback if image fails to load
			setImageError(true); // Set error flag
		};

		return (
			<Image
				src={imageSrc || fallbackImage} // Use fallback if the image source is null
				alt={props.alt}
				className="z-10 h-full w-full aspect-square rounded-md object-contain"
				classNames={{ wrapper: "w-full h-full aspect-square" }}
				onError={handleImageError} // Handle 404 or other loading errors
			/>
		);
	};

	return (
		<>
			<Card className="mx-auto shadow-none w-full">
				<div className="flex flex-col lg:flex-row gap-4 w-full items-start">
					<Card className=" h-full w-full aspect-square lg:w-1/2">
						{/* Blurred Background */}
						<div className="absolute inset-0 z-0">
							<Image
								alt="Blurred Background"
								src={imageData?.image || fallbackImage}
								className="w-full h-full object-cover blur-md"
								classNames={{ wrapper: "w-full h-full aspect-square" }}
								onError={() => setImageError(true)}
							/>
						</div>
						{/* Main Image */}
						{loading ? (
							<div className="flex justify-center items-center w-full h-full z-10">
								<Spinner color="primary" size="lg" />
							</div>
						) : (
							<RenderImage
								src={imageData?.image ?? null}
								alt={imageData?.name ?? "Image"}
							/>
						)}
					</Card>
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

							<>
								<Skeleton isLoaded={!isFetchingPrompts}>
									{" "}
									<Textarea
										isReadOnly
										label="Complex Prompt"
										variant="bordered"
										labelPlacement="outside"
										placeholder="Enter your description"
										value={imageData?.complex_prompt ?? "N/A"}
										className="w-full"
									/>
								</Skeleton>
								<Skeleton isLoaded={!isFetchingPrompts}>
									<Textarea
										isReadOnly
										label="Tag Prompt"
										variant="bordered"
										labelPlacement="outside"
										placeholder="Enter your description"
										value={imageData?.tag_prompt ?? "N/A"}
										className="w-full"
									/>
								</Skeleton>

								<Skeleton isLoaded={!isFetchingPrompts}>
									<Textarea
										isReadOnly
										label="Negative Prompt"
										variant="bordered"
										labelPlacement="outside"
										placeholder="Enter your description"
										value={imageData?.negative_prompt ?? "N/A"}
										className="w-full"
									/>
								</Skeleton>
							</>
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
