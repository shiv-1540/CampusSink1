// src/components/Student/Seminars.jsx
import React from "react";

const Seminars = () => {
  return (
    <div>
      <h2 className="mb-4">Upcoming Seminars</h2>
      <div className="bg-white p-4 rounded shadow-sm mb-4">
        <h5>AI in Education</h5>
        <p className="text-muted mb-1">Department: Computer Science</p>
        <p>Date: 20th June 2025 | Time: 10:00 AM – 12:00 PM</p>
        <p className="small">
          A seminar exploring how AI is transforming learning environments and
          academic processes.
        </p>
        <button className="btn btn-sm btn-primary">Join Seminar</button>
      </div>

      <h2 className="mb-3 mt-5">Past Seminars</h2>
      <ul className="list-group">
        <li className="list-group-item d-flex justify-content-between">
          <div>
            <strong>Data Privacy Challenges</strong>
            <br />
            <small className="text-muted">Held on 14th May 2025</small>
          </div>
          <button className="btn btn-outline-secondary btn-sm">View Summary</button>
        </li>
        <li className="list-group-item d-flex justify-content-between">
          <div>
            <strong>Quantum Computing Basics</strong>
            <br />
            <small className="text-muted">Held on 5th April 2025</small>
          </div>
          <button className="btn btn-outline-secondary btn-sm">View Summary</button>
        </li>
      </ul>
    </div>
  );
};

export default Seminars;
