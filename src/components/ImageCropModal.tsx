"use client";

import React, { useRef } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalContent,
} from "@nextui-org/react";
import { Cropper, CropperRef } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { compressImage, getCroppedImageBlob } from "@/app/utils/imageUtils";

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedImage: File) => void;
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
}) => {
  const cropperRef = useRef<CropperRef>(null);

  // Function to handle crop completion
  const handleCrop = async () => {
    if (cropperRef.current) {
      const croppedImageBlob = await getCroppedImageBlob(cropperRef.current);
      if (croppedImageBlob) {
        const compressedFile = await compressImage(croppedImageBlob);
        onCropComplete(compressedFile || croppedImageBlob); // Pass cropped image blob to the parent component
      }
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalBody className="aspect-square">
          <div className=" flex p-4 aspect-square rounded-md w-full h-full mx-auto align-middle">
            <Cropper
              ref={cropperRef}
              src={imageSrc}
              stencilProps={{ aspectRatio: 1 }} // Square crop
              // onInitialized={(instance: any) => setCropper(instance)} // Initialize cropper instance
              className="cropper"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex flex-auto justify-left gap-2">
            <Button color="primary" onClick={handleCrop}>
              Apply Crop
            </Button>
            <Button color="secondary" variant="light" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ImageCropModal;
