import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import AdminDashboard from "./components/AdminDashboard";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
    </Routes>
  );
};

export default App;
