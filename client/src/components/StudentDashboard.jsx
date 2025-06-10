import React from "react";

export default function StudentDashboard() {
  const styles = {
    container: {
      backgroundColor: "#e3f2fd",
      padding: "40px",
      borderRadius: "12px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      margin: "50px auto",
      width: "80%",
    },
    heading: {
      color: "#0d47a1",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Welcome to Student Dashboard</h2>
    </div>
  );
}
