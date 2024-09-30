"use client";
import { useState, ChangeEvent } from "react";
import {
	Button,
	Card,
	CardFooter,
	Image,
	CardBody,
	Textarea,
} from "@nextui-org/react";
import { sendPromptToBackend, getImagesByJobID, submitFinalData } from "@/services/api"; // Assuming these API functions exist
import { toast } from "react-toastify";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import ImageCropModal from '@/components/ImageCropModal'; // Assuming you have an image crop modal

const PromptPage = () => {
	const [prompt, setPrompt] = useState<string>(""); // State for prompt text
	const [resultImage, setResultImage] = useState<File | string | null>(null); // Store result image from backend or upload
	const [isSubmittingPrompt, setIsSubmittingPrompt] = useState<boolean>(false); // Loading state for prompt submission
	const [isSubmittingFinal, setIsSubmittingFinal] = useState<boolean>(false); // Loading state for final submission
	const [jobID, setJobID] = useState<string | null>(null); // Store JobID for fetching images
	const [isCropModalOpen, setCropModalOpen] = useState(false); // State to manage the crop modal
	const router = useRouter(); // To redirect to result page

	// Handle prompt submission to backend
	const handleSubmitPrompt = async () => {
		if (!prompt.trim()) {
			toast.error("Prompt cannot be empty!");
			return;
		}

		try {
			setIsSubmittingPrompt(true);

			// Send prompt text to backend in specified format
			const response = await sendPromptToBackend({ prompt_text: prompt });
			toast.success("Prompt submitted successfully!");

			// Assuming the response contains a jobID
			if (response.jobID) {
				setJobID(response.jobID); // Set the jobID

				// Fetch images using jobID
				const imageResponse = await getImagesByJobID(response.jobID);

				if (imageResponse.image_urls && imageResponse.image_urls.length > 0) {
					setResultImage(imageResponse.image_urls[0]); // Display the first image
				} else {
					toast.error("No images returned from the backend.");
				}
			} else {
				toast.error("Failed to retrieve jobID.");
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
		if (!resultImage) {
			toast.error("No image available to submit.");
			return;
		}

		try {
			setIsSubmittingFinal(true);

			// Assuming the final submission sends the image URL to the backend
			const response = await submitFinalData(
				typeof resultImage === "string" ? resultImage : URL.createObjectURL(resultImage as File)
			);

			if (response.jobID) {
				toast.success("Final submission successful!");

				// Fetch images using the jobID and redirect to the result page
				router.push(`/result?jobID=${response.jobID}`); // Assuming this navigates to a result page
			} else {
				toast.error("Failed to submit the image.");
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
		if (file) {
			setResultImage(file); // Set the file directly
			setCropModalOpen(true); // Open crop modal
		}
	};

	// Handle crop complete and set the cropped image
	const handleCropComplete = (croppedImage: File) => {
		setResultImage(croppedImage); // Set the cropped image
		setCropModalOpen(false); // Close crop modal
	};

	// Handle image deletion
	const handleDeleteImage = () => {
		setResultImage(null);
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<Card className="w-[700px] h-auto gap-1">
				<CardBody className="flex flex-col md:flex md:flex-row gap-2">
					{/* Image Section */}
					<Card
						isPressable
						onClick={() =>
							document.getElementById("user-image-input")?.click()
						}
						className="w-[500px] aspect-square bg-pink-500"
					>
						{resultImage ? (
							<>
								<Image
									alt="Result Image"
									className="z-0 w-full h-full object-cover"
									classNames={{ wrapper: "w-full h-full aspect-square" }}
									src={
										typeof resultImage === "string"
											? resultImage
											: URL.createObjectURL(resultImage)
									} // Handle both file and URL
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
							onPress={handleFinalSubmit}
							isDisabled={!resultImage || isSubmittingFinal} // Disable if no image is available or if submitting
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
				imageSrc={
					resultImage && typeof resultImage === "string"
						? resultImage
						: resultImage
						? URL.createObjectURL(resultImage as File)
						: ""
				} // Send the image URL to the crop modal
				onCropComplete={handleCropComplete}
			/>
		</div>
	);
};

export default PromptPage;
