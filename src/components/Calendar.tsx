'use client';

import { getAdminCheck } from '@/services/api';
import { Button } from '@nextui-org/react';
import { addMonths, addWeeks, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, newDate, startOfMonth, startOfWeek, subMonths } from 'date-fns-jalali';
import { FC, useEffect, useState } from 'react';
import { Meal } from '../interfaces/Meal';
import MealCell from './MealCell';

interface CalendarProps {
  year: number;
  month: number;
  meals: { date: Date; meals: Meal[] }[];
  onMonthChange: (year: number, month: number) => void;
}

const Calendar: FC<CalendarProps> = ({ year, month, meals, onMonthChange }) => {
  const currentMonth = newDate(year, month - 1, 1);
  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const weeks = [];
  let currentWeek = startOfWeek(firstDayOfMonth, { weekStartsOn: 6 });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const response = await getAdminCheck();
        setIsAdmin(response.is_admin);
      } catch (error) {
        console.error('Failed to fetch admin status:', error);
      }
    };

    fetchAdminStatus();
  }, []);
  while (currentWeek <= lastDayOfMonth) {
    const weekDays = eachDayOfInterval({
      start: currentWeek,
      end: endOfWeek(currentWeek, { weekStartsOn: 6 }),
    });
    weeks.push(weekDays);
    currentWeek = addWeeks(currentWeek, 1);
  }
  // console.log(weeks);

  const handlePrevMonth = () => {
    const prevMonth = subMonths(currentMonth, 1);
    const newYear = parseInt(format(prevMonth, 'yyyy'), 10);
    const newMonth = parseInt(format(prevMonth, 'MM'), 10);
    onMonthChange(newYear, newMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1);
    const newYear = parseInt(format(nextMonth, 'yyyy'), 10);
    const newMonth = parseInt(format(nextMonth, 'MM'), 10);
    onMonthChange(newYear, newMonth);
  };

  return (
    <div className="max-w-full mx-auto px-4 py-12 md:px-6 lg:py-16">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Meals Calendar for {format(currentMonth, 'MMMM yyyy')}
      </h1>
      <div className="flex justify-between mb-4">
        <Button onClick={handlePrevMonth}>Previous Month</Button>
        <Button onClick={handleNextMonth}>Next Month</Button>
      </div>
      <div  className="grid grid-cols-7 gap-0 bg-black/50 rounded-xl mb-2 ">
        {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
          <div key={day} className=" text-center text-white py-2 font-bold">
            {day}
          </div>
        ))}
        </div>
      <div className="grid grid-cols-7 gap-1 ">
        {weeks.map((week, i) => (
          week.map((day, j) => {
            const cellMeals = meals.find((cell) => isSameDay(cell.date, day))?.meals || [];
            return (
              <div key={j} className=" flex flex-col items-center justify-start  aspect-square">
                {isSameMonth(day, currentMonth) ? (
                  <>
                    <MealCell date={day} initialMeals={cellMeals} isAdmin={isAdmin} />
                  </>
                ) : null}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
};

export default Calendar;
