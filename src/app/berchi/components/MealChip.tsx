'use client';

import React from "react";
import { Popover, PopoverTrigger, PopoverContent, Chip, Avatar } from "@nextui-org/react";
import { MealDetailCard } from "./MealDetailCard";
import { Meal } from "../interfaces/Meal";

interface MealChipProps {
meal?:Meal;
}

const MealChip: React.FC<MealChipProps> = ({
  meal,
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
        {meal&&<MealDetailCard
          meal={meal}
        />}
      </PopoverContent>
    </Popover>
  );
};

export default MealChip;
