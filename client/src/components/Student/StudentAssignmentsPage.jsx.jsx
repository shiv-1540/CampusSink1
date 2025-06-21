import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { FaClock, FaDownload } from "react-icons/fa";
import { Button, Tabs, Tab, ProgressBar } from "react-bootstrap";
import axios from "axios";
import StudSidebar from "./StudSidebar";
const server= import.meta.env.VITE_BACKEND_URL;

const StudentAssignmentsPage = () => {
  const [key, setKey] = useState("active");
  const [activeAssignments, setActiveAssignments] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);

  // Mock student details (replace with actual login state if needed)
  const student = {
    year: "TE",
    branch: "CSE",
    name: "John Doe",
  };

  useEffect(() => {

    const token = localStorage.getItem('token');
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(
          `${server}/api/assignments?year=${student.year}&branch=${student.branch}`,
          {
            headers:{
              'Content-Type':'application/json',
              'Authorization':`Bearer ${token}`
            }
          }
        );
        const allAssignments = res.data;

        const submitted = JSON.parse(localStorage.getItem("submittedAssignments")) || [];
        const submittedIds = submitted.map((s) => s.id);

        setActiveAssignments(allAssignments.filter((a) => !submittedIds.includes(a.id)));
        setSubmittedAssignments(submitted);
      } catch (err) {
        console.error("Error fetching assignments:", err);
      }
    };

    fetchAssignments();
  }, []);

  const handleSubmit = (assignment) => {
    const updatedSubmitted = [...submittedAssignments, assignment];
    localStorage.setItem("submittedAssignments", JSON.stringify(updatedSubmitted));
    setSubmittedAssignments(updatedSubmitted);

    const updatedActive = activeAssignments.filter((a) => a.id !== assignment.id);
    setActiveAssignments(updatedActive);
    setKey("submitted");
  };

  // ✅ File Download Handler (FIXED)
  const handleDownload = (fileUrl, fileName) => {
    const fullUrl = `${server}/uploads/${fileUrl}`;
    const link = document.createElement("a");
    link.href = fullUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderAssignmentCard = (assignment, showSubmit = true) => (
    <div key={assignment.id} className="card shadow-sm p-3 mb-3">
      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <div
            className="me-3 d-flex align-items-center justify-content-center"
            style={{
              width: 50,
              height: 50,
              background: "linear-gradient(to right, #6a11cb, #2575fc)",
              borderRadius: 12,
            }}
          >
            <FaClock className="text-white fs-4" />
          </div>
          <div>
            <h5 className="mb-1">
              {assignment.title}{" "}
              {new Date(assignment.deadline).toDateString() === new Date().toDateString() && (
                <span className="badge bg-danger">Due today</span>
              )}
            </h5>
            <small className="text-muted">{assignment.description}</small>
            <p className="mt-2 mb-1">{assignment.description}</p>
            <small className="text-muted">
              Due: {new Date(assignment.deadline).toLocaleDateString()} • Posted by Teacher
            </small>
          </div>
        </div>
        <div className="d-flex flex-column align-items-end">
          {assignment.file_url && (
            <Button
              variant="outline-secondary"
              size="sm"
              className="mb-2"
              onClick={() => handleDownload(assignment.file_url, assignment.title + ".pdf")}
            >
              <FaDownload className="me-1" /> Download
            </Button>
          )}
          {showSubmit ? (
            <Button variant="primary" size="sm" onClick={() => handleSubmit(assignment)}>
              Submit
            </Button>
          ) : (
            <span className="badge bg-success">Submitted</span>
          )}
        </div>
      </div>
      {showSubmit && (
        <div className="mt-3">
          <strong>Progress</strong>
          <ProgressBar now={50} label="50% complete" className="mt-2" />
        </div>
      )}
    </div>
  );

  return (
    <div className="d-flex">
       <div className="w-64 fixed top-0 left-0 h-full z-10">
          <StudSidebar/>
        </div>

      <div className="flex-grow ml-64 p-6 bg-gray-100 min-h-screen">
        <h3 className="fw-bold mb-1">My Assignments</h3>
        <p className="text-muted mb-4">Track your assignments and submissions</p>

        <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-4">
          <Tab eventKey="active" title={`Active (${activeAssignments.length})`}>
            {activeAssignments.length === 0 ? (
              <p>No active assignments.</p>
            ) : (
              activeAssignments.map((a) => renderAssignmentCard(a))
            )}
          </Tab>

          <Tab eventKey="submitted" title={`Submitted (${submittedAssignments.length})`}>
            {submittedAssignments.length === 0 ? (
              <p>No submitted assignments yet.</p>
            ) : (
              submittedAssignments.map((a) => renderAssignmentCard(a, false))
            )}
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentAssignmentsPage;
