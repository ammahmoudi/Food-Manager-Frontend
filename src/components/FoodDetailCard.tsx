import React from "react";
import {
	Avatar,
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Link,
} from "@nextui-org/react";
import { Food } from "@/interfaces/Food";

interface FoodDetailCardProps {
	food: Food;
}

export const FoodDetailCard: React.FC<FoodDetailCardProps> = ({ food }) => {
	return (
		<Card shadow="none" className="max-w-[300px] border-none bg-transparent">
			<CardHeader className="justify-between">
				<div className="flex gap-3">
					<Avatar
						isBordered
						radius="full"
						size="md"
						src={(food?.image as string) ?? "images/food-placeholder.jpg"}
					/>
					<div className="flex flex-col items-start justify-center">
						<h4 className="text-small font-semibold leading-none text-default-600">
							{food.name}
						</h4>
					</div>
				</div>
				<Button
					color="primary"
					radius="full"
					size="sm"
					as={Link}
					isExternal
					href={`foods/${food.id}`}
					className="m-2"
				>
					More
				</Button>
			</CardHeader>
			<CardBody className="px-3 py-0">
				<p className="text-small pl-px text-default-500">{food.description}</p>
			</CardBody>
			<CardFooter className="gap-3">
				<div className="flex gap-1">
					<p className="text-default-500 text-small">Rating: {food.avg_rate}</p>
				</div>
			</CardFooter>
		</Card>
	);
};
