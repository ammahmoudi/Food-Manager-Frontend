"use client";

import { useEffect, useState } from "react";
import { useParams} from "next/navigation";
import { Button, Input, Spinner } from "@nextui-org/react";
import { updateMeal, getMealById } from "@/app/berchi/services/berchiApi";
import { Meal } from "../../../interfaces/Meal";
import { Food } from "../../../interfaces/Food";
import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "sonner";

const EditMealPage = () => {
	const { id } = useParams();
	const [meal, setMeal] = useState<Meal | null>(null);
	const [selectedFood, setSelectedFood] = useState<Food | null>(null);
	const [date, setDate] = useState<string>("");

	useEffect(() => {
		const fetchMeal = async () => {
			if (id) {
				const fetchMealPromise = getMealById(parseInt(id as string));
				try {
					toast.promise(fetchMealPromise, {
						loading: "Fetching meal details...",
						success: "Meal details loaded successfully!",
						error: "Failed to load meal details. Please try again.",
					});
					const fetchedMeal = await  fetchMealPromise;
					setMeal(fetchedMeal);
					setSelectedFood(fetchedMeal.food);
					setDate(fetchedMeal.date);
				} catch (error) {
					console.error("Failed to fetch meal:", error);
				}
			}
		};

		fetchMeal();
	}, [id]);

	const handleSave = async () => {
		if (meal && selectedFood) {
			const saveMealPromise = updateMeal(meal.id, {
				...meal,
				date,
				food_id: selectedFood.id,
			});

			try {
				await toast.promise(saveMealPromise, {
					loading: "Saving meal...",
					success: "Meal updated successfully!",
					error: "Failed to update meal. Please try again.",
				});
				// router.push("/meals");
			} catch (error) {
				console.error("Failed to update meal:", error);
			}
		}
	};

	if (!meal) {
		return 		<div className="flex items-center justify-center h-screen w-screen">
		<Spinner size="lg" />
	</div>;
	}

	return (
		<ProtectedRoute>
			<div className="max-w-4xl mx-auto px-4 py-12 md:px-6 lg:py-16">
				<h1 className="text-3xl font-bold mb-6">Edit Meal</h1>
				<div className="space-y-6">
					<Input
						label="Date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
					/>

					<Button onClick={handleSave}>Save</Button>
				</div>
			</div>
		</ProtectedRoute>
	);
};

export default EditMealPage;
