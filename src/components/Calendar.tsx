"use client";

import { Button, Skeleton } from "@nextui-org/react";
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
import { convertPersianMonthToEnglish } from "@/utils/dateUtils";
import { toast } from "react-toastify";
import { showToast } from "@/services/showToast";

const Calendar: FC<CalendarProps> = ({ year, month, onMonthChange }) => {
	const [currentYear, setCurrentYear] = useState(year);
	const [currentMonth, setCurrentMonth] = useState(month);
	const [cells, setCells] = useState<MealCellData[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const currentMonthDate = newDate(currentYear, currentMonth - 1, 1);
	const firstDayOfMonth = startOfMonth(currentMonthDate);
	const lastDayOfMonth = endOfMonth(currentMonthDate);

	useEffect(() => {
		const fetchMeals = async () => {
			try {
				setLoading(true);
				const response = await getMealsForCurrentMonth(
					currentYear,
					currentMonth
				);
				const mealCells = response.map(
					(day: { date: Date; food: Food; rating: number }) => ({
						date: day.date,
						meals: [day],
					})
				);
				setCells(mealCells);
			} catch (error) {
				console.error("Failed to fetch meals:", error);
				// showToast('error','Failed to get current month meals.')
			} finally {
				setLoading(false);
			}
		};

		fetchMeals();
	}, [currentYear, currentMonth]);

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
		const prevMonth = subMonths(currentMonthDate, 1);
		const newYear = parseInt(format(prevMonth, "yyyy"), 10);
		const newMonth = parseInt(format(prevMonth, "MM"), 10);
		if (newYear !== currentYear || newMonth !== currentMonth) {
			setCurrentYear(newYear);
			setCurrentMonth(newMonth);
			if (onMonthChange) onMonthChange(newYear, newMonth);
		}
	};

	const handleNextMonth = () => {
		const nextMonth = addMonths(currentMonthDate, 1);
		const newYear = parseInt(format(nextMonth, "yyyy"), 10);
		const newMonth = parseInt(format(nextMonth, "MM"), 10);
		if (newYear !== currentYear || newMonth !== currentMonth) {
			setCurrentYear(newYear);
			setCurrentMonth(newMonth);
			if (onMonthChange) onMonthChange(newYear, newMonth);
		}
	};

	return (
		<div className="p-1 w-full h-full">
			<div className="flex justify-between mb-4 gap-3">
				<Button className="px-10" onClick={handlePrevMonth}>
					Previous Month
				</Button>
				<Button
					disabled
					disableRipple
					className="text-large text-white font-bold w-full text-center bg-primary "
				>
					{convertPersianMonthToEnglish(format(currentMonthDate, "MMMM yyyy"))}
				</Button>

				<Button className="px-10" onClick={handleNextMonth}>
					Next Month
				</Button>
			</div>
			{loading ? (
				<Skeleton isLoaded={!loading} className=" rounded-xl" />
			) : (
				<div className="grid grid-cols-7 gap-0 bg-primary rounded-xl mb-2">
					{["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
						<div key={day} className="text-center text-white py-2 font-bold">{day}</div>
					))}
				</div>
			)}

			<div className="grid grid-cols-7 gap-1">
				{weeks.map((week, i) =>
					week.map((day, j) => {
						const cellMeal =
							cells.find((cell) => isSameDay(cell.date, day))?.meals || null;

						return loading ? (
							<Skeleton
								className="meal-cell aspect-square h-full w-full p-0.5 rounded-md"
								key={j}
							/>
						) : (
							<div
								key={j}
								className="flex flex-col items-center justify-start aspect-square"
							>
								{isSameMonth(day, currentMonthDate) ? (
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
