import React, { useEffect, useState } from "react";
import { fetchTasks, deleteTask, updateTask } from "../services/api";
import EditTaskForm from "./EditTaskForm";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const data = await fetchTasks();
    setTasks(data);
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks(tasks.filter((task) => task._id !== id));
  };

  const handleToggleComplete = async (id) => {
    const taskToUpdate = tasks.find((task) => task._id === id);
    const updatedTask = {
      ...taskToUpdate,
      completed: !taskToUpdate.completed, 
    };
    
    await updateTask(id, updatedTask);

    setTasks(
      tasks.map((task) =>
        task._id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div>
      <h2>Task List</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task._id} style={{ backgroundColor: task.completed ? '#e0ffe0' : '#fff' }}>
            <span>
              {task.title} - {task.description}
              <span style={{ marginLeft: "10px", fontStyle: "italic", color: task.completed ? 'green' : 'red' }}>
                {task.completed ? 'Completed' : 'Not Completed'}
              </span>
            </span>
            <button onClick={() => handleDelete(task._id)}>Delete</button>
            <button onClick={() => setEditingTask(task)}>Edit</button>
            <button onClick={() => handleToggleComplete(task._id)}>
              Mark as {task.completed ? 'Not Completed' : 'Completed'}
            </button>
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
