import React, { useState } from "react";
import { createTask } from "../services/api";

const TaskForm = ({ onTaskAdded }) => {
  const [task, setTask] = useState({ title: "", description: "" });

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTask(task);
    onTaskAdded(); 
    setTask({ title: "", description: "" });
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
