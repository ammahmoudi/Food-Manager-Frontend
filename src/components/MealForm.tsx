"use client";

import React, { FC, useState, useEffect, useCallback } from "react";
import {
	Button,
	Card,
	
	CardFooter,
	CardHeader,
	Image,
	Link,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@nextui-org/react";
import { DatePicker } from "@nextui-org/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Food } from "../interfaces/Food";
import {
	createMeal,
	deleteMeal,
	getMealByDate,
	updateMeal,
} from "../services/api";
import CustomFoodAutocomplete from "./CustomFoodAutocomplete";
import FoodModal from "./FoodModal";
import { Meal } from "@/interfaces/Meal";
import { formatDateToYYYYMMDD } from "@/utils/dateUtils";
import { CreateMealData } from "@/interfaces/CreateMealData";
import { PencilSquareIcon } from "@heroicons/react/16/solid";
import CommentSection from "./CommentSection";
import RateSection from "./RateSection";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify"; // Importing toast

interface MealFormProps {
	initialData: Meal | null;
	date: Date | null;
	onSave: (meal: Meal | null) => void;
	onDelete: (mealId: number) => void;
}

const MealForm: FC<MealFormProps> = ({
	initialData,
	date,
	onSave,
	onDelete,
}) => {
	const [selectedFood, setSelectedFood] = useState<Food | null>(null);
	const [selectedDate, setSelectedDate] = useState<Date | null>(
		date || new Date()
	);
	const [foodModalVisible, setFoodModalVisible] = useState(false);
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [shouldUpdateFoods, setShouldUpdateFoods] = useState(false);
	const [meal, setMeal] = useState<Meal | null>(initialData);
	const { isAdmin } = useUser();

	const fetchMeal = useCallback(async () => {
		if (selectedDate) {
			try {
				const response = await toast.promise(
					getMealByDate(formatDateToYYYYMMDD(selectedDate)),
					{
						// pending: "Fetching meal data...",
						// success: "Meal data loaded successfully!",
						error: "Failed to fetch meal data",
					}
				);
				setMeal(response);
				if (!selectedFood) {
					setSelectedFood(response.food);
				}
			} catch (error) {
				setMeal(null);
				console.error("Failed to fetch meal:", error);
			}
		}
	}, [selectedDate, selectedFood]);

	useEffect(() => {
		if (initialData && selectedDate) {
			fetchMeal();
		}
	}, []);

	const handleOpenFoodModal = () => {
		setFoodModalVisible(true);
	};

	const handleCloseFoodModal = () => {
		setFoodModalVisible(false);
		setShouldUpdateFoods(true); // Trigger update in CustomFoodAutocomplete
	};

	const handleFoodSave = (food: Food) => {
		// fetchMeal();
		setSelectedFood(food);
	};

	const handleFoodDelete = (foodId: number) => {
		console.log(foodId);
		// fetchMeal();
		setSelectedFood(null);
	};

	const handleOpenDeleteModal = () => {
		setDeleteModalVisible(true);
	};

	const handleCloseDeleteModal = () => {
		setDeleteModalVisible(false);
	};

	const handleSaveMeal = async () => {
		if (!selectedFood) {
			// If no food is selected, show the delete modal
			handleOpenDeleteModal();
			return;
		}

		const newMeal: CreateMealData = {
			food_id: selectedFood?.id,
			date: formatDateToYYYYMMDD(selectedDate || new Date()),
		};

		// Full control of toast.promise for saving the meal
		const saveMealPromise = meal
			? updateMeal(meal.id, newMeal)
			: createMeal(newMeal);

		const updatedMeal = await toast.promise(saveMealPromise, {
			pending: {
				render() {
					return meal ? "Updating meal..." : "Creating meal...";
				},
				icon: false,
			},
			success: {
				render() {
					return meal
						? "Meal has been updated successfully!"
						: "Meal has been created successfully!";
				},
			},
			error: {
				render({ data }) {
					return `Failed to save meal: ${data || "Unknown error"}`;
				},
			},
		});

		onSave(updatedMeal); // Pass the updated meal to onSave after toast.promise resolves
	};

	const handleDeleteMeal = async () => {
		if (!meal) return;

		const deletePromise = deleteMeal(meal.id);

		await toast.promise(deletePromise, {
			pending: "Deleting meal...",
			success: "Meal has been deleted successfully!",
			error: "Failed to delete meal",
		});

		onDelete(meal.id);
	};

	return (
		<div className="meal-form">
			{selectedFood && (
				<Card isFooterBlurred className=" aspect-square mb-4">
					<CardHeader className="absolute z-10 top-1 items-start">
						<div className="flex flex-grow gap-2 items-top justify-between">
							<div className="flex flex-col">
								<h3
									className="text-white font-bold text-2xl"
									style={{
										textShadow:
											"0 0 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 0, 0, 0.5)",
									}}
								>
									{selectedFood.name}
								</h3>
								<p
									className="text-lg text-white/80 uppercase font-medium"
									style={{
										textShadow:
											"0 0 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 0, 0, 0.5)",
									}}
								>
									{selectedFood.description}
								</p>
							</div>

							{isAdmin && (
								<Button
									radius="full"
									size="sm"
									className=" aspect-square bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
									onPress={handleOpenFoodModal}
									isIconOnly
								>
									<PencilSquareIcon className="h-5 w-5" />
								</Button>
							)}
						</div>
					</CardHeader>
					<Image
						alt={selectedFood.name}
						className="z-0 w-full h-full object-cover"
						classNames={{ wrapper: "w-full h-full max-w-full max-h-full  aspect-square " }}
						src={
							(selectedFood.image as string) ?? "/images/food-placeholder.jpg"
						}
					/>
					<CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
						<div className="flex flex-grow gap-2 items-center">
							<div className="flex flex-col">
								<p className="text-tiny text-white/60">
									<span className="text-muted-foreground text-sm">{selectedFood.avg_rate}/5.0</span>
								</p>
							</div>
						</div>
						<Button
							radius="full"
							size="sm"
							className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
							as={Link}
							href={`/foods/${selectedFood.id}`}
							isExternal
						>
							<span>more</span>
						</Button>
					</CardFooter>
				</Card>
			)}
			{isAdmin && (
				<>
					{!date && (
						<div className="mb-4">
							<DatePicker
								label="Select Date"
								minValue={today(getLocalTimeZone())}
								defaultValue={today(getLocalTimeZone())}
								onChange={(newDate) =>
									setSelectedDate(new Date(newDate.toString()))
								}
							/>
						</div>
					)}
					<CustomFoodAutocomplete
						selectedFood={selectedFood}
						onFoodSelect={setSelectedFood}
						shouldUpdate={shouldUpdateFoods}
						onUpdateComplete={() => setShouldUpdateFoods(false)}
					/>
				</>
			)}
			{meal && (
				<>
					<RateSection mealId={meal.id} />
					<CommentSection variant="meal" mealId={meal.id} meal={meal} />
				</>
			)}
			{isAdmin && (
				<>
					<div className="flex justify-left gap-2">
						<Button color="primary" onPress={handleSaveMeal} className="mt-4">
							<span>{meal ? "Update Meal" : "Add Meal"}</span>
						</Button>
						{meal && (
							<Button
								color="danger"
								variant="light"
								onPress={handleOpenDeleteModal}
								className="mt-4"
							>
								Delete Meal
							</Button>
						)}
					</div>
				</>
			)}

			<FoodModal
				visible={foodModalVisible}
				onClose={handleCloseFoodModal}
				initialData={selectedFood}
				isEditMode={true}
				onSave={handleFoodSave}
				onDelete={handleFoodDelete}
			/>
			<Modal isOpen={deleteModalVisible} onClose={handleCloseDeleteModal}>
				<ModalContent>
					<ModalHeader>Delete Meal</ModalHeader>
					<ModalBody>Are you sure you want to delete this meal item?</ModalBody>
					<ModalFooter>
						<Button color="danger" onClick={handleDeleteMeal}>
							Delete
						</Button>
						<Button variant="light" onClick={handleCloseDeleteModal}>
							Cancel
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
};

export default MealForm;
