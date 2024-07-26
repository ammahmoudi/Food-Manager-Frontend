'use client';

import { useEffect, useState } from 'react';
import { useParams,useRouter } from 'next/navigation';
import { Button, Input, Textarea } from '@nextui-org/react';
import  { updateMeal,getMealById } from '../../../../services/api';
import { Meal } from '../../../../interfaces/Meal';
import FoodSelection from '../../../../components/FoodSelection';
import { Food } from '../../../../interfaces/Food';

const EditMealPage = () => {
  const { id } = useParams();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [date, setDate] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const router = useRouter();



  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const fetchedMeal = await getMealById(parseInt(id as string));
        setMeal(fetchedMeal);
        setSelectedFood(fetchedMeal.food);
        setDate(fetchedMeal.date);
        setRating(fetchedMeal.rating);
      } catch (error) {
        console.error('Failed to fetch meal:', error);
      }
    };

    fetchMeal();
  }, [id]);

  const handleSave = async () => {
    if (meal && selectedFood) {
      try {
        const updatedMeal = {
          ...meal,
          date,
          rating,
          food: selectedFood.id
        };
        await updateMeal(meal.id, updatedMeal);
        router.push('/meals');
      } catch (error) {
        console.error('Failed to update meal:', error);
      }
    }
  };

  if (!meal) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:px-6 lg:py-16">
      <h1 className="text-3xl font-bold mb-6">Edit Meal</h1>
      <div className="space-y-6">
        <Input
          label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <FoodSelection
          selectedFood={selectedFood}
          onFoodSelect={setSelectedFood}
        />
    
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
};

export default EditMealPage;

