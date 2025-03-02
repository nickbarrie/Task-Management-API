import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
});


export const registerUser = async ({ email, password }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/register`, {
        email,
        password,
      });
  
      if (response.status !== 201) {
        throw new Error('Registration failed');
      }
  
      return response.data;
    } catch (err) {
      throw new Error(err.message || 'An error occurred during registration');
    }
  };

  export const loginUser = async ({ email, password }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const data = await response.json(); // Get the response body
  
      if (data.token) {
       
        localStorage.setItem('authToken', data.token); 
      }
  
      return data; 
    } catch (err) {
      throw new Error(err.message || 'An error occurred during login');
    }
  };

  export const fetchTasks = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const text = await response.text(); 
  
      const data = JSON.parse(text); 
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Fetch tasks failed:", error);
      return [];
    }
  };
  

export const createTask = async (taskData) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.post(
      `${API_BASE_URL}/tasks`, 
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    return response.data; 
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};


export const deleteTask = async (id, token) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  export const updateTask = async (id, updatedTask, token) => {
    try {
      await axios.put(`${API_BASE_URL}/tasks/${id}`, updatedTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error updating task', error);
    }
  };