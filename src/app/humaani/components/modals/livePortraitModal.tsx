
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import DatasetImage from "../../interfaces/DatasetImage";
import EditFaceComponent from "../editFace";

interface EditFaceModalProps {
  image: DatasetImage;
  isOpen: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
}

const EditFaceModal: React.FC<EditFaceModalProps> = ({
  image,
  isOpen,
  onClose
}) => {



  return (

    <Modal isOpen={isOpen} backdrop="blur" onClose={onClose} size="5xl">
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalBody>
      {image ? (
            <EditFaceComponent initialImage={image} onClose={onClose}/>
          ) : (
            <p>Loading image data...</p>
          )}
          </ModalBody>
      </ModalContent>
    </Modal>

  );
};

export default EditFaceModal;
