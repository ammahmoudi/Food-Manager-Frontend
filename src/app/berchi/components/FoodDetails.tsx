"use client";

import { FC } from "react";
import { Link, Image } from "@nextui-org/react";
import { Meal } from "../interfaces/Meal";
import { Food } from "../interfaces/Food";
import CommentSection from "./CommentSection";
import { format } from "date-fns-jalali/format";

const StarIcon: FC<{ filled: boolean }> = ({ filled }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill={filled ? "currentColor" : "none"}
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
	</svg>
);
interface FoodDetailsProps {
	food: Food;
	meals: Meal[];
}
const FoodDetails: FC<FoodDetailsProps> = ({ food, meals }) => {
	return (
		<div className="max-w-4xl mx-auto px-4 py-12 md:px-6 lg:py-16">
			<div className="grid md:grid-cols-2 gap-8 items-start">
				<div>
					<Image
						src={(food.image as string) ?? "images/food-placeholder.jpg"}
						alt="Food Image"
						className="w-full rounded-lg object-cover aspect-square"
					/>
				</div>
				<div className="space-y-6">
					<div>
						<h1 className="text-3xl font-bold">{food.name}</h1>
						<p className="text-muted-foreground">{food.description}</p>
						<div className="flex items-center gap-2 mt-2">
							<div className="flex items-center gap-0.5">
								{[...Array(5)].map((_, i) => (
									<StarIcon key={i} filled={i < food.avg_rate} />
								))}
							</div>
							<span className="text-muted-foreground text-sm">
								({food.avg_rate})
							</span>
						</div>
					</div>
					{/* <div className="text-sm text-muted-foreground">Posted on</div> */}
				</div>
			</div>
			<div className="mt-12">
				<h2 className="text-2xl font-bold mb-6">Comments</h2>
				<CommentSection variant="food" foodId={food.id} />
			</div>
			<div className="mt-12">
				<h2 className="text-2xl font-bold mb-6">Meals with this Food</h2>
				<div className="space-y-8">
					{meals.map((meal, index) => (
						<div key={index} className="flex gap-4">
							<div className="flex-1">
								<div className="flex items-center justify-between">
									<div className="font-medium">
										{format(new Date(meal.date), "yyyy/MM/dd")}
									</div>
									<div className="flex items-center gap-0.5">
										<StarIcon filled={true} />
										<span className="text-muted-foreground text-sm">
											({meal.avg_rate})
										</span>
									</div>
									<Link href={`/meals/${meal.date}`}>
										<p className="text-blue-500 hover:underline">View Meal</p>
									</Link>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default FoodDetails;
