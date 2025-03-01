import React, { useState } from "react";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";

const App = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      <h1>Task Manager</h1>
      <TaskForm onTaskAdded={() => setRefresh(!refresh)} />
      <TaskList key={refresh} />
    </div>
  );
};

export default App;
