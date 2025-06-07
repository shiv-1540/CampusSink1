import React from "react";

const TeacherDashboard = () => {
  return (
    <div style={{ 
      backgroundColor: "#f0f4f8", 
      padding: "40px", 
      borderRadius: "12px",
      color: "#333",
      fontFamily: "Arial, sans-serif",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      textAlign: "center",
      marginTop: "50px"
    }}>
      <h1 style={{ color: "#2c3e50" }}>Welcome to the Teacher Dashboard</h1>
      <p style={{ color: "#555" }}>Start managing assignments here.</p>
    </div>
  );
};

export default TeacherDashboard;
