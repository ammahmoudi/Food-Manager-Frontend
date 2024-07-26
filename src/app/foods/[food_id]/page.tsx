'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getFoodDetails, getFoodComments, getMealsWithFood } from '../../../services/api';
import FoodDetails from '../../../components/FoodDetails';
import { FoodDetailsData } from '../../../interfaces/FoodDetailsData';
import { Comment } from '../../../interfaces/Comment';
import { MealWithFood } from '../../../interfaces/MealWithFood';

const FoodDetailPage = () => {
  const { food_id } = useParams();
  const [food, setFood] = useState<FoodDetailsData | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [meals, setMeals] = useState<MealWithFood[]>([]);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      if (food_id) {
        try {
          const fetchedFood = await getFoodDetails(parseInt(food_id as string));
          setFood({
            id: fetchedFood.id,
            imageUrl: fetchedFood.picture,
            title: fetchedFood.name,
            description: fetchedFood.description,
            rating: 0, // will calculate later
            datePosted: '', // populate if needed
            comments: [],
            meals: [],
          });
        } catch (error) {
          console.error('Failed to fetch food details:', error);
        }
      }
    };

    fetchFoodDetails();
  }, [food_id]);

  useEffect(() => {
    const fetchComments = async () => {
      if (food_id) {
        try {
          const fetchedComments = await getFoodComments(parseInt(food_id as string));
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

  useEffect(() => {
    if (food && meals.length > 0) {
      const averageRating = meals.reduce((acc, meal) => acc + meal.rating, 0) / meals.length;
      setFood({ ...food, rating: averageRating });
    }
  }, [meals]);

  if (!food) {
    return <div>Loading...</div>;
  }

  return <FoodDetails data={{ ...food, comments, meals }} />;
};

export default FoodDetailPage;
