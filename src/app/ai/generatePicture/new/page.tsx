"use client";
import { useState, useEffect, ChangeEvent } from "react";
import {
	Button,
	Card,
	CardFooter,
	CardBody,
	Textarea,
} from "@nextui-org/react";
import ImageCropModal from "@/components/ImageCropModal";
import { useRouter, useSearchParams } from "next/navigation"; // For navigation and search params
import React from "react";
import {
	getJob,
	sendPromptToBackend,
	submitFinalData,
	getImageById, // Assuming you have this API call for fetching image by ID
} from "../../services/aiApi";
import { Job } from "../../interfaces/Job";
import { toast } from "sonner";
import SeedInput from "../../components/SeedGenerator";
import LoraTypeComponent from "../../components/LoraTypeComponent";
import ImageUploadComponent from "../../components/UploadImage";
import DatasetImage from "../../interfaces/DatasetImage";

const PromptPage = () => {
	const [prompt, setPrompt] = useState<string>("");
	const [job, setJob] = useState<Job | null>(null); // Store the entire job object
	const [isSubmittingPrompt, setIsSubmittingPrompt] = useState<boolean>(false);
	const [isSubmittingFinal, setIsSubmittingFinal] = useState<boolean>(false);
	const [polling, setPolling] = useState<boolean>(false);
	const [referenceImage, setReferenceImage] = useState<number | null>(null);
	const [isCropModalOpen, setCropModalOpen] = useState(false);
	const [selectedLoraType, setSelectedLoraType] = useState<string | null>(null);
	const router = useRouter();
	const searchParams = useSearchParams(); // Hook for accessing search params
	const [seed, setSeed] = useState<number>(
		Math.floor(Math.random() * Math.pow(2, 16))
	);

	// Poll the job statuses
	const pollJobStatus = async (jobId: number) => {
		setPolling(true);

		const fetchJobStatus = async () => {
			try {
				const jobData = await getJob(jobId);
				setJob(jobData); // Store the full job object
				setReferenceImage(jobData.images[0]);

				if (jobData.status === "completed") {
					setPolling(false);
					clearInterval(intervalId); // Stop polling when job is completed

					if (jobData.result_data) {
						toast.success("Job completed and result is ready!");
					} else {
						toast.error("No results returned from the backend.");
					}
				} else if (jobData.status === "failed") {
					setPolling(false);
					clearInterval(intervalId); // Stop polling when job has failed
					toast.error("Job failed to complete.");
				}
			} catch (error) {
				console.error("Error fetching job status:", error);
				setPolling(false);
				clearInterval(intervalId); // Stop polling in case of error
				toast.error("Error fetching job status.");
			}
		};

		// Call the function immediately for the first time
		await fetchJobStatus();

		// Set up the interval for subsequent polling
		const intervalId = setInterval(async () => {
			await fetchJobStatus();
		}, 1000); // Poll every 5 seconds
	};

	// Handle prompt submission to backend
	const handleSubmitPrompt = async () => {
		if (!prompt.trim()) {
			toast.error("Prompt cannot be empty!");
			return;
		}

		setIsSubmittingPrompt(true);

		try {
			setJob(null); // Clear previous job on new prompt

			const response = await sendPromptToBackend({
				prompt: prompt,
				seed: String(seed),
			});
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
		if (!referenceImage) {
			toast.error("No image available to submit.");
			return;
		}

		try {
			setIsSubmittingFinal(true);

			if (referenceImage) {
				const response = await submitFinalData(referenceImage, selectedLoraType); // Send job.id

				if (response.dataset_id) {
					toast.success("Final submission successful!");
					router.push(`/ai/datasets/${response.dataset_id}`);
				} else {
					toast.error("Failed to retrieve dataset.");
				}
			}
		} catch (error) {
			toast.error("Failed to submit final data.");
			console.error("Final submission error:", error);
		} finally {
			setIsSubmittingFinal(false);
		}
	};

	// Handle image ID received from the image upload component
	const handleImageIdReceived = (image: DatasetImage | null) => {
		if (image) {
			setReferenceImage(image.id);
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
			// Handle image change logic here if needed
			console.log("file", file);
		}
	};

	// Handle crop complete and set the cropped image
	const handleCropComplete = (croppedImage: File) => {
		if (job) {
			console.log("croppedImage", croppedImage);
		}
		setCropModalOpen(false);
	};

	const handleSelectionChange = (LoraType: string) => {
		setSelectedLoraType(LoraType);
	};

	// Use searchParams to get the image ID from the URL
	useEffect(() => {
		const imageId = searchParams.get("id");
		if (imageId) {
			// Fetch the image from the backend using the imageId
			const loadImageById = async (id: string) => {
				try {
					const image = await getImageById(parseInt(id)); // Assuming getImageById fetches the image details
					setReferenceImage(image);
				} catch (error) {
					toast.error("Error loading image.");
					console.error("Error loading image with ID:", id, error);
				}
			};

			loadImageById(imageId); // Call the loadImageById function with the imageId
		}
	}, [searchParams]); // This will run whenever the searchParams change

	return (
		<div className="container xl:w-1/2 mx-auto p-2 items-center">
			<div className="flex justify-center items-center min-h-screen">
				<Card className="w-[700px] h-auto gap-1">
					<CardBody className="flex flex-col md:flex md:flex-row gap-2">
						{/* Image Section */}
						<ImageUploadComponent onImageIdReceived={handleImageIdReceived} />

						<input
							placeholder="image"
							type="file"
							id="user-image-input"
							accept="image/*"
							className="hidden"
							onChange={handleImageChange}
						/>

						{/* Prompt Input Field and Submit Button */}
						<div className="flex flex-grow flex-col justify-between w-full">
							<Textarea
								label="Prompt"
								className=""
								placeholder="Enter your prompt"
								fullWidth
								value={prompt}
								onChange={(e) => setPrompt(e.target.value)}
							/>
							<div className="flex flex-col items-center justify-center w-full h-full gap-4">
								<div className="w-full bg-gray-100 rounded-lg">
									<SeedInput seed={seed} setSeed={setSeed} />
								</div>

								<div className="w-full bg-gray-100 rounded-lg">
									<LoraTypeComponent onSelect={handleSelectionChange} />
								</div>
							</div>
							<div className="flex w-full">
								<Button
									color="primary"
									className="w-full"
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
						<div className="flex w-full justify-center">
							<Button
								color="secondary"
								className="w-full"
								isDisabled={!referenceImage || polling || isSubmittingFinal}
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
		</div>
	);
};

export default PromptPage;
