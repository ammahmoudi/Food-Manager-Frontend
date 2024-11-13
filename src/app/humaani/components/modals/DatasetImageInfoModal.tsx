"use client";

import { FC } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import DatasetImageInfoCard from "../DatasetImageInfoCard";

interface DatasetImageInfoModalProps {
	visible: boolean;
	onClose: () => void;
	imageId: number;
	onDeleteSuccess: () => void;
}

const DatasetImageInfoModal: FC<DatasetImageInfoModalProps> = ({
	visible,
	onClose,
	imageId,
	onDeleteSuccess,
}) => {
	return (
		<Modal
			isOpen={visible}
			onOpenChange={onClose}
            size="5xl"
			scrollBehavior="inside"
		>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					<p>Dataset Image Information</p>
				</ModalHeader>
				<ModalBody>
					<DatasetImageInfoCard
						imageId={imageId}
						onDeleteSuccess={() => {
							onDeleteSuccess();
							onClose();
						} }
					/>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default DatasetImageInfoModal;
