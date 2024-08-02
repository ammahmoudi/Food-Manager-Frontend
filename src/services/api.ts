import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
});

const getToken = () => {
  return localStorage.getItem('access') || sessionStorage.getItem('access');
};

const getRefreshToken = () => {
  return localStorage.getItem('refresh') || sessionStorage.getItem('refresh');
};

const setToken = (access: string, refresh: string, remember: boolean) => {
  if (remember) {
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
  } else {
    sessionStorage.setItem('access', access);
    sessionStorage.setItem('refresh', refresh);
  }
};

const refreshToken = async () => {
  const refresh = getRefreshToken();
  if (refresh) {
    try {
      const response = await axios.post(`${API_BASE_URL}auth/jwt/refresh/`, {
        refresh,
      });
      const { access } = response.data;
      const remember = Boolean(localStorage.getItem('refresh'));
      setToken(access, refresh, remember);
      return access;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  }
  return null;
};

api.interceptors.request.use(async (config) => {
  let token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
    } else if (!error.response) {
      console.error('Error response is undefined:', error);
    } else {
      console.error('Unexpected error:', error);
    }
    return Promise.reject(error);
  }
);

export const getFoods = async () => {
  const response = await api.get('foods/');
  return response.data;
};

export const getMeals = async () => {
  const response = await api.get('meals/');
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

export const getFoodDetails = async (foodId: number) => {
  const response = await api.get(`foods/${foodId}/`);
  return response.data;
};

export const getFoodComments = async (foodId: number) => {
  const response = await api.get(`foods/${foodId}/comments/`);
  return response.data;
};

export const addFood = async (food: { name: string; description: string; picture: string }) => {
  const response = await api.post('foods/', food);
  return response.data;
};
export const updateMeal = async (id: number, meal: any) => {
  const response = await api.put(`meals/${id}/`, meal);
  return response.data;
};
export const saveMeal = async (meal: { date: string; foodId: number }) => {
  const response = await api.post('meals/', meal);
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
  const response = await api.post('meals/', data);
  return response.data;
};

export const getAdminCheck = async () => {
  const response = await api.get('admin-check/');
  return response.data;
};

export const login = async (phone_number: string, password: string) => {
  const response = await api.post('auth/jwt/create/', {
    phone_number,
    password,
  });
  const { access, refresh } = response.data;
  return { access, refresh };
};

export default api;
