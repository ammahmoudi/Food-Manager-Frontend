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
						            <div className="flex items-center gap-0.5 mt-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${
                i < food.avg_rate ? "text-yellow-500" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927C9.269 2.36 9.731 2 10.35 2s1.08.36 1.301.927l1.717 4.175 4.693.688c.714.104 1.002.98.484 1.486l-3.397 3.309.801 4.678c.122.712-.599 1.272-1.231.931L10 15.347l-4.197 2.202c-.633.342-1.353-.22-1.23-.931l.8-4.678-3.396-3.309c-.518-.507-.23-1.382.485-1.486l4.692-.688 1.717-4.175z" />
            </svg>
          ))}
        </div>
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
			{/* <CardBody className="px-3 pt-0 pb-2">
				<p className="text-small pl-px text-default-500">{food.description}</p>
			</CardBody> */}
			{/* <CardFooter className="gap-3">
				<div className="flex gap-1">
					<p className="text-default-500 text-small">Rating: {food.avg_rate}</p>
				</div>
			</CardFooter> */}
		</Card>
	);
};
