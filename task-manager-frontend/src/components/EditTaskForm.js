import React, { useState } from "react";
import { updateTask } from "../services/api";

const EditTaskForm = ({ task, onTaskUpdated }) => {
  const [updatedTask, setUpdatedTask] = useState({ title: task.title, description: task.description });

  const handleChange = (e) => {
    setUpdatedTask({ ...updatedTask, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTask(task._id, updatedTask);
      onTaskUpdated();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" value={updatedTask.title} onChange={handleChange} required />
      <input type="text" name="description" value={updatedTask.description} onChange={handleChange} required />
      <button type="submit">Update</button>
    </form>
  );
};

export default EditTaskForm;
