"use client";

import { FC, useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { toast } from "sonner";
import { submitVideoRequest } from "@/app/humaani/services/aiApi";

interface GenerateVideoFormProps {
	datasetId: number | null;
	onSave: (videoRequest: unknown) => void;
}

const GenerateVideoForm: FC<GenerateVideoFormProps> = ({
	datasetId,
	onSave,
}) => {
	const [prompt, setPrompt] = useState<string>("");

	const handleSave = async () => {
		if (!datasetId || !prompt) {
			toast.error("Please fill in all required fields.");
			return;
		}

		const videoData = {
			dataset_image_id: datasetId,
			prompt: prompt,
		};

		try {
			const saveVideoPromise = submitVideoRequest(videoData);
			await toast.promise(saveVideoPromise, {
				loading: "Generating video...",
				success: "Video generated successfully!",
				error: "Failed to generate video.",
			});
			onSave(await saveVideoPromise);
		} catch (error) {
			console.error("Failed to generate video:", error);
		}
	};

	return (
		<div className="video-form space-y-4">
			{/* Prompt Input */}
			<Input
				label="Prompt"
				placeholder="Enter prompt for video generation"
				fullWidth
				value={prompt}
				onChange={(e) => setPrompt(e.target.value)}
				isRequired
			/>

			{/* Save Button */}
			<div className="flex justify-left gap-2">
				<Button
					color="primary"
					isDisabled={!datasetId || !prompt}
					onPress={handleSave}
				>
					Generate Video
				</Button>
			</div>
		</div>
	);
};

export default GenerateVideoForm;
