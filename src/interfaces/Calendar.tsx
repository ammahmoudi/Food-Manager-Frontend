import { Meal } from "@/interfaces/Meal";
import { Food } from "@/interfaces/Food";

export interface MealCellData {
	date: Date;
	meals: Meal[];
}

export interface CalendarProps {
	year: number;
	month: number;
	onMonthChange: (year: number, month: number) => void;
}
