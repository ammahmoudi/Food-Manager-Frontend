'use client'
import React, { useState } from "react";
import {
	Input,
	Button,
	Textarea,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalContent,
	useDisclosure,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import api from "@/services/api"; // Import your axios instance

const NotificationPage = () => {
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [scheduledTime, setScheduledTime] = useState(""); // For scheduling notifications
	const {
		isOpen: isModalOpen,
		onOpen: openModal,
		onClose: closeModal,
	} = useDisclosure();



	// Function to send push notifications
	const sendNotification = async () => {
		if (!title || !message) {
			toast.error("Title and message are required");
			return;
		}

		const notificationData = {
			// title:title,
			message:message,
			// scheduled_time: scheduledTime, // Optional, can be used for scheduling
		};

		try {
            console.log('req',notificationData);
            
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
		<div className="notification-page p-4">
			<h1 className="text-xl font-bold mb-4">Send Push Notification</h1>
			<Input
				label="Title"
				placeholder="Notification Title"
				fullWidth
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
			<Textarea
				label="Message"
				placeholder="Notification Message"
				fullWidth
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				rows={5}
			/>
			<Input
				type="datetime-local"
				label="Schedule Notification (optional)"
				fullWidth
				value={scheduledTime}
				onChange={(e) => setScheduledTime(e.target.value)}
			/>
			<Button color="primary" className="mt-4" onClick={sendNotification}>
				Send Notification
			</Button>

			<Button className="mt-4" onClick={openModal}>
				Manage Notifications
			</Button>

			{/* Modal for managing notifications */}
			<Modal isOpen={isModalOpen} onClose={closeModal}>
				<ModalContent>
					<ModalHeader>Manage Notifications</ModalHeader>
					<ModalBody>
						<p>
							Here you can manage the notifications (history, scheduled
							notifications, etc).
						</p>
					</ModalBody>
					<ModalFooter>
						<Button onClick={closeModal}>Close</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
};

export default NotificationPage;
