"use client";

import React, { useState } from "react";
import { Card, CardBody, Image, Link } from "@nextui-org/react";
import { StarIcon } from "@heroicons/react/24/solid";
import { Food } from "../interfaces/Food";
import FoodModal from "./FoodModal";
import { useUser } from "@/context/UserContext";

interface FoodCardProps {
	initialFood: Food;
	onDelete: (foodId: number) => void;
}

const FoodCard: React.FC<FoodCardProps> = ({
	initialFood,
	onDelete,
}): JSX.Element => {
	const [food, setFood] = useState<Food | null>(initialFood);
	const [modalVisible, setModalVisible] = useState(false);
	const { isAdmin } = useUser();

	const handleOpenModal = () => {
		setModalVisible(true);
	};

	const handleCloseModal = () => {
		setModalVisible(false);
	};

	const handleSave = (updatedFood: Food) => {
		setFood(updatedFood);
	};

	const handleDelete = async (foodId: number) => {
		onDelete(foodId);
	};

	return (
		<div className="food-card h-full w-full p-0.5">
			{food ? (
				<Card
					className="border-none  dark:bg-grey-100/50 h-full w-full"
					isPressable
					{...(isAdmin
						? { onPress: handleOpenModal }
						: { as: Link, href: `foods/${food.id}`, isExternal: true })}
					shadow="sm"
				>
					<CardBody>
						<div className="flex items-center gap-4">
							<div className="relative flex-shrink-0 aspect-square">
								<Image
									alt={food.name}
									className="z-0 w-full h-full object-cover aspect-square"
									classNames={{
										wrapper: "w-full h-full max-w-full max-h-full",
									}}
									shadow="md"
									height={120}
									width={120}
									src={(food.image as string) ?? "/images/food-placeholder.jpg"}
								/>
							</div>

							<div className="flex flex-col overflow-hidden">
								<h1 className="font-black text-foreground/90">{food.name}</h1>
								<div className="flex items-center gap-0.5 mt-1">
									{[...Array(5)].map((_, i) => (
										<StarIcon
											key={i}
											className={
												(i < food.avg_rate
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
						isEditMode={true}
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
		</div>
	);
};

export default FoodCard;
