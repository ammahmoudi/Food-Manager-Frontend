"use client";

import { useEffect, useState, useCallback } from "react";
import { getLatestComments, getCurrentDayMeal } from "@/services/api";
import { Comment } from "@/interfaces/Comment";
import { Meal } from "@/interfaces/Meal";
import MealCard from "@/components/MealCard";
import Calendar from "@/components/Calendar";
import { Card, CardBody, Image } from "@nextui-org/react";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { format, startOfToday } from "date-fns-jalali";
import UserChip from "@/components/UserChip";
import MealChip from "@/components/MealChip";
import { Food } from "../../interfaces/Food";
import { useUser } from "@/context/UserContext";
import CommentCard from "@/components/CommentCard";
import CommentSection from "@/components/CommentSection";

const HomePage = () => {
	const [latestComments, setLatestComments] = useState<Comment[]>([]);
	const [currentDayMeal, setCurrentDayMeal] = useState<Meal | null>(null);
	const { isAdmin } = useUser();

	const fetchLatestComments = useCallback(async () => {
		try {
			const comments = await getLatestComments();
			setLatestComments(comments);
		} catch (error) {
			console.error("Failed to fetch latest comments:", error);
		}
	}, []);

	const fetchCurrentDayMeal = useCallback(async () => {
		try {
			const meal = await getCurrentDayMeal();
			setCurrentDayMeal(meal);
		} catch (error) {
			console.error("Failed to fetch current day meal:", error);
		}
	}, []);

	const handleDeleteMeal = (mealId: number) => {
		setCurrentDayMeal(null);
	};

	useEffect(() => {
		if (isAdmin) {
			fetchLatestComments();
		}
		fetchCurrentDayMeal();
	}, [fetchLatestComments, fetchCurrentDayMeal, isAdmin]);

	const currentDate = startOfToday();
	let currentYear = Number(format(currentDate, "yyyy"));
	let currentMonth = Number(format(currentDate, "MM"));

	return (
		<div className="container mx-auto p-4 w-screen">
			<div className="flex flex-col lg:flex-row justify-between gap-6">
				<div className="flex-1 lg:basis-1/2 lg:w-1/2">
					{/* Current Day Meal Card */}
					{currentDayMeal && (
						<div>
							<h2 className="text-2xl font-semibold mb-4">Todays Meal</h2>
							<MealCard
								date={new Date(currentDayMeal.date)}
								initialMeal={currentDayMeal}
								onDelete={handleDeleteMeal}
							/>
						</div>
					)}

					{/* Admin-Specific Section */}
					{isAdmin && (
						<div className="mt-8 flex-1">
							<h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>

							{/* Latest Comments Card */}
							<Card>
								<CardBody>
									<h3 className="font-semibold text-xl mb-4 flex items-center">
										<ChatBubbleLeftIcon className="w-5 h-5 mr-2" />
										Latest Comments
									</h3>
									{/* {latestComments.length > 0 ? (
										latestComments.map((comment) => (
									<CommentCard key={comment.id} comment={comment} onDelete={function (commentId: number): void {
												throw new Error("Function not implemented.");
											} } onUpdate={function (comment: Comment): void {
												throw new Error("Function not implemented.");
											} } onClick={function (): void {
												throw new Error("Function not implemented.");
											} } />
										))
									) : (
										<p>No comments available.</p>
									)} */}
									{<CommentSection variant="latest" />}
								</CardBody>
							</Card>

							{/* Additional Admin Cards (Optional) */}
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
	);
};

export default HomePage;
