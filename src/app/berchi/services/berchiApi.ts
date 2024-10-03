"use client";
import { CreateMealData } from "../interfaces/CreateMealData";
import { FoodFormData } from "../interfaces/FoodFormData";
import { api } from "../../../services/api";

//Food Apis

export const getFoods = async () => {
	const response = await api.get("foods/");
	return response.data;
};
export const getFoodDetails = async (foodId: number) => {
	const response = await api.get(`foods/${foodId}/`);
	return response.data;
};

export const addFood = async (food: FoodFormData) => {
	// const formData = createFoodFormData(food);
	const response = await api.post("foods/", food, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

	return response.data;
};

export const updateFood = async (id: number, food: FoodFormData) => {
	// const formData = createFoodFormData(food);
	const response = await api.put(`foods/${id}/`, food, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data;
};

export const deleteFood = async (id: number) => {
	const response = await api.delete(`foods/${id}/`);
	return response.data;
};
//Meal Apis

export const updateMeal = async (id: number, meal: CreateMealData) => {
	const response = await api.put(`meals/${id}/`, meal);
	return response.data;
};
export const createMeal = async (data: CreateMealData) => {
	const response = await api.post("meals/", data);
	return response.data;
};
export const deleteMeal = async (id: number) => {
	const response = await api.delete(`meals/${id}/`);
	return response.data;
};
export const getMealsWithFood = async (foodId: number) => {
	const response = await api.get(`foods/${foodId}/meals/`);
	return response.data;
};

export const getFilteredMeals = async (filter: string) => {
	const response = await api.get(`meals/filter/${filter}/`);
	return response.data;
};

export const getMealsForCurrentMonth = async (year: number, month: number) => {
	const response = await api.get(`meals/current-month/${year}-${month}`);
	return response.data;
};
export const getMeals = async () => {
	const response = await api.get("meals/");
	return response.data;
};

export const getMealById = async (id: number) => {
	const response = await api.get(`meals/${id}/`);
	return response.data;
};

export const getMealByDate = async (date: string) => {
	const response = await api.get(`meals/date/${date}/`);
	return response.data;
};
export const getCurrentDayMeal = async () => {
	const today = new Date().toISOString().split("T")[0];
	const response = await api.get(`meals/date/${today}/`);
	return response.data;
};
//Comment Apis

export const getMealComments = async (mealId: number) => {
	const response = await api.get(`meals/${mealId}/comments/`);
	return response.data;
};
export const getLatestComments = async () => {
	const response = await api.get("comments/latest/");
	// console.log(response.data)
	return response.data;
};
// Fetch comments by a specific user
export const getUserComments = async (userId: number) => {
	const response = await api.get(`users/${userId}/comments/`);
	return response.data;
};
// Submit a comment for a specific meal

export const submitCommentForMeal = async (mealId: number, text: string) => {
	const response = await api.post(`/comments/`, { meal_id: mealId, text });
	return response.data;
};
// Update a comment for a specific meal
export const updateCommentForMeal = async (commentId: number, text: string) => {
	const response = await api.put(`/comments/${commentId}/`, { text });
	return response.data;
};
// Delete a comment for a specific meal
export const deleteCommentForMeal = async (commentId: number) => {
	const response = await api.delete(`/comments/${commentId}/`);
	return response.data;
};
// Fetch the user's comments for a specific meal

export const getUserCommentsForMeal = async (mealId: number) => {
	const response = await api.get(`/meals/${mealId}/comments/`);
	return response.data;
};
export const getFoodComments = async (foodId: number) => {
	const response = await api.get(`foods/${foodId}/comments/`);
	return response.data;
};
//Rate Apis
// Fetch the user's rating for a specific meal

export const getUserRateForMeal = async (mealId: number) => {
	const response = await api.get(`/meals/${mealId}/rate/`);
	return response.data;
};
// Submit or update the user's rating for a specific meal

export const submitRateForMeal = async (mealId: number, rate: number) => {
	const response = await api.post(`/meals/${mealId}/rate/`, { rate });
	return response.data;
};
