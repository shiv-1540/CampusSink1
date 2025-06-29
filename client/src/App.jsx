import React from "react";
import { BrowserRouter,Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx"; 
import AddAssignment from "./components/Teacher/AddAssignment.jsx";
import ViewEditAssignments from "./components/Teacher/ViewEditAssignments.jsx";
import ManageDeadlines from "./components/Teacher/ManageDeadlines.jsx";
import ProjectReviewPage from "./components/Teacher/ProjectReviewPage.jsx";
import SeminarPage from "./components/SeminarPage";
import ForgotPasswordPage from "./ForgotPasswordPage";

import { ToastContainer,toast } from "react-toastify";


import StudentDashboardHome from "./components/Student/StudentDashboardHome.jsx";
import StudentAssignmentsPage from "./components/Student/StudentAssignmentsPage.jsx"; 
import StudentSeminarsPage from "./components/Student/StudentSeminarsPage";
import ProjectReviews from './components/Student/ProjectReviews';
import AddUsersPage from "./components/Admin/AddUsers.jsx";
import AdminLayout from "./components/Admin/AdminLayout.jsx";
import AdminSettingsPage from "./components/Admin/AdminSettingsPage.jsx";
import AdminReportPage from "./components/Admin/AdminReportPage.jsx";
import SignupPage from "./SignupPage.jsx";
import AcademicCalendar from "./components/Teacher/AcademicCalendar.jsx";

const App = () => {
  return (
    <>
     <ToastContainer/>
      
      <Routes>
       
        {/* ✅ Redirect root path to /signup */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* 🔹 Main routes */}
         <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path='/admin/addusers' element={<AddUsersPage/>}/>
        <Route path='/admin/settings' element={< AdminSettingsPage/>}/>
        <Route path='/admin/reports' element={< AdminReportPage/>}/>

        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/add-assignment" element={<AddAssignment />} />
        <Route path="/teacher/view-assignments" element={<ViewEditAssignments />} />
        <Route path="/teacher/manage-deadlines" element={<ManageDeadlines />} />
        <Route path="/teacher/project-reviews" element={<ProjectReviewPage />} />
        <Route path="/teacher/seminars" element={<SeminarPage />} />
        <Route path="/teacher/calendar" element={<AcademicCalendar />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/student/dashboard" element={<StudentDashboardHome />} />
        <Route path="/student/assignments" element={<StudentAssignmentsPage />} />
        <Route path="/student/seminars" element={<StudentSeminarsPage />} />
        <Route path="/student/reviews" element={<ProjectReviews />} />
        
      </Routes>
      </>
    
  );
};

export default App;
