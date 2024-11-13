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
} from "@nextui-org/react";
import {
	getCharacters,
	sendPromptForCharacter,
	getJob,
	getImageById,
	requestPromptsForImage,
} from "../../services/aiApi";
import { toast } from "sonner";
import Character from "../../interfaces/Character";
import SeedInput from "../../components/SeedGenerator";
import AspectRatioDropDown from "../../components/AspectRatioDropDown";
import LoraUsageSlider from "../../components/StrengthSlider";
import ImageUploadComponent from "../../components/UploadImage";
import ImageComponent from "../../components/ImageComponent";


const PromptPage = () => {
	const [prompt, setPrompt] = useState<string>("");
	const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
	const [selectedLora, setSelectedLora] = useState<string>("");
	const [characters, setCharacters] = useState<Character[]>([]);
	const [loras, setLoras] = useState<{ name: string; path: string }[]>([]);
	const [isSubmittingPrompt, setIsSubmittingPrompt] = useState<boolean>(false);
	const [seed, setSeed] = useState<number>(Math.floor(Math.random() * Math.pow(2, 16)));
	const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>("1:1");
	const [sliderValue, setSliderValue] = useState<number>(0.8);
	const [referenceSliderValue, setReferenceSliderValue] = useState<number>(0.5);
	const [referenceImageId, setReferenceImageId] = useState<number | null>(null);
	const [isFetchingPrompts, setIsFetchingPrompts] = useState(false);
	const [pollingPrompt, setPollingPrompt] = useState(false);
	const [jobId, setJobId] = useState<number | null>(null);


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


	const handleGetPrompts = async () => {
		try {
			setIsFetchingPrompts(true);
				if(referenceImageId){
				const response = await requestPromptsForImage(referenceImageId);

				if (response.job_id) {
					toast.success("Prompt submitted successfully!");
					await pollJobStatusForPrompt(response.job_id);

				} else {
					toast.error("Failed to retrieve job ID.");
				}
			}
		} catch (error) {
			console.error(`Error requesting prompts for image:`, error);
			setIsFetchingPrompts(false);
		}
	};

	const handleImageIdReceived = (UploadedImage: number|null) => {
		setReferenceImageId(UploadedImage);
	};

	const handleAspectRatioSelect = (aspectRatio: string) => {
		setSelectedAspectRatio(aspectRatio);
	};

	const handleSliderChange = (value: number) => {
		setSliderValue(value);
	};

	const handleReferenceSliderChange = (value: number) => {
		setReferenceSliderValue(value);
	};

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

	const pollJobStatusForPrompt = async (jobId: number) => {
		setPollingPrompt(true);
		let polling = true;

		const fetchJobStatus = async () => {
			try {
				const jobData = await getJob(jobId);
				if (jobData.status === "completed") {
					await fetchImageData();
					setPollingPrompt(false);
					setIsFetchingPrompts(false);
					toast.success("Job completed and result is ready!");
					polling = false;
				} else if (jobData.status === "failed") {
					setPollingPrompt(false);
					setIsFetchingPrompts(false);
					toast.error("Job failed to complete.");
					polling = false;
				}
			} catch (error) {
				console.error("Error fetching job status:", error);
				setPollingPrompt(false);
				setIsFetchingPrompts(false);
				toast.error("Error fetching job status.");
				polling = false;
			}
		};

		await fetchJobStatus();

		const intervalId = setInterval(async () => {
			if (!polling) {
				clearInterval(intervalId);
			} else {
				await fetchJobStatus();
			}
		},2000);
	};

	const fetchImageData = async () => {
		try {
			if(referenceImageId){
				const data = await getImageById(referenceImageId);
				setPrompt(prompt+", "+data.complex_prompt)
				setReferenceImageId(data.id);
			}
		} catch (error) {
			console.error(`Error fetching image`, error);
		}
	};

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
			const response = await sendPromptForCharacter({
				prompt,
				character_id: selectedCharacter.id,
				lora_name: selectedLora,
				seed: String(seed),
				lora_strength: String(sliderValue),
				aspect_ratio: selectedAspectRatio,
				reference_strength: referenceImageId ?String(referenceSliderValue):undefined,
				reference_image: referenceImageId ? referenceImageId : undefined
			});
			toast.success("Prompt submitted successfully!");
			if (response.job_id) {
				setJobId(response.job_id)
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
		<div className="container mx-auto p-2 items-center">
			<div className="flex flex-col lg:flex-row justify-center items-center min-h-screen gap-2">
				<Card className="w-full h-full gap-1">
					<CardBody className="flex flex-col md:flex md:flex-row gap-2">
						<div className="flex flex-col w-full h-full gap-2">
							{/* Image Upload and Textarea */}
							<div className="container mx-auto p-4">
								<div className="flex flex-col lg:flex-row gap-4 w-full items-start">
									<div className="w-full lg:w-1/2 flex flex-col gap-4">
										<ImageUploadComponent
											onImageIdReceived={handleImageIdReceived}
										/>
										{ referenceImageId &&  <>
											<Button
												color="primary"
												onClick={handleGetPrompts}
												disabled={isFetchingPrompts || pollingPrompt}
												isLoading={isFetchingPrompts}>
												{isFetchingPrompts ? "Fetching Prompts..." : "Get Prompts"}
											</Button>
											<LoraUsageSlider
												defaultValue={50}
												onValueChange={handleReferenceSliderChange}
												label="Reference Strength"
											/>
										</>}
									</div>
										<Textarea
											label="Prompt"
											placeholder="Enter your prompt"
											fullWidth
											value={prompt}
											onChange={(e) => setPrompt(e.target.value)}
											className="w-full h-full"
											size="lg"
											minRows={8}
										/>
								</div>
							</div>
							{/* Character and Lora Selection */}
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
							<div>
								<Select<{ name: string; path: string }>
									items={loras}
									label="Choose a LoRA"
									variant="bordered"
									placeholder="Select a LoRA"
									onSelectionChange={(selectedKeys) =>
										setSelectedLora(Array.from(selectedKeys)[0] as string)
									}
									selectedKeys={
										selectedLora ? new Set([selectedLora]) : new Set()
									}
								>
									{(lora) => (
										<SelectItem key={lora.name} textValue={lora.name}>
											<div className="flex gap-2 items-center">{lora.name}</div>
										</SelectItem>
									)}
								</Select>
							</div>
							<div className="flex flex-grow flex-col justify-between w-full space-y-2">
								<SeedInput seed={seed} setSeed={setSeed} />
							</div>
							<div className="flex flex-grow flex-col justify-between w-full space-y-1">
								<LoraUsageSlider
									defaultValue={80}
									onValueChange={handleSliderChange}
									label="Lora Strength"
								/>
								<AspectRatioDropDown onSelect={handleAspectRatioSelect} />
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
				{/* Image Rendering */}
				{jobId && (
					<Card className="h-full w-full gap-1">
						<CardBody className="">
							<div className="flex flex-col w-full h-full">
								<ImageComponent src_id={jobId} src_variant={"job"} className="hover:object-none"></ImageComponent>
							</div>
						</CardBody>
					</Card>
				)}
			</div>
		</div>
	);
};

export default PromptPage;
