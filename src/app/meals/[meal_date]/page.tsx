'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {  getMealByDate, getMealComments } from '../../../services/api';
import MealDetails from '../../../components/MealDetails';
import { MealDetailsData } from '../../../interfaces/MealDetailsData';
import { Comment } from '../../../interfaces/Comment';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Meal } from '@/interfaces/Meal';

const MealDetailPage = () => {
  const { meal_date } = useParams();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const fetchMeal =useCallback( async () => {
    if (meal_date) {
      try {
        const fetchedMeal = await getMealByDate(meal_date as string);
        setMeal(fetchedMeal);
      } catch (error) {
        console.error('Failed to fetch meal:', error);
      }
    }
  },[meal_date]);


  useEffect(() => {
    fetchMeal();
  }, [fetchMeal]);

  if (!meal) {
    return <div>Loading...</div>;
  }

  return <ProtectedRoute><MealDetails meal={meal} /></ProtectedRoute>;
};

export default MealDetailPage;
