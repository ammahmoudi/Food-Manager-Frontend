"use client";

import { FC, useState, ChangeEvent } from "react";
import {
	Input,
	Button,
	Card,
	CardFooter,
	Image,
	useDisclosure,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalContent,
} from "@nextui-org/react";

import {CharacterFormData} from "../interfaces/CharacterFormData";

import { TrashIcon } from "@heroicons/react/24/solid";
import ImageCropModal from "@/components/ImageCropModal"; // Import ImageCropModal
import React from "react";
import { toast } from "sonner";
import Character from "../interfaces/Character";
import { addCharacter, deleteCharacter, updateCharacter } from "../services/aiApi";

interface CharacterFormProps {
	initialData: Character | null;
	isEditMode: boolean;
	onSave: (character: Character) => void;
	onDelete: (characterId: number) => void;
}

const CharacterForm: FC<CharacterFormProps> = ({
	initialData = null,
	isEditMode,
	onSave,
	onDelete,
}) => {
	const [name, setName] = useState(initialData?.name || "");
	const [description, setDescription] = useState(initialData?.description || "");
	const [image, setImage] = useState<File | string | null>(initialData?.image || null);

	const {
		isOpen: isDeleteModalOpen,
		onOpen: openDeleteModal,
		onClose: closeDeleteModal,
	} = useDisclosure();
	const {
		isOpen: isCropModalOpen,
		onOpen: openCropModal,
		onClose: closeCropModal,
	} = useDisclosure();

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setImage(imageUrl); // Temporarily set image URL to show a preview
			openCropModal(); // Open the crop modal after selecting the image
		}
	};

	const handleCropComplete = (croppedImage: File) => {
		setImage(croppedImage); // Set the cropped image as the selected image
		closeCropModal();
	};

	const handleDeleteImage = () => {
		setImage(null);
	};

	const handleSave = async () => {
		const characterData: CharacterFormData = {
			name,
			description,
			image,
		};
		const saveCharacterPromise =
			isEditMode && initialData
				? updateCharacter(initialData.id, characterData)
				: addCharacter(characterData);

		try {
			toast.promise(saveCharacterPromise, {
				loading: isEditMode ? "Updating character..." : "Creating character...",
				success: (savedCharacter) => {
					onSave(savedCharacter);
					return isEditMode
						? "Character updated successfully!"
						: "Character created successfully!";
				},
				error: "Failed to save character.",
			});
		} catch (error) {
			console.error("Failed to save character:", error);
		}
	};

	const handleDeleteCharacter = async () => {
		if (initialData) {
			const deleteCharacterPromise = deleteCharacter(initialData.id);
			try {
				await toast.promise(deleteCharacterPromise, {
					loading: "Deleting character...",
					success: () => {
						onDelete(initialData.id);
						closeDeleteModal();
						return "Character deleted successfully!";
					},
					error: "Failed to delete character.",
				});
			} catch (error) {
				console.error("Failed to delete character:", error);
			}
		}
	};

	return (
		<div className="character-form space-y-4">
			<div>
				<Card
					isPressable
					onClick={() => document.getElementById("character-image-input")?.click()}
					className="w-full aspect-square"
				>
					{image ? (
						<>
							<Image
								alt="Character Image"
								className="z-0 w-full h-full object-cover"
								classNames={{ wrapper: "w-full h-full aspect-square " }}
								src={
									image instanceof File
										? URL.createObjectURL(image as File)
										: image
								}
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
					id="character-image-input"
					accept="image/*"
					className="hidden"
					onChange={handleImageChange}
					title="Character Image"
					placeholder="Select an image"
				/>
			</div>
			<Input
				label="Name"
				placeholder="Enter character name"
				fullWidth
				value={name}
				isRequired
				onChange={(e) => setName(e.target.value)}
			/>
			<Input
				label="Description"
				placeholder="Enter character description"
				fullWidth
				value={description}
				onChange={(e) => setDescription(e.target.value)}
			/>

			<div className="flex justify-left gap-2">
				<Button
					isDisabled={
						name === "" ||
						(isEditMode &&
							name === initialData?.name &&
							description === initialData.description &&
							image === initialData.image)
					}
					color="primary"
					onPress={handleSave}
				>
					{isEditMode ? "Update Character" : "Create Character"}
				</Button>
				{isEditMode && (
					<Button color="danger" variant="light" onClick={openDeleteModal}>
						Delete Character
					</Button>
				)}
			</div>

			{/* Delete Confirmation Modal */}
			<Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
				<ModalContent>
					<ModalHeader>Delete Character</ModalHeader>
					<ModalBody>Are you sure you want to delete this character?</ModalBody>
					<ModalFooter>
						<Button color="danger" onClick={handleDeleteCharacter}>
							Delete
						</Button>
						<Button variant="light" onClick={closeDeleteModal}>
							Cancel
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Image Crop Modal */}
			<ImageCropModal
				isOpen={isCropModalOpen}
				onClose={closeCropModal}
				imageSrc={image as string} // Send the image URL to the crop modal
				onCropComplete={handleCropComplete}
			/>
		</div>
	);
};

export default CharacterForm;
