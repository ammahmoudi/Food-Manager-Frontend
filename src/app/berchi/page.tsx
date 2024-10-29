"use client";
import { useCallback, useEffect, useState } from "react";
import { getCurrentDayMeal } from "@/app/berchi/services/berchiApi";
import Calendar from "@/app/berchi/components/Calendar";
import { Card, CardBody, Skeleton } from "@nextui-org/react";
import {
	TrophyIcon,
	ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { format, startOfToday } from "date-fns-jalali";
import { useUser } from "@/context/UserContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import CommentSection from "../berchi/components/CommentSection";
import MealCard from "../berchi/components/MealCard";
import TopRatedFoodsChart from "../berchi/components/TopRatedFoodsChart";
import { Meal } from "../berchi/interfaces/Meal";
import { toast } from "sonner";
import { CalendarDateRangeIcon } from "@heroicons/react/24/solid";

const HomePage = () => {
	const [currentDayMeal, setCurrentDayMeal] = useState<Meal | null>(null);
	const [loadingMeal, setLoadingMeal] = useState(true); // Loading state for meal
	const { isAdmin } = useUser();

	const fetchCurrentDayMeal = useCallback(async () => {
		setLoadingMeal(true);
		const fetchMealPromise = getCurrentDayMeal();
		try {
			toast.promise(fetchMealPromise, {
				// loading: "Fetching today's meal...",
				success: (meal) => {
					setCurrentDayMeal(meal);
					return "Today's meal loaded successfully!";
				},
				error: "Failed to load today's meal.",
			});
		} catch (error) {
			console.error("Failed to fetch current day meal:", error);
		} finally {
			setLoadingMeal(false);
		}
	}, []); // Add empty dependency array to ensure it doesn't change
	useEffect(() => {
		fetchCurrentDayMeal();
	}, []);
	const handleDeleteMeal = (mealId: number) => {
		console.log("meal", mealId, "deleted");
		setCurrentDayMeal(null);
		toast.success("Meal deleted successfully.");
	};

	const currentDate = startOfToday();
	let currentYear = Number(format(currentDate, "yyyy"));
	let currentMonth = Number(format(currentDate, "MM"));

	return (
		<ProtectedRoute>
			<div className="container mx-auto p-4 w-screen">
				<div className="flex flex-col lg:flex-row justify-between gap-4">
					<div className="flex-1 lg:basis-1/2 lg:w-1/2">
						{/* Current Day Meal Card */}
						{loadingMeal ? (
							<Skeleton className="h-48 w-full mb-4" /> // Skeleton for meal card
						) : (

<Card>
									<CardBody>
										<h3 className="font-semibold text-xl mb-4 flex items-center">
											<CalendarDateRangeIcon className="w-5 h-5 mr-2" />
											Today Meal
										</h3>

										{currentDayMeal ? (
									<MealCard
										date={new Date(currentDayMeal.date)}
										initialMeal={currentDayMeal}
										onDelete={handleDeleteMeal}
									/>
								) : (
									<div className="text-center text-default-500">No Meal has Been set for Today</div>
								)}									</CardBody>
								</Card>

	
						)}

						{/* Admin-Specific Section */}
						{isAdmin && (
							<div className="mt-8 flex flex-col gap-4">
								{/* Latest Comments Card */}
								<Card>
									<CardBody>
										<h3 className="font-semibold text-xl mb-4 flex items-center">
											<ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
											Latest Comments
										</h3>

										<CommentSection variant="latest" />
									</CardBody>
								</Card>

								{/* Top Rated Foods */}
								<Card>
									<CardBody>
										<h3 className="font-semibold text-xl mb-4 flex items-center">
											<TrophyIcon className="w-5 h-5 mr-2" />
											Top Rated Foods
										</h3>
										<TopRatedFoodsChart />
									</CardBody>
								</Card>
							</div>
						)}
					</div>

					{/* Calendar Component */}
					<div className="flex-1 lg:basis-1/2 lg:w-1/2">
						<h2 className="text-2xl font-semibold mb-4">Calendar</h2>
						<div className="w-full h-auto">
							<Calendar
								year={currentYear}
								month={currentMonth}
								onMonthChange={(year, month) => {
									currentYear = year;
									currentMonth = month;
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</ProtectedRoute>
	);
};

export default HomePage;
