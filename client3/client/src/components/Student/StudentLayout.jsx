// src/components/Sidebar.jsx
import React from "react";
import { FaHome, FaBook, FaChalkboardTeacher, FaClipboardList, FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ name = "Alex Kumar", role = "student", avatar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const defaultAvatar = "https://randomuser.me/api/portraits/men/75.jpg";

  const handleLogout = () => {
    localStorage.clear(); // Or selectively clear if needed
    navigate("/login");
  };

  const navItems = [
    { to: "/student/dashboard", label: "Home", icon: <FaHome /> },
    { to: "/student/assignments", label: "My Assignments", icon: <FaBook /> },
    { to: "/student/seminars", label: "Seminars", icon: <FaChalkboardTeacher /> },
    { to: "/student/reviews", label: "Project Reviews", icon: <FaClipboardList /> },
  ];

  return (
    <div className="bg-white border-end vh-100 d-flex flex-column justify-content-between shadow-sm" style={{ width: "240px" }}>
      <div>
        {/* Logo and Header */}
        <div className="p-4 text-center border-bottom">
          <h5 className="mb-0 fw-bold text-primary">CampusSink</h5>
          <small className="text-muted">Academic Portal</small>
        </div>

        {/* User Info */}
        <div className="text-center mt-3 mb-4">
          <img
            src={avatar || defaultAvatar}
            className="rounded-circle mb-2"
            width="60"
            alt="profile"
          />
          <h6 className="mb-0">{name}</h6>
          <small className="text-muted text-capitalize">{role}</small>
        </div>

        {/* Navigation */}
        <ul className="nav flex-column px-3">
          {navItems.map(({ to, label, icon }) => (
            <li className="nav-item mb-2" key={to}>
              <Link
                className={`nav-link ${location.pathname === to ? "text-primary fw-semibold" : "text-dark"}`}
                to={to}
              >
                {icon} <span className="ms-2">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout Button */}
      <div className="text-center p-3 border-top">
        <button className="btn btn-outline-danger btn-sm w-100" onClick={handleLogout}>
          <FaSignOutAlt className="me-1" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
