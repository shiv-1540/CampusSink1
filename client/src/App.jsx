//COMMON DEPENDCIES
import React from "react";
import { BrowserRouter,Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer,toast } from "react-toastify";

//COMMON PAGES
import LoginPage from "./LoginPage";
import ForgotPasswordPage from "./ForgotPasswordPage";

//TEACHER PAGES & COMPONENTS
import TeacherDashboard from "./pages/TeacherDashboard.jsx"; 
import AddAssignment from "./components/Teacher/AddAssignment.jsx";
import ViewEditAssignments from "./components/Teacher/ViewEditAssignments.jsx";
import ManageDeadlines from "./components/Teacher/ManageDeadlines.jsx";
import ProjectReviewPage from "./components/Teacher/ProjectReviewPage.jsx";
import SeminarPage from "./components/SeminarPage";

//STUDENT PAGES & COMPONENTS
import StudentDashboardHome from "./components/Student/StudentDashboardHome.jsx";
import StudentAssignmentsPage from "./components/Student/StudentAssignmentsPage.jsx"; 
import StudentSeminarsPage from "./components/Student/StudentSeminarsPage";
import ProjectReviews from './components/Student/ProjectReviews';
import Notifications from "./components/Student/Notifications.jsx";

//ADMIN PAGES & COMPONENTS
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AddUsersPage from "./components/Admin/AddUsers.jsx";
import AdminSettingsPage from "./components/Admin/AdminSettingsPage.jsx";
import AdminReportPage from "./components/Admin/AdminReportPage.jsx";
import AcademicCalendar from "./components/Teacher/AcademicCalendar.jsx";
import LandingPage from "./pages/LandingPage.jsx";

import { sidebarProvider } from "./components/SidebarContext.jsx";

const App = () => {
  return (
    <>
     <ToastContainer/>
     {/* <sidebarProvider> */}
      <Routes>
         <Route path="" element={<LandingPage/>} />
        <Route path="/login" element={<LoginPage />} />
       

        {/* ADMIN ROUTES/PATHS */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path='/admin/addusers' element={<AddUsersPage/>}/>
        <Route path='/admin/settings' element={< AdminSettingsPage/>}/>
        <Route path='/admin/reports' element={< AdminReportPage/>}/>

       {/* TEACHER ROUTES/PATHS */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/add-assignment" element={<AddAssignment />} />
        <Route path="/teacher/view-assignments" element={<ViewEditAssignments />} />
        <Route path="/teacher/manage-deadlines" element={<ManageDeadlines />} />
        <Route path="/teacher/project-reviews" element={<ProjectReviewPage />} />
        <Route path="/teacher/seminars" element={<SeminarPage />} />
        <Route path="/teacher/calendar" element={<AcademicCalendar />} />

        {/* STUDENT ROUTES/PATHS */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/student/dashboard" element={<StudentDashboardHome />} />
        <Route path="/student/assignments" element={<StudentAssignmentsPage />} />
        <Route path="/student/seminars" element={<StudentSeminarsPage />} />
        <Route path="/student/reviews" element={<ProjectReviews />} />
        <Route path="/student/notifications" element={<Notifications />} />
    
      </Routes>
      {/* </sidebarProvider> */}
      </>
    
  );
};

export default App;
