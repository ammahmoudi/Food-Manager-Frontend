"use client";

import { FC } from "react";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
} from "@nextui-org/react";
import Character from "../../interfaces/Character";
import CharacterInfoForm from "../CharacterInfoForm";

interface EditCharacterModalProps {
	visible: boolean;
	onClose: () => void;
	initialCharacter: Character | null;
	isEditMode: boolean;
	onSave: (character: Character) => void;
	onDelete: (characterId: number) => void;
}

const EditCharacterModal: FC<EditCharacterModalProps> = ({
	visible,
	onClose,
	initialCharacter,
	isEditMode,
	onSave,
	onDelete,
}) => {


	return (
		<Modal
			isOpen={visible}
			onOpenChange={onClose}
		>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					<p>Edit Character</p>
				</ModalHeader>
				<ModalBody>
					<CharacterInfoForm
						initialData={initialCharacter}
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

export default EditCharacterModal;
