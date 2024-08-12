import React from "react";
import { Popover, PopoverTrigger, PopoverContent, Chip, Avatar } from "@nextui-org/react";
import { MealDetailCard } from "./MealDetailCard";

interface MealChipProps {
  mealName: string;
  mealDate: string;
  mealPicture: string;
  foodDescription: string;
  rating: number;
  onDelete: (mealId: number) => void;
}

const MealChip: React.FC<MealChipProps> = ({
  mealName,
  mealDate,
  mealPicture,
  foodDescription,
  rating,
  onDelete,
}) => {
  return (
    <Popover showArrow placement="bottom">
      <PopoverTrigger>
        <Chip
          variant="flat"
          avatar={<Avatar name={mealName} src={mealPicture} />}
          as="button"
          className="self-center"
        >
          {mealName}
        </Chip>
      </PopoverTrigger>
      <PopoverContent className="p-1">
        <MealDetailCard
          mealName={mealName}
          mealDate={mealDate}
          mealPicture={mealPicture}
          foodDescription={foodDescription}
          rating={rating}
          onDelete={onDelete}
        />
      </PopoverContent>
    </Popover>
  );
};

export default MealChip;
