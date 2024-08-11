import React, { useState } from "react";
import { Card, CardBody, Image } from "@nextui-org/react";
import { StarIcon } from "@heroicons/react/24/solid";
import { Food } from "../interfaces/Food";
import { getFoodDetails } from "@/services/api";
import FoodDetailModal from "./FoodModal";
import FoodModal from "./FoodModal";

interface FoodCardProps {
	initialFood: Food;
}

const FoodCard: React.FC<FoodCardProps> = ({ initialFood }): JSX.Element => {
	const [food, setFood] = useState<Food | null>(initialFood);
	const [modalVisible, setModalVisible] = useState(false);

	const fetchFood = async () => {
		try {
			const response = await getFoodDetails(food?.id!);
			setFood(response);
		} catch (error) {
			setFood(null);
			console.error("Failed to fetch food details:", error);
		}
	};

	const handleOpenModal = () => {
		setModalVisible(true);
	};

	const handleCloseModal = () => {
		fetchFood();
		setModalVisible(false);
	};
	const handleSave = (food: Food) => {
		fetchFood();
	};

	const handleDelete = () => {};

	return (
		<div className="food-card h-full w-full p-0.5">
			{food ? (
				<Card
					isBlurred
					className="border-none bg-background/60 dark:bg-default-100/50 h-full w-full"
					isPressable
					onPress={handleOpenModal}
					shadow="sm"
				>
					<CardBody>
						<div className="flex items-center gap-4">
							<div className="relative flex-shrink-0 aspect-square">
								<Image
									alt={food.name}
									className="z-0 w-full h-full  object-cover"
									classNames={{
										wrapper: "w-full h-full max-w-full max-h-full",
									}}
									shadow="md"
									src={food.picture ?? "/images/food-placeholder.jpg"} // Add a placeholder image if no picture is available
									width={120} // Adjust width as needed
									height={120} // Keep the height matching the content
								/>
							</div>

							<div className="flex flex-col overflow-hidden">
								<h1 className="font-black text-foreground/90">{food.name}</h1>
								<div className="flex items-center gap-0.5 mt-1">
									{[...Array(5)].map((_, i) => (
										<StarIcon
											key={i}
											className={
												(i < food.rating
													? "text-yellow-500"
													: "text-gray-300") + " w-4 h-4"
											}
										/>
									))}
								</div>
								<p className="text-small text-foreground/80 mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
									{food.description}
								</p>
								<p className="text-xs text-foreground/60 mt-1">
									{food.meal_count} meals
								</p>
							</div>
						</div>
					</CardBody>
					<FoodModal
						visible={modalVisible}
						onClose={handleCloseModal}
						initialData={food}
						isEditMode={false}
						onSave={handleSave}
						onDelete={handleDelete}
					/>
				</Card>
			) : (
				<Card
					isFooterBlurred
					radius="md"
					className="h-full w-full justify-center items-center"
					isPressable
					onPress={handleOpenModal}
				>
					<div className="h-full flex items-center justify-center ">
						<p className="text-medium text-black/60 uppercase font-bold text-center">
							No Data
						</p>
					</div>
				</Card>
			)}

			<FoodModal
				visible={modalVisible}
				onClose={handleCloseModal}
				initialData={food}
				isEditMode={true}
				onSave={function (food: Food): void {
					throw new Error("Function not implemented.");
				}}
				onDelete={function (foodId: number): void {
					throw new Error("Function not implemented.");
				}}
			/>
		</div>
	);
};

export default FoodCard;
