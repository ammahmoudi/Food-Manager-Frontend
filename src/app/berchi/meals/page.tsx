"use client";

import { Key, Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
	getMeals,
	getFilteredMeals,
	deleteMeal,
} from "@/app/berchi/services/berchiApi";
import {
	Input,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Button,
	Tab,
	Tabs,
} from "@nextui-org/react";
import {
	CalendarIcon,
	ClockIcon,
	ArrowUpIcon,
	ArrowDownIcon,
	PlusIcon,
} from "@heroicons/react/24/outline";
import { useUser } from "@/context/UserContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import MealCard from "../components/MealCard";
import MealDetailModal from "../components/MealDetailModal";
import { Meal } from "../interfaces/Meal";
import { toast } from "sonner";

const MealsPage = () => {
	const [meals, setMeals] = useState<Meal[]>([]);
	const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [sortOrder, setSortOrder] = useState<"date" | "rating">("date");
	const [modalVisible, setModalVisible] = useState(false);
	const { isAdmin } = useUser();

	const router = useRouter();
	const searchParams = useSearchParams();
	const filterType = searchParams.get("filter") || "current-week"; // Default filter

	const fetchMeals = useCallback(async () => {
		const fetchMealsPromise =
			filterType === "all" ? getMeals() : getFilteredMeals(filterType);
		try {
			toast.promise(fetchMealsPromise, {
				loading: "Fetching meals...",
				success: "Meals fetched successfully!",
				error: "Failed to fetch meals",
			});

			const response = await fetchMealsPromise;

			// Update state after fetching meals
			setMeals(response);
			setFilteredMeals(response);
		} catch (error) {
			console.error("Failed to fetch meals:", error);
		}
	}, [filterType]);

	useEffect(() => {
		fetchMeals();
	}, []);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
		if (event.target.value === "") {
			setFilteredMeals(meals);
		} else {
			const filtered = meals.filter((meal) =>
				meal.food?.name.toLowerCase().includes(event.target.value.toLowerCase())
			);
			setFilteredMeals(filtered);
		}
	};

	const handleTabChange = (key: Key) => {
		router.push(`?filter=${key}`);
	};

	const handleSortChange = (order: "date" | "rating") => {
		setSortOrder(order);
		const sortedMeals = [...filteredMeals].sort((a, b) => {
			if (order === "date") {
				return new Date(a.date).getTime() - new Date(b.date).getTime();
			} else {
				return b.avg_rate - a.avg_rate;
			}
		});
		setFilteredMeals(sortedMeals);
	};

	const handleOpenModal = () => {
		setModalVisible(true);
	};

	const handleCloseModal = () => {
		fetchMeals();
		setModalVisible(false);
	};

	const handleSave = (meal: Meal | null) => {
		console.log("meal", meal, "saved");
		// Optionally handle the save logic
	};

	const handleDelete = async (mealId: number) => {
		const deleteMealPromise = deleteMeal(mealId);
		try {
			await toast.promise(deleteMealPromise, {
				loading: "Deleting meal...",
				success: "Meal deleted successfully!",
				error: "Failed to delete meal",
			});
			setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== mealId));
			setFilteredMeals((prevFilteredMeals) =>
				prevFilteredMeals.filter((meal) => meal.id !== mealId)
			);
		} catch (error) {
			console.error("Failed to delete meal:", error);
		}
	};

	return (
		<ProtectedRoute>
			<Suspense fallback={<div>Loading...</div>}>
				<div className="container xl:w-1/2 mx-auto p-2 items-center">
					<div className="flex justify-between items-center mb-4 gap-2">
						<Input
							isClearable
							placeholder="Search by food name"
							value={searchTerm}
							onChange={handleSearchChange}
							className="w-full"
						/>
						{isAdmin && (
							<Button
								isIconOnly
								color="success"
								className="h-full w-auto aspect-square"
								onPress={handleOpenModal}
							>
								<PlusIcon className="text-white size-6"></PlusIcon>
							</Button>
						)}
						<Dropdown >
							<DropdownTrigger>
								<Button color='primary' variant="solid"startContent={sortOrder === "date" ? <ArrowUpIcon className="w-5 h-5" /> : <ArrowDownIcon className="w-5 h-5" />}>
									Sort by {sortOrder === "date" ? "Date" : "Rating"}
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								onAction={(key) => handleSortChange(key as "date" | "rating")}
							>
								<DropdownItem key="date">
									<div className="flex items-center space-x-2">
										<ArrowUpIcon className="w-5 h-5" />
										<span>Date</span>
									</div>
								</DropdownItem>
								<DropdownItem key="rating">
									<div className="flex items-center space-x-2">
										<ArrowDownIcon className="w-5 h-5" />
										<span>Rating</span>
									</div>
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</div>

					<Tabs
						aria-label="Filter Options"
						selectedKey={filterType}
						onSelectionChange={handleTabChange}
						variant="solid"
						color="primary"
						className="mb-4"
						fullWidth
						size="sm"

					>
						<Tab
							key="current-week"
							title={
								<div className="flex items-center space-x-1">
									<CalendarIcon className="w-5 h-5" />
									<span>Current Week</span>
								</div>
							}
						/>
						<Tab
							key="upcoming"
							title={
								<div className="flex items-center space-x-1">
									<ClockIcon className="w-5 h-5" />
									<span>Upcoming Meals</span>
								</div>
							}
						/>
						<Tab
							key="past"
							title={
								<div className="flex items-center space-x-1">
									<ArrowUpIcon className="w-5 h-5" />
									<span>Past Meals</span>
								</div>
							}
						/>
						<Tab
							key="all"
							title={
								<div className="flex items-center space-x-1">
									<span>All Meals</span>
								</div>
							}
						/>
					</Tabs>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:grid-cols-2">
						{filteredMeals.map((meal) => (
							<MealCard
								key={meal.id}
								date={new Date(meal.date)}
								initialMeal={meal}
								onDelete={handleDelete} // Pass the handleDelete function to MealCard
							/>
						))}
					</div>
					<MealDetailModal
						visible={modalVisible}
						onClose={handleCloseModal}
						date={null}
						onSave={handleSave}
						initialData={null}
						onDelete={handleDelete}
					/>
				</div>
			</Suspense>
		</ProtectedRoute>
	);
};

export default MealsPage;
