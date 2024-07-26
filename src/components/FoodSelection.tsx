import { FC, Key, useEffect, useState } from 'react';
import { Autocomplete, AutocompleteItem } from '@nextui-org/react';
import api, { getFoods } from '../services/api';
import { Food } from '../interfaces/Food';

interface FoodSelectionProps {
  selectedFood: Food | null;
  onFoodSelect: (food: Food) => void;
}

const FoodSelection: FC<FoodSelectionProps> = ({ selectedFood, onFoodSelect }) => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await getFoods();
        setFoods(response);
      } catch (error) {
        console.error('Failed to fetch foods:', error);
      }
    };

    fetchFoods();
  }, []);

  const handleFoodSelect = (key: Key | null) => {
    const food = foods.find(food => food.id === key);
    if (food) {
      onFoodSelect(food);
    }
  };

  return (
    <Autocomplete
          label="Select Food"
        children={foods.map(food => (
            <AutocompleteItem key={food.id} value={food.name}>
                {food.name}
            </AutocompleteItem>
        ))}
          inputValue={selectedFood ? selectedFood.name : inputValue}
          onInputChange={(value) => setInputValue(value)}
          onSelectionChange={handleFoodSelect}    />
  );
};

export default FoodSelection;
