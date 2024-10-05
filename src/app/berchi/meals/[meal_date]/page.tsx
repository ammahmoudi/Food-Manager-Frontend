'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getMealByDate } from "@/app/berchi/services/berchiApi";
import MealDetails from '../../components/MealDetails';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Meal } from '../../interfaces/Meal';
import { toast } from 'react-toastify';

const MealDetailPage = () => {
  const { meal_date } = useParams();
  const [meal, setMeal] = useState<Meal | null>(null);

  const fetchMeal = useCallback(async () => {
    if (meal_date) {
      const fetchMealPromise = getMealByDate(meal_date as string);

      try {
        const fetchedMeal = await toast.promise(fetchMealPromise, {
          pending: 'Fetching meal details...',
          success: 'Meal details loaded successfully!',
          error: 'Failed to fetch meal details. Please try again.',
        });
        setMeal(fetchedMeal);
      } catch (error) {
        console.error('Failed to fetch meal:', error);
      }
    }
  }, [meal_date]);

  useEffect(() => {
    fetchMeal();
  }, [fetchMeal]);

  if (!meal) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoute>
      <MealDetails meal={meal} />
    </ProtectedRoute>
  );
};

export default MealDetailPage;
