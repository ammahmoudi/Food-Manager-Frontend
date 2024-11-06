import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
} from "@nextui-org/react";
import { toast } from "sonner";
import DatasetImage from "../../interfaces/DatasetImage";
import { getImageById } from "../../services/aiApi";
import EditFaceComponent from "../editFace";

interface EditFaceModalProps {
  image_id: number;
  isOpen: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
}

const EditFaceModal: React.FC<EditFaceModalProps> = ({
  image_id,
  isOpen,
  onClose
}) => {
  const [image, setImage] = useState<DatasetImage | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const fetchedImage = await getImageById(image_id);
        setImage(fetchedImage);
      } catch (error) {
        console.error("Error fetching image:", error);
        toast.error("Failed to load image.");
      }
    };

    if (isOpen) {
      fetchImage();
    }
  }, [image_id, isOpen]);


  return (
    <div className="">
    <Modal isOpen={isOpen} backdrop="blur" onClose={onClose} size="5xl">
      <ModalContent>
      {image ? (
            <EditFaceComponent initialImage={image} onClose={onClose}/>
          ) : (
            <p>Loading image data...</p>
          )}
      </ModalContent>
    </Modal>
    </div>
  );
};

export default EditFaceModal;
