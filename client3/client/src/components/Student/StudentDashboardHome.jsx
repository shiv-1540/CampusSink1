// src/components/Student/StudentDashboardHome.jsx

import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import './StudentDashboard.css';

import {
  FaBook,
  FaChalkboardTeacher,
  FaClipboardList,
  FaMedal,
  FaCalendarAlt,
} from "react-icons/fa";

const StudentDashboardHome = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="p-4 bg-light" style={{ minHeight: "100vh" }}>
      {/* Header */}
      <div className="bg-primary text-white p-4 rounded mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h3>Welcome back, Alex! 👋</h3>
          <p className="mb-0">Computer Science • Year 3 • Ready to achieve your academic goals?</p>
        </div>
        <div className="text-end">
          <small>Completion Rate</small>
          <h4 className="mb-0">71%</h4>
          <div className="progress mt-1" style={{ height: "6px", width: "120px" }}>
            <div className="progress-bar bg-white" style={{ width: "71%" }}></div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="bg-white p-3 rounded shadow-sm text-center">
            <FaBook size={24} className="text-primary mb-2" />
            <h6 className="mb-0">Active Assignments</h6>
            <h4>1</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="bg-white p-3 rounded shadow-sm text-center">
            <FaChalkboardTeacher size={24} className="text-success mb-2" />
            <h6 className="mb-0">Upcoming Seminars</h6>
            <h4>0</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="bg-white p-3 rounded shadow-sm text-center">
            <FaClipboardList size={24} className="text-purple mb-2" />
            <h6 className="mb-0">Project Reviews</h6>
            <h4>1</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="bg-white p-3 rounded shadow-sm text-center">
            <FaMedal size={24} className="text-warning mb-2" />
            <h6 className="mb-0">Completed</h6>
            <h4>5</h4>
          </div>
        </div>
      </div>

      {/* Assignments & Calendar */}
      <div className="row g-4">
        <div className="col-md-8">
          <div className="bg-white p-4 rounded shadow-sm">
            <h5>Current Assignments</h5>
            <div className="border-start border-4 border-danger ps-3 mt-3">
              <h6>Database Design Project</h6>
              <p className="mb-1 text-muted">Database Systems</p>
              <p className="small text-muted">
                Design and implement a complete database system for a library management system
                including ER diagrams, normalization, and SQL queries.
              </p>
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-danger">Due today</small>
                <small>Due: 15/12/2024</small>
              </div>
              <div className="progress my-2" style={{ height: "6px" }}>
                <div className="progress-bar bg-danger" style={{ width: "17%" }}></div>
              </div>
              <button className="btn btn-sm btn-primary">Continue</button>
            </div>
          </div>
        </div>

        {/* React Calendar Integration */}
        <div className="col-md-4">
          <div className="bg-white p-4 rounded shadow-sm">
            <h5 className="mb-3">
              <FaCalendarAlt className="me-2" />
              {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
            </h5>
            <div className="calendar-container">
              <Calendar value={date} onChange={setDate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardHome;
