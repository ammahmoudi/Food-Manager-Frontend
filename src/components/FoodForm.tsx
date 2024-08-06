'use client';

import { FC, useState, ChangeEvent } from 'react';
import { Input, Button, Card, CardFooter, Image, useDisclosure, Modal, ModalBody, ModalFooter, ModalHeader, ModalContent } from '@nextui-org/react';
import { Food } from '../interfaces/Food';
import { FoodFormData } from '../interfaces/FoodFormData';
import { addFood, updateFood, deleteFood } from '../services/api';
import { TrashIcon } from '@heroicons/react/24/solid';

interface FoodFormProps {
  initialData?: Food | null;
  isEditMode: boolean;
  onSave: (food: Food) => void;
  onDelete: (foodId: number) => void;
}

const FoodForm: FC<FoodFormProps> = ({ initialData = null, isEditMode, onSave, onDelete }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(initialData?.picture || '');

  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
    setImageUrl('');
  };

  const handleSave = async () => {
    try {
      const foodData: FoodFormData = {
        name,
        description,
        picture: image ? image : imageUrl,
      };

      let savedFood: Food;
      if (isEditMode && initialData) {
        savedFood = await updateFood(initialData.id, foodData);
      } else {
        savedFood = await addFood(foodData);
      }
      onSave(savedFood);
    } catch (error) {
      console.error('Failed to save food:', error);
    }
  };

  const handleDeleteFood = async () => {
    if (initialData) {
      try {
        await deleteFood(initialData.id);
        onDelete(initialData.id);
        closeModal();
      } catch (error) {
        console.error('Failed to delete food:', error);
      }
    }
  };

  return (
    <div className="food-form space-y-4">
      <div>
        <Card
          isPressable
          onClick={() => document.getElementById('food-image-input')?.click()}
          className="w-full aspect-square"
        >
          {imageUrl ? (
            <>
              <Image
                removeWrapper
                alt="Food Image"
                className="z-0 w-full h-full object-cover"
                src={imageUrl}
              />
              <CardFooter className="absolute bottom-0 z-10">
                <div className="flex items-center">
                  <div className="flex flex-col">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage();
                      }}
                      radius="full"
                      size="sm"
                      className="w-full h-full aspect-square bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full bg-gray-200">
              <p className="text-gray-500">Click to upload an image</p>
            </div>
          )}
        </Card>
        <input
          type="file"
          id="food-image-input"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
          title="Food Image"
          placeholder="Select an image"
        />
      </div>
      <Input
        label="Name"
        placeholder="Enter food name"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        label="Description"
        placeholder="Enter food description"
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="flex space-x-4">
        <Button color="primary" variant='ghost' onClick={handleSave}>
          {isEditMode ? 'Update Food' : 'Create Food'}
        </Button>
        {isEditMode && (
          <Button color="danger" variant="light" onClick={openModal}>
            Delete Food
          </Button>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalContent>
          <ModalHeader>Delete Food</ModalHeader>
          <ModalBody>Are you sure you want to delete this food item?</ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={handleDeleteFood}>
              Delete
            </Button>
            <Button variant="light" onClick={closeModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FoodForm;
