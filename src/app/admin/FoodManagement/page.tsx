'use client';

import { useState } from 'react';
import { Button } from '@nextui-org/react';
import { Food } from '@/interfaces/Food';
import FoodModal from '@/components/FoodModal';
import { getFoods, addFood, updateFood, deleteFood } from "@/app/berchi/services/berchiApi";

const FoodManagement = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchFoods = async () => {
    const fetchedFoods = await getFoods();
    setFoods(fetchedFoods);
  };

  const handleAddClick = () => {
    setSelectedFood(null);
    setIsEditMode(false);
    setIsModalVisible(true);
  };

  const handleEditClick = (food: Food) => {
    setSelectedFood(food);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const handleSave = async (food: Food) => {
    if (isEditMode) {
      await updateFood(food.id, food);
    } else {
      await addFood(food);
    }
    fetchFoods();
  };

  const handleDelete = async (foodId: number) => {
    await deleteFood(foodId);
    fetchFoods();
  };

  return (
    <div>
      <Button onClick={handleAddClick}>Add New Food</Button>
      <div>
        {foods.map((food) => (
          <div key={food.id}>
            <p>{food.name}</p>
            <Button onClick={() => handleEditClick(food)}>Edit</Button>
          </div>
        ))}
      </div>

      {isModalVisible && (
        <FoodModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          initialData={selectedFood}
          isEditMode={isEditMode}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default FoodManagement;
