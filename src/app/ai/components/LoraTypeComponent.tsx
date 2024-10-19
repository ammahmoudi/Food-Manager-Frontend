"use client";

import { FC, useState, useEffect } from "react";
import {
	Select,
	SelectItem,
} from "@nextui-org/react";
import { toast } from "sonner";
import { LoraRequestType } from '../interfaces/LoraRequest';
import { getLoraTypes } from "../services/aiApi";

interface LoraFormProps {
	onSelect: (LoraRequestTypeId: string) => void;
}

const LoraTypeComponent: FC<LoraFormProps> = ({onSelect}) => {
	const [loraTypes, setLoraTypes] = useState<LoraRequestType[]>([]);
	const [selectedLoraType, setSelectedLoraType] = useState<string | null>(null);

    const handleSelectionChange = (selectedKeys: Iterable<unknown> | ArrayLike<unknown>) => {
		setSelectedLoraType(Array.from(selectedKeys)[0] as string)
        if (selectedLoraType){
            onSelect(selectedLoraType)
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


	return (
		<div className="lora-form space-y-4">

			{/* Second Row - LoRA Type Dropdown and Character Autocomplete */}
			<div className="flex flex-row justify-between gap-4">
				<Select
					items={loraTypes}
					variant="bordered"
					label="LoRA Type"
					placeholder="Select LoRA Type"
					fullWidth
					onSelectionChange={
                        handleSelectionChange
					}
					selectedKeys={
						selectedLoraType ? new Set([selectedLoraType]) : new Set()
					}
				>
					{loraTypes.map((type) => (
						<SelectItem key={type.id} value={type.id}>
							{type.name}
						</SelectItem>
					))}
				</Select>


			</div>

		</div>
	);
};

export default LoraTypeComponent;
