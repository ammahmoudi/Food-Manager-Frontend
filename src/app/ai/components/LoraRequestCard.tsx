"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, Image, Button } from "@nextui-org/react";
import { LoraRequest } from "../interfaces/LoraRequest";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { updateLoraRequestStatus } from "@/app/berchi/services/api"; // Adjust this import according to your file structure

interface LoraRequestCardProps {
	loraRequestId: number;
	onStatusChange: (loraRequestId: number, status: string) => void;
}

const LoraRequestCard: React.FC<LoraRequestCardProps> = ({
	loraRequestId,
	onStatusChange,
}): JSX.Element => {
	const [loraRequest, setLoraRequest] = useState<LoraRequest | null>(null);
	const { isAdmin } = useUser();

	// Fetch LoraRequest data
	const fetchLoraRequest = async () => {
		try {
			const response = await fetch(`/cui/lora-requests/${loraRequestId}/`);
			const data = await response.json();
			setLoraRequest(data);
		} catch (error) {
			console.error("Failed to fetch LoRA request:", error);
			toast.error("Failed to fetch LoRA request");
		}
	};

	useEffect(() => {
		fetchLoraRequest();
	}, [loraRequestId]);

	// Generic method to handle both Cancel and Accept requests
	const handleStatusChange = async (status: 'canceled' | 'accepted') => {
		try {
			toast.promise(
				updateLoraRequestStatus(loraRequestId, status),
				{
					loading: `${status === 'canceled' ? 'Cancelling' : 'Accepting'} request...`,
					success: () => {
						onStatusChange(loraRequestId, status);
						return `Request ${status === 'canceled' ? 'cancelled' : 'accepted'} successfully!`;
					},
					error: `Failed to ${status === 'canceled' ? 'cancel' : 'accept'} request`,
				}
			);
		} catch (error) {
			console.error(`Failed to ${status === 'canceled' ? 'cancel' : 'accept'} request:`, error);
		}
	};

	return (
		<div className="lora-request-card h-full w-full p-0.5">
			{loraRequest ? (
				<Card className="border-none dark:bg-grey-100/50 h-full w-full" shadow="sm">
					<CardBody>
						{/* Flex container to align all four parts in a row */}
						<div className="flex flex-row justify-between items-center gap-4">
							{/* First part - Character image with blur */}
							<div className="relative flex-shrink-0">
								<Image
									alt={loraRequest.character.name}
									className="z-0 w-32 h-32 object-cover"
									src={loraRequest.character.image ?? "/images/character-placeholder.jpg"}
									shadow="md"
								/>
								<div className="absolute inset-0 bg-black opacity-30 blur-sm"></div> {/* Blurred background */}
							</div>

							{/* Second part - Character details */}
							<div className="flex flex-col justify-between w-1/4">
								<h1 className="font-black text-foreground/90">{loraRequest.character.name}</h1>
								<p className="text-small text-foreground/80">ID: {loraRequest.character.id}</p>
							</div>

							{/* Third part - LoRARequest details */}
							<div className="flex flex-col justify-between w-1/4">
								<p>Status: {loraRequest.status}</p>
								<p>Created at: {new Date(loraRequest.created_at).toLocaleString()}</p>
								<p>Created by: {loraRequest.user.name}</p>
								<p>LoRA Type: {loraRequest.lora_type.name}</p>
								<p>Trigger Word: {loraRequest.trigger_word}</p>
							</div>

							{/* Fourth part - Action buttons */}
							<div className="flex flex-col justify-between w-1/4">
								<Button color="danger" onPress={() => handleStatusChange('canceled')}>
									Cancel Request
								</Button>
								{isAdmin && (
									<Button
										color="success"
										className="mt-2" // Add margin to the top for padding
										onPress={() => handleStatusChange('accepted')}
									>
										Accept Request
									</Button>
								)}
							</div>
						</div>
					</CardBody>
				</Card>
			) : (
				<Card
					isFooterBlurred
					radius="md"
					className="h-full w-full justify-center items-center"
					isPressable
				>
					<div className="h-full flex items-center justify-center">
						<p className="text-medium text-black/60 uppercase font-bold text-center">
							Loading...
						</p>
					</div>
				</Card>
			)}
		</div>
	);
};

export default LoraRequestCard;
