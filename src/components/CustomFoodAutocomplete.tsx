'use client';

import React, { FC, useState, useEffect } from 'react';
import { Autocomplete, AutocompleteItem, Avatar, Button, useDisclosure } from '@nextui-org/react';
import { getFoods,addFood } from '../services/api';
import { Food } from '../interfaces/Food';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface CustomFoodAutocompleteProps {
  selectedFood: Food | null;
  onFoodSelect: (food: Food | null) => void;
}

const CustomFoodAutocomplete: FC<CustomFoodAutocompleteProps> = ({ selectedFood, onFoodSelect }) => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await getFoods();
        setFoods(response);
        console.log('Fetched foods:', response);
      } catch (error) {
        console.error('Failed to fetch foods:', error);
      }
    };

    fetchFoods();
  }, []);

  const handleAddNewFood = async () => {
    if (inputValue) {
      try {
        const newFood = await addFood({ name: inputValue, description: '', picture: '' });
        setFoods([...foods, newFood]);
        onFoodSelect(newFood);
        setInputValue('');
      } catch (error) {
        console.error('Failed to add new food:', error);
      }
    }
  };

  return (
    <Autocomplete
      classNames={{
        listboxWrapper: "max-h-[320px]",
        selectorButton: "text-default-500",
      }}
      className='w-full'
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
          inputWrapper: "h-[48px]",
        },
      }}
      listboxProps={{
        hideSelectedIcon: false,
        emptyContent: 'Your own empty content text.',


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
      startContent={<MagnifyingGlassIcon className="text-default-400 size-6" strokeWidth={2.5}  />}
      radius="full"
      variant="bordered"
    >
      {(item) => (
        <AutocompleteItem key={item.id} textValue={item.name}>
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Avatar alt={item.name} className="flex-shrink-0" size="sm" src={item.picture} />
              <div className="flex flex-col">
                <span className="text-small">{item.name}</span>
                <span className="text-tiny text-default-400 overflw-hiddein truncate">{item.description}</span>
              </div>
            </div>
            
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
};

export default CustomFoodAutocomplete;
