'use client';

import React, { FC, useState, useEffect } from 'react';
import { Autocomplete, AutocompleteItem, Avatar, Button, Link, useDisclosure, Modal, ModalBody, ModalFooter, ModalHeader, ModalContent } from '@nextui-org/react';
import { getFoods, addFood } from '../services/api';
import { Food } from '../interfaces/Food';
import { MagnifyingGlassIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import FoodForm from './FoodForm';

interface CustomFoodAutocompleteProps {
  selectedFood: Food | null;
  onFoodSelect: (food: Food | null) => void;
}

const CustomFoodAutocomplete: FC<CustomFoodAutocompleteProps> = ({ selectedFood, onFoodSelect }) => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
  const fetchFoods = async () => {
    try {
      const response = await getFoods();
      setFoods(response);
      console.log('Fetched foods:', response);
    } catch (error) {
      console.error('Failed to fetch foods:', error);
    }
  };
  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  const handleAddNewFood = async (food: Food) => {
    try {
      const newFood = await addFood({ name: food.name, description: food.description, picture: food.picture });
      // setFoods([...foods, newFood]);
      fetchFoods();
      onFoodSelect(newFood);
      closeModal();
    } catch (error) {
      console.error('Failed to add new food:', error);
    }
  };

  const handleFoodDelete = (foodId: number) => {
    setFoods(foods.filter(food => food.id !== foodId));
    onFoodSelect(null);
  };

  return (
    <div className="justify-between flex gap-2">
      <Autocomplete
        classNames={{
          listboxWrapper: "max-h-[320px]",
          selectorButton: "text-default-500",
        }}
        className=""
        variant="flat"
        defaultItems={foods}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSelectionChange={(key) => {
          if (key !== null) {
            const selected = foods.find((food) => food.id === +key);
            onFoodSelect(selected || null);
          }
        }}
        inputProps={{
          classNames: {
            input: "ml-1",
            inputWrapper: "h-full",
          },
        }}
        listboxProps={{
          hideSelectedIcon: false,
          emptyContent: (
            <Link>
              <PlusCircleIcon className="size-6"></PlusCircleIcon>Add This Food
            </Link>
          ),
          itemClasses: {
            base: [
              "rounded-medium",
              "text-default-500",
              "transition-opacity",
              "data-[hover=true]:text-foreground",
              "dark:data-[hover=true]:bg-default-50",
              "data-[pressed=true]:opacity-70",
              "data-[hover=true]:bg-default-200",
              "data-[selectable=true]:focus:bg-default-100",
              "data-[focus-visible=true]:ring-default-500",
            ],
          },
        }}
        aria-label="Select a food"
        placeholder="Enter food name"
        popoverProps={{
          offset: 10,
          classNames: {
            base: "rounded-large",
            content: "p-1 border-small border-default-100 bg-background",
          },
        }}
        startContent={<MagnifyingGlassIcon className="text-default-400 size-6" strokeWidth={2.5} />}
        radius="lg"
      >
        {(item) => (
          <AutocompleteItem key={item.id} textValue={item.name}>
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Avatar alt={item.name} className="flex-shrink-0" size="sm" src={item.picture} />
                <div className="flex flex-col">
                  <span className="text-small">{item.name}</span>
                  <span className="text-tiny text-default-400 overflow-hidden truncate">{item.description}</span>
                </div>
              </div>
            </div>
          </AutocompleteItem>
        )}
      </Autocomplete>
      <Button isIconOnly color="success" className="h-full w-auto aspect-square" onPress={openModal}>
        <PlusIcon className="text-white size-6"></PlusIcon>
      </Button>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalContent>
          <ModalHeader>Add New Food</ModalHeader>
          <ModalBody>
            <FoodForm
              initialData={null}
              isEditMode={false}
              onSave={handleAddNewFood}
              onDelete={handleFoodDelete}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={closeModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CustomFoodAutocomplete;
