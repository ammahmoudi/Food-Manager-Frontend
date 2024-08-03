'use client';

import { FC, useState, useEffect } from 'react';
import { Card, CardFooter, CardHeader, Image } from '@nextui-org/react';
import { Meal } from '../interfaces/Meal';
import { format, isToday, parseISO } from 'date-fns-jalali';

import MealDetailModal from './MealDetailModal';
import { getMealByDate } from '@/services/api';

interface MealCellProps {
  date: Date;
  initialMeals: Meal[]|[];
  isAdmin: boolean;
}

const MealCell: FC<MealCellProps> = ({ date, initialMeals, isAdmin }) => {
  const [meals, setMeals] = useState<Meal[]>(initialMeals);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (initialMeals.length === 0 && date) {
      // const fetchMeals = async () => {
      //   try {
      //     const response = await getMealByDate(date.split('T')[0]);
      //     setMeals(response);
      //   } catch (error) {
      //     console.error('Failed to fetch meals:', error);
      //   }
      // };

      // fetchMeals();
    }
    else {
      setMeals(initialMeals);
    }
  }, [date, initialMeals]);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <div className={`meal-cell h-full w-full p-0.5 ${'shadow-indigo-500/50'?isToday(date):''
    }`} >
      {meals.length > 0 ? (
        meals.map((meal) => (
          <Card
            isFooterBlurred
            radius="md"
            key={meal.id}
            isPressable
            onPress={handleOpenModal}
          >
            <Image
              removeWrapper
              className="z-0 w-full h-full object-cover"
              src={meal.food?.picture}
              alt={meal.food?.name}
              radius="none"
            />
            <CardHeader className="absolute z-10  flex-col items-center justify-center h-full">
              <p className="text-medium text-white/90  uppercase font-bold">
                {format((date || ''), 'd')}
              </p>

            </CardHeader>

            <CardFooter className="absolute before:bg-white/60 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-center py-1 lg:py-2 hidden sm:block">
              <p className="text-white font-bold text-tiny truncate ">
                <span>{meal.food?.name}</span>
              </p>
            </CardFooter>
          </Card>
        ))
      ) : (
        <Card
          isFooterBlurred
          radius="md"
          className="h-full w-full justify-center items-center"
          isPressable
          onPress={handleOpenModal}
        >
          <div className='h-full flex items-center justify-center '>
            <p className="text-medium text-black/60 uppercase font-bold text-center">
              {format(date, 'd')}
            </p>

   
          </div>
    
        </Card>
      )}

      <MealDetailModal
        visible={modalVisible}
        onClose={handleCloseModal}
        date={date}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default MealCell;
