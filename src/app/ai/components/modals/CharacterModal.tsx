"use client";

import { FC } from "react";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
} from "@nextui-org/react";
import Character from "../../interfaces/Character";
import CharacterForm from "../CharacterForm";



interface CharacterModalProps {
	visible: boolean;
	onClose: () => void;
	initialData: Character | null;
	isEditMode: boolean;
	onSave: (character: Character) => void;
	onDelete: (characterId: number) => void;
}

const CharacterModal: FC<CharacterModalProps> = ({
	visible,
	onClose,
	initialData,
	isEditMode,
	onSave,
	onDelete,
}) => {
	return (
		<Modal
			isOpen={visible}
			onOpenChange={onClose}
			size="sm"
			scrollBehavior="inside"
		>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					<p>{isEditMode ? "Edit Character" : "Create Character"}</p>
				</ModalHeader>
				<ModalBody>
					<CharacterForm
						initialData={initialData}
						isEditMode={isEditMode}
						onSave={(character) => {
							onSave(character);
							onClose();
						}}
						onDelete={(characterId) => {
							onDelete(characterId);
							onClose();
						}}
					/>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default CharacterModal;
