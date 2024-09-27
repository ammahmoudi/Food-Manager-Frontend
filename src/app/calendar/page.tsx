"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { startOfToday, format } from "date-fns-jalali";
import Calendar from "@/components/Calendar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CalendarPage() {
	const searchParams = useSearchParams();
	const router = useRouter();

	const [year, setYear] = useState<number | null>(null);
	const [month, setMonth] = useState<number | null>(null);

	useEffect(() => {
		if (!searchParams) return;

		const yearParam = searchParams.get("year");
		const monthParam = searchParams.get("month");

		let year = parseInt(yearParam || "");
		let month = parseInt(monthParam || "");

		if (isNaN(year) || isNaN(month)) {
			const today = startOfToday();
			year = parseInt(format(today, "yyyy"), 10);
			month = parseInt(format(today, "MM"), 10);
			router.push(`/calendar?year=${year}&month=${month}`);
		} else {
			setYear(year);
			setMonth(month);
		}
	}, [searchParams, router]);

	const handleMonthChange = (newYear: number, newMonth: number) => {
		router.push(`/calendar?year=${newYear}&month=${newMonth}`);
	};

	if (year === null || month === null) {
		return null; // Return nothing while redirect happens
	}

	return (	<Suspense>
		<ProtectedRoute>
			<div className="container xl:w-1/2 mx-auto">
				<Calendar year={year} month={month} onMonthChange={handleMonthChange} />
			</div>
		</ProtectedRoute>
		</Suspense>
	);
}
