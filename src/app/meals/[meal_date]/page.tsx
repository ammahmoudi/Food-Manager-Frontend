'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getMealByDate, getMealComments } from '../../../services/api';
import MealDetails from '../../../components/MealDetails';
import { MealDetailsData } from '../../../interfaces/MealDetailsData';
import { Comment } from '../../../interfaces/Comment';

const MealDetailPage = () => {
  const { meal_date } = useParams();
  const [meal, setMeal] = useState<MealDetailsData | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchMeal = async () => {
      if (meal_date) {
        try {
          const fetchedMeal = await getMealByDate(meal_date as string);
          setMeal({
            ...fetchedMeal,
            foodId: fetchedMeal.food.id,
            imageUrl: fetchedMeal.food.picture,
            title: fetchedMeal.food.name,
            description: fetchedMeal.food.description,
            datePosted: meal_date as string,
            rating: fetchedMeal.rating,
            comments: [],
          });
        } catch (error) {
          console.error('Failed to fetch meal:', error);
        }
      }
    };

    fetchMeal();
  }, [meal_date]);

  useEffect(() => {
    const fetchComments = async () => {
      if (meal) {
        try {
          const fetchedComments = await getMealComments(meal.id);
          setComments(fetchedComments.map((comment: any) => ({
            avatarUrl: comment.user.user_image,
            name: comment.user.name,
            date: comment.date,
            text: comment.text,
          })));
        } catch (error) {
          console.error('Failed to fetch comments:', error);
        }
      }
    };

    fetchComments();
  }, [meal]);

  if (!meal) {
    return <div>Loading...</div>;
  }

  return <MealDetails data={{ ...meal, comments }} />;
};

export default MealDetailPage;
