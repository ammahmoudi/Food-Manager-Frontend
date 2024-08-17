import React, { useState } from "react";
import { Card, CardBody, Image } from "@nextui-org/react";
import { format } from "date-fns-jalali";
import { StarIcon } from "@heroicons/react/24/solid";
import { Meal } from "../interfaces/Meal";
import MealDetailModal from "./MealDetailModal";
import { getMealByDate } from "@/services/api";
import { formatDateToYYYYMMDD } from "@/utils/dateUtils";

interface MealCardProps {
	date: Date;
	initialMeal: Meal | null;
	onDelete: (mealId: number) => void;
}

const MealCard: React.FC<MealCardProps> = ({
	date,
	initialMeal,
	onDelete,
}): JSX.Element => {
	const [meal, setMeal] = useState<Meal | null>(initialMeal);
	const [modalVisible, setModalVisible] = useState(false);

	const fetchMeal = async () => {
		try {
			const response = await getMealByDate(formatDateToYYYYMMDD(date));
			setMeal(response);
		} catch (error) {
			setMeal(null);
			console.error("Failed to fetch meals:", error);
		}
	};

	const handleOpenModal = () => {
		setModalVisible(true);
	};

	const handleCloseModal = () => {
		fetchMeal();
		setModalVisible(false);
	};

	const handleSave = (meal: Meal | null) => {
		// Optionally handle save logic
	};

	const handleDelete = (mealId: number) => {
		onDelete(mealId);
	};

	return (
		<div className="meal-card h-full w-full p-0.5">
			{meal ? (
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
									alt={meal.food?.name}
									className="z-0 w-full h-full object-cover"
									classNames={{
										wrapper: "w-full h-full max-w-full max-h-full ",
									}}
									shadow="md"
									src={meal.food?.image as string ?? "/images/food-placeholder.jpg"} // Add a placeholder image if no picture is available
									width={120} // Adjust width as needed
									height={120} // Keep the height matching the content
								/>
							</div>

							<div className="flex flex-col overflow-hidden">
								<h1 className="font-black text-foreground/90">
									{format(new Date(meal.date), "yyyy/MM/dd")}
								</h1>
								<h2 className="text-large font-semibold mt-2">
									{meal.food?.name}
								</h2>
								<div className="flex items-center gap-0.5 mt-1">
									{[...Array(5)].map((_, i) => (
										<StarIcon
											key={i}
											className={
												(i < meal.avg_rate
													? "text-yellow-500"
													: "text-gray-300") + " w-4 h-4"
											}
										/>
									))}
								</div>
								<p className="text-small text-foreground/80 mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
									{meal.food?.description}
								</p>
							</div>
						</div>
					</CardBody>
					<MealDetailModal
						visible={modalVisible}
						onClose={handleCloseModal}
						date={date}
						onSave={handleSave}
						initialData={meal}
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
							{format(date, "d")}
						</p>
					</div>
				</Card>
			)}

			<MealDetailModal
				visible={modalVisible}
				onClose={handleCloseModal}
				date={date}
				onSave={handleSave}
				initialData={meal}
				onDelete={handleDelete}
			/>
		</div>
	);
};

export default MealCard;
