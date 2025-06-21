// src/components/admin/Feedback.jsx

import React, { useState } from "react";

const feedbackList = [
  {
    id: 1,
    name: "Alex Kumar",
    role: "Student",
    initials: "AK",
    title: "Assignment submission issue",
    message: "I had trouble uploading my assignment file. The upload button was not responding properly.",
    date: "11/20/2024",
    status: ["New", "Bug"],
    rating: 3
  },
  {
    id: 2,
    name: "Dr. Sarah Johnson",
    role: "Teacher",
    initials: "DSJ",
    title: "Great platform!",
    message: "The assignment management features are excellent. Students find it easy to submit their work.",
    date: "11/19/2024",
    status: ["Reviewed", "General"],
    rating: 5
  },
  {
    id: 3,
    name: "Emma Wilson",
    role: "Student",
    initials: "EW",
    title: "Calendar feature request",
    message: "It would be great to have a calendar sync feature with Google Calendar for better deadline management.",
    date: "11/18/2024",
    status: ["New", "Feature"],
    rating: 3
  }
];

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "New": return "primary";
    case "Bug": return "danger";
    case "Feature": return "info";
    case "Reviewed": return "warning";
    case "General": return "success";
    default: return "secondary";
  }
};

const Feedback = () => {
  const [filter, setFilter] = useState("All Feedback");

  const filteredFeedback =
    filter === "All Feedback"
      ? feedbackList
      : feedbackList.filter((f) => f.status.includes(filter));

  return (
    <div className="container-fluid p-4 bg-light">
      <h2 className="fw-bold mb-2">Feedback & Reviews</h2>
      <p className="text-muted mb-4">Monitor user feedback and platform satisfaction</p>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card p-3">
            <h6>Total Feedback</h6>
            <h4>{feedbackList.length}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3">
            <h6>New</h6>
            <h4>{feedbackList.filter(f => f.status.includes("New")).length}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3">
            <h6>Under Review</h6>
            <h4>{feedbackList.filter(f => f.status.includes("Under Review")).length}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3">
            <h6>Avg Rating</h6>
            <h4>{(feedbackList.reduce((sum, f) => sum + f.rating, 0) / feedbackList.length).toFixed(1)}</h4>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <ul className="nav nav-tabs mb-3">
        {["All Feedback", "New", "Under Review", "Resolved", "Bug", "Feature Requests"].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${filter === tab ? "active" : ""}`}
              onClick={() => setFilter(tab)}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>

      {/* Feedback Cards */}
      {filteredFeedback.map((item) => (
        <div key={item.id} className="card mb-3 p-3">
          <div className="d-flex justify-content-between align-items-start">
            <div className="d-flex gap-3">
              <div className="avatar bg-primary text-white fw-bold rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                {item.initials}
              </div>
              <div>
                <h6 className="mb-1 fw-bold">
                  {item.title}
                  {item.status.map((s, i) => (
                    <span
                      key={i}
                      className={`badge bg-${getStatusBadgeClass(s)} ms-2`}
                    >
                      {s}
                    </span>
                  ))}
                </h6>
                <p className="mb-1 small text-muted">{item.name} • {item.role}</p>
                <p className="mb-1">{item.message}</p>
                <div className="d-flex align-items-center gap-2">
                  <small className="text-muted">{item.date}</small>
                  <span>
                    {Array.from({ length: 5 }, (_, i) => (
                      <i
                        key={i}
                        className={`bi ${i < item.rating ? "bi-star-fill text-warning" : "bi-star text-muted"}`}
                      ></i>
                    ))}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-end d-flex flex-column align-items-end gap-2">
              <i className="bi bi-eye"></i>
              <i className="bi bi-reply"></i>
              <i className="bi bi-hand-thumbs-up"></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feedback;
