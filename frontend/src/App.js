import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegistrationModal from "./pages/RegistrationModal/RegistrationModal";
import TaskListPage from "./pages/TaskListPage/TaskListPage";
import CreateTaskPage from "./pages/CreateTaskPage/CreateTaskPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="tasks" element={<TaskListPage />} />
        <Route path="/" element={<CreateTaskPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
