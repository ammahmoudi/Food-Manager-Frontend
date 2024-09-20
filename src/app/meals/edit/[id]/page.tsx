"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Input } from "@nextui-org/react";
import { updateMeal, getMealById } from "../../../../services/api";
import { Meal } from "../../../../interfaces/Meal";
import { Food } from "../../../../interfaces/Food";
import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "react-toastify";

const EditMealPage = () => {
	const { id } = useParams();
	const [meal, setMeal] = useState<Meal | null>(null);
	const [selectedFood, setSelectedFood] = useState<Food | null>(null);
	const [date, setDate] = useState<string>("");
	const router = useRouter();

	useEffect(() => {
		const fetchMeal = async () => {
			if (id) {
				const fetchMealPromise = getMealById(parseInt(id as string));
				try {
					const fetchedMeal = await toast.promise(fetchMealPromise, {
						pending: "Fetching meal details...",
						success: "Meal details loaded successfully!",
						error: "Failed to load meal details. Please try again.",
					});
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
					pending: "Saving meal...",
					success: "Meal updated successfully!",
					error: "Failed to update meal. Please try again.",
				});
				router.push("/meals");
			} catch (error) {
				console.error("Failed to update meal:", error);
			}
		}
	};

	if (!meal) {
		return <div>There is no meal</div>;
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
