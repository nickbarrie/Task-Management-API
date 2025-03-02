import React, { useEffect, useState } from "react";
import { fetchTasks, deleteTask, updateTask } from "../services/api";
import EditTaskForm from "./EditTaskForm";
import TaskForm from "./TaskForm"; 
import { useNavigate } from 'react-router-dom'; 

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const navigate = useNavigate();  

    const isAuthenticated = localStorage.getItem('authToken') !== null;

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login'); 
        } else {
            loadTasks(); 
        }
    }, [isAuthenticated, navigate]);

    const loadTasks = async () => {
        const token = localStorage.getItem('authToken'); 
        const data = await fetchTasks(token); 
        if (Array.isArray(data)) {
            setTasks(data); 
        } else {
            setTasks([]);  // Fallback to an empty array if data is not an array
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('authToken'); 
        await deleteTask(id, token); 
        setTasks(tasks.filter((task) => task._id !== id));
    };

    const handleToggleComplete = async (id) => {
        const taskToUpdate = tasks.find((task) => task._id === id);
        const updatedTask = {
            ...taskToUpdate,
            completed: !taskToUpdate.completed,
        };

        const token = localStorage.getItem('authToken'); 
        await updateTask(id, updatedTask, token); 

        setTasks(
            tasks.map((task) =>
                task._id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };


    const handleTaskAdded = (newTask) => {
        loadTasks(); // Reload tasks after adding a new task
    };

    return (
        <div>
            <h2>Task List</h2>

            <TaskForm onTaskAdded={handleTaskAdded} />

            <ul>
                {tasks.map((task) => (
                    <li key={task._id} style={{ backgroundColor: task.completed ? '#e0ffe0' : '#fff' }}>
                        <span>
                            {task.title} - {task.description}
                            <span style={{ marginLeft: "10px", fontStyle: "italic", color: task.completed ? 'green' : 'red' }}>
                                {task.completed ? 'Completed' : 'Not Completed'}
                            </span>
                        </span>
                        <div className="task-buttons">
                            <button onClick={() => handleDelete(task._id)}>Delete</button>
                            <button onClick={() => setEditingTask(task)}>Edit</button>
                            <button onClick={() => handleToggleComplete(task._id)}>
                                Mark as {task.completed ? 'Not Completed' : 'Completed'}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {editingTask && (
                <EditTaskForm
                    task={editingTask}
                    onTaskUpdated={() => {
                        setEditingTask(null);
                        loadTasks();
                    }}
                />
            )}
        </div>
    );
};

export default TaskList;
