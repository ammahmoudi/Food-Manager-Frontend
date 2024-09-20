"use client";

import React, { FC, useState, useEffect } from "react";
import {
	Autocomplete,
	AutocompleteItem,
	Avatar,
	Button,
	Link,
} from "@nextui-org/react";
import { getFoods, addFood } from "../services/api";
import { Food } from "../interfaces/Food";
import {
	MagnifyingGlassIcon,
	PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import FoodModal from "./FoodModal";
import { toast } from "react-toastify";

interface CustomFoodAutocompleteProps {
	selectedFood: Food | null;
	onFoodSelect: (food: Food | null) => void;
	shouldUpdate: boolean;
	onUpdateComplete: () => void;
}

const CustomFoodAutocomplete: FC<CustomFoodAutocompleteProps> = ({
	selectedFood,
	onFoodSelect,
	shouldUpdate,
	onUpdateComplete,
}) => {
	const [foods, setFoods] = useState<Food[]>([]);
	const [inputValue, setInputValue] = useState("");
	const [modalVisible, setModalVisible] = useState(false);

	const fetchFoods = async () => {
		try {
			await toast.promise(
				getFoods(),
				{
					pending: "Loading foods...",
					success: "Foods loaded successfully!",
					error: "Failed to load foods",
				}
			).then((response) => {
				setFoods(response);
			});
		} catch (error) {
			console.error("Failed to fetch foods:", error);
		}
	};

	useEffect(() => {
		fetchFoods();
	}, []);

	useEffect(() => {
		if (shouldUpdate) {
			fetchFoods();
			onUpdateComplete();
		}
	}, [shouldUpdate, onUpdateComplete]);

	const handleOpenModal = () => {
		setModalVisible(true);
	};

	const handleCloseModal = () => {
		setModalVisible(false);
		fetchFoods(); // Refresh the food list after closing the modal
	};

	const handleSave = async (food: Food) => {
		try {
			await toast.promise(
				addFood(food),
				{
					pending: "Adding food...",
					success: "Food added successfully!",
					error: "Failed to add food",
				}
			);
			fetchFoods();
			onFoodSelect(food);
			setInputValue(food.name);
		} catch (error) {
			console.error("Failed to add food:", error);
		}
	};

	const handleDelete = () => {
		fetchFoods();
	};

	return (
		<div className="justify-between flex gap-2">
			<Autocomplete
				classNames={{
					listboxWrapper: "max-h-[320px]",
					selectorButton: "text-default-500",
				}}
				variant="flat"
				defaultItems={foods}
				defaultInputValue={inputValue}
				onInputChange={setInputValue}
				onSelectionChange={(key) => {
					if (key !== null) {
						const selected = foods.find((food) => food.id === +key);
						onFoodSelect(selected || null);
					}
				}}
				selectedKey={selectedFood?.id.toString() || ""}
				inputProps={{
					classNames: {
						input: "ml-1",
						inputWrapper: "h-full",
					},
				}}
				listboxProps={{
					hideSelectedIcon: false,
					emptyContent: (
						<Link>
							<PlusCircleIcon className="size-6"></PlusCircleIcon>Add This Food
						</Link>
					),
					itemClasses: {
						base: [
							"rounded-medium",
							"text-default-500",
							"transition-opacity",
							"data-[hover=true]:text-foreground",
							"dark:data-[hover=true]:bg-default-50",
							"data-[pressed=true]:opacity-70",
							"data-[hover=true]:bg-default-200",
							"data-[selectable=true]:focus:bg-default-100",
							"data-[focus-visible=true]:ring-default-500",
						],
					},
				}}
				aria-label="Select a food"
				placeholder="Enter food name"
				popoverProps={{
					offset: 10,
					classNames: {
						base: "rounded-large",
						content: "p-1 border-small border-default-100 bg-background",
					},
				}}
				startContent={
					<MagnifyingGlassIcon
						className="text-default-400 size-6"
						strokeWidth={2.5}
					/>
				}
				radius="lg"
			>
				{(item) => (
					<AutocompleteItem key={item.id} textValue={item.name}>
						<div className="flex justify-between items-center">
							<div className="flex gap-2 items-center">
								<Avatar
									alt={item.name}
									className="flex-shrink-0"
									size="sm"
									src={item.image as string}
								/>
								<div className="flex flex-col">
									<span className="text-small">{item.name}</span>
									<span className="text-tiny text-default-400 overflow-hidden truncate">
										{item.description}
									</span>
								</div>
							</div>
						</div>
					</AutocompleteItem>
				)}
			</Autocomplete>
			<Button
				isIconOnly
				color="success"
				className="h-full w-auto aspect-square"
				onPress={handleOpenModal}
			>
				<PlusIcon className="text-white size-6"></PlusIcon>
			</Button>

			<FoodModal
				visible={modalVisible}
				onClose={handleCloseModal}
				initialData={null}
				isEditMode={false}
				onSave={handleSave}
				onDelete={handleDelete}
			/>
		</div>
	);
};

export default CustomFoodAutocomplete;
