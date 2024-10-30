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


import { TrashIcon } from "@heroicons/react/24/solid";
import ImageCropModal from "@/components/ImageCropModal"; // Import ImageCropModal
import React from "react";
import Character from "../interfaces/Character";
import { deleteCharacter, updateCharacterInfo } from "../services/aiApi";

interface CharacterInfoFormProps {
	initialData: Character | null;
	isEditMode: boolean;
	onSave: (character: Character) => void;
	onDelete: (characterId: number) => void;
}

const CharacterInfoForm: FC<CharacterInfoFormProps> = ({
	initialData = null,
	onSave,
	onDelete,
}) => {
	const [name, setName] = useState(initialData?.name || "");
	const [description, setDescription] = useState(initialData?.description || "");
	const [image, setImage] = useState<File | string | null>(initialData?.image || null);
	const {isOpen: isDeleteModalOpen,onOpen: openDeleteModal,onClose: closeDeleteModal,} = useDisclosure();
	const {isOpen: isCropModalOpen,onOpen: openCropModal,onClose: closeCropModal,} = useDisclosure();

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setImage(imageUrl);
			openCropModal();
		}
	};

	const handleCropComplete = (croppedImage: File) => {
		setImage(croppedImage);
		closeCropModal();
	};

	const handleDeleteImage = () => {
		setImage(null);
	};

	const handleSave = async () => {
		if (initialData && image){
			try{
				const response = await updateCharacterInfo(initialData.id, name, description)
				if(response){
					onSave(response)
				}
			}catch{
				console.log("error")
			}
		}
	};

	const handleDeleteCharacter = async () => {
		if (initialData) {
			try {
                await deleteCharacter(initialData.id);
                onDelete(initialData.id)
                closeDeleteModal()

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
					color="success"
					variant="shadow"
					onPress={handleSave}
				>
					Update
				</Button>

				<Button
					color="danger"
					variant="shadow"
					onClick={openDeleteModal}
				>
					Delete
				</Button>

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
				imageSrc={image as string}
				onCropComplete={handleCropComplete}
			/>
		</div>
	);
};

export default CharacterInfoForm;
