import React from 'react';
import Sidebar from './Sidebar'; // Adjust path if necessary
import 'bootstrap/dist/css/bootstrap.min.css';
import { Calendar } from 'lucide-react';

const SeminarPage = () => {
  const upcomingSeminars = []; // No upcoming seminars

  const pastSeminars = [
    {
      title: 'Future of Artificial Intelligence',
      date: '5/12/2024',
      location: 'Auditorium A',
      speaker: 'Dr. Michael Chen',
    },
    {
      title: 'Cybersecurity Best Practices',
      date: '12/12/2024',
      location: 'Tech Lab 1',
      speaker: 'Prof. Lisa Zhang',
    },
  ];

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="fw-bold">Seminars</h2>
            <p className="text-muted">Organize and manage educational seminars for students</p>
          </div>
          <button className="btn btn-primary">+ Add Seminar</button>
        </div>

        {/* Upcoming Seminars */}
        <div className="card mb-4 shadow-sm">
          <div className="card-body text-center py-5">
            {upcomingSeminars.length === 0 ? (
              <>
                <Calendar size={48} className="mb-3 text-muted" />
                <h5 className="text-muted">No upcoming seminars</h5>
                <p className="text-muted">Create your first seminar to get started.</p>
              </>
            ) : (
              upcomingSeminars.map((seminar, idx) => (
                <div key={idx} className="text-start">
                  <h5>{seminar.title}</h5>
                  <p>{seminar.date} • {seminar.location} • {seminar.speaker}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Past Seminars */}
        <h5 className="mb-3">Past Seminars</h5>
        <div className="d-flex flex-column gap-3">
          {pastSeminars.map((seminar, idx) => (
            <div key={idx} className="card shadow-sm">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="fw-semibold">{seminar.title}</h6>
                  <p className="mb-0 text-muted small">
                    {seminar.date} • {seminar.location} • {seminar.speaker}
                  </p>
                </div>
                <span className="badge bg-light text-muted border">Completed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeminarPage;
