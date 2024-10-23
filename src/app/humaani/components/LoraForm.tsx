"use client";

import { FC, useState } from "react";
import {
	Input,
	Button,
	Link,
} from "@nextui-org/react";
import { toast } from "sonner";
import CustomCharacterAutocomplete from "./CustomCharacterAutoComplete";
import Character from "../interfaces/Character";
import { newLoraRequest } from "../services/aiApi";
import LoraTypeComponent from "./LoraTypeComponent";

interface LoraFormProps {
	datasetId: number | null;
	onSave: (loraRequest: unknown) => void;
}

const LoraForm: FC<LoraFormProps> = ({ datasetId, onSave }) => {
	const [name, setName] = useState<string>("");
	const [selectedLoraType, setSelectedLoraType] = useState<string | null>(null);
	const [triggerWord, setTriggerWord] = useState<string>("");
	const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);




	const handleSelectionChange = (LoraType: string) => {
		setSelectedLoraType(LoraType);
	};


	// Handle saving the new LoRA request
	const handleSave = async () => {
		console.log(name)
		console.log(selectedLoraType)
		console.log(triggerWord)
		console.log(selectedLoraType)

		if (!name || !selectedLoraType || !triggerWord || !selectedCharacter) {
			toast.error("Please fill in all required fields.");
			return;
		}

		const loraData =  {
			name: name,
			lora_type: selectedLoraType,
			trigger_word: triggerWord,
			character: selectedCharacter.id,
			dataset: datasetId,

		};

		try {
			const saveLoraPromise = newLoraRequest(loraData);
			await toast.promise(saveLoraPromise, {
				loading: "Creating LoRA request...",
				success: "LoRA request created successfully!",
				error: "Failed to create LoRA request.",
			});
			onSave(await saveLoraPromise);
		} catch (error) {
			console.error("Failed to save LoRA request:", error);
		}
	};

	return (
		<div className="lora-form space-y-4">
			{/* First Row - LoRA Name */}
			<Input
				label="LoRA Name"
				placeholder="Enter LoRA name"
				fullWidth
				value={name}
				onChange={(e) => setName(e.target.value)}
				isRequired
			/>

			{/* Second Row - LoRA Type Dropdown and Character Autocomplete */}
			<div className="flex flex-row justify-between gap-4">

				<div className="w-full">
					<LoraTypeComponent onSelect={handleSelectionChange}/>
				</div>

				{/* Custom Character Autocomplete */}
				<CustomCharacterAutocomplete
					selectedCharacter={selectedCharacter}
					onCharacterSelect={(character) => setSelectedCharacter(character)}
					shouldUpdate={false}
					onUpdateComplete={() => {}}
				/>
			</div>

			{/* Third Row - Trigger Word */}
			<Input
				label="Trigger Word"
				placeholder="Enter trigger word"
				fullWidth
				value={triggerWord}
				onChange={(e) => setTriggerWord(e.target.value)}
				isRequired
			/>

			{/* Save Button */}
			<div className="flex justify-left gap-2">
				<Button as={Link}
					href="/humaani/lora/requests"
					color="primary"
					isDisabled={!name || !selectedLoraType || !triggerWord || !selectedCharacter}
					onPress={handleSave}
				>
					Create LoRA
				</Button>
			</div>
		</div>
	);
};

export default LoraForm;
