import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const users = [
  {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    role: "Teacher",
    details: "Faculty Member"
  },
  {
    name: "Alex Kumar",
    email: "alex.kumar@student.edu",
    role: "Student",
    details: "Computer Science, Year 3"
  },
  {
    name: "Admin User",
    email: "admin@university.edu",
    role: "Admin",
    details: "System Administrator"
  }
];

const UserManagement = () => {
  return (
    <div>
      <h2>User Management</h2>
      <p className="text-muted">Manage teachers, students, and administrators</p>

      <div className="d-flex gap-3 my-4">
        <div className="stat-card"><strong>Total Users</strong><div>3</div></div>
        <div className="stat-card"><strong>Teachers</strong><div>1</div></div>
        <div className="stat-card"><strong>Students</strong><div>1</div></div>
        <div className="stat-card"><strong>Admins</strong><div>1</div></div>
      </div>

      <div className="d-flex gap-2 mb-3">
        <input className="form-control" type="text" placeholder="Search users..." />
        <select className="form-select">
          <option>All Roles</option>
          <option>Student</option>
          <option>Teacher</option>
          <option>Admin</option>
        </select>
        <button className="btn btn-primary ms-auto">+ Add User</button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Details</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, index) => (
            <tr key={index}>
              <td>
                <strong>{u.name}</strong><br />
                <small>{u.email}</small>
              </td>
              <td>
                <span className={`badge bg-${u.role === "Admin" ? "danger" : u.role === "Teacher" ? "info" : "success"}`}>
                  {u.role}
                </span>
              </td>
              <td>{u.details}</td>
              <td>
                <button className="btn btn-sm btn-link text-primary me-2"><FaEdit /></button>
                <button className="btn btn-sm btn-link text-danger"><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
