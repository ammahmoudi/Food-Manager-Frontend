"use client";

import { Button } from "@nextui-org/react";
import {
	addMonths,
	addWeeks,
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	isSameDay,
	isSameMonth,
	newDate,
	startOfMonth,
	startOfWeek,
	subMonths,
} from "date-fns-jalali";
import { FC, useEffect, useState } from "react";
import { getMealsForCurrentMonth } from "@/services/api";
import MealCell from "./MealCell";
import { CalendarProps, MealCellData } from "@/interfaces/Calendar";
import { Food } from "@/interfaces/Food";

const Calendar: FC<CalendarProps> = ({ year, month, onMonthChange }) => {
	const [cells, setCells] = useState<MealCellData[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const currentMonth = newDate(year, month - 1, 1);
	const firstDayOfMonth = startOfMonth(currentMonth);
	const lastDayOfMonth = endOfMonth(currentMonth);

	useEffect(() => {
		const fetchMeals = async () => {
			try {
				setLoading(true);
				const response = await getMealsForCurrentMonth(year, month);
				const mealCells = response.map(
					(day: { date: Date; food: Food; rating: number }) => ({
						date: day.date,
						meals: [day],
					})
				);
				setCells(mealCells);
			} catch (error) {
				console.error("Failed to fetch meals:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchMeals();
	}, [year, month]);

	const weeks = [];
	let currentWeek = startOfWeek(firstDayOfMonth, { weekStartsOn: 6 });

	while (currentWeek <= lastDayOfMonth) {
		const weekDays = eachDayOfInterval({
			start: currentWeek,
			end: endOfWeek(currentWeek, { weekStartsOn: 6 }),
		});
		weeks.push(weekDays);
		currentWeek = addWeeks(currentWeek, 1);
	}

	const handlePrevMonth = () => {
		const prevMonth = subMonths(currentMonth, 1);
		const newYear = parseInt(format(prevMonth, "yyyy"), 10);
		const newMonth = parseInt(format(prevMonth, "MM"), 10);
		onMonthChange(newYear, newMonth);
	};

	const handleNextMonth = () => {
		const nextMonth = addMonths(currentMonth, 1);
		const newYear = parseInt(format(nextMonth, "yyyy"), 10);
		const newMonth = parseInt(format(nextMonth, "MM"), 10);
		onMonthChange(newYear, newMonth);
	};

	if (loading) {
		return <div className="max-w-full mx-auto px-4 py-12 md:px-6 lg:py-16"><p>Loading...</p></div>; // Show a loading state while data is being fetched
	}

	return (
		<div className="max-w-full mx-auto px-4 py-12 md:px-6 lg:py-16">
			<div className="flex justify-between mb-4 gap-3">
				<Button className="px-10" onClick={handlePrevMonth}>
					Previous Month
				</Button>
				<Button
					disabled
					disableAnimation
					disableRipple
					className="text-xl text-white font-bold w-full text-center bg-black/50 "
				>
					{format(currentMonth, "MMMM yyyy")}
				</Button>
				<Button className="px-10" onClick={handleNextMonth}>
					Next Month
				</Button>
			</div>
			<div className="grid grid-cols-7 gap-0 bg-black/50 rounded-xl mb-2">
				{["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
					<div key={day} className="text-center text-white py-2 font-bold">
						{day}
					</div>
				))}
			</div>
			<div className="grid grid-cols-7 gap-1">
				{weeks.map((week, i) =>
					week.map((day, j) => {
						const cellMeal =
							cells.find((cell) => isSameDay(cell.date, day))?.meals || null;
						return (
							<div
								key={j}
								className="flex flex-col items-center justify-start aspect-square"
							>
								{isSameMonth(day, currentMonth) ? (
									<MealCell
										date={day}
										initialMeal={
											cellMeal && cellMeal.length !== 0 ? cellMeal[0] : null
										}
									/>
								) : null}
							</div>
						);
					})
				)}
			</div>
		</div>
	);
};

export default Calendar;
