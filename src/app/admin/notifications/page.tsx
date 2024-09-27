"use client";
import React, { useState, ChangeEvent } from "react";
import {
	Input,
	Button,
	Textarea,
	useDisclosure,
	Card,
	CardFooter,
	Image,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { TrashIcon } from "@heroicons/react/24/solid";
import ImageCropModal from "@/components/ImageCropModal"; // Import ImageCropModal
import api from "@/services/api";

const NotificationPage = () => {
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [scheduledTime, setScheduledTime] = useState("");
	const [image, setImage] = useState<File | string | null>(null);
	const [link, setLink] = useState("");

	const {
		isOpen: isCropModalOpen,
		onOpen: openCropModal,
		onClose: closeCropModal,
	} = useDisclosure();

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setImage(imageUrl); // Temporarily set image URL to show a preview
			openCropModal(); // Open the crop modal after selecting the image
		}
	};

	const handleCropComplete = (croppedImage: File) => {
		setImage(croppedImage); // Set the cropped image as the selected image
		closeCropModal();
	};

	const handleDeleteImage = () => {
		setImage(null);
	};
	// Function to send push notifications
	const sendNotification = async () => {
		if (!title || !message) {
			toast.error("Title and message are required");
			return;
		}

		const notificationData = {
			title: title,
			message: message,
			image: image,
			link: link,
			// scheduled_time: scheduledTime, // Optional, can be used for scheduling
		};

		try {
			console.log("req", notificationData);

			const response = await toast.promise(
				api.post("/users/send-notification/", notificationData), // Example API to send notification
				{
					pending: "Sending notification...",
					success: "Notification sent successfully!",
					error: "Failed to send notification",
				}
			);

			console.log("Notification response:", response);
		} catch (error) {
			console.error("Error sending notification:", error);
		}
	};

	return (
		<div className="notification-form space-y-4">
			<h1>Send Notification</h1>
			<Input
				label="Notification Title"
				placeholder="Enter notification title"
				fullWidth
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
			<Textarea
				label="Notification Message"
				placeholder="Enter notification message"
				fullWidth
				value={message}
				onChange={(e) => setMessage(e.target.value)}
			/>
			<Input
				label="Link"
				placeholder="Enter notification link"
				fullWidth
				value={link}
				onChange={(e) => setLink(e.target.value)}
			/>
			<Input
				label="Scheduled Time"
				placeholder="Select time to send"
				fullWidth
				value={scheduledTime}
				onChange={(e) => setScheduledTime(e.target.value)}
			/>
			<div>
				<Card
					isPressable
					onClick={() =>
						document.getElementById("notification-image-input")?.click()
					}
					className="w-full aspect-square"
				>
					{image ? (
						<>
							<Image
								alt="Notification Image"
								className="z-0 w-full h-full object-cover"
								classNames={{ wrapper: "w-full h-full aspect-square" }}
								src={
									image instanceof File
										? URL.createObjectURL(image as File)
										: image
								}
							/>
							<CardFooter className="absolute bottom-0 z-10">
								<div className="flex items-center">
									<div className="flex flex-col">
										<Button
											onClick={(e) => {
												e.stopPropagation();
												handleDeleteImage();
											}}
											radius="full"
											size="sm"
											className="w-full h-full aspect-square bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
										>
											<TrashIcon className="h-5 w-5" />
										</Button>
									</div>
								</div>
							</CardFooter>
						</>
					) : (
						<div className="flex flex-col items-center justify-center w-full h-full bg-gray-200">
							<p className="text-gray-500">Click to upload an image</p>
						</div>
					)}
				</Card>
				<input
					type="file"
					id="notification-image-input"
					accept="image/*"
					className="hidden"
					onChange={handleImageChange}
				/>
			</div>

			{/* Image Crop Modal */}
			<ImageCropModal
				isOpen={isCropModalOpen}
				onClose={closeCropModal}
				imageSrc={image as string} // Send the image URL to the crop modal
				onCropComplete={handleCropComplete}
			/>

			<Button color="primary" onPress={sendNotification}>
				Send Notification
			</Button>
		</div>
	);
};

export default NotificationPage;
