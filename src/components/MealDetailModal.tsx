'use client';

import { FC, useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { updateMeal, createMeal, getMealByDate, getMealComments } from '../services/api';
import { useRouter } from 'next/navigation';
import MealDetails from './MealDetails';
import { MealDetailsData } from '../interfaces/MealDetailsData';
import { Comment } from '../interfaces/Comment';
import FoodSelection from './FoodSelection';
import { Food } from '../interfaces/Food';
import { formatDateToYYYYMMDD } from '@/utils/dateUtils';
import MealForm from './MealForm';
import { CreateMealData } from '../interfaces/CreateMealData';

interface MealDetailModalProps {
  visible: boolean;
  onClose: () => void;
  date: Date;
  isAdmin: boolean;
}

const MealDetailModal: FC<MealDetailModalProps> = ({ visible, onClose, date, isAdmin }) => {
  const [meal, setMeal] = useState<MealDetailsData | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log(isAdmin)
    const fetchMeal = async () => {
      if (date) {
        try {
          const fetchedMeal = await getMealByDate((formatDateToYYYYMMDD(date)));
          setMeal({
            ...fetchedMeal,
            foodId: fetchedMeal.food.id,
            imageUrl: fetchedMeal.food.picture,
            title: fetchedMeal.food.name,
            description: fetchedMeal.food.description,
            datePosted: date,
            rating: fetchedMeal.rating,
            comments: [],
          });
          setSelectedFood(fetchedMeal.food);
          console.log(fetchedMeal) 
        } catch (error) {
          console.error('Failed to fetch meal:', error);
        }
      }
      console.log(date)
      console.log('meal',meal)
      
    };


    if (visible) {
      fetchMeal();
    }
  }, [date, visible]);

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

    if (meal) {
      fetchComments();
    }
  }, [meal]);

  const handleSave = async (food: Food) => {
    try {
      if (meal) {
        await updateMeal(meal.id, { ...meal, food: food.id });
      } else {
        const newMeal:CreateMealData= {food_id:food.id,date:formatDateToYYYYMMDD(date)}
        await createMeal(newMeal);
      }
      router.refresh();
      setSelectedFood(null);
      onClose();
    } catch (error) {
      console.error('Failed to save meal:', error);
    }
  };

  const mealDetailsData = meal
    ? {
        ...meal,
        comments,
      }
    : null;

  return (
    <Modal isOpen={visible} size='sm' scrollBehavior='inside' onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <p>{meal ? 'Meal Details' : 'Add New Meal'}</p>
        </ModalHeader>
        <ModalBody>
          {meal ? (
            mealDetailsData && <MealDetails data={mealDetailsData} />
          ) : (
            isAdmin && (
              <MealForm  date={date} onSave={handleSave} />
            )
          )}
        </ModalBody>
        {isAdmin && meal && (
          <ModalFooter>
            <Button color="primary" onPress={() => selectedFood &&  handleSave(selectedFood)}>
              Update Meal
            </Button>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export default MealDetailModal;
