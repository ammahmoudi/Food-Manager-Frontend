"use client";

import axios from "axios";
import { FoodFormData } from "@/interfaces/FoodFormData";
import { jwtDecode, JwtPayload } from "jwt-decode"; // To decode JWT and check expiration
import { UpdateUserData } from "@/interfaces/UpdateUserData";
import { SignUpData } from "@/interfaces/SignUpData";
import { CreateMealData } from "@/interfaces/CreateMealData";

const API_BASE_URL = "http://localhost:8000/api/";

const api = axios.create({
	baseURL: API_BASE_URL,
});

//Auth Apis

const getToken = () => {
	return localStorage.getItem("access") || sessionStorage.getItem("access");
};

const getRefreshToken = () => {
	return localStorage.getItem("refresh") || sessionStorage.getItem("refresh");
};

const setToken = (access: string, refresh: string, remember: boolean) => {
	if (remember) {
		localStorage.setItem("access", access);
		localStorage.setItem("refresh", refresh);
	} else {
		sessionStorage.setItem("access", access);
		sessionStorage.setItem("refresh", refresh);
	}
};

const clearTokens = () => {
	localStorage.removeItem("access");
	localStorage.removeItem("refresh");
	sessionStorage.removeItem("access");
	sessionStorage.removeItem("refresh");
};

const isTokenValid = (token: string) => {
	try {
		const decoded = jwtDecode<JwtPayload>(token);
		const currentTime = Date.now() / 1000; // Current time in seconds
		if (decoded.exp) {
			return decoded.exp > currentTime;
		} else {
			return false;
		}
	} catch (error) {
		console.error('error in token validation',error);
		return false;
	}
};

export const refreshToken = async () => {
	const refresh = getRefreshToken();
	if (refresh && isTokenValid(refresh)) {
		try {
			// console.log('Attempting to refresh token...');
			const response = await api.post(`auth/jwt/refresh/`, {
				refresh,
			});
			const { access } = response.data;
			const remember = Boolean(localStorage.getItem("refresh"));
			setToken(access, refresh, remember);
			return access;
		} catch (error) {
			console.error("Failed to refresh token:", error);
			clearTokens();
			// window.location.href = "/login"; // Redirect to login page if refresh fails
			return null;
		}
	}
	clearTokens();
	// window.location.href = "/login"; // Redirect to login page if no valid refresh token
	return null;
};

api.interceptors.request.use(
	(config) => {
		const token = getToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (
			error.response &&
			error.response.status === 401 &&
			!originalRequest._retry
		) {
			originalRequest._retry = true;

			// Avoid infinite loop by checking if the request is a refresh attempt
			if (
				originalRequest.url.includes("/auth/jwt/refresh/") ||
				originalRequest.url.includes("/users/me/")
			) {
				clearTokens();
				// window.location.href = "/login";
				return Promise.reject(error);
			}

			const newToken = await refreshToken();
			if (newToken) {
				originalRequest.headers.Authorization = `Bearer ${newToken}`;
				return api(originalRequest);
			} else {
				clearTokens();
				// window.location.href = "/login";
			}
		}

		return Promise.reject(error);
	}
);

//User Apis

export const login = async (phone_number: string, password: string) => {
	const response = await api.post("auth/jwt/create/", {
		phone_number,
		password,
	});
	const { access, refresh } = response.data;
	return { access, refresh };
};
// Fetch current user data
export const getCurrentUser = async () => {
	const response = await api.get("/auth/users/me/");
	return response.data;
};

// Update current user data
export const updateUser = async (userData: UpdateUserData) => {
	const formData = new FormData();
	formData.append("full_name", userData.full_name);
	formData.append("phone_number", userData.phone_number);

	if (userData.user_image) {
		formData.append("user_image", userData.user_image);
	}

	if (userData.remove_image) {
		formData.append("remove_image", "true"); // Add this flag to the request
	}
	const response = await api.put("auth/users/me/", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

	return response.data;
};

// Change user password
export const changePassword = async (
	oldPassword: string,
	newPassword: string,
	confirmPassword: string
) => {
	const response = await api.post("auth/users/set_password/", {
		current_password: oldPassword,
		new_password: newPassword,
		re_new_password: confirmPassword,
	});
	return response.data;
};
export const checkPhoneNumberUnique = async (phoneNumber: string) => {
	const response = await api.get("users/check-phone-number/", {
		params: { phone_number: phoneNumber },
	});
	return response.data;
};
export const signup = async (data: SignUpData) => {
	const response = await api.post("/auth/users/", data);
	return response;
};

//Food Apis
export const getFoods = async () => {
	const response = await api.get("foods/");
	return response.data;
};
export const getFoodDetails = async (foodId: number) => {
	const response = await api.get(`foods/${foodId}/`);
	return response.data;
};
// const createFoodFormData = (food: Partial<FoodFormData>) => {
// 	const formData = new FormData();

// 	if (food.name) formData.append("name", food.name);
// 	if (food.description) formData.append("description", food.description);

// 	// Handle image field
// 	if (food.image === "") {
// 		// If the image is an empty string, indicate that the image should be removed
// 		formData.append("remove_picture", "true");
// 	} else if (food.image && typeof food.image !== "string") {
// 		// Only append the file if it's not a string (i.e., it's a File)
// 		formData.append("image", food.image as File);
// 	}

// 	return formData;
// };

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

export default api;
