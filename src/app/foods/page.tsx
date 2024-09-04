"use client";

import { useCallback, useEffect, useState } from "react";
import {
	Input,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Button,
} from "@nextui-org/react";
import {
	ArrowUpIcon,
	ArrowDownIcon,
	PlusIcon,
} from "@heroicons/react/24/outline";
import { Food } from "@/interfaces/Food";
import { getFoods, deleteFood } from "@/services/api"; // Ensure you import deleteFood
import FoodCard from "@/components/FoodCard";
import FoodModal from "@/components/FoodModal";
import ProtectedRoute from "@/components/ProtectedRoute";

const FoodsPage = () => {
	const [foods, setFoods] = useState<Food[]>([]);
	const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [sortOrder, setSortOrder] = useState<"meals" | "rating">("meals");
	const [modalVisible, setModalVisible] = useState(false);

	const fetchFoods = useCallback(async () => {
		try {
			const response = await getFoods();
			setFoods(response);
			setFilteredFoods(response);
		} catch (error) {
			console.error("Failed to fetch foods:", error);
		}
	}, []);

	useEffect(() => {
		fetchFoods();
	}, [fetchFoods]);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
		if (event.target.value === "") {
			setFilteredFoods(foods);
		} else {
			const filtered = foods.filter((food) =>
				food.name.toLowerCase().includes(event.target.value.toLowerCase())
			);
			setFilteredFoods(filtered);
		}
	};

	const handleSortChange = (order: "meals" | "rating") => {
		setSortOrder(order);
		const sortedFoods = [...filteredFoods].sort((a, b) => {
			if (order === "meals") {
				return b.meal_count - a.meal_count; // Sort by most common (highest meal count)
			} else {
				return b.avg_rate - a.avg_rate; // Sort by rating
			}
		});
		setFilteredFoods(sortedFoods);
	};

	const handleOpenModal = () => {
		setModalVisible(true);
	};

	const handleCloseModal = () => {
		setModalVisible(false);
		fetchFoods(); // Refresh the food list after closing the modal
	};

	const handleSave = (food: Food) => {
		// Optionally handle the save logic
	};

	const handleDelete = (foodId: number) => {
		setFoods((prevFoods) => prevFoods.filter((food) => food.id !== foodId));
		setFilteredFoods((prevFilteredFoods) =>
			prevFilteredFoods.filter((food) => food.id !== foodId)
		);
	};

	return (
		<ProtectedRoute>
			<div className="container xl:w-1/2 mx-auto p-2 items-center">
				<div className="flex justify-between items-center mb-4 gap-2">
					<Input
						isClearable
						placeholder="Search by food name"
						value={searchTerm}
						onChange={handleSearchChange}
						className="w-full"
					/>
					<Button
						isIconOnly
						color="success"
						className="h-full w-auto aspect-square"
						onPress={handleOpenModal}
					>
						<PlusIcon className="text-white size-6"></PlusIcon>
					</Button>
					<Dropdown>
						<DropdownTrigger>
							<Button variant="flat" className="px-10">
								Sort by {sortOrder === "meals" ? "Most Common" : "Rating"}
							</Button>
						</DropdownTrigger>
						<DropdownMenu
							onAction={(key) => handleSortChange(key as "meals" | "rating")}
						>
							<DropdownItem key="meals">
								<div className="flex items-center space-x-2">
									<ArrowUpIcon className="w-5 h-5" />
									<span>Most Common</span>
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

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:grid-cols-2">
					{filteredFoods.map((food) => (
						<FoodCard
							key={food.id}
							initialFood={food}
							onDelete={handleDelete} // Pass the handleDelete function to FoodCard
						/>
					))}
				</div>
				<FoodModal
					visible={modalVisible}
					onClose={handleCloseModal}
					initialData={null}
					isEditMode={false}
					onSave={handleSave}
					onDelete={handleDelete}
				/>
			</div>
		</ProtectedRoute>
	);
};

export default FoodsPage;
