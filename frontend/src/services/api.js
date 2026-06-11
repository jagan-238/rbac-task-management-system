import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://rbac-task-management-system-1.onrender.com/api",
});

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

// ==================== AUTH ====================
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

// ==================== TASKS ====================
export const fetchMyTasks = () => API.get("/tasks");
export const createTask = (data) => API.post("/tasks", data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

// ==================== ADMIN ====================
export const fetchAllUsers = () => API.get("/admin/users");

export const updateUserStatus = (id, status) =>
  API.put(`/admin/users/${id}/status`, { status });

export const deleteUser = (id) =>
  API.delete(`/admin/users/${id}`);

export const fetchAllTasks = () => API.get("/admin/tasks");

export const adminDeleteTask = (id) =>
  API.delete(`/admin/tasks/${id}`);

export const fetchActivityLogs = () => API.get("/admin/logs");

export const fetchAnalytics = () =>
  API.get("/admin/analytics");

export default API;