"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, Image, Button } from "@nextui-org/react";
import { LoraRequest } from "../interfaces/LoraRequest";
import { toast } from "sonner";
import { cancelLoraRequest, getLoraRequest } from "../services/aiApi";

interface LoraRequestCardProps {
	loraRequestId: number;
	onCancel: (loraRequestId: number) => void;
}

const LoraRequestCard: React.FC<LoraRequestCardProps> = ({
	loraRequestId,
	onCancel,
}): JSX.Element => {
	const [loraRequest, setLoraRequest] = useState<LoraRequest | null>(null);
	const [loading, setLoading] = useState(false);

	// Fetch LoraRequest data based on the passed loraRequestId
	const fetchLoraRequest = async (id: number) => {
		try {
			setLoading(true);
			const data = await getLoraRequest(id);
			setLoraRequest(data);
		} catch (error) {
			toast.error("Failed to load Lora request."+error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchLoraRequest(loraRequestId);
	}, [loraRequestId]);

	const handleCancelRequest = async () => {
		try {
			await cancelLoraRequest(loraRequestId);
			onCancel(loraRequestId); // Trigger the cancel callback
			toast.success("Lora request canceled successfully.");
		} catch (error) {
			toast.error("Failed to cancel Lora request."+error);
		}
	};

	return (
		<div className="lora-request-card h-full w-full p-0.5">
			{loraRequest ? (
				<Card
					className="border-none dark:bg-grey-100/50 h-full w-full"
					shadow="sm"
				>
					<CardBody>
						<div className="flex items-center gap-4">
							<div className="relative flex-shrink-0 aspect-square">
								{/* Character Image */}
								<Image
									alt={loraRequest.name}
									className="z-0 w-full h-full object-cover aspect-square"
									classNames={{
										wrapper: "w-full h-full max-w-full max-h-full",
									}}
									shadow="md"
									height={120}
									width={120}
									src={loraRequest.character?.image ?? "/images/character-placeholder.jpg"}
								/>
							</div>

							{/* LoraRequest Details */}
							<div className="flex flex-col overflow-hidden">
								<h1 className="font-black text-foreground/90">{loraRequest.name}</h1>
								<p className="text-small text-foreground/80 mt-1">
									Character name: <strong>{loraRequest.character.name}</strong>
								</p>
								<p className="text-small text-foreground/80 mt-1">
									Status: <strong>{loraRequest.status}</strong>
								</p>
								<p className="text-small text-foreground/80 mt-1">
									Created At:{loraRequest.created_at}
								</p>
								<p className="text-small text-foreground/80 mt-1">
									Created By: <strong>User #{loraRequest.user}</strong>
								</p>
								<p className="text-small text-foreground/80 mt-1">
									Lora Type:{" "}
									<strong>{loraRequest.lora_type?.name ?? "N/A"}</strong>
								</p>
								<p className="text-small text-foreground/80 mt-1">
									Trigger Word: <strong>{loraRequest.trigger_word}</strong>
								</p>

								{/* Cancel Button */}
								<Button
									isDisabled={loraRequest.status === "canceled" || loading}
									color="primary"
									className="mt-3"
									onPress={handleCancelRequest}
								>
									{loraRequest.status === "canceled" ? "Request Canceled" : "Cancel Request"}
								</Button>
							</div>
						</div>
					</CardBody>
				</Card>
			) : (
				<Card
					isFooterBlurred
					radius="md"
					className="h-full w-full justify-center items-center"
				>
					<div className="h-full flex items-center justify-center ">
						<p className="text-medium text-black/60 uppercase font-bold text-center">
							Loading Lora Request...
						</p>
					</div>
				</Card>
			)}
		</div>
	);
};

export default LoraRequestCard;
