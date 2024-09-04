import React from "react";
import { Popover, PopoverTrigger, PopoverContent, Chip, Avatar } from "@nextui-org/react";
import { MealDetailCard } from "./MealDetailCard";
import { Meal } from "@/interfaces/Meal";

interface MealChipProps {
meal:Meal;
  onDelete: (mealId: number) => void;
}

const MealChip: React.FC<MealChipProps> = ({
  meal,
  onDelete,
}) => {
  return (
    <Popover showArrow placement="bottom">
      <PopoverTrigger>
        <Chip
          variant="flat"
          avatar={<Avatar name={meal?.food?.name} src={(meal?.food?.image as string) ?? "images/food-placeholder.jpg"} />}
          as="button"
          className="self-center"
          size="sm"
        >
          {meal?.food?.name}
        </Chip>
      </PopoverTrigger>
      <PopoverContent className="p-1">
        <MealDetailCard
          meal={meal}
          onDelete={onDelete}
        />
      </PopoverContent>
    </Popover>
  );
};

export default MealChip;
