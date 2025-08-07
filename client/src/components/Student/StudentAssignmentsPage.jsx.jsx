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
            `${server}/api/assignments/submitassi`,
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
   <div
        key={assignment.id}
        className="bg-white shadow-md rounded-xl p-4 mb-1 border border-gray-400 hover:shadow-1xl transition duration-300"
      >
        <div className="flex flex-col md:flex-row gap-2">
          {/* Icon Box */}
          <div className="flex-shrink-0 w-14 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
            <FaClock className="text-white text-1xl" />
          </div>

          {/* Assignment Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between">
              <div>
                <h3 className="text-sm md:text-md font-semibold text-gray-800">
                  {assignment.title}
                </h3>
                {isDueToday && (
                  <span className="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded mt-1/2">
                    Due Today
                  </span>
                )}
              </div>
              <div className="mt-2 sm:mt-0 text-sm text-gray-500">
                {new Date(assignment.deadline).toLocaleDateString()}
              </div>
            </div>

            {/* <p className="text-sm text-gray-500 mt-2">
              Posted by <span className="font-semibold text-gray-700">{assignment.createdby}</span>
            </p> */}

            <p className="text-gray-700 text-sm mt-1 md:pr-6">{assignment.description}</p>

            {/* Actions */}
            <div className="flex flex-wrap justify-end items-center mt-1 gap-3">
              {/* Download (if file present) */}
              {/* {assignment.file_url && (
                <button
                  onClick={() =>
                    handleDownload(assignment.file_url, assignment.title + ".pdf")
                  }
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  <FaDownload className="mr-2" />
                  Download
                </button>
              )} */}

              {/* Submit/Submitted */}
              {showSubmit ? (
                <button
                  onClick={() => handleSubmit(assignment)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm"
                >
                  Submit
                </button>
              ) : (
                <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                  Submitted
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

  );
};


  return (
    <div className="maincontainer flex min-h-screen  bg-gray-100">
      
      <StudSidebar/>

      <div className="container flex-grow">
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
