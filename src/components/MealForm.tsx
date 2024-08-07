"use client";

import React, { FC, useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Link,
} from "@nextui-org/react";
import { Food } from "../interfaces/Food";
import { getAdminCheck, getMealsWithFood } from "../services/api";
import CustomFoodAutocomplete from "./CustomFoodAutocomplete";
import { MealWithFood } from "../interfaces/MealWithFood";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import FoodModal from "./FoodModal";

interface MealFormProps {
  date: Date;
  onSave: (food: Food) => void;
}

const MealForm: FC<MealFormProps> = ({ date, onSave }) => {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [meals, setMeals] = useState<MealWithFood[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [shouldUpdateFoods, setShouldUpdateFoods] = useState(false);

  const fetchAdminStatus = async () => {
    try {
      const response = await getAdminCheck();
      setIsAdmin(response.is_admin);
    } catch (error) {
      console.error("Failed to fetch admin status:", error);
    }
  };

  const fetchMealsWithFood = async () => {
    if (selectedFood) {
      try {
        const fetchedMeals = await getMealsWithFood(selectedFood.id);
        setMeals(fetchedMeals);
      } catch (error) {
        console.error("Failed to fetch meals with food:", error);
      }
    }
  };

  useEffect(() => {
    fetchAdminStatus();
  }, []);

  useEffect(() => {
    fetchMealsWithFood();
  }, [selectedFood]);

  useEffect(() => {
    if (meals.length > 0) {
      const average =
        meals.reduce((acc, meal) => acc + meal.rating, 0) / meals.length;
      setAverageRating(average);
    }
  }, [meals]);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setShouldUpdateFoods(true); // Trigger update in CustomFoodAutocomplete
  };

  const handleSave = (food: Food) => {
    fetchMealsWithFood();
    setSelectedFood(food);
  };

  const handleDelete = (foodId: number) => {
    fetchMealsWithFood();
    setSelectedFood(null);
  };

  return (
    <div className="meal-form">
      {selectedFood && (
        <Card isFooterBlurred className=" aspect-square mb-4">
          <CardHeader className="absolute z-10 top-1 items-start">
            <div className="flex flex-grow gap-2 items-top justify-between">
              <div className="flex flex-col">
                <h3
                  className="text-white font-bold text-2xl"
                  style={{
                    textShadow:
                      "0 0 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  {selectedFood.name}
                </h3>
                <p
                  className="text-lg text-white/80 uppercase font-medium"
                  style={{
                    textShadow:
                      "0 0 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  {selectedFood.description}
                </p>
              </div>

              {isAdmin && (
                <Button
                  radius="full"
                  size="sm"
                  className=" aspect-square bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                  onPress={handleOpenModal}
                >
                  <PencilSquareIcon className="h-5 w-5" />
                </Button>
              )}
            </div>
          </CardHeader>
          <Image
            removeWrapper
            alt={selectedFood.name}
            className="z-0 w-full h-full object-cover"
            src={selectedFood.picture}
          />
          <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
            <div className="flex flex-grow gap-2 items-center">
              <div className="flex flex-col">
                <p className="text-tiny text-white/60">
                  <span className="text-muted-foreground text-sm">
                    ({averageRating.toFixed(1)})
                  </span>
                </p>
              </div>
            </div>
            <Button
              radius="full"
              size="sm"
              className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
              as={Link}
              href={`/foods/${selectedFood.id}`}
              isExternal
            >

              more
            </Button>
          </CardFooter>
        </Card>
      )}
      <CustomFoodAutocomplete
        selectedFood={selectedFood}
        onFoodSelect={setSelectedFood}
        shouldUpdate={shouldUpdateFoods}
        onUpdateComplete={() => setShouldUpdateFoods(false)}
      />
      <Button
        color="primary"
        variant="ghost"
        onPress={() => selectedFood && onSave(selectedFood)}
        className="mt-4"
      >
        Save Meal
      </Button>
      <FoodModal
        visible={modalVisible}
        onClose={handleCloseModal}
        initialData={selectedFood}
        isEditMode={true}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default MealForm;
