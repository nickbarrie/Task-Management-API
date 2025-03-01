import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchTasks = async () => {
  const response = await api.get("/tasks");
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post("/tasks", taskData);
  return response.data;
};

export const deleteTask = async (taskId) => {
  await api.delete(`/tasks/${taskId}`);
};

export const updateTask = async (taskId, updatedData) => {
    const response = await api.put(`/tasks/${taskId}`, updatedData);
    return response.data;
  };
