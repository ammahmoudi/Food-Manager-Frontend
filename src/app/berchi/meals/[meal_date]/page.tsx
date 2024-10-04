"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getMealByDate } from "@/app/berchi/services/berchiApi";
import MealDetails from "../../components/MealDetails";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Meal } from "../../interfaces/Meal";
import { toast } from "sonner";
import { Spinner } from "@nextui-org/react";

const MealDetailPage = () => {
	const { meal_date } = useParams();
	const [meal, setMeal] = useState<Meal | null>(null);

	const fetchMeal = useCallback(async () => {
		if (meal_date) {
			const fetchMealPromise = getMealByDate(meal_date as string);

			try {
				toast.promise(fetchMealPromise, {
					// loading: 'Fetching meal details...',
					// success: 'Meal details loaded successfully!',
					error: "Failed to fetch meal details.",
				});
				const fetchedMeal = await fetchMealPromise;
				setMeal(fetchedMeal);
			} catch (error) {
				console.error("Failed to fetch meal:", error);
			}
		}
	}, [meal_date]);

	useEffect(() => {
		fetchMeal();
	}, [fetchMeal]);

	if (!meal) {
		return (
			<div className="flex items-center justify-center h-screen w-screen">
				<Spinner size="lg" />
			</div>
		);
	}

	return (
		<ProtectedRoute>
			<MealDetails meal={meal} />
		</ProtectedRoute>
	);
};

export default MealDetailPage;
