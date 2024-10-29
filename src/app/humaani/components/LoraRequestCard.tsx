"use client";

import React, { useState, useEffect } from "react";
import {
	Card,
	CardBody,
	Image,
	Button,
	CardFooter,
	CardHeader,
	Spinner,
} from "@nextui-org/react";
import { LoraRequest } from "../interfaces/LoraRequest";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";

import { getLoraRequest, updateLoraRequestStatus } from "../services/aiApi";
import UserChip from "@/components/UserChip";
import moment from "moment";
import { FaCalendarAlt, FaUser } from "react-icons/fa";

interface LoraRequestCardProps {
	loraRequestId: number;
	onStatusChange: (loraRequestId: number, status: string) => void;
}

const LoraRequestCard: React.FC<LoraRequestCardProps> = ({
	loraRequestId,
}): JSX.Element => {
	const [loraRequest, setLoraRequest] = useState<LoraRequest | null>(null);
	const { isAdmin } = useUser();

	// Fetch LoraRequest data
	const fetchLoraRequest = async () => {
		try {
			const response = await getLoraRequest(loraRequestId);
			setLoraRequest(response);
		} catch (error) {
			console.error("Failed to fetch LoRA request:", error);
			toast.error("Failed to fetch LoRA request");
		}
	};

	useEffect(() => {
		fetchLoraRequest();
	}, [loraRequestId]);

	// Generic method to handle status changes
	const handleStatusChange = async (
		status: "canceled" | "accepted" | "denied"
	) => {
		try {
			await toast.promise(updateLoraRequestStatus(loraRequestId, status), {
				loading: "loading",
				success: () => {
					fetchLoraRequest(); // Re-fetch the LoRA request after status change
					return `Request ${
						status === "canceled" ? "cancelled" : status
					} successfully!`;
				},
				error: () =>
					`Failed to ${status === "canceled" ? "cancel" : status} request`,
			});
			// onStatusChange(loraRequestId, status); // Notify parent about status change
		} catch (error) {
			console.error(`Failed to ${status} request:`, error);
		}
	};

	const renderStatusButton = (status: string, classNames?: string) => {
		// Define the color and variant types explicitly
		type ButtonColor =
			| "default"
			| "primary"
			| "secondary"
			| "success"
			| "warning"
			| "danger"
			| undefined;
		type ButtonVariant = "solid" | "light" | "bordered" | "ghost" | undefined;

		// Mapping for statuses
		const statusMapping: {
			[key: string]: {
				color: ButtonColor;
				label: string;
				variant: ButtonVariant;
			};
		} = {
			waiting: { color: "warning", label: "Waiting", variant: "light" },
			accepted: { color: "success", label: "Accepted", variant: "light" },
			running: { color: "primary", label: "Running", variant: "light" },
			completed: { color: "success", label: "Completed", variant: "light" },
			failed: { color: "danger", label: "Failed", variant: "light" },
			denied: { color: "danger", label: "Denied", variant: "light" },
			canceled: { color: "danger", label: "Canceled", variant: "light" },
		};

		// Destructure or fallback to defaults
		const {
			color = "default",
			label = "Unknown Status",
			variant = "light",
		} = statusMapping[status] || {};

		// Single return with dynamic color, label, and variant
		return (
			<Button color={color} variant={variant} className={classNames}>
				{label}
			</Button>
		);
	};

	return (
		<div className="lora-request-card w-fit p-2">
			{loraRequest ? (
				<Card
					className="border-none dark:bg-grey-100/50 h-full w-full"
					shadow="sm"
					isBlurred
				>
					<CardBody  className="flex flex-col md:flex-row  gap-4 items-center w-full">
						{/* Flex container to align all four parts in a row */}
							{/* First part - Character image with blur */}
							<div className="flex flex-grow-0 flex-col gap-2 items-center">
								<Card isFooterBlurred radius="lg" className="border-none w-full">
									<CardHeader className="absolute z-10 top-1 flex-col !items-start">
										<h4 className="text-white font-medium text-large">
											{loraRequest.character.name}
										</h4>
									</CardHeader>
									<Image
										alt={loraRequest.character.name}
										className="z-0 w-auto h-64 object-cover"
										src={
											loraRequest.character.image ??
											"/images/character-placeholder.jpg"
										}
										shadow="lg"
									/>
									<CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-0 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
										{renderStatusButton(loraRequest.status, "w-full")}
									</CardFooter>
								</Card>
							</div>

							{/* Third part - LoRARequest details */}
							<div className="flex flex-col md:h-64 gap-2">
							<div className=" flex flex-col flex-grow-1 space-y-4 h-full"><div className="flex items-center gap-1 text-md">
							<FaCalendarAlt />
							{moment(new Date(loraRequest.created_at).toLocaleString()).fromNow()}
								</div>
								<div className="flex items-center gap-1 text-md"><FaUser />
								<UserChip user={loraRequest.user} size="md" /></div>
								<p>LoRA Type: {loraRequest.lora_type.name}</p>
								<p>Trigger Word: {loraRequest.trigger_word}</p></div>
								

								{/* Fourth part - Action buttons */}
							{loraRequest.status !== "completed" && (
								<div className="flex flex-col flex-grow-0 ">
									{/* Users can cancel requests if they are waiting (not admin) or running */}
									{!isAdmin &&
										(loraRequest.status === "waiting" ||
											loraRequest.status === "running") && (
											<Button
												color="danger"
												onPress={() => handleStatusChange("canceled")}
											>
												Cancel Request
											</Button>
										)}

									{/* Admin can only cancel a running request */}
									{isAdmin && loraRequest.status === "running" && (
										<Button
											color="danger"
											variant="shadow"
											onPress={() => handleStatusChange("canceled")}
										>
											Cancel Request
										</Button>
									)}

									{/* Admin-only actions based on the status */}
									{isAdmin && loraRequest.status === "waiting" && (
										<>
											<Button
												color="success"
												variant="shadow"
												onPress={() => handleStatusChange("accepted")}
											>
												Accept Request
											</Button>
											<Button
												color="danger"
												variant="shadow"
												className="mt-2"
												onPress={() => handleStatusChange("denied")}
											>
												Deny Request
											</Button>
										</>
									)}
								</div>
							)}
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
					<div className="h-full min-h-20 flex items-center justify-center">
						<Spinner />
					</div>
				</Card>
			)}
		</div>
	);
};

export default LoraRequestCard;
