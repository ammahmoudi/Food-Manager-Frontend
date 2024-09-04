"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { startOfToday, format } from "date-fns-jalali";
import Calendar from "@/components/Calendar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CalendarPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Get year and month from URL or use the current year and month as default
    const yearParam = searchParams.get("year");
    const monthParam = searchParams.get("month");

    let year = parseInt(yearParam || "");
    let month = parseInt(monthParam || "");

    if (isNaN(year) || isNaN(month)) {
        // Get the current date
        const today = startOfToday();
        year = parseInt(format(today, "yyyy"), 10);
        month = parseInt(format(today, "MM"), 10);

        // Redirect to the current year/month if not provided
        router.push(`/calendar?year=${year}&month=${month}`, undefined);
        return null; // Return nothing while the redirect happens
    }

    const handleMonthChange = (newYear: number, newMonth: number) => {
        router.push(`/calendar?year=${newYear}&month=${newMonth}`, undefined);
    };

    return (
     <ProtectedRoute>
           <div className="container xl:w-1/2 mx-auto">
            <Calendar
                year={year}
                month={month}
                onMonthChange={handleMonthChange}
            />
        </div>
     </ProtectedRoute>
    );
}
