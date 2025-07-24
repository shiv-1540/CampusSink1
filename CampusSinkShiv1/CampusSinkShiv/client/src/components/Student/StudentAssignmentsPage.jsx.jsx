import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaClock, FaDownload } from "react-icons/fa";
import { Button, Tabs, Tab, ProgressBar } from "react-bootstrap";
import axios from "axios";
import StudSidebar from "./StudSidebar";
const server= import.meta.env.VITE_BACKEND_URL;

const StudentAssignmentsPage = () => {
  const [key, setKey] = useState("active");
  const [activeAssignments, setActiveAssignments] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
   const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // // Mock student details (replace with actual login state if needed)
  // const student = {
  //   year: "TE",
  //   branch: "CSE",
  //   name: "John Doe",
  // };


   const studinfo=JSON.parse(localStorage.getItem('studinfo'));
   const token=localStorage.getItem('token');
   console.log(studinfo.year," >>" ,studinfo.dept_id);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!studinfo?.year || !studinfo?.dept_id || !studinfo?.prn || !token) {
        setError("Missing student information or token");
        return;
      }

      try {
        const response = await axios.get(`${server}/api/assignments?year=${studinfo.year}&dept_id=${studinfo.dept_id}&prn=${studinfo.prn}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
       
        });

        const { submitted, unsubmitted } = response.data;

        setSubmittedAssignments(submitted || []);
        setActiveAssignments(unsubmitted || []);
      } catch (err) {
        console.error("❌ Error fetching assignments:", err);
        setError("Failed to load assignments.");
        toast.error("Something went wrong while loading assignments");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

       // Return loading or error UI (optional)
  if (loading) return <div className="text-center py-4 text-blue-600">Loading assignments...</div>;
  if (error) return <div className="text-red-600 text-center py-4">{error}</div>;



    const handleSubmit = async (assignment) => {
        const token = localStorage.getItem('token');
        const student = JSON.parse(localStorage.getItem('studinfo'));

        if (!token || !student?.prn) {
          toast.error('Unauthorized or missing student information');
          return;
        }

        try {
          // Send POST request to backend to mark assignment as submitted
          await axios.post(
            `http://localhost:5000/api/assignments/submitassi`,
            {
              assignment_id: assignment.id,
              prn: student.prn,
              submission_file:'11'
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          // Update UI after successful submission
          const updatedSubmitted = [...submittedAssignments, assignment];
          localStorage.setItem("submittedAssignments", JSON.stringify(updatedSubmitted));
          setSubmittedAssignments(updatedSubmitted);

          const updatedActive = activeAssignments.filter((a) => a.id !== assignment.id);
          setActiveAssignments(updatedActive);

          toast.success("✅ Assignment submitted successfully!");
          setKey("submitted");
        } catch (error) {
          console.error("Submit error:", error);
          toast.error(`❌ Failed to submit assignment >> ${error.message}`);
        }
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

 const renderAssignmentCard = (assignment, showSubmit = true) => {
  const isDueToday =
    new Date(assignment.deadline).toDateString() === new Date().toDateString();

  return (
    <div key={assignment.id} className="card shadow rounded-4 mb-4 border-0">
      <div className="card-body">
        <div className="d-flex gap-3">
          {/* Icon Box */}
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: 60,
              height: 60,
              background: "linear-gradient(to right, #6a11cb, #2575fc)",
              borderRadius: 16,
            }}
          >
            <FaClock className="text-white fs-3" />
          </div>

          {/* Assignment Info */}
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="fw-bold mb-1 text-primary">
                  {assignment.title}
                </h5>
                {isDueToday && (
                  <span className="badge bg-danger mb-2">Due Today</span>
                )}
              </div>
              <small className="text-muted">
                {new Date(assignment.deadline).toLocaleDateString()}
              </small>
            </div>

            <p className="text-muted small mb-1">
              Posted by <strong>Teacher</strong>
            </p>
            <p className="text-dark">{assignment.description}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
          {/* Download */}
          {assignment.file_url && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() =>
                handleDownload(assignment.file_url, assignment.title + ".pdf")
              }
            >
              <FaDownload className="me-2" />
              Download
            </Button>
          )}

          {/* Submit */}
          {showSubmit ? (
            <Button
              variant="success"
              size="sm"
              onClick={() => handleSubmit(assignment)}
            >
              Submit
            </Button>
          ) : (
            <span className="badge bg-success px-3 py-2 fs-6">Submitted</span>
          )}
        </div>

        {/* Progress */}
        {showSubmit && (
          <div className="mt-4">
            <strong className="d-block mb-2">Progress</strong>
            <ProgressBar now={50} label="50% complete" />
          </div>
        )}
      </div>
    </div>
  );
};


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
