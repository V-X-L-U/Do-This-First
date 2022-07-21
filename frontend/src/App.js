import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegistrationModal from "./pages/RegistrationModal/RegistrationModal";
import TaskListPage from "./pages/TaskListPage/TaskListPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="tasks" element={<TaskListPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
