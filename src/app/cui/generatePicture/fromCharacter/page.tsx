"use client";
import { useEffect, useState, ChangeEvent } from "react";
import {
	Button,
	Card,
	CardFooter,
	CardBody,
	Textarea,
	Spinner,
	Select,
	SelectItem,
} from "@nextui-org/react";
import { sendPromptToBackend, getJobStatus, getCharactersFromBackend } from "@/services/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation"; // For navigation

interface Job {
	id: string;
	workflow: string;
	status: "pending" | "running" | "completed" | "failed";
	runtime: string;
	images: any[];
	result_data: Record<string, any>;
	input_data: Record<string, any>;
	logs: string;
	user: string;
}

const PromptPage = () => {
	const [prompt, setPrompt] = useState<string>(""); 
	const [selectedCharacter, setSelectedCharacter] = useState<string>(""); 
	const [characters, setCharacters] = useState<any[]>([]); // Store list of characters
	const [job, setJob] = useState<Job | null>(null); 
	const [isSubmittingPrompt, setIsSubmittingPrompt] = useState<boolean>(false); 
	const [isSubmittingFinal, setIsSubmittingFinal] = useState<boolean>(false); 
	const [polling, setPolling] = useState<boolean>(false); 
	const [resultImage, setResultImage] = useState<string | null>(null);
	const router = useRouter();

	// Fetch list of characters from backend on component mount
	useEffect(() => {
		const fetchCharacters = async () => {
			try {
				const fetchedCharacters = await getCharactersFromBackend();
				setCharacters(fetchedCharacters); // Populate characters from backend
			} catch (error) {
				toast.error("Failed to fetch characters.");
			}
		};
		fetchCharacters();
	}, []);

	// Poll the job status using the jobID
	const pollJobStatus = async (jobId: string) => {
		const intervalId = setInterval(async () => {
			try {
				const jobData = await getJobStatus(jobId);
				setJob(jobData);

				if (jobData.status === "completed") {
					clearInterval(intervalId);
					setPolling(false);

					if (jobData.images && jobData.images.length > 0) {
						setResultImage(jobData.images[0]); // Show first image
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
				clearInterval(intervalId);
				setPolling(false);
				toast.error("Error fetching job status.");
			}
		}, 5000); // Poll every 5 seconds
	};

	// Handle prompt submission to backend
	const handleSubmitPrompt = async () => {
		if (!prompt.trim()) {
			toast.error("Prompt cannot be empty!");
			return;
		}

		if (!selectedCharacter) {
			toast.error("You must select a character.");
			return;
		}

		try {
			setIsSubmittingPrompt(true);
			setJob(null);
			setResultImage(null); // Clear previous result

			const response = await sendPromptToBackend({ prompt, character: selectedCharacter });
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

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<Card className="w-[700px] h-auto gap-1">
				<CardBody className="flex flex-col md:flex md:flex-row gap-2">
					{/* Prompt Input Field */}
					<div className="flex flex-col w-full h-full">
						<Textarea
							label="Prompt"
							className="h-[110px]"
							placeholder="Enter your prompt"
							fullWidth
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
						/>

						{/* Character Selection */}
						<div className="mt-4">
							<Select
								label="Choose a character"
								selectedKeys={selectedCharacter}
								onChange={(e) => setSelectedCharacter(e)}
							>
								{characters.map((char) => (
									<SelectItem key={char.id} value={char.id}>
										{char.name}
									</SelectItem>
								))}
							</Select>
						</div>
					</div>
				</CardBody>

				<CardFooter>
					<div className="flex flex-col w-full h-full">
						<Button
							color="primary"
							onPress={handleSubmitPrompt}
							isLoading={isSubmittingPrompt}
							isDisabled={isSubmittingPrompt}
						>
							Submit Prompt
						</Button>
					</div>
				</CardFooter>
			</Card>

			{/* Show result image under the button */}
			{resultImage && (
				<div className="mt-4">
					<h3 className="text-xl font-semibold mb-2">Generated Image</h3>
					<img
						src={resultImage}
						alt="Generated result"
						className="w-80 h-80 object-cover border rounded-md"
					/>
				</div>
			)}
		</div>
	);
};

export default PromptPage;
