'use client';

import { FC, useEffect, useState } from 'react';
import { Table, Button, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import jMoment from 'moment-jalaali';
import { getMealsForCurrentMonth } from '../services/api';
import { Meal } from '../interfaces/Meal';
import MealCell from './MealCell';

interface CalendarProps {}

const Calendar: FC<CalendarProps> = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [currentMonth, setCurrentMonth] = useState<jMoment.Moment>(jMoment().startOf('jMonth'));

  const fetchMeals = async (month: jMoment.Moment) => {
    try {
      const response = await getMealsForCurrentMonth(month.format('jYYYY-jMM'));
      setMeals(response);
    } catch (error) {
      console.error('Failed to fetch meals:', error);
    }
  };

  useEffect(() => {
    fetchMeals(currentMonth);
  }, [currentMonth]);

  const daysInMonth = currentMonth.daysInMonth();
  const firstDayOfMonth = currentMonth.startOf('jMonth').day();
  console.log('firstDayOfMonth',firstDayOfMonth)
  console.log('daysInMonth',daysInMonth)
  
  const weeks = [];

  let day = 1;

  for (let i = 0; i < 6; i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDayOfMonth) {
        week.push(null);
      } else if (day > daysInMonth) {
        week.push(null);
      } else {
        week.push(day);
        day++;
      }
    }
    weeks.push(week);
  }

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.clone().subtract(1, 'jMonth'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.clone().add(1, 'jMonth'));
  };

  return (
    <div className="w-screen mx-auto px-4 py-12 md:px-6 lg:py-16">
      <h1 className="text-3xl font-bold mb-6">Meals Calendar for {currentMonth.format('jMMMM jYYYY')}</h1>
      <div className="flex justify-between mb-4">
        <Button onClick={handlePrevMonth}>Previous Month</Button>
        <Button onClick={handleNextMonth}>Next Month</Button>
      </div>
      <Table>
        <TableHeader>
          {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
            <TableColumn key={day}>{day}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {weeks.map((week, i) => (
            <TableRow key={i}>
              {week.map((day, j) => (
                <TableCell key={j}>
                  {day ? (
                    <MealCell date={currentMonth.clone().date(day).format('YYYY-MM-DD')} meals={meals} />
                  ) : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Calendar;
