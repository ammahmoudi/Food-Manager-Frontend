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
	Card,
	CardHeader,
} from "@nextui-org/react";
import { toast } from "sonner";
import DatasetImage from "../../interfaces/DatasetImage";
import { deleteImageById, getImageById, getJob } from "../../services/aiApi";
import { HiOutlineDownload, HiOutlineTrash } from "react-icons/hi";
import { GiDoubleFaceMask } from "react-icons/gi";
import { PiTextAlignLeftLight } from "react-icons/pi";
import { IoCloseCircle } from "react-icons/io5";
import CarouselComponent from "../CarousalComponent";
import { Job } from "../../interfaces/Job";
import DatasetImageInfoModal from "./DatasetImageInfoModal";
import EditFaceModal from "./livePortraitModal";

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
	const { isOpen: isDeleteModalOpen, onOpen: openDeleteModal, onClose: closeDeleteModal } = useDisclosure();
	const { isOpen: isEditFaceModalOpen, onOpen: openEditFaceModal, onClose: closeEditFaceModal } = useDisclosure();
	const { isOpen: isImageInfoModalOpen, onOpen: openImageInfoeModal, onClose: closeImageInfoModal } = useDisclosure();

	const [image, setImage] = useState<DatasetImage>();
	const [loading, setLoading] = useState<boolean>(false);
	const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
	const [selectedJob, setSelectedJob] = useState<Job | null>(null);

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
				onUpdate();
			}
		} catch (error) {
			console.error(`Error deleting image:`, error);
		} finally {
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

	useEffect(() => {
		const fetchData = async () => {
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
		fetchData();
	}, [initialImageId]);

	return (
		<>
		<Modal
	backdrop="blur"
	className="bg-transparent h-screen"
	isOpen={isOpen}
	onClose={onClose}
	size="full"
	classNames={{
		body: "flex flex-col justify-center items-center h-screen",
	}}
>
	{/* Background click handler */}
	<div onClick={onClose} className="absolute inset-0 bg-transparent" />

	<ModalContent onClick={(e) => e.stopPropagation()} /* Prevents modal close on content click */>
		<ModalBody className="flex-grow flex  items-center justify-center py-4 overflow-y-auto">
			{loading ? (
				<Spinner />
			) : (
				<div className=" flex items-center align-middle  gap-4 ">
					{/* Original Image - Smaller when a variant is selected */}
					{selectedVariant && (
						<div
							className="flex flex-grow"
							
							onClick={(e) => e.stopPropagation()} // Prevent modal close on image click
						>
							<Image
              removeWrapper
								src={image?.image}
								alt="Original"
								className="w-full h-full object-contain"
                style={{
                  maxWidth: "20vw",
                  maxHeight: "30vh",
                }}
							/>
						</div>
					)}

					{/* Selected Variant Image */}
					<div
						className="relative flex flex-auto"
						
						onClick={(e) => e.stopPropagation()} // Prevent modal close on image click
					>
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
						<Image
            removeWrapper
            style={{
							maxWidth: "60vw",
							maxHeight: "65vh",
						}}
							src={selectedVariant || image?.image}
							alt="Selected Variant"
							className="w-full h-full object-contain"
						/>
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




			{image && (
				<EditFaceModal
					image={image}
					isOpen={isEditFaceModalOpen}
					onClose={closeEditFaceModal}
					onDeleteSuccess={closeEditFaceModal}
				/>
			)}

			<DatasetImageInfoModal
				visible={isImageInfoModalOpen}
				onClose={closeImageInfoModal}
				imageId={initialImageId}
				onDeleteSuccess={closeImageInfoModal}
			/>

			<Modal isOpen={isDeleteModalOpen} onOpenChange={closeDeleteModal}>
				<ModalContent>
					<ModalHeader>Confirm Deletion</ModalHeader>
					<ModalBody>
						<p>Are you sure you want to delete this image?</p>
					</ModalBody>
					<ModalFooter>
						<Button variant="light" color="secondary" onClick={closeDeleteModal}>
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
