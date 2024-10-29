"use client";

import {  useState } from "react";
import { Card, CardFooter, Image, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, Input, ModalFooter } from "@nextui-org/react";

import { toast } from "sonner";
import { deleteCharacter, getCharacter, renameCharacter } from "../services/aiApi";
import Character from '../interfaces/Character';
import { MdDriveFileRenameOutline } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";

interface CharacterCardProps {
  initialCharacter: Character | null;
  onUpdate: () => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ initialCharacter, onUpdate }) => {
  const [character, setCharacter] = useState<Character | null>(initialCharacter);
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onOpenChange: onOpenChangeDelete } = useDisclosure();
  const { isOpen: isOpenRename, onOpen: onOpenRename, onOpenChange: onOpenChangeRename } = useDisclosure();
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCharacter = async () => {
    
    try {
      const response = await getCharacter(character!.id);
      console.log(response)
      setCharacter(response)

    } catch {
      toast.error("Failed to delete dataset.");
    } finally {
      setIsDeleting(false);
    }
  };



  // Handle renaming the Character
  const handleRenameCharacter = async () => {
    setIsRenaming(true);
    try {
      const response = await renameCharacter(character!.id, character!.name);
      if (response) {
        console.log(response)
        setCharacter(response);
        fetchCharacter()
        toast.success("Dataset renamed successfully!");
      }
      onOpenChangeRename();
    } catch {
      toast.error("Failed to rename dataset.");
    } finally {
      setIsRenaming(false);
    }
  };

  // Handle deleting the Character
  const handleDeleteCharacter = async () => {
    setIsDeleting(true);
    try {
      await deleteCharacter(character!.id);
      setCharacter(null);
      toast.success("Dataset deleted successfully!");
      onOpenChangeDelete();
      onUpdate()
    } catch {
      toast.error("Failed to delete dataset.");
    } finally {
      setIsDeleting(false);
    }
  };


  return (
    <div>
      {character ? (
        <Card
          key={character.id}
          isFooterBlurred
          radius="lg"
          className="border-none"
        >
          <Image
            alt={character.name}
            className="object-cover"
            height={300}
            src={character.image}
            width={200}
          />
          <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
            <p className="text-tiny text-white/80">{character.name}</p>
            <Dropdown backdrop="blur" shouldBlockScroll>
              <DropdownTrigger>
                <Button
                  className="text-tiny text-white/80 bg-black/20  overflow-visible rounded-full  after:content-[''] after:absolute after:rounded-full after:inset-0 after:bg-background/40 after:z-[-1] after:transition after:!duration-500 hover:after:scale-150 hover:after:opacity-0"
                  variant="flat"
                  color="default"
                  radius="lg"
                  size="sm"
                  >
                    Edit Character
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
                  Rename character
                </DropdownItem>
                <DropdownItem
                  onClick={onOpenDelete}
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={<FaRegTrashAlt />}
                >
                  Delete character
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </CardFooter>
        </Card>
      ) : (
        <h1>error showing the character</h1>
      )}


      {character && (
      <Modal isOpen={isOpenRename} onOpenChange={onOpenChangeRename} backdrop="blur">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Rename Dataset
              </ModalHeader>
              <ModalBody>
                <Input
                  label="New Character Name"
                  value={character.name}
                  onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                  fullWidth
                  required
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onOpenChangeRename}>
                  Close
                </Button>
                <Button
                  onPress={handleRenameCharacter}
                  color="success"
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
      )}


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
                  onPress={handleDeleteCharacter}
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
    </div>
  );
};

export default CharacterCard;





