"use client";

import React, { FC, useState, useEffect } from "react";
import {
	Autocomplete,
	AutocompleteItem,
	Avatar,
	Button,
	Link,
} from "@nextui-org/react";

import {
	MagnifyingGlassIcon,
	PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";


import { toast } from "sonner";
import Character from "../interfaces/Character";
import CharacterModal from "./modals/CharacterModal";


interface CustomCharacterAutocompleteProps {
	selectedCharacter: Character | null;
	onCharacterSelect: (character: Character | null) => void;
	shouldUpdate: boolean;
	onUpdateComplete: () => void;
}

const CustomCharacterAutocomplete: FC<CustomCharacterAutocompleteProps> = ({
	selectedCharacter,
	onCharacterSelect,
	shouldUpdate,
	onUpdateComplete,
}) => {
	const [characters, setCharacters] = useState<Character[]>([]);
	const [inputValue, setInputValue] = useState("");
	const [modalVisible, setModalVisible] = useState(false);

	const fetchCharacters = async () => {
		try {
			toast.promise(
				getCharacters(),
				{
					loading: "Loading characters...",
					success: (response) => {
						setCharacters(response);
						return "Characters loaded successfully!";
					},
					error: "Failed to load characters",
				}
			)
		} catch (error) {
			console.error("Failed to fetch characters:", error);
		}
	};

	useEffect(() => {
		fetchCharacters();
	}, []);

	useEffect(() => {
		if (shouldUpdate) {
			fetchCharacters();
			onUpdateComplete();
		}
	}, [shouldUpdate, onUpdateComplete]);

	const handleOpenModal = () => {
		setModalVisible(true);
	};

	const handleCloseModal = () => {
		setModalVisible(false);
		fetchCharacters(); // Refresh the character list after closing the modal
	};

	const handleSave = async (character: Character) => {
        onCharacterSelect(character)
	};

	const handleDelete = () => {
		fetchCharacters();
	};

	return (
		<div className="justify-between flex gap-2">
			<Autocomplete
				shouldCloseOnBlur
				classNames={{
					listboxWrapper: "max-h-[320px]",
					selectorButton: "text-default-500",
				}}
				variant="flat"
				defaultItems={characters}
				defaultInputValue={inputValue}
				onInputChange={setInputValue}
				onSelectionChange={(key) => {
					if (key !== null) {
						const selected = characters.find((character) => character.id === +key);
						onCharacterSelect(selected || null);
					}
				}}
				selectedKey={selectedCharacter?.id.toString() || ""}
				inputProps={{
					classNames: {
						input: "ml-1",
						inputWrapper: "h-full",
					},
				}}
				listboxProps={{
					hideSelectedIcon: false,
					emptyContent: (
						<Link>
							<PlusCircleIcon className="size-6"></PlusCircleIcon>Use the Add Button
						</Link>
					),
					itemClasses: {
						base: [
							"rounded-medium",
							"text-default-500",
							"transition-opacity",
							"data-[hover=true]:text-foreground",
							"dark:data-[hover=true]:bg-default-50",
							"data-[pressed=true]:opacity-70",
							"data-[hover=true]:bg-default-200",
							"data-[selectable=true]:focus:bg-default-100",
							"data-[focus-visible=true]:ring-default-500",
						],
					},
				}}
				aria-label="Select a character"
				placeholder="Enter character name"
				popoverProps={{
					offset: 10,
					classNames: {
						base: "rounded-large",
						content: "p-1 border-small border-default-100 bg-background",
					},
				}}
				startContent={
					<MagnifyingGlassIcon
						className="text-default-400 size-6"
						strokeWidth={2.5}
					/>
				}
				radius="lg"
			>
				{(item) => (
					<AutocompleteItem key={item.id} textValue={item.name}>
						<div className="flex justify-between items-center">
							<div className="flex gap-2 items-center">
								<Avatar
									alt={item.name}
									className="flex-shrink-0"
									size="sm"
									src={item.image as string}
								/>
								<div className="flex flex-col">
									<span className="text-small">{item.name}</span>
									<span className="text-tiny text-default-400 overflow-hidden truncate">
										{item.description}
									</span>
								</div>
							</div>
						</div>
					</AutocompleteItem>
				)}
			</Autocomplete>
			<Button
				isIconOnly
				color="success"
				className="h-full w-auto aspect-square"
				onPress={handleOpenModal}
			>
				<PlusIcon className="text-white size-6"></PlusIcon>
			</Button>

			<CharacterModal
				visible={modalVisible}
				onClose={handleCloseModal}
				initialData={null}
				isEditMode={false}
				onSave={handleSave}
				onDelete={handleDelete}
			/>
		</div>
	);
};

export default CustomCharacterAutocomplete;
