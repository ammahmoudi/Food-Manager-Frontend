// app/page.tsx
"use client";

import withAuth from "../components/withAuth";
import { useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { getMeals } from "../services/api";

interface Meal {
	id: number;
	food: {
		name: string;
		description: string;
	};
	date: string;
}

const Home = () => {
	const [meals, setMeals] = useState<Meal[]>([]);

	useEffect(() => {
		async function fetchMeals() {
			try {
				const meals = await getMeals();
				setMeals(meals);
			} catch (error) {
				console.error("error fetching meals: ", error);
			}
		}
		fetchMeals();
	}, []);

	return (
		<div>
			{meals.map((meal) => (
				<div key={meal.id}>
					<Card>
						<CardBody>
							<span>{meal.food.name}</span>
							<span>{meal.food.description}</span>
						</CardBody>
					</Card>
				</div>
			))}
		</div>
	);
};

export default withAuth(Home);
