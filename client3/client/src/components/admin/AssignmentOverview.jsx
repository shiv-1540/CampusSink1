// src/components/admin/AssignmentOverview.jsx

import React, { useState } from "react";
// import Sidebar from "../Sidebar"; // ❌ Remove this line, handled in Layout

const assignments = [
  {
    id: 1,
    title: "Database Design Project",
    course: "Database Systems",
    teacher: "Dr. Sarah Johnson",
    year: "Year 3",
    branch: "Computer Science",
    status: "Active",
    created: "11/1/2024",
    due: "12/15/2024",
    submissions: "45/60",
    progress: 75
  },
  {
    id: 2,
    title: "Machine Learning Research Paper",
    course: "Machine Learning",
    teacher: "Dr. Sarah Johnson",
    year: "Year 4",
    branch: "Computer Science",
    status: "Active",
    created: "11/5/2024",
    due: "12/20/2024",
    submissions: "12/25",
    progress: 48
  },
  {
    id: 3,
    title: "Web Development Portfolio",
    course: "Web Development",
    teacher: "Dr. Sarah Johnson",
    year: "Year 3",
    branch: "Computer Science",
    status: "Overdue",
    created: "10/15/2024",
    due: "11/30/2024",
    submissions: "55/60",
    progress: 92
  }
];

const AssignmentOverview = () => {
  const [activeTab, setActiveTab] = useState("All");

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "success";
      case "Overdue": return "danger";
      case "Completed": return "secondary";
      default: return "primary";
    }
  };

  const filtered = activeTab === "All" ? assignments : assignments.filter(a => a.status === activeTab);

  const stats = {
    total: assignments.length,
    active: assignments.filter(a => a.status === "Active").length,
    overdue: assignments.filter(a => a.status === "Overdue").length,
    completed: assignments.filter(a => a.status === "Completed").length
  };

  return (
    <div className="container-fluid p-4 bg-light flex-grow-1">
      <h2 className="fw-bold mb-2">Assignment Overview</h2>
      <p className="text-muted mb-4">Monitor and manage all assignments across the platform</p>

      <div className="row g-3 mb-4">
        {["total", "active", "overdue", "completed"].map((key, i) => (
          <div className="col-md-3" key={i}>
            <div className="card shadow-sm p-3">
              <div className="fw-semibold text-capitalize">{key}</div>
              <h4 className="mb-0">{stats[key]}</h4>
            </div>
          </div>
        ))}
      </div>

      <ul className="nav nav-tabs mb-3">
        {["All", "Active", "Overdue", "Completed"].map(tab => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab} ({tab === "All" ? stats.total : stats[tab.toLowerCase()]})
            </button>
          </li>
        ))}
      </ul>

      <div className="assignment-list">
        {filtered.map((a) => (
          <div key={a.id} className="card mb-3 p-3 shadow-sm">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="mb-1">
                  <i className="bi bi-journal-code me-2"></i>
                  {a.title}
                  <span className={`badge bg-${getStatusColor(a.status)} ms-2`}>{a.status}</span>
                </h5>
                <p className="mb-1 small text-muted">
                  {a.course} • {a.teacher} • {a.year} {a.branch}
                </p>
                <p className="mb-1 small text-muted">
                  Created: {a.created} • Due: {a.due} • {a.submissions} submissions
                </p>
              </div>
              <div className="text-end">
                <div className="small text-muted">Submission Rate</div>
                <div className="fw-bold">{a.progress}%</div>
                <div className="progress" style={{ width: "120px", height: "6px" }}>
                  <div
                    className={`progress-bar bg-${a.progress < 50 ? "danger" : a.progress < 80 ? "warning" : "success"}`}
                    role="progressbar"
                    style={{ width: `${a.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-muted py-4">No assignments in this category.</div>
        )}
      </div>
    </div>
  );
};

export default AssignmentOverview;