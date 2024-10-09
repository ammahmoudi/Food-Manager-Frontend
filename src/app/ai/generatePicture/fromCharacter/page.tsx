"use client";
import { useEffect, useState } from "react";
import {
	Button,
	Card,
	CardFooter,
	CardBody,
	Textarea,
	Select,
	SelectItem,
	Avatar,
	Image,
	Spinner,
} from "@nextui-org/react";
import {
	getCharacters,
	sendPromptForCharacter,
	getJob,
} from "../../services/aiApi";
import { Job } from "../../interfaces/Job";
import { toast } from "sonner";
import Character from "../../interfaces/Character";
import SeedInput from "../../components/SeedGenerator";

const PromptPage = () => {
	const [prompt, setPrompt] = useState<string>("");
	const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
	const [selectedLora, setSelectedLora] = useState<string>("");
	const [characters, setCharacters] = useState<Character[]>([]);
	const [loras, setLoras] = useState<{ name: string; path: string }[]>([]);
	const [job, setJob] = useState<Job | null>(null);
	const [isSubmittingPrompt, setIsSubmittingPrompt] = useState<boolean>(false);
	const [resultImages, setResultImages] = useState<string[]>([]); // For storing images from the new structure
	const [polling, setPolling] = useState<boolean>(false);
	const [seed, setSeed] = useState<number>(Math.floor(Math.random() * Math.pow(2, 16)));

	// Fetch list of characters from backend on component mount
	useEffect(() => {
		const fetchCharacters = async () => {
			try {
				const fetchedCharacters = await getCharacters();
				setCharacters(fetchedCharacters);
			} catch (error) {
				console.error("Failed to fetch characters:", error);
				toast.error("Failed to fetch characters.");
			}
		};
		fetchCharacters();
	}, []);

	// Handle character selection and update Loras
	const handleCharacterSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const character = characters.find(
			(char) => char.id === parseInt(e.target.value)
		);
		if (character) {
			setSelectedCharacter(character);
			const loraList = Object.entries(character.loras).map(([name, path]) => ({
				name,
				path,
			}));
			setLoras(loraList);
		} else {
			setLoras([]);
		}
	};

	// Poll the job status using the jobID and process result_data
	const pollJobStatus = async (jobId: number) => {
		setPolling(true);

		const fetchJobStatus = async () => {
			try {
				const jobData = await getJob(jobId);
				setJob(jobData);

				if (jobData.status === "completed") {
					setPolling(false);
					clearInterval(intervalId);

					// Extract images from the new result_data structure
					if (jobData.result_data) {
						const images: string[] = [];

						// Traverse through result_data to collect images
						Object.keys(jobData.result_data).forEach((nodeId) => {
							const nodeOutputs = jobData.result_data[nodeId];
							Object.keys(nodeOutputs).forEach((inputName) => {
								const output = nodeOutputs[inputName];
								if (output.type === "image") {
									images.push(output.value); // Collect image URLs
								}
							});
						});

						if (images.length > 0) {
							setResultImages(images);
							toast.success("Images generated successfully!");
						} else {
							toast.error("No images returned from the backend.");
						}
					}
				} else if (jobData.status === "failed") {
					setPolling(false);
					clearInterval(intervalId);
					toast.error("Job failed to complete.");
				}
			} catch (error) {
				console.error("Error fetching job status:", error);
				setPolling(false);
				clearInterval(intervalId);
				toast.error("Error fetching job status.");
			}
		};

		// Call the function immediately for the first time
		await fetchJobStatus();

		// Set up the interval for subsequent polling
		const intervalId = setInterval(async () => {
			await fetchJobStatus();
		}, 5000);
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

		if (!selectedLora) {
			toast.error("You must select a Lora.");
			return;
		}

		try {
			setIsSubmittingPrompt(true);
			setJob(null);
			setResultImages([]); // Clear previous images

			const response = await sendPromptForCharacter({
				prompt,
				character_id: selectedCharacter.id,
				lora_name: selectedLora,
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

	return (
		<div className="container xl:w-1/2 mx-auto p-2 items-center">
			<div className="flex flex-col lg:flex-row justify-center items-center min-h-screen gap-2">
				<Card className="w-full h-full gap-1">
					<CardBody className="flex flex-col md:flex md:flex-row gap-2">
						<div className="flex flex-col w-full h-full gap-2">
							<Textarea
								label="Prompt"
								placeholder="Enter your prompt"
								fullWidth
								value={prompt}
								onChange={(e) => setPrompt(e.target.value)}
							/>

							<div className="">
								<Select
									label="Choose a character"
									variant="bordered"
									onChange={handleCharacterSelection}
									selectedKeys={String(selectedCharacter?.id)}
								>
									{characters.map((char) => (
										<SelectItem
											key={char.id}
											value={char.id}
											textValue={char.name}
										>
											<div className="flex gap-2 items-center">
												<Avatar
													alt={char.name}
													className="flex-shrink-0"
													size="sm"
													src={char.image}
												/>
												<div className="flex flex-col">
													<span className="text-small">{char.name}</span>
												</div>
											</div>
										</SelectItem>
									))}
								</Select>
							</div>

							<div className="">
								<Select<{ name: string; path: string }>
									items={loras}
									label="Choose a Lora"
									variant="bordered"
									placeholder="Select a Lora"
									onSelectionChange={(selectedKeys) =>
										setSelectedLora(Array.from(selectedKeys)[0] as string)
									}
									selectedKeys={selectedLora ? new Set([selectedLora]) : new Set()}
								>
									{(lora) => (
										<SelectItem key={lora.name} textValue={lora.name}>
											<div className="flex gap-2 items-center">{lora.name}</div>
										</SelectItem>
									)}
								</Select>
							</div>

							<div className="flex flex-grow flex-col justify-between w-full space-y-2">
								<div>
									<SeedInput seed={seed} setSeed={setSeed} />
								</div>
							</div>
						</div>
					</CardBody>

					<CardFooter>
						<div className="flex flex-col w-full h-full">
							<Button
								color="primary"
								onPress={handleSubmitPrompt}
								isLoading={isSubmittingPrompt || polling}
								isDisabled={isSubmittingPrompt || polling}
							>
								Submit Prompt
							</Button>
						</div>
					</CardFooter>
				</Card>

				{job?.status === "pending" || job?.status === "running" ? (
					<Card className="w-full h-full gap-1 flex justify-center items-center p-10">
						<Spinner color="primary" size="lg" />
						<p className="text-gray-500 ">{job?.status}</p>
					</Card>
				) : (
					resultImages.length > 0 && (
						<Card className="h-full gap-1">
							<CardBody className="">
								<div className="flex flex-col w-full h-full">
									{resultImages.map((imageUrl, index) => (
										<div key={index} className="w-full">
											<Image
												src={imageUrl}
												alt={`Generated result ${index + 1}`}
												className="w-full h-full object-cover border rounded-md"
											/>
										</div>
									))}
								</div>
							</CardBody>
						</Card>
					)
				)}
			</div>
		</div>
	);
};

export default PromptPage;
