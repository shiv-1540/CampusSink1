// src/components/Sidebar.jsx
import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaTasks, FaFileAlt, FaClock, FaBookOpen } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate(); // initialize the hook

  const handleLogout = () => {
    // Clear any session/auth storage if used
    localStorage.clear();  // optional if you use localStorage
    navigate('/'); // Redirect to sign-in page
  };

  return (
    <div className="bg-light border-end" style={{ width: '250px', minHeight: '100vh' }}>
      <div className="p-3">
        <h4 className="fw-bold mb-4">📘 CampusSink</h4>
        <div className="text-center mb-4">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            className="rounded-circle"
            width="70"
            alt="Teacher"
          />
          <p className="mt-2 fw-semibold mb-0">Dr. Sarah Johnson</p>
          <small className="text-muted">Teacher</small>
        </div>
        <ListGroup>
          <ListGroup.Item
            action
            as={Link}
            to="/teacher/dashboard"
            active={location.pathname === '/teacher/dashboard'}
          >
            <FaTasks className="me-2" /> Dashboard
          </ListGroup.Item>

          <ListGroup.Item
            action
            as={Link}
            to="/teacher/add-assignment"
            active={location.pathname === '/teacher/add-assignment'}
          >
            <FaFileAlt className="me-2" /> Add Assignment
          </ListGroup.Item>

          <ListGroup.Item
            action
            as={Link}
            to="/teacher/view-assignments"
            active={location.pathname === '/teacher/view-assignments'}
          >
            <FaFileAlt className="me-2" /> View/Edit Assignments
          </ListGroup.Item>

          <ListGroup.Item
            action
            as={Link}
            to="/teacher/manage-deadlines"
            active={location.pathname === '/teacher/manage-deadlines'}
          >
            <FaClock className="me-2" /> Manage Deadlines
          </ListGroup.Item>

          <ListGroup.Item
            action
            as={Link}
            to="/teacher/project-reviews"
            active={location.pathname === '/teacher/project-reviews'}
          >
            <FaBookOpen className="me-2" /> Project Reviews
          </ListGroup.Item>

          <ListGroup.Item
            action
            as={Link}
            to="/teacher/seminars"
            active={location.pathname === '/teacher/seminars'}
          >
            <FaBookOpen className="me-2" /> Seminars
          </ListGroup.Item>
        </ListGroup>
      </div>
      <div className="p-3 border-top text-center">
        <Button variant="outline-danger" size="sm"onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
};

export default Sidebar;
