"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import {
	Input,
	Button,
	Textarea,
	useDisclosure,
	Card,
	CardFooter,
	Image,
	CardBody,
	Checkbox,
} from "@nextui-org/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import ImageCropModal from "@/components/ImageCropModal"; // Import ImageCropModal
import { sendNotification, getAllUsers } from "@/services/api"; // Assuming getUsers API is available
import { Select, SelectItem, Avatar, Chip } from "@nextui-org/react";
import { User} from "@/interfaces/User"; // Assuming User interface is in this path
import { toast } from "sonner";

// Define the types for user selection

const NotificationPage = () => {
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [scheduledTime, setScheduledTime] = useState("");
	const [image, setImage] = useState<File | string | null>(null);
	const [link, setLink] = useState("");
	const [users, setUsers] = useState<User[]>([]);
	const [selectedUserIds, setSelectedUserIds] = useState<Iterable<React.Key>>(
		new Set()
	);
	const [sendToAll, setSendToAll] = useState(false);

	const {
		isOpen: isCropModalOpen,
		onOpen: openCropModal,
		onClose: closeCropModal,
	} = useDisclosure();

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const usersData = await getAllUsers();
				setUsers(usersData);
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};

		fetchUsers();
	}, []);

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

	const handleUserSelectChange = (keys: Iterable<React.Key>) => {
		setSelectedUserIds(keys);
	};

	// Function to send push notifications
	const handleSendNotification = async () => {
		if (!title || !message) {
			toast.error("Title and message are required");
			return;
		}

		// If "Send to All" is checked, send an empty array for selectedUserIds
		const userIdsToSend = sendToAll
			? []
			: (Array.from(selectedUserIds) as number[]);

		try {
			toast.promise(
				sendNotification(title, message, userIdsToSend, image as File, link),
				{
					loading: "Sending notification...",
					success: "Notification sent successfully!",
					error:(response)=>{
						console.log("Notification response:", response);
						return 	"Failed to send notification";
					}
				,
				}
			);
		} catch (error) {
			console.error("Error sending notification:", error);
		}
	};

	return (
		<div className="container mx-auto p-4 max-w-lg ">
			<Card className="gap-3">
				<CardBody className="flex flex-col gap-3 md:flex md:flex-row ">
					<Card
						isPressable
						onClick={() =>
							document.getElementById("notification-image-input")?.click()
						}
						className="h-full w-full aspect-square "
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
						title="notification image"
						type="file"
						id="notification-image-input"
						accept="image/*"
						className="hidden"
						onChange={handleImageChange}
					/>
					<div className="flex flex-grow flex-col justify-between gap-3 w-full">
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
					</div>
				</CardBody>
				<CardFooter className="flex flex-col gap-4">
					{/* User selection dropdown */}
					<Select<User>
						items={users}
						label="Select Users"
						variant="bordered"
						selectionMode="multiple"
						isMultiline={true}
						selectedKeys={selectedUserIds as unknown as Iterable<import("@react-types/shared").Key>}
						placeholder="Select users to send notification"
						labelPlacement="outside"
						isDisabled={sendToAll}
						classNames={{
							base: "max-w",
							trigger: "min-h-12 py-2",
						}}
						onSelectionChange={handleUserSelectChange}
						renderValue={(items) => (
							<div className="flex flex-wrap gap-2">
								{items.map((item) => (
									<Chip key={item.key}>{item.data?.full_name}</Chip>
								))}
							</div>
						)}
					>
						{(user) => (
							<SelectItem key={user.id} textValue={user.full_name}>
								<div className="flex gap-2 items-center">
									<Avatar
										alt={user.full_name}
										className="flex-shrink-0"
										size="sm"
										src={user.user_image as string}
									/>
									<div className="flex flex-col">
										<span className="text-small">{user.full_name}</span>
									</div>
								</div>
							</SelectItem>
						)}
					</Select>
					{/* Send to All Checkbox */}
					<Checkbox
						isSelected={sendToAll}
						onChange={(e) => setSendToAll(e.target.checked)}
						color="primary"
					>
						Send to all users
					</Checkbox>

					<Button color="primary" onPress={handleSendNotification}>
						Send Notification
					</Button>
				</CardFooter>
			</Card>

			{/* Image Crop Modal */}
			<ImageCropModal
				isOpen={isCropModalOpen}
				onClose={closeCropModal}
				imageSrc={image as string} // Send the image URL to the crop modal
				onCropComplete={handleCropComplete}
			/>
		</div>
	);
};

export default NotificationPage;
