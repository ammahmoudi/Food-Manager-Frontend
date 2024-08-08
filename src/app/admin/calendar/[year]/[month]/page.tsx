'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import Calendar from '@/components/Calendar';
import { getMealsForCurrentMonth } from '@/services/api';
import { notFound } from 'next/navigation';
import { Meal } from '@/interfaces/Meal';
import { Food } from '@/interfaces/Food';

export default function CalendarPage({ params }: { params: { year: string; month: string } }) {
  const { year, month } = params;

  // Check if the year and month are valid Jalaali dates
  const parsedYear = parseInt(year, 10);
  const parsedMonth = parseInt(month, 10);

  if (isNaN(parsedYear) || isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
    notFound();
  }

  const router = useRouter();
  const [cells, setCells] = useState<{ date: Date; meals: Meal[] }[]>([]);
  const [got,setGot]=useState(false);
  const fetchMeals = async (year: number, month: number) => {
    try {
      const response = await getMealsForCurrentMonth(year, month);
      const mealCells = response.map((day: { date: Date;food: Food,rating:number }) => ({
        date: day.date,
        meals: [day],
      }));
      setCells(mealCells);
      setGot(true);
    } catch (error) {
      console.error('Failed to fetch meals:', error);
    }
  };

  useEffect(() => {
    fetchMeals(parsedYear, parsedMonth);
    
  }, [parsedYear, parsedMonth]);

  const handleMonthChange = (newYear: number, newMonth: number) => {
    router.push(`/admin/calendar/${newYear}/${newMonth}`);
  };

  return(
    <div className=' container xl:w-1/2 mx-auto '>
     { got&&<Calendar year={parsedYear} month={parsedMonth} onMonthChange={handleMonthChange} meals={cells} />}
    </div>


  );
}
