import React, { FC, useEffect, useState } from "react";
import {
	Modal,
	ModalContent,
	Image,
	ModalBody,
	ModalFooter,
	Button,
	Spinner,
	useDisclosure,
	ModalHeader,
} from "@nextui-org/react";
import { toast } from "sonner";
import DatasetImage from "../../interfaces/DatasetImage";
import { deleteImageById, getImageById, getJob } from "../../services/aiApi";
import { HiOutlineDownload, HiOutlineTrash } from "react-icons/hi";
import { GiDoubleFaceMask } from "react-icons/gi";
import { PiTextAlignLeftLight } from "react-icons/pi";
import { IoCloseCircle } from "react-icons/io5";
import CarouselComponent from "../CarouselComponent";
import { Job } from "../../interfaces/Job";
import DatasetImageInfoModal from "./DatasetImageInfoModal";
import EditFaceModal from "./livePortraitModal";
import VideoComponent from "../VideoComponent";
import { MdOutlineVideoCall } from "react-icons/md";
import GenerateVideoModal from "./GenerateVideoModal";

interface FullScreenModalProps {
	initialImageId: number;
	isOpen: boolean;
	onClose: () => void;
	onUpdate: () => void;
}

const FullScreenModal: FC<FullScreenModalProps> = ({
	initialImageId,
	isOpen,
	onClose,
	onUpdate,
}) => {
	const {
		isOpen: isDeleteModalOpen,
		onOpen: openDeleteModal,
		onClose: closeDeleteModal,
	} = useDisclosure();
	const {
		isOpen: isEditFaceModalOpen,
		onOpen: openEditFaceModal,
		onClose: closeEditFaceModal,
	} = useDisclosure();
	const {
		isOpen: isImageInfoModalOpen,
		onOpen: openImageInfoeModal,
		onClose: closeImageInfoModal,
	} = useDisclosure();
	const {
		isOpen: isGenerateVideoModalOpen,
		onOpen: openGenerateVideoModal,
		onClose: closeGenerateVideoModal,
	} = useDisclosure(); // Video modal state

	const [image, setImage] = useState<DatasetImage>();
	const [loading, setLoading] = useState<boolean>(false);
	const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
	const [selectedJob, setSelectedJob] = useState<Job | null>(null);

	// Effect to reset state when modal opens
	useEffect(() => {
		if (isOpen) {
			// Reset variant selection and job when modal opens
			setSelectedVariant(null);
			setSelectedJob(null);
			fetchImage();
		}
	}, [isOpen]);

	const downloadImage = async () => {
		if (image) {
			try {
				const response = await fetch(image?.image);
				const blob = await response.blob();
				const blobUrl = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.href = blobUrl;
				link.download = "downloaded_image.jpg";
				link.click();
				URL.revokeObjectURL(blobUrl);
			} catch (error) {
				console.error("Error downloading image:", error);
				toast.error("Failed to download image.");
			}
		}
	};

	const handleDelete = async () => {
		try {
			if (image) {
				await deleteImageById(image?.id);
			}
		} catch (error) {
			console.error(`Error deleting image:`, error);
		} finally {
			onUpdate();
			closeDeleteModal();
			onClose();
		}
	};

	const handleVariantSelect = async (jobId: number) => {
		try {
			const job = await getJob(jobId);
			setSelectedJob(job);
			const videoOutput = job.video_outputs?.[0]?.video_url;
			const imageOutput = job.image_outputs?.[0]?.url;
			setSelectedVariant(videoOutput || imageOutput || null);
		} catch (error) {
			console.error(`Error fetching job data for variant ID ${jobId}:`, error);
			toast.error("Failed to load variant data.");
		}
	};

	const handleVariantClose = () => {
		setSelectedVariant(null);
		setSelectedJob(null);
	};

	// Fetch function to reload the image
	const fetchImage = async () => {
		setLoading(true);
		try {
			const fetchedImage = await getImageById(initialImageId);
			setImage(fetchedImage);
		} catch (error) {
			console.error(`Error fetching data for ${initialImageId}:`, error);
			toast.error(`Failed to fetch image data.`);
		} finally {
			setLoading(false);
		}
	};

	// Custom close function for the main modal
	const handleClose = () => {
		handleVariantClose(); // Reset variant when closing
		onUpdate();
		onClose();
	};

	return (
		<>
		<Modal
			backdrop="blur"
			className="bg-transparent h-screen"
			isOpen={isOpen}
			onClose={handleClose}
			size="full"
			classNames={{
				body: "flex flex-col justify-center items-center h-screen",
				closeButton: "text-white text-large"
			}}
			onClick={handleClose}
		>
			<ModalContent onClick={(e) => e.stopPropagation()}>
				<ModalBody className="flex-grow flex items-center justify-center py-4 overflow-y-auto">
					{loading ? (
						<Spinner />
					) : (
						<div className="flex items-center justify-center align-middle gap-4 w-full h-full">
							{/* Original Image - Smaller */}
							{selectedVariant && (
								<div
									className="flex flex-grow-0 flex-shrink-0 h-full max-w-[15vw] rounded-lg overflow-hidden"
									onClick={(e) => e.stopPropagation()}
								>
									<Image
										removeWrapper
										src={image?.image}
										alt="Original"
										className="object-contain w-full h-full rounded-lg"
									/>
								</div>
							)}

							{/* Selected Variant - Larger with Aspect Ratio Constraint */}
							<div
								className="relative flex flex-grow-0 flex-shrink-0 max-w-[60vw] max-h-[80vh] aspect-w-16 aspect-h-9 rounded-lg overflow-hidden"
								onClick={(e) => e.stopPropagation()}
							>
								{/* Close Button */}
								{selectedVariant && (
									<Button
										isIconOnly
										onClick={(e) => {
											e.stopPropagation();
											handleVariantClose();
										}}
										className="absolute top-2 right-2 z-20 text-white bg-transparent hover:text-red-500"
									>
										<IoCloseCircle size={30} />
									</Button>
								)}
								
								{/* Video or Image Variant with Aspect Ratio */}
								{selectedVariant?.endsWith(".mp4") ? (
									<div className="flex justify-center items-center w-full h-full rounded-lg overflow-hidden">
										<VideoComponent src={selectedVariant} className="object-contain w-full h-full rounded-lg" />
									</div>
								) : (
									<Image
										removeWrapper
										src={selectedVariant || image?.image}
										alt="Selected Variant"
										className="object-contain w-full h-full rounded-lg"
									/>
								)}
							</div>
						</div>
					)}
				</ModalBody>


					<ModalFooter className="flex flex-col w-full space-y-4">
						{/* Carousel Component */}
						{image?.variants && image.variants.length > 0 && (
							<div className="w-full h-[20vh] max-h-32 overflow-x-auto overflow-y-hidden justify-center mb-4 flex items-center">
								<CarouselComponent
									jobs={image.variants}
									onImageClick={(id) => {
										handleVariantSelect(id);
									}}
									selectedVariant={selectedJob?.id || null}
								/>
							</div>
						)}

						{/* Action Buttons */}
						<div className="flex justify-center space-x-4">
							<Button
								isIconOnly
								size="lg"
								className="text-white hover:text-primary bg-transparent shadow-none text-4xl"
								onPress={openEditFaceModal}
							>
								<GiDoubleFaceMask />
							</Button>
							<Button
								isIconOnly
								size="lg"
								className="text-white hover:text-primary bg-transparent shadow-none text-4xl"
								onPress={openGenerateVideoModal}
							>
								<MdOutlineVideoCall />
							</Button>
							<Button
								isIconOnly
								size="lg"
								className="text-white hover:text-black bg-transparent shadow-none text-4xl"
								onPress={openImageInfoeModal}
							>
								<PiTextAlignLeftLight />
							</Button>
							<Button
								size="lg"
								isIconOnly
								className="text-white hover:text-green-600 bg-transparent shadow-none text-4xl"
								onPress={downloadImage}
							>
								<HiOutlineDownload />
							</Button>
							<Button
								size="lg"
								isIconOnly
								className="text-white hover:text-red-600 bg-transparent shadow-none text-4xl"
								onPress={openDeleteModal}
							>
								<HiOutlineTrash />
							</Button>
						</div>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Edit Face Modal */}
			{image && (
				<EditFaceModal
					image={image}
					isOpen={isEditFaceModalOpen}
					onClose={() => {
						closeEditFaceModal();
						fetchImage(); // Refetch image data on close
					}}
					onDeleteSuccess={() => {
						closeEditFaceModal();
						fetchImage();
					}}
				/>
			)}

			{/* Dataset Image Info Modal */}
			<DatasetImageInfoModal
				visible={isImageInfoModalOpen}
				onClose={() => {
					closeImageInfoModal();
					fetchImage(); // Refetch image data on close
				}}
				imageId={initialImageId}
				onDeleteSuccess={() => {
					closeImageInfoModal();
					fetchImage();
				}}
			/>

			{/* Generate Video Modal */}
			<GenerateVideoModal
				visible={isGenerateVideoModalOpen}
				onClose={() => {
					closeGenerateVideoModal();
					fetchImage(); // Refetch image data on close
				}}
				datasetId={image?.id || null}
				onSave={(videoRequest) => {
					console.log("Video request completed:", videoRequest);
					closeGenerateVideoModal();
					fetchImage();
				}}
			/>

			{/* Delete Confirmation Modal */}
			<Modal isOpen={isDeleteModalOpen} onOpenChange={closeDeleteModal}>
				<ModalContent>
					<ModalHeader>Confirm Deletion</ModalHeader>
					<ModalBody>
						<p>Are you sure you want to delete this image?</p>
					</ModalBody>
					<ModalFooter>
						<Button
							variant="light"
							color="secondary"
							onClick={closeDeleteModal}
						>
							Cancel
						</Button>
						<Button color="danger" onClick={handleDelete}>
							Delete
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default FullScreenModal;
