import React, { FC } from "react";
import {
    Modal,
    ModalContent,
    ModalBody,
    ModalFooter,
    Button,
    ModalHeader,
} from "@nextui-org/react";
import UploadVideo from "../UploadVideo";

interface VideoUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const VideoUploadModal: FC<VideoUploadModalProps> = ({ isOpen, onClose }) => {


    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            backdrop="blur"
            size="md"
        >
            <ModalContent>
            <ModalHeader>
                Upload Your Video
            </ModalHeader>
                <ModalBody className="flex flex-col items-center justify-center h-full">
                    <UploadVideo></UploadVideo>
                </ModalBody>
                <ModalFooter>
                <Button color="primary" onPress={onClose}>
                    Done
                </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
    };

export default VideoUploadModal;
