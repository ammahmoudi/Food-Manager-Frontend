'use client';

import { FC, useState, ChangeEvent } from 'react';
import { Input, Button, Card, CardFooter, Image, useDisclosure, Modal, ModalBody, ModalFooter, ModalHeader, ModalContent } from '@nextui-org/react';
import { Food } from '../interfaces/Food';
import { FoodFormData } from '../interfaces/FoodFormData';
import { addFood, updateFood, deleteFood } from '../services/api';
import { TrashIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import ImageCropModal from './ImageCropModal'; // Import ImageCropModal

interface FoodFormProps {
  initialData: Food | null;
  isEditMode: boolean;
  onSave: (food: Food) => void;
  onDelete: (foodId: number) => void;
}

const FoodForm: FC<FoodFormProps> = ({ initialData = null, isEditMode, onSave, onDelete }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [image, setImage] = useState<File | string | null>(initialData?.image || null);

  const { isOpen: isDeleteModalOpen, onOpen: openDeleteModal, onClose: closeDeleteModal } = useDisclosure();
  const { isOpen: isCropModalOpen, onOpen: openCropModal, onClose: closeCropModal } = useDisclosure();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl); // Temporarily set image URL to show a preview
      openCropModal(); // Open the crop modal after selecting the image
    }
  };

  const handleCropComplete = (croppedImage: File) => {
    
    setImage(croppedImage); // Set the cropped image as the selected image
    closeCropModal();
  };

  const handleDeleteImage = () => {
    setImage(null);
  };

  const handleSave = async () => {
    const foodData: FoodFormData = {
      name,
      description,
      image
    };
    const saveFoodPromise = isEditMode && initialData
      ? updateFood(initialData.id, foodData)
      : addFood(foodData);

    try {
      const savedFood = await toast.promise(
        saveFoodPromise,
        {
          pending: isEditMode ? 'Updating food...' : 'Creating food...',
          success: isEditMode ? 'Food updated successfully!' : 'Food created successfully!',
          error: 'Failed to save food.',
        }
      );
      onSave(savedFood);
    } catch (error) {
      console.error('Failed to save food:', error);
    }
  };

  const handleDeleteFood = async () => {
    if (initialData) {
      const deleteFoodPromise = deleteFood(initialData.id);
      try {
        await toast.promise(
          deleteFoodPromise,
          {
            pending: 'Deleting food...',
            success: 'Food deleted successfully!',
            error: 'Failed to delete food.',
          }
        );
        onDelete(initialData.id);
        closeDeleteModal();
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
          {image ? (
            <>
              <Image
                alt="Food Image"
                className="z-0 w-full h-full object-cover"
                classNames={{ wrapper: "w-full h-full aspect-square " }}
                src={image instanceof File ? URL.createObjectURL(image as File) : image}
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
        isRequired
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        label="Description"
        placeholder="Enter food description"
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="flex justify-left gap-2">
        <Button
          isDisabled={name === "" || (isEditMode && (name === initialData?.name && description === initialData.description && image === initialData.image))}
          color="primary"
          onPress={handleSave}
        >
          {isEditMode ? 'Update Food' : 'Create Food'}
        </Button>
        {isEditMode && (
          <Button color="danger" variant="light" onClick={openDeleteModal}>
            Delete Food
          </Button>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <ModalContent>
          <ModalHeader>Delete Food</ModalHeader>
          <ModalBody>Are you sure you want to delete this food item?</ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={handleDeleteFood}>
              Delete
            </Button>
            <Button variant="light" onClick={closeDeleteModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Image Crop Modal */}
      <ImageCropModal
        isOpen={isCropModalOpen}
        onClose={closeCropModal}
        imageSrc={image as string} // Send the image URL to the crop modal
        onCropComplete={handleCropComplete}
      />
    </div>
  );
};

export default FoodForm;
