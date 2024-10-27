import React, { useState } from "react";
import Dataset from "../interfaces/Dataset";
import ImageComponent from "./ImageComponent";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  Link,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "sonner"; // Assuming toast notifications are handled with sonner
import { renameDatasetByID, deleteDatasetById } from "../services/aiApi"; // Assuming you have these API methods implemented

interface DatasetAlbumProps {
  initialDataset: Dataset | null;
  onUpdate: () => void;
}

const DatasetAlbum: React.FC<DatasetAlbumProps> = ({ initialDataset, onUpdate  }) => {
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onOpenChange: onOpenChangeDelete } = useDisclosure();
  const { isOpen: isOpenRename, onOpen: onOpenRename, onOpenChange: onOpenChangeRename } = useDisclosure();
  const [dataset, setDataset] = useState<Dataset | null>(initialDataset);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle renaming the dataset
  const handleRenameDataset = async () => {
    setIsRenaming(true);
    try {
      const response = await renameDatasetByID(dataset!.id, dataset!.name); // Use non-null assertion (dataset!) after the check
      if (response) {
        setDataset(response);
        toast.success("Dataset renamed successfully!");
      }
      onOpenChangeRename(); // Close modal
    } catch {
      toast.error("Failed to rename dataset.");
    } finally {
      setIsRenaming(false);
    }
  };

  // Handle deleting the dataset
  const handleDeleteDataset = async () => {
    setIsDeleting(true);
    try {
      await deleteDatasetById(dataset!.id);
      setDataset(null);
      toast.success("Dataset deleted successfully!");
      onOpenChangeDelete();
      onUpdate()
    } catch {
      toast.error("Failed to delete dataset.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Conditional check for null dataset
  if (!dataset) {
    return <p className="text-center text-lg">No dataset</p>; // Display this when dataset is null
  }

  return (
    <>
      <Card
        isBlurred
        className="border-none bg-background/60 dark:bg-default-100/50"
        shadow="sm"
      >
        <CardHeader className="flex flex-row flex-grow justify-between">
          <div className="flex flex-col gap-1">
            <Link href={`/humaani/datasets/${dataset.id}`}>
              <p className="text-md text-black font-bold">
                {dataset.name} (ID: {dataset.id})
              </p>
            </Link>
            <div className="px-3 py-0 text-small">
              <p className="text-sm mb-4">
                Created At: {new Date(dataset.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          <Dropdown backdrop="blur" shouldBlockScroll>
            <DropdownTrigger>
              <Button isIconOnly variant="light" size="lg">
                <HiDotsVertical />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                onClick={onOpenRename}
                key="rename"
                className="text-success"
                color="success"
                startContent={<MdDriveFileRenameOutline />}
              >
                Rename dataset
              </DropdownItem>
              <DropdownItem
                onClick={onOpenDelete}
                key="delete"
                className="text-danger"
                color="danger"
                startContent={<FaRegTrashAlt />}
              >
                Delete dataset
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {dataset.images && dataset.images.length > 0 ? (
              dataset.images.map((imageId) => (
                <div key={imageId} className="w-40 h-40">
                  <ImageComponent src_id={imageId} src_variant="datasetImage" />
                </div>
              ))
            ) : dataset.jobs && dataset.jobs.length > 0 ? (
              dataset.jobs.map((jobId) => (
                <ImageComponent
                  className="w-40 h-40"
                  key={jobId}
                  src_id={jobId}
                  src_variant="job"
                />
              ))
            ) : (
              <p>No images or jobs available in this dataset.</p>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Rename Dataset Modal */}
      <Modal isOpen={isOpenRename} onOpenChange={onOpenChangeRename} backdrop="blur">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Rename Dataset
              </ModalHeader>
              <ModalBody>
                <Input
                  label="New Dataset Name"
                  value={dataset.name}
                  onChange={(e) => setDataset({ ...dataset, name: e.target.value })}
                  fullWidth
                  required
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onOpenChangeRename}>
                  Close
                </Button>
                <Button
                  color="success"
                  onPress={handleRenameDataset}
                  isDisabled={isRenaming}
                  isLoading={isRenaming}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Dataset Modal */}
      <Modal isOpen={isOpenDelete} onOpenChange={onOpenChangeDelete} backdrop="blur">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you sure you want to delete this dataset?
              </ModalHeader>
              <ModalBody></ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onOpenChangeDelete}>
                  Close
                </Button>
                <Button
                  color="danger"
                  onPress={handleDeleteDataset}
                  isDisabled={isDeleting}
                  isLoading={isDeleting}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DatasetAlbum;
