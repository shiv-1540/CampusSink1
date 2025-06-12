import React, { useState } from 'react';
import Sidebar from './Sidebar'; // your existing sidebar
import 'bootstrap/dist/css/bootstrap.min.css';
import { Eye, Pencil, CalendarDays } from 'lucide-react';

const ProjectReviewPage = () => {
  const [activeTab, setActiveTab] = useState('scheduled');

  const scheduledReviews = [
    {
      title: 'E-commerce Platform',
      student: 'Alex Kumar',
      date: '8/12/2024 at 2:00 PM',
    },
  ];

  const completedReviews = [
    {
      title: 'IoT Home Automation',
      student: 'Emma Wilson',
      date: '10/12/2024 at 2:00 PM',
      grade: '92%',
    },
  ];

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="container-fluid p-4">
        <h2 className="fw-bold mb-3">Project Reviews</h2>
        <p className="text-muted">Manage and track student project evaluations</p>

        {/* Summary Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h4>2</h4>
                <p>Total Reviews</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h4>1</h4>
                <p>Scheduled</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h4>1</h4>
                <p>Completed</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center shadow-sm">
              <div className="card-body text-purple">
                <h4>92%</h4>
                <p>Average Grade</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'scheduled' ? 'active' : ''}`}
              onClick={() => setActiveTab('scheduled')}
            >
              Scheduled ({scheduledReviews.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending (0)
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed ({completedReviews.length})
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        <div>
          {/* Scheduled */}
          {activeTab === 'scheduled' && scheduledReviews.map((review, index) => (
            <div key={index} className="card mb-3 shadow-sm">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5>{review.title}</h5>
                  <p className="mb-1">👤 {review.student}</p>
                  <p className="mb-1"><CalendarDays size={16} className="me-1" /> {review.date}</p>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <span className="badge bg-primary">Scheduled</span>
                  <button className="btn btn-success">Start Review</button>
                  <button className="btn btn-outline-secondary">Reschedule</button>
                  <Eye size={18} className="ms-2" />
                  <Pencil size={18} />
                </div>
              </div>
            </div>
          ))}

          {/* Pending */}
          {activeTab === 'pending' && (
            <div className="text-center py-4 text-muted">
              <p>No reviews pending</p>
              <small>Reviews will appear here once scheduled.</small>
            </div>
          )}

          {/* Completed */}
          {activeTab === 'completed' && completedReviews.map((review, index) => (
            <div key={index} className="card mb-3 shadow-sm">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5>{review.title}</h5>
                  <p className="mb-1">👤 {review.student}</p>
                  <p className="mb-1"><CalendarDays size={16} className="me-1" /> {review.date}</p>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <span className="badge bg-success">Completed</span>
                  <strong className="text-success">Grade: {review.grade}</strong>
                  <Eye size={18} className="ms-2" />
                  <Pencil size={18} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectReviewPage;
