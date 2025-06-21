import React from "react";
import "./MyAssignments.css";
import { FaClipboard } from "react-icons/fa";

const MyAssignments = () => {
  return (
    <div className="p-4">
      <h2 className="fw-bold">My Assignments</h2>
      <p className="text-muted">Track your assignments and submissions</p>

      {/* Tabs */}
      <div className="btn-group mb-4" role="group">
        <button type="button" className="btn btn-primary active">Active (1)</button>
        <button type="button" className="btn btn-outline-primary">Submitted (0)</button>
        <button type="button" className="btn btn-outline-primary">Completed (0)</button>
      </div>

      {/* Assignment Card */}
      <div className="card shadow-sm p-3 position-relative">
        <div className="d-flex justify-content-between align-items-start">
          <div className="d-flex align-items-start">
            <FaClipboard className="text-primary fs-4 me-2 mt-1" />
            <div>
              <h5 className="fw-bold mb-1">
                Database Design Project{" "}
                <span className="badge bg-danger small">Due today</span>
              </h5>
              <p className="mb-1">
                <strong>Database Systems</strong> - Dr. Sarah Johnson
              </p>
              <p className="text-muted mb-1" style={{ fontSize: "0.95rem" }}>
                Design and implement a complete database system including ER diagrams, normalization, and SQL queries.
              </p>
              <p className="text-muted small mb-0">
                <strong>Due:</strong> 12/12/2024 • <strong>Posted:</strong> 11/11/2024
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button className="btn btn-sm btn-primary">Submit</button>
        </div>

        {/* Progress */}
        <div className="mt-3">
          <p className="mb-1 text-muted">Progress</p>
          <div className="progress" style={{ height: "8px" }}>
            <div
              className="progress-bar bg-primary"
              style={{ width: "67%" }}
            ></div>
          </div>
          <small className="text-muted float-end">67% complete</small>
        </div>
      </div>
    </div>
  );
};

export default MyAssignments;
