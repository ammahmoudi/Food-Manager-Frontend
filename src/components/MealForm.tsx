'use client';

import React, { FC, useState, useEffect } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Image } from '@nextui-org/react';
import { Food } from '../interfaces/Food';
import { getMealsWithFood } from '../services/api';
import CustomFoodAutocomplete from './CustomFoodAutocomplete';
import { MealWithFood } from '../interfaces/MealWithFood';

interface MealFormProps {
  date: Date;
  onSave: (food: Food) => void;
}

const MealForm: FC<MealFormProps> = ({ date, onSave }) => {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [meals, setMeals] = useState<MealWithFood[]>([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchMealsWithFood = async () => {
      if (selectedFood) {
        try {
          const fetchedMeals = await getMealsWithFood(selectedFood.id);
          setMeals(fetchedMeals);
        } catch (error) {
          console.error('Failed to fetch meals with food:', error);
        }
      }
    };

    fetchMealsWithFood();
  }, [selectedFood]);

  useEffect(() => {
    if (meals.length > 0) {
      const average = meals.reduce((acc, meal) => acc + meal.rating, 0) / meals.length;
      setAverageRating(average);
    }
  }, [meals]);

  return (
    <div className="meal-form">
      {selectedFood && (
        <Card className="mb-4">
          <CardHeader>
            <h2 className="text-lg font-bold">{selectedFood.name}</h2>
          </CardHeader>
          <CardBody>
            <Image src={selectedFood.picture} alt={selectedFood.name} className="w-full h-48 object-cover rounded-md" />
            <p className="mt-2">{selectedFood.description}</p>
          </CardBody>
          <CardFooter>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={i < averageRating ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="text-muted-foreground text-sm">({averageRating.toFixed(1)})</span>
            </div>
          </CardFooter>
        </Card>
      )}
      <CustomFoodAutocomplete selectedFood={selectedFood} onFoodSelect={setSelectedFood} />
      <Button
        color="primary"
        onPress={() => selectedFood && onSave(selectedFood)}
        className="mt-4"
      >
        Save Meal
      </Button>
    </div>
  );
};

export default MealForm;
