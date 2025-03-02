import React, { useState } from "react";
import { createTask } from "../services/api";

const TaskForm = ({ onTaskAdded }) => {
  const [task, setTask] = useState({ title: "", description: "" });

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call the API to create the task
      const newTask = await createTask(task);

      // Once the task is created, call the onTaskAdded function passed from the parent
      onTaskAdded(newTask);

      // Reset the form after submitting
      setTask({ title: "", description: "" });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" value={task.title} onChange={handleChange} placeholder="Title" required />
      <input type="text" name="description" value={task.description} onChange={handleChange} placeholder="Description" required />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
