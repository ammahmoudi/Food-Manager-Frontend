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

interface MealDetailModalProps {
  visible: boolean;
  onClose: () => void;
  date: string;
  isAdmin: boolean;
}

const MealDetailModal: FC<MealDetailModalProps> = ({ visible, onClose, date, isAdmin }) => {
  const [meal, setMeal] = useState<MealDetailsData | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMeal = async () => {
      if (date) {
        try {
          const fetchedMeal = await getMealByDate(date);
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

  const handleSave = async () => {
    if (selectedFood) {
      try {
        if (meal) {
          await updateMeal(meal.id, { ...meal, food: selectedFood.id });
        } else {
          await createMeal({ date, food: selectedFood.id, rating: 0 });
        }
        router.refresh();
        setSelectedFood(null);
        onClose();
      } catch (error) {
        console.error('Failed to save meal:', error);
      }
    }
  };

  const mealDetailsData = meal
    ? {
        ...meal,
        comments,
      }
    : null;

  return (
    <Modal isOpen={visible} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <p>{meal ? 'Meal Details' : 'Add New Meal'}</p>
        </ModalHeader>
        <ModalBody>
          {meal ? (
            mealDetailsData && <MealDetails data={mealDetailsData} />
          ) : (
            isAdmin && (
              <FoodSelection selectedFood={selectedFood} onFoodSelect={setSelectedFood} />
            )
          )}
        </ModalBody>
        {isAdmin && (
          <ModalFooter>
            <Button color="primary" onPress={handleSave}>
              {meal ? 'Update Meal' : 'Add Meal'}
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
