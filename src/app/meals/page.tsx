"use client";

import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Link } from "@nextui-org/react";
import {
	Dropdown,
	DropdownMenu,
	DropdownTrigger,
	DropdownItem,
} from "@nextui-org/react";
import { Meal } from "../../interfaces/Meal";
import { toJalali } from "../../utils/dateUtils";
import { getAdminCheck, getFilteredMeals } from "@/services/api";
import { format } from "date-fns-jalali";
import MealCard from "@/components/MealCard";
const ListOrderedIcon = (props: any) => (
	<svg
		{...props}
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<line x1="10" x2="21" y1="6" y2="6" />
		<line x1="10" x2="21" y1="12" y2="12" />
		<line x1="10" x2="21" y1="18" y2="18" />
		<path d="M4 6h1v4" />
		<path d="M4 10h2" />
		<path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
	</svg>
);

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

const MealsPage = () => {
	const [meals, setMeals] = useState<Meal[]>([]);
	const [filter, setFilter] = useState("all");
	const [sort, setSort] = useState("rating");
	const [isAdmin, setIsAdmin] = useState(false);
	const [got, setGot] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const fetchMeals = async () => {
			try {
				const response = await getFilteredMeals(filter);
				setMeals(response);
				setGot(true);
			} catch (error) {
				console.error("Failed to fetch meals:", error);
			}
		};

		const checkAdmin = async () => {
			try {
				const response = await getAdminCheck();
				setIsAdmin(response.is_admin);
			} catch (error) {
				console.error("Failed to check admin status:", error);
			}
		};

		fetchMeals();
		checkAdmin();
	}, [filter]);

	const sortMeals = (meals: Meal[]) => {
		return meals.sort((a, b) => {
			if (sort === "rating") {
				return b.rating - a.rating;
			} else {
				return new Date(a.date).getTime() - new Date(b.date).getTime();
			}
		});
	};

	const filteredMeals = sortMeals(meals);

	return (
		<div className=" container xl:w-1/2 mx-auto p-2 items-center">
			<div className="flex flex-col items-center">
				<div className="flex items-center py-2 space-x-1 mb-4">
					<Button variant="bordered" onClick={() => setFilter("all")}>
						Show All
					</Button>
					<Button variant="bordered" onClick={() => setFilter("current_week")}>
						This Week
					</Button>
					<Button variant="bordered" onClick={() => setFilter("upcoming")}>
						Upcoming
					</Button>
					<Button variant="bordered" onClick={() => setFilter("past")}>
						Past
					</Button>
					<Dropdown>
						<DropdownTrigger>
							<Button variant="bordered" className="gap-1">
								<ListOrderedIcon className="h-4 w-4" />
								Sort by
							</Button>
						</DropdownTrigger>
						<DropdownMenu>
							<DropdownItem onClick={() => setSort("rating")}>
								Rating
							</DropdownItem>
							<DropdownItem onClick={() => setSort("date")}>Date</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			</div>
			<div className="grid items-center justify-center gap-4">
				{got &&
					filteredMeals.map((meal) => (
						<MealCard key={meal.id} date={meal.date} initialMeal={meal} />
					))}
			</div>
		</div>
	);
};

export default MealsPage;
