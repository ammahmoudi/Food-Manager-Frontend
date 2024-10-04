'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getFoodDetails, getMealsWithFood } from "@/app/berchi/services/berchiApi";
import { Meal } from '../../interfaces/Meal';
import { Food } from '../../interfaces/Food';
import FoodDetails from '../../components/FoodDetails';
import { toast } from 'sonner';
import { Spinner } from '@nextui-org/react';

const FoodDetailPage = () => {
  const { food_id } = useParams();
  const [food, setFood] = useState<Food>();
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    const fetchFood = async () => {
      if (food_id) {
        const fetchFoodPromise = getFoodDetails(parseInt(food_id as string));

        try {
          toast.promise(
            fetchFoodPromise,
            {
              // loading: 'Loading food details...',
              // success: 'Food details loaded successfully!',
              error: 'Failed to load food details.',
            }
          );
          const fetchedFood = await fetchFoodPromise;
          setFood(fetchedFood);
        } catch (error) {
          console.error('Failed to fetch food details:', error);
        }
      }
    };

    fetchFood();
  }, [food_id]);


  useEffect(() => {
    const fetchMealsWithFood = async () => {
      if (food_id) {
        const fetchMealsPromise = getMealsWithFood(parseInt(food_id as string));

        try {
          toast.promise(
            fetchMealsPromise,
            {
              // loading: 'Loading meals...',
              // success: 'Meals loaded successfully!',
              error: 'Failed to load meals.',
            }
          );
          const fetchedMeals = await fetchMealsPromise;
          setMeals(fetchedMeals);
        } catch (error) {
          console.error('Failed to fetch meals with food:', error);
        }
      }
    };

    fetchMealsWithFood();
  }, [food_id]);

  if (!food) {
    return 		<div className="flex items-center justify-center h-screen w-screen">
    <Spinner size="lg" />
  </div>;
  }

  return <FoodDetails food={food} meals={meals} />;
};

export default FoodDetailPage;
