"use client";

import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import Calendar from "@/components/Calendar";

export default function CalendarPage({
	params,
}: {
	params: { year: string; month: string };
}) {
	const { year, month } = params;

	// Check if the year and month are valid Jalaali dates
	const parsedYear = parseInt(year, 10);
	const parsedMonth = parseInt(month, 10);

	if (
		isNaN(parsedYear) ||
		isNaN(parsedMonth) ||
		parsedMonth < 1 ||
		parsedMonth > 12
	) {
		notFound();
	}

	const router = useRouter();

	const handleMonthChange = (newYear: number, newMonth: number) => {
		router.push(`/calendar/${newYear}/${newMonth}`);
	};

	return (
		<div className="container xl:w-1/2 mx-auto">
			<Calendar
				year={parsedYear}
				month={parsedMonth}
				onMonthChange={handleMonthChange}
			/>
		</div>
	);
}
