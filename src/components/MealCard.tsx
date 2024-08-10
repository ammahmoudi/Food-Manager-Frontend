import React, { useState } from "react";
import { Card, CardBody, Image, Button, CardFooter } from "@nextui-org/react";
import { format } from "date-fns-jalali";
import Link from "next/link";
import { StarIcon } from "@heroicons/react/24/solid";
import { Meal } from "../interfaces/Meal";
import { useRouter } from "next/navigation";
import MealDetailModal from "./MealDetailModal";
import { getMealByDate } from "@/services/api";
import { formatDateToYYYYMMDD } from "@/utils/dateUtils";

interface MealCardProps {
	date: Date;
	initialMeal: Meal | null;
}

const MealCard: React.FC<MealCardProps> = ({
	date,
	initialMeal,
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
	const handleSave = (meal: Meal | null) => {};
	const handleDelete = (mealId: number) => {};

	return (
		<div className={`meal-cell h-full w-full p-0.5 `}>
			{meal ? (
				<Card
					isBlurred
					className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
					isPressable
					onPress={handleOpenModal}
					shadow="sm"
				>
					<CardBody>
						<div className="grid grid-cols-12  gap-6 md:gap-4 items-center justify-center">
							<div className="relative col-span-6 md:col-span-4">
								<Image
									alt={meal.food?.name}
									className="object-cover"
									shadow="md"
									src={meal.food?.picture ?? "/images/food-placeholder.jpg"} // Add a placeholder image if no picture is available
									width="100%"
								/>
							</div>

							<div className="flex flex-col col-span-6 md:col-span-8">
								<div className="flex justify-between items-start">
									<div className="flex flex-col gap-0">
										<h3 className="font-semibold text-foreground/90">
											{format(new Date(meal.date), "yyyy/MM/dd")}
										</h3>
										<Link href={`/foods/${meal.food?.id}`}>
											<h1 className="text-large font-medium mt-2">
												{meal.food?.name}
											</h1>
										</Link>
										<p className="text-small text-foreground/80">
											{meal.food?.description}
										</p>
									</div>
									<div className="flex items-center gap-0.5">
										{[...Array(5)].map((_, i) => (
											<StarIcon
												key={i}
												className={
													i < meal.rating ? "text-yellow-500" : "text-gray-300"
												}
											/>
										))}
									</div>
								</div>

								{/* {isAdmin && (
                 <Button
                   variant="bordered"
                   onClick={() => router.push(`/meals/edit/${meal.id}`)}
                   className="mt-3"
                 >
                   Edit
                 </Button>
               )} */}
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
