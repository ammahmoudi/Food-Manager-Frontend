"use client";

import axios from "axios";
import { FoodFormData } from "@/interfaces/FoodFormData";
import { jwtDecode, JwtPayload } from "jwt-decode"; // To decode JWT and check expiration
import { UpdateUserData } from "@/interfaces/UpdateUserData";
import { SignUpData } from "@/interfaces/SignUpData";
import { CreateMealData } from "@/interfaces/CreateMealData";
import { input } from "@nextui-org/react";
import { cache } from "react";
import { error } from "console";

const API_BASE_URL = "http://192.168.40.39:8000/api/";

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
		console.error("error in token validation", error);
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

export const getAllUsers = async () => {
	const response = await api.get("/auth/users/");
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

// push notification mode
// Function to subscribe a user
export const subscribeUser = async (token: string) => {
	if (!token) throw new Error("Token is required");

	try {
		const response = await api.post("/users/subscribe-push/", { token });
		console.log("Subscription successful", response);
		return response.data;
	} catch (error) {
		console.error("Subscription failed:", error);
		throw error;
	}
};

// Function to unsubscribe a user
export const unsubscribeUser = async (token: string) => {
	if (!token) throw new Error("Token is required");

	try {
		const response = await api.post("/users/unsubscribe-push/", { token });
		console.log("Unsubscription successful", response);
		return response.data;
	} catch (error) {
		console.error("Unsubscription failed:", error);
		throw error;
	}
};

// Function to send a notification
export const sendNotification = async (
	title: string,
	message: string,
	userIdsToSend: number[],
	image?: File,
	link?: string
) => {
	if (!title || !message) throw new Error("Title and message are required");

	// Create FormData to handle file uploads
	const formData = new FormData();
	formData.append("title", title);
	formData.append("message", message);

	// Append each user ID individually
	userIdsToSend.forEach((userId) => {
		formData.append("user_ids", userId.toString()); 
	});

	if (link) {
		formData.append("link", link);
	}
	if (image) {
		formData.append("image", image); 
	}

	try {
		const response = await api.post("/push-notifications/send/", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		console.log("Notification sent successfully:", response);
		return response.data;
	} catch (error) {
		console.error("Error sending notification:", error);
		throw error;
	}
};


// Fetch the list of available workflows
export const getWorkflows = async () => {
  try {
    const response = await api.get("/cui/workflows");
    return response.data; 
  } catch (error) {
	console.error("Error sending notification:", error);
	throw error;
  }
};

// Run a workflow with the provided inputs
export const runWorkflow = async (workflowId: number, inputs: any) => {
  try {
    const response = await api.post(`/cui/workflows/${workflowId}/run/`, {
      inputs,
	  
    });
    return response.data; // Assuming the response contains the job ID
  } catch (error) {
	console.error("Error sending notification:", error);
	throw error;
  }
};

// Poll the job status by job ID
export const getJobStatus = async (jobId: number) => {
  try {
    const response = await api.get(`/cui/jobs/${jobId}`);
    return response.data; // Assuming the response contains the job status and result
  } catch (error) {
	console.error("Error sending notification:", error);
	throw error;
  }
};

// Sample API function for fetching nodes with POST request
export const fetchNodesFromJson = async (jsonData: string) => {
	const response = await api.post(`/cui/workflows/nodes/`, {
		json_data: jsonData,
	});
	return response.data;
};

// Function to submit workflow inputs
export const submitWorkflowInputs = async (inputs: any) => {
	try{
		const response = await api.post(`/cui/workflows/`,  inputs );
		console.log(input)
		return response.data;
	}catch(error){
		console.error("Submit failed:", error);
		throw error;
	}
	
};


// Function to submit prompt to backend
export const sendPromptToBackend = async (promptData: { prompt_text: string }) => {
	try {
	  const response = await api.post(`/cui/specialized-workflows/characters/prompt/`, promptData);
	  console.log("Prompt submitted:", promptData);
	  return response.data; // Expecting { jobID: "some-job-id" }
	} catch (error) {
	  console.error("Failed to submit prompt:", error);
	  throw error;
	}
  };
  
  // Function to get images by JobID
  export const getImagesByJobID = async (jobId: string) => {
	try {
	  const response = await api.get(`/cui/jobs/${jobId}`);
	  console.log("Images fetched for jobID:", jobId);
	  return response.data; // Expecting { image_urls: ["url1", "url2", ...] }
	} catch (error) {
	  console.error("Failed to fetch images by JobID:", error);
	  throw error;
	}
  };
  
  // Function to submit final image data
  // Submit an image file to get results (URLs)
export const submitFinalData = async (imageFile: File) => {
	try {
	  // Prepare FormData to handle file upload
	  const formData = new FormData();
	  formData.append("image", imageFile); // Add the image file to the form data
  
	  // Send the image as part of the request
	  const response = await api.post(`/cui/specialized-workflows/characters/dataSet/`, formData, {
		headers: {
		  "Content-Type": "multipart/form-data", // Ensure the request is sent as form data
		},
	  });
  
	  return response.data; // Assuming the response contains the image URLs
	} catch (error) {
	  console.error("Error submitting image for results:", error);
	  throw error;
	}
  };



export default api;
