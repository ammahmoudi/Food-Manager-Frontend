'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getFoodDetails, getFoodComments, getMealsWithFood } from '../../../services/api';
import FoodDetails from '../../../components/FoodDetails';
import { FoodDetailsData } from '../../../interfaces/FoodDetailsData';
import { Comment } from '../../../interfaces/Comment';
import { MealWithFood } from '../../../interfaces/MealWithFood';
import { Food } from '@/interfaces/Food';
import { Meal } from '@/interfaces/Meal';

const FoodDetailPage = () => {
  const { food_id } = useParams();
  const [food, setFood] = useState<Food>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    const fetchFood = async () => {
      if (food_id) {
        try {
          const fetchedFood = await getFoodDetails(parseInt(food_id as string));
          setFood(fetchedFood);
        } catch (error) {
          console.error('Failed to fetch food details:', error);
        }
      }
    };

    fetchFood();
  }, [food_id]);

  useEffect(() => {
    const fetchComments = async () => {
      if (food_id) {
        try {
          const fetchedComments = await getFoodComments(parseInt(food_id as string));
          setComments(fetchedComments);
        } catch (error) {
          console.error('Failed to fetch comments:', error);
        }
      }
    };

    fetchComments();
  }, [food_id]);

  useEffect(() => {
    const fetchMealsWithFood = async () => {
      if (food_id) {
        try {
          const fetchedMeals = await getMealsWithFood(parseInt(food_id as string));
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
