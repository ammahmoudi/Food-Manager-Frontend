import { Meal } from "@/app/berchi/interfaces/Meal";

export interface MealCellData {
	date: Date;
	meals: Meal[];
}

export interface CalendarProps {
	year: number;
	month: number;
	onMonthChange: (year: number, month: number) => void;
}
