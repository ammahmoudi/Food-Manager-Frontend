import axios from "axios";
import { Food } from "@/interfaces/Food";
import { FoodFormData } from "@/interfaces/FoodFormData";
import { Meal } from "@/interfaces/Meal";

const API_BASE_URL = "http://localhost:8000/api/";

const api = axios.create({
	baseURL: API_BASE_URL,
});

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

const refreshToken = async () => {
	const refresh = getRefreshToken();
	if (refresh) {
		try {
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
			return null;
		}
	}
	clearTokens();
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
			const newToken = await refreshToken();
			if (newToken) {
				originalRequest.headers.Authorization = `Bearer ${newToken}`;
				return api(originalRequest);
			}
		}

		if (error.response && error.response.status === 401) {
			clearTokens();
			window.location.href = "/login"; // Redirect to login page
		}

		return Promise.reject(error);
	}
);

export const getFoods = async () => {
	const response = await api.get("foods/");
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

export const getMealComments = async (mealId: number) => {
	const response = await api.get(`meals/${mealId}/comments/`);
	return response.data;
};
export const getLatestComments = async () => {
	const response = await api.get("comments/latest/");
	return response.data;
};
export const getCurrentDayMeal = async () => {
	const today = new Date().toISOString().split("T")[0];
	const response = await api.get<Meal>(`meals/date/${today}/`);
	return response.data;
};
export const getFoodDetails = async (foodId: number) => {
	const response = await api.get(`foods/${foodId}/`);
	return response.data;
};

export const getFoodComments = async (foodId: number) => {
	const response = await api.get(`foods/${foodId}/comments/`);
	return response.data;
};
const createFormData = (food: Partial<FoodFormData>) => {
	const formData = new FormData();

	if (food.name) formData.append("name", food.name);
	if (food.description) formData.append("description", food.description);

	// Handle image field
	if (food.image === "") {
		// If the image is an empty string, indicate that the image should be removed
		formData.append("remove_picture", "true");
	} else if (food.image && typeof food.image !== "string") {
		// Only append the file if it's not a string (i.e., it's a File)
		formData.append("image", food.image as File);
	}

	return formData;
};

export const addFood = async (food: FoodFormData) => {
	const formData = createFormData(food);
	console.log("form_Data", food);

	const response = await api.post("foods/", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

	return response.data;
};

export const updateFood = async (id: number, food: Partial<FoodFormData>) => {
	const formData = createFormData(food);
	console.log("form_Data", food);

	const response = await api.put(`foods/${id}/`, formData, {
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
export const updateMeal = async (id: number, meal: any) => {
	const response = await api.put(`meals/${id}/`, meal);
	return response.data;
};

export const saveMeal = async (meal: { date: string; foodId: number }) => {
	const response = await api.post("meals/", meal);
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

export const createMeal = async (data: any) => {
	const response = await api.post("meals/", data);
	return response.data;
};

export const getAdminCheck = async () => {
	const response = await api.get("admin-check/get/");
	return response.data;
};

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
export const updateUser = async (userData: any) => {
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
	console.log(userData);

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
export const signup = async (data: any) => {
	const response = await api.post("/auth/users/", data);
	return response.data;
};
export const getUserCommentForMeal = async (mealId: number) => {
	try {
		const response = await api.get(`/meals/${mealId}/comments/`);
		return response.data;
	} catch (error) {
		console.error("Error fetching user comments:", error);
		throw error;
	}
};

export const createOrUpdateComment = async (
	mealId: number,
	data: { rating: number; comment: string }
) => {
	try {
		const response = await api.post(`/meals/${mealId}/comment/`, data);
		return response.data;
	} catch (error) {
		console.error("Error saving comment:", error);
		throw error;
	}
};
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

// Fetch the user's comments for a specific meal
export const getUserCommentsForMeal = async (mealId: number) => {
	const response = await api.get(`/meals/${mealId}/comments/`);
	return response.data;
};

// Submit a comment for a specific meal
export const submitCommentForMeal = async (mealId: number, text: string) => {
	const response = await api.post(`/comments/`, { meal: mealId, text });
	return response.data;
};

const createComment = async (mealId, text) => {
	try {
	  const response = await api.post('/comments/', {
		meal: mealId,
		text: text,
	  });
	  return response.data;
	} catch (error) {
	  console.error('Failed to create comment:', error);
	  throw error;
	}
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

export default api;
