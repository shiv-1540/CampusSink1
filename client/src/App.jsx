import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import AdminDashboard from "./components/AdminDashboard";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import AddAssignment from "./components/AddAssignment"; 
import ViewEditAssignments from "./components/ViewEditAssignments";
import ManageDeadlines from "./components/ManageDeadlines";
import ProjectReviewPage from "./components/ProjectReviewPage";
import SeminarPage from "./components/SeminarPage";
import ForgotPasswordPage from "./ForgotPasswordPage";

const App = () => {
  return (
    
      <Routes>
        {/* ✅ Redirect root path to /signup */}
        <Route path="/" element={<Navigate to="/signup" />} />
        
        {/* 🔹 Main routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/add-assignment" element={<AddAssignment />} />
        <Route path="/teacher/view-assignments" element={<ViewEditAssignments />} />
        <Route path="/teacher/manage-deadlines" element={<ManageDeadlines />} />
        <Route path="/teacher/project-reviews" element={<ProjectReviewPage />} />
        <Route path="/teacher/seminars" element={<SeminarPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />


      </Routes>
    
  );
};

export default App;



// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LoginPage from "./LoginPage";
// import SignupPage from "./SignupPage";
// import AdminDashboard from "./components/AdminDashboard";
// import StudentDashboard from "./components/StudentDashboard";
// import TeacherDashboard from "./components/TeacherDashboard";

// const App = () => {
//   return (
//     <Routes>
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/signup" element={<SignupPage />} />
//       <Route path="/admin/dashboard" element={<AdminDashboard />} />
//       <Route path="/student/dashboard" element={<StudentDashboard />} />
//       <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
//     </Routes>
//   );
// };

// export default App;
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LoginPage from "./LoginPage";
// import SignupPage from "./SignupPage";
// import AdminDashboard from "./components/AdminDashboard";
// import StudentDashboard from "./components/StudentDashboard";
// import TeacherDashboard from "./components/TeacherDashboard";

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignupPage />} />
//         <Route path="/admin/dashboard" element={<AdminDashboard />} />
//         <Route path="/student/dashboard" element={<StudentDashboard />} />
//         <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;
