import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx"; 
import AddAssignment from "./components/Teacher/AddAssignment.jsx";
import ViewEditAssignments from "./components/Teacher/ViewEditAssignments.jsx";
import ManageDeadlines from "./components/Teacher/ManageDeadlines.jsx";
import ProjectReviewPage from "./components/Teacher/ProjectReviewPage.jsx";
import SeminarPage from "./components/SeminarPage";
import ForgotPasswordPage from "./ForgotPasswordPage";

import StudentDashboardHome from "./components/Student/StudentDashboardHome.jsx";
import StudentAssignmentsPage from "./components/Student/StudentAssignmentsPage.jsx"; 
import StudentSeminarsPage from "./components/Student/StudentSeminarsPage";
import ProjectReviews from './components/Student/ProjectReviews';
import AddUsersPage from "./components/Admin/AddUsers.jsx";

const App = () => {
  return (
      <Routes>
        {/* ✅ Redirect root path to /signup */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* 🔹 Main routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path='/admin/addusers' element={<AddUsersPage/>}/>

        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/add-assignment" element={<AddAssignment />} />
        <Route path="/teacher/view-assignments" element={<ViewEditAssignments />} />
        <Route path="/teacher/manage-deadlines" element={<ManageDeadlines />} />
        <Route path="/teacher/project-reviews" element={<ProjectReviewPage />} />
        <Route path="/teacher/seminars" element={<SeminarPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/student/dashboard" element={<StudentDashboardHome />} />
        <Route path="/student/assignments" element={<StudentAssignmentsPage />} />
        <Route path="/student/seminars" element={<StudentSeminarsPage />} />
        <Route path="/student/reviews" element={<ProjectReviews />} />
        
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
