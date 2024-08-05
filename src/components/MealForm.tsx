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
         <Card isFooterBlurred  className=" aspect-square mb-4">
         <CardHeader className="absolute z-10 top-1 flex-col items-start ">
         <h3 className="text-white font-bold text-2xl" style={{ textShadow: '0 0 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 0, 0, 0.5)' }}>
  {selectedFood.name}
</h3>

           <p className="text-lg text-white/80 uppercase font-medium" style={{ textShadow: '0 0 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 0, 0, 0.5)' }}>{selectedFood.description}</p>
         </CardHeader>
        <Image
          removeWrapper
          alt={selectedFood.name}
          className="z-0 w-full h-full object-cover"
          src={selectedFood.picture}
        />
         <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
          
           <div className="flex flex-grow gap-2 items-center">
            
             <div className="flex flex-col">
               <p className="text-tiny text-white/60"><span className="text-muted-foreground text-sm">({averageRating.toFixed(1)})</span>
               </p>
             </div>
           </div>
           <Button radius="full" size="sm" className='bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg'>more</Button>
         </CardFooter>
       </Card>


      )}
      <CustomFoodAutocomplete selectedFood={selectedFood} onFoodSelect={setSelectedFood} />
      <Button
        color="primary"
        variant='ghost'
        onPress={() => selectedFood && onSave(selectedFood)}
        className="mt-4"
      >
        Save Meal
      </Button>
    </div>
  );
};

export default MealForm;
