import React, { FC, useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  Image,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  useDisclosure,
  ModalHeader,
} from "@nextui-org/react";
import { toast } from "sonner";
import DatasetImage from "../../interfaces/DatasetImage";
import { deleteImageById, getImageById } from "../../services/aiApi";
import { HiOutlineDownload, HiOutlineTrash } from "react-icons/hi";
import { GiDoubleFaceMask } from "react-icons/gi";
import EditFaceModal from "./livePortraitModal";
import { PiTextAlignLeftLight } from "react-icons/pi";
import DatasetImageInfoModal from "./DatasetImageInfoModal";


interface FullScreenModalProps {
    initialImageId: number;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void
}

const FullScreenModal: FC<FullScreenModalProps> = ({initialImageId,isOpen,onClose,onUpdate}) => {
  const {isOpen: isDeleteModalOpen,onOpen: openDeleteModal,onClose: closeDeleteModal,} = useDisclosure();
  const {isOpen: isEditFaceModalOpen,onOpen: openEditFaceModal,onClose: closeEditFaceModal,} = useDisclosure();
  const {isOpen: isImageInfoModalOpen,onOpen: openImageInfoeModal,onClose: closeImageInfoModal,} = useDisclosure();
  const [image, setImage] = useState<DatasetImage>()
  const [loading, setLoading] = useState<boolean>(false)


  const downloadImage = async () => {
    if  (image){
      try {
        const response = await fetch(image?.image);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = "downloaded_image.jpg";
        link.click();
        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Error downloading image:", error);
        toast.error("Failed to download image.");
      }
    }
  };

  const handleDelete = async () => {
    try {
      if(image){
        await deleteImageById(image?.id);
        onUpdate
      }
    } catch (error) {
      console.error(`Error deleting image:`, error);
    } finally {
      closeDeleteModal()
      onClose()

    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
          const fetchedImage = await getImageById(initialImageId);
          setImage(fetchedImage);
      } catch (error) {
        console.error(`Error fetching data for ${initialImageId} with ID ${initialImageId}:`, error);
        toast.error(`Failed to fetch ${initialImageId} data.`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [initialImageId]);


  return (

    <>
    <Modal

      backdrop="blur"
      className="bg-transparent"
      isOpen={isOpen}
      onClose={onClose}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (!target.closest("img") && !target.closest("button")) {
          onClose();
        }
      }}
      size="full"
    >
      <ModalContent>
        <ModalBody className="mx-auto flex justify-center">
          {!loading ?(
            <Image src={image?.image} alt="alt" />
          ):(
            <Spinner></Spinner>
          )}
        </ModalBody>

        <ModalFooter>
          {!loading && (
            <>
              <Button
                isIconOnly
                size="lg"
                className="text-white hover:text-primary bg-transparent shadow-none text-4xl"
                onPress={openEditFaceModal}
              >
                <GiDoubleFaceMask />
              </Button>

              <Button
                isIconOnly
                size="lg"
                className="text-white hover:text-black bg-transparent shadow-none text-4xl"
                onPress={openImageInfoeModal}
              >
                <PiTextAlignLeftLight />
              </Button>

              <Button
                size="lg"
                isIconOnly
                className="text-white hover:text-green-600 bg-transparent shadow-none text-4xl"
                onPress={downloadImage}
              >
                <HiOutlineDownload />
              </Button>

              <Button
                size="lg"
                isIconOnly
                className="text-white hover:text-red-600 bg-transparent shadow-none text-4xl"
                onPress={openDeleteModal}
              >
                <HiOutlineTrash />
              </Button>
            </>
          )}

        </ModalFooter>
      </ModalContent>
    </Modal>

    {image &&
      <EditFaceModal
        image={image}
        isOpen={isEditFaceModalOpen}
        onClose={closeEditFaceModal}
        onDeleteSuccess={closeEditFaceModal}
      />
    }

      <DatasetImageInfoModal
        visible={isImageInfoModalOpen}
        onClose={closeImageInfoModal}
        imageId={initialImageId}
        onDeleteSuccess={closeImageInfoModal}
      />

    <Modal isOpen={isDeleteModalOpen} onOpenChange={closeDeleteModal}>
      <ModalContent>
        <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this image?</p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              color="secondary"
              onClick={closeDeleteModal}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FullScreenModal;
