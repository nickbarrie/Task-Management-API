import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import TaskList from "./components/TaskList";
import Login from "./components/Login";
import Registration from "./components/Registration";

function HomePage() {
  return (
    <div>
      <h1>Task Manager</h1>
      <TaskList />
    </div>
  );
}

// App component with navigation links
function App() {
  return (
    <div>
      {/* Navigation buttons at the top */}
      <nav style={{ padding: '10px', backgroundColor: '#f4f4f4', display: 'flex', justifyContent: 'space-around' }}>
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/register">
          <button>Register</button>
        </Link>
        <Link to="/">
          <button>Home</button>
        </Link>
      </nav>

      {/* Routing for different components */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
      </Routes>
    </div>
  );
}

export default App;
