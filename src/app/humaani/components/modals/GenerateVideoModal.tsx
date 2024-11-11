"use client";

import { FC } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import GenerateVideoForm from "../GenerateVideoForm";

interface GenerateVideoModalProps {
  visible: boolean;
  onClose: () => void;
  datasetId: number | null;
  onSave: (videoRequest: unknown) => void;
}

const GenerateVideoModal: FC<GenerateVideoModalProps> = ({
  visible,
  onClose,
  datasetId,
  onSave,
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
          <p>Generate Video</p>
        </ModalHeader>
        <ModalBody>
          <GenerateVideoForm
            datasetId={datasetId}
            onSave={(videoRequest) => {
              onSave(videoRequest);
              onClose();
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GenerateVideoModal;
