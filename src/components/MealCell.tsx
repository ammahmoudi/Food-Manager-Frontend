'use client';

import { FC, useState } from 'react';
import { Card, Button, CardBody } from '@nextui-org/react';
import { Meal } from '../interfaces/Meal';
import { useRouter } from 'next/navigation';
import FoodSelection from './FoodSelection';
import { Food } from '../interfaces/Food';
import { updateMeal, createMeal } from '../services/api';
import jMoment from 'moment-jalaali';

interface MealCellProps {
  date: string;
  meals: Meal[];
}

const MealCell: FC<MealCellProps> = ({ date, meals }) => {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const router = useRouter();

  const dayMeals = meals.filter((meal) => jMoment(meal.date).format('YYYY-MM-DD') === jMoment(date).format('YYYY-MM-DD'));

  const handleSave = async () => {
    if (selectedFood) {
      try {
        const existingMeal = dayMeals[0];
        if (existingMeal) {
          await updateMeal(existingMeal.id, { ...existingMeal, food: selectedFood.id });
        } else {
          await createMeal({ date, food: selectedFood.id, rating: 0 });
        }
        router.refresh();
        setSelectedFood(null);
      } catch (error) {
        console.error('Failed to save meal:', error);
      }
    }
  };

  return (
    <Card>
      <CardBody>
        <div>{jMoment(date).jDate()}</div>
        <div>
          {dayMeals.length > 0 ? (
            dayMeals.map((meal) => (
              <div key={meal.id}>
                <div>{meal.food?.name}</div>
                <Button onClick={() => router.push(`/meals/edit/${meal.id}`)}>Edit</Button>
              </div>
            ))
          ) : (
            <Button onClick={() => setSelectedFood(null)}>Add Meal</Button>
          )}
        </div>
        {selectedFood && (
          <div>
            <FoodSelection selectedFood={selectedFood} onFoodSelect={setSelectedFood} />
            <Button onClick={handleSave}>Save</Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default MealCell;
