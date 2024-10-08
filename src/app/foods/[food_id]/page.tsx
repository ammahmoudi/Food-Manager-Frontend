'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getFoodDetails, getMealsWithFood } from '../../../services/api';
import FoodDetails from '../../../components/FoodDetails';
import { Meal } from '../../../interfaces/Meal';
import { Food } from '@/interfaces/Food';
import { toast } from 'react-toastify';

const FoodDetailPage = () => {
  const { food_id } = useParams();
  const [food, setFood] = useState<Food>();
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    const fetchFood = async () => {
      if (food_id) {
        const fetchFoodPromise = getFoodDetails(parseInt(food_id as string));

        try {
          const fetchedFood = await toast.promise(
            fetchFoodPromise,
            {
              pending: 'Loading food details...',
              success: 'Food details loaded successfully!',
              error: 'Failed to load food details.',
            }
          );
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
          const fetchedMeals = await toast.promise(
            fetchMealsPromise,
            {
              pending: 'Loading meals...',
              success: 'Meals loaded successfully!',
              error: 'Failed to load meals.',
            }
          );
          setMeals(fetchedMeals);
        } catch (error) {
          console.error('Failed to fetch meals with food:', error);
        }
      }
    };

    fetchMealsWithFood();
  }, [food_id]);

  if (!food) {
    return <div>Loading...</div>;
  }

  return <FoodDetails food={food} meals={meals} />;
};

export default FoodDetailPage;
