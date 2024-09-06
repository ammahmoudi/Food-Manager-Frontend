"use client";

import { useCallback, useEffect, useState } from "react";
import { getLatestComments, getCurrentDayMeal } from "@/services/api";
import { Meal } from "@/interfaces/Meal";
import MealCard from "@/components/MealCard";
import Calendar from "@/components/Calendar";
import { Card, CardBody, Skeleton } from "@nextui-org/react";
import {
	TrophyIcon,
	ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { format, startOfToday } from "date-fns-jalali";
import { useUser } from "@/context/UserContext";
import CommentSection from "@/components/CommentSection";
import TopRatedFoodsChart from "@/components/TopRatedFoodsChart";
import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "react-toastify";

const HomePage = () => {
	const [currentDayMeal, setCurrentDayMeal] = useState<Meal | null>(null);
	const [loadingMeal, setLoadingMeal] = useState(true); // Loading state for meal
	const [loadingComments, setLoadingComments] = useState(true); // Loading state for comments
	const { isAdmin } = useUser();

	const fetchCurrentDayMeal = useCallback(async () => {
		setLoadingMeal(true); // Show skeleton while loading
		const fetchMealPromise = getCurrentDayMeal();

		try {
			const meal = await toast.promise(fetchMealPromise, {
				pending: "Fetching today's meal...",
				success: "Today's meal loaded successfully!",
				error: "Failed to load today's meal.",
			});
			setCurrentDayMeal(meal);
		} catch (error) {

			console.error("Failed to fetch current day meal:", error);
		} finally {
			setLoadingMeal(false); // Hide skeleton after loading
		}
	}, []);

	const handleDeleteMeal = (mealId: number) => {
		setCurrentDayMeal(null);
		toast.success("Meal deleted successfully.");
	};

	useEffect(() => {
		fetchCurrentDayMeal();
		setLoadingComments(false); // Hide comments skeleton after loading
	}, [fetchCurrentDayMeal, isAdmin]);

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
						) : currentDayMeal ? (
							<div>
								<h2 className="text-2xl font-semibold mb-4">Today's Meal</h2>
								<MealCard
									date={new Date(currentDayMeal.date)}
									initialMeal={currentDayMeal}
									onDelete={handleDeleteMeal}
								/>
							</div>
						) : (
							<p>No meal data available</p>
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
										{loadingComments ? (
											<Skeleton className="h-32 w-full" /> // Skeleton for comments
										) : (
											<CommentSection variant="latest" />
										)}
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
						<h2 className="text-2xl font-semibold mb-4">Calendar</h2>					<div className="w-full h-auto">
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

			</div>
		</ProtectedRoute>
	);
};

export default HomePage;
