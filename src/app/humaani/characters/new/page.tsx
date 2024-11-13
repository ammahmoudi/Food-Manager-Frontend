"use client";
import { useState } from "react";
import {Button,Card,CardFooter,CardBody,Textarea,} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";
import {sendPromptToBackend,submitFinalData,} from "../../services/aiApi";
import { toast } from "sonner";
import SeedInput from "../../components/SeedGenerator";
import LoraTypeComponent from "../../components/LoraTypeComponent";
import ImageUploadComponent from "../../components/UploadImage";
import ImageComponent from "../../components/ImageComponent";

const NewCharacter = () => {
	const [prompt, setPrompt] = useState<string>("");
	const [jobId, setJobId] = useState<number | null>(null);
	const [imageId, setImageId] = useState<number | null>(null);
	const [isSubmittingPrompt, setIsSubmittingPrompt] = useState<boolean>(false);
	const [isSubmittingFinal, setIsSubmittingFinal] = useState<boolean>(false);
	const [referenceImageId, setReferenceImageId] = useState<number | null>(null);
	const [selectedLoraType, setSelectedLoraType] = useState<string | null>(null);
	const router = useRouter();
	const [seed, setSeed] = useState<number>(Math.floor(Math.random() * Math.pow(2, 16)));

	const handleImageReceived = (id: number) => {
		setImageId(id);
		setIsSubmittingPrompt(false)
	};

	const handleUploadImageIdReceived = (UploadedImageId: number | null) => {
		if (UploadedImageId) {
			console.log(UploadedImageId)
			setReferenceImageId(UploadedImageId);
		}
	};


	const handleSelectionChange = (LoraType: string) => {
		setSelectedLoraType(LoraType);
	};

	const handleSubmitPrompt = async () => {
		if (!prompt.trim()) {
			toast.error("Prompt cannot be empty!");
			return;
		}
		setIsSubmittingPrompt(true);
		
		try {
			setJobId(null);
			const response = await sendPromptToBackend({
				prompt: prompt,
				seed: String(seed),
			});
			toast.success("Prompt submitted successfully!");
			setReferenceImageId(null);

			if (response.job_id) {
				setJobId(response.job_id)
				setIsSubmittingPrompt(false)
			} else {
				toast.error("Failed to retrieve job ID.");
				setIsSubmittingPrompt(false);
			}
		} catch (error) {
			toast.error("Error submitting the prompt.");
			console.error("Error submitting prompt:", error);
			setIsSubmittingPrompt(false);
		}
	};


	const handleFinalSubmit = async () => {
		if (!referenceImageId) {
			toast.error("No image available to submit.");
			return;
		}
		try {
			setIsSubmittingFinal(true);
			if (referenceImageId) {
				const response = await submitFinalData(referenceImageId, selectedLoraType);

				if (response.dataset_id) {
					toast.success("Final submission successful!");
					router.push(`/humaani/datasets/${response.dataset_id}`);
				} else {
					toast.error("Failed to retrieve dataset.");
				}
			}else if (imageId){
				const response = await submitFinalData(imageId, selectedLoraType);

				if (response.dataset_id) {
					toast.success("Final submission successful!");
					router.push(`/humaani/datasets/${response.dataset_id}`);
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


	return (
		<div className="container xl:w-1/2 mx-auto p-2 items-center">
			<div className="flex justify-center items-center min-h-screen">
				<Card className="w-[700px] h-auto gap-1">
					<CardBody className="flex flex-col md:flex md:flex-row gap-2">
						{jobId ? (
							<ImageComponent src_id={jobId} src_variant={"job"} onImageRecieved={handleImageReceived}></ImageComponent>
						):(
							<ImageUploadComponent onImageIdReceived={handleUploadImageIdReceived}></ImageUploadComponent>
						)}
						<div className="flex flex-col w-full gap-2">
							<div className="flex-grow">
								<Textarea
									label="Prompt"
									size="lg"
									placeholder="Enter your prompt"
									value={prompt}
									onChange={(e) => setPrompt(e.target.value)}
									classNames={{
										base: "h-full",
										inputWrapper: "!h-full",
									}}
								/>
							</div>

							<div className="w-full bg-gray-100 rounded-lg">
								<SeedInput seed={seed} setSeed={setSeed} />
							</div>
							<div className="w-full bg-gray-100 rounded-lg">
								<LoraTypeComponent onSelect={handleSelectionChange} />
							</div>

							<div className="flex w-full">
								<Button
									color="primary"
									className="w-full"
									onPress={handleSubmitPrompt}
									isLoading={isSubmittingPrompt}
									isDisabled={isSubmittingPrompt || !prompt}
								>
									{isSubmittingPrompt ? "Submitting prompt..." : "Submit Prompt"}
								</Button>
							</div>
						</div>
					</CardBody>

					<CardFooter>
						<div className="flex w-full justify-center">
							<Button
								color="secondary"
								className="w-full"
								isDisabled={!referenceImageId || isSubmittingPrompt || isSubmittingFinal}
								onPress={handleFinalSubmit}
								isLoading={isSubmittingFinal}
							>
								Final Submit
							</Button>
						</div>
					</CardFooter>
				</Card>

			</div>
		</div>
	);
};

export default NewCharacter;
