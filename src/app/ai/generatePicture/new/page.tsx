"use client";
import { useState, ChangeEvent } from "react";
import {
	Button,
	Card,
	CardFooter,
	Image,
	CardBody,
	Textarea,
	Spinner,
} from "@nextui-org/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import ImageCropModal from "@/components/ImageCropModal";
import { useRouter } from "next/navigation"; // For navigation
import React from "react";
import {
	getJob,
	sendPromptToBackend,
	submitFinalData,
} from "../../services/aiApi";
import { Job } from "../../interfaces/Job";
import { toast } from "sonner";

const PromptPage = () => {
	const [prompt, setPrompt] = useState<string>("");
	const [job, setJob] = useState<Job | null>(null); // Store the entire job object
	const [isSubmittingPrompt, setIsSubmittingPrompt] = useState<boolean>(false);
	const [isSubmittingFinal, setIsSubmittingFinal] = useState<boolean>(false);
	const [polling, setPolling] = useState<boolean>(false);
	const [isCropModalOpen, setCropModalOpen] = useState(false);
	const router = useRouter();

	const pollJobStatus = async (jobId: number) => {
		const intervalId = setInterval(async () => {
			try {
				const jobData = await getJob(jobId);
				setJob(jobData); // Store the full job object

				if (jobData.status === "completed") {
					clearInterval(intervalId);
					setPolling(false);

					if (jobData.images && jobData.images.length > 0) {
						toast.success("Image generated successfully!");
					} else {
						toast.error("No images returned from the backend.");
					}
				} else if (jobData.status === "failed") {
					clearInterval(intervalId);
					setPolling(false);
					toast.error("Job failed to complete.");
				}
			} catch (error) {
				console.error("Error fetching job status:", error);
				clearInterval(intervalId);
				setPolling(false);
				toast.error("Error fetching job status.");
			}
		}, 5000);
	};

	// Handle prompt submission to backend
	const handleSubmitPrompt = async () => {
		if (!prompt.trim()) {
			toast.error("Prompt cannot be empty!");
			return;
		}

		try {
			setIsSubmittingPrompt(true);
			setJob(null); // Clear previous job on new prompt

			const response = await sendPromptToBackend({ prompt: prompt });
			toast.success("Prompt submitted successfully!");

			if (response.job_id) {
				setPolling(true);
				pollJobStatus(response.job_id);
			} else {
				toast.error("Failed to retrieve job ID.");
			}
		} catch (error) {
			toast.error("Error submitting the prompt.");
			console.error("Error submitting prompt:", error);
		} finally {
			setIsSubmittingPrompt(false);
		}
	};

	// Handle final submission of data
	const handleFinalSubmit = async () => {
		console.log(job);
		if (!job) {
			toast.error("No job available to submit.");
			return;
		}

		try {
			setIsSubmittingFinal(true);

			const response = await submitFinalData(job.images[0]); // Send job.id

			if (response.dataset_id) {
				toast.success("Final submission successful!");
				router.push(`/cui/datasets/${response.dataset_id}`);
			} else {
				toast.error("Failed to retrieve dataset.");
			}
		} catch (error) {
			toast.error("Failed to submit final data.");
			console.error("Final submission error:", error);
		} finally {
			setIsSubmittingFinal(false);
		}
	};

	// Handle image upload and open crop modal
	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && job?.status !== "completed") {
			toast.error("Please wait for the current job to complete.");
			return;
		}
		if (file) {
			// setJob({
			// 	...job,
			// 	images: [URL.createObjectURL(file)], // Simulate image being added
			// } as Job);
			// setCropModalOpen(true);
			console.log("file", file);
		}
	};

	// Handle crop complete and set the cropped image
	const handleCropComplete = (croppedImage: File) => {
		if (job) {
			// setJob({
			// 	...job,
			// 	images: [URL.createObjectURL(croppedImage)],
			// });
			console.log("croppedImage", croppedImage);
		}
		setCropModalOpen(false);
	};

	// Handle image deletion
	const handleDeleteImage = () => {
		if (job) {
			setJob({
				...job,
				images: [],
			});
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<Card className="w-[700px] h-auto gap-1">
				<CardBody className="flex flex-col md:flex md:flex-row gap-2">
					{/* Image Section */}
					<Card
						isPressable
						onClick={() => document.getElementById("user-image-input")?.click()}
						className="w-[500px] aspect-square bg-pink-500 relative"
					>
						{job && job.images?.length > 0 ? (
							<>
								<Image
									alt="Result Image"
									className="z-0 w-full h-full object-cover"
									classNames={{ wrapper: "w-full h-full aspect-square" }}
									src={job.result_data.image_urls[0]}
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
						) : job?.status === "pending" || job?.status === "running" ? (
							<div className="flex justify-center items-center w-full h-full bg-gray-200">
								<Spinner color="primary" size="lg" />
								<p className="text-gray-500 ml-4">{job?.status}</p>
							</div>
						) : (
							<div className="flex flex-col items-center justify-center w-full h-full bg-gray-200">
								<p className="text-gray-500">Click to upload an image</p>
							</div>
						)}
					</Card>
					<input
						placeholder="image"
						type="file"
						id="user-image-input"
						accept="image/*"
						className="hidden"
						onChange={handleImageChange}
					/>

					{/* Prompt Input Field and Submit Button */}
					<div className="flex flex-col w-full h-full">
						<Textarea
							label="Prompt"
							className="h-[110px]"
							placeholder="Enter your prompt"
							fullWidth
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
						/>
						<div className="flex w-full">
							<Button
								color="primary"
								className="w-[390px]"
								onPress={handleSubmitPrompt}
								isLoading={isSubmittingPrompt}
								isDisabled={isSubmittingPrompt}
							>
								Submit Prompt
							</Button>
						</div>
					</div>
				</CardBody>
				<CardFooter>
					<div className="flex justify-center">
						<Button
							color="secondary"
							className="w-[280px]"
							isDisabled={!job || polling || isSubmittingFinal}
							onPress={handleFinalSubmit}
							isLoading={isSubmittingFinal}
						>
							Final Submit
						</Button>
					</div>
				</CardFooter>
			</Card>

			{/* Image Crop Modal */}
			<ImageCropModal
				isOpen={isCropModalOpen}
				onClose={() => setCropModalOpen(false)}
				imageSrc={job && job.images?.length > 0 ? job.images[0].toString() : ""}
				onCropComplete={handleCropComplete}
			/>
		</div>
	);
};

export default PromptPage;
