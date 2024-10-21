"use client";

import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode"; // To decode JWT and check expiration
import { UpdateUserData } from "@/interfaces/UpdateUserData";
import { SignUpData } from "@/interfaces/SignUpData";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://web:8000";


export const api = axios.create({
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

export default api;
