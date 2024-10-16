"use client";

import { FC, useState, useEffect } from "react";
import {
	Input,
	Button,
	Select,
	SelectItem,
} from "@nextui-org/react";
import { toast } from "sonner";
import CustomCharacterAutocomplete from "./CustomCharacterAutoComplete";
import Character from "../interfaces/Character";
import { LoraRequestType } from "../interfaces/LoraRequest";
import { getLoraTypes, newLoraRequest } from "../services/aiApi";

interface LoraFormProps {
	datasetId: number; // Pass the datasetId from the page using this form
	onSave: (loraRequest: unknown) => void;
}

const LoraForm: FC<LoraFormProps> = ({ datasetId, onSave }) => {
	const [name, setName] = useState<string>("");
	const [loraTypes, setLoraTypes] = useState<LoraRequestType[]>([]); // Array to hold the LoRA types from the API
	const [selectedLoraType, setSelectedLoraType] = useState<LoraRequestType | null>(null);
	const [triggerWord, setTriggerWord] = useState<string>("");
	const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null); // Handle the selected character from the autocomplete component

	const handleLoraSelectionSelection = (
		e: React.ChangeEvent<HTMLSelectElement>
	) => {
		const loraType = loraTypes.find(
			(char) => char.id === parseInt(e.target.value)
		);
		if (loraType) {
			setSelectedLoraType(loraType);
		} else {
			setLoraTypes([]);
		}
	};

	// Fetch the LoRA types on component load
	const fetchLoraTypes = async () => {
		try {
			const types = await getLoraTypes();
			setLoraTypes(types);
		} catch (error) {
			console.error("Failed to fetch LoRA types:", error);
			toast.error("Failed to load LoRA types.");
		}
	};

	useEffect(() => {
		fetchLoraTypes();
	}, []);

	// Handle saving the new LoRA request
	const handleSave = async () => {
		if (!name || !selectedLoraType || !triggerWord || !selectedCharacter) {
			toast.error("Please fill in all required fields.");
			return;
		}

		const loraData = {
			name,
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
				<Select
					label="LoRA Type"
					placeholder="Select LoRA Type"
					fullWidth
					selectedKeys={String(loraTypes)}
					onChange={handleLoraSelectionSelection}
					isRequired

				>
					{loraTypes.map((type) => (
						<SelectItem key={type.id} value={type.id}>
							{type.name}
						</SelectItem>
					))}
				</Select>

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
				<Button
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
