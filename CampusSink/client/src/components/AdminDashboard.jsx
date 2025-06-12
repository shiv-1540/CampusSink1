import React from "react";

export default function AdminDashboard() {
  const styles = {
    container: {
      backgroundColor: "#fff3e0",
      padding: "40px",
      borderRadius: "12px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      margin: "50px auto",
      width: "80%",
    },
    heading: {
      color: "#ef6c00",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Welcome to Admin Dashboard</h2>
    </div>
  );
}
