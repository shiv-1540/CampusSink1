import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table, Alert } from 'react-bootstrap';
import { FaSearch, FaSave } from 'react-icons/fa';
import axios from 'axios';
import TeachSidebar from './TeacherSidebar';
const server = import.meta.env.VITE_BACKEND_URL;

const ManageDeadlines = () => {
  const [assignments, setAssignments] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [newDeadline, setNewDeadline] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(`${server}/api/assignments/get1`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        setAssignments(res.data);
      } catch (err) {
        console.error('Error fetching assignments', err);
      }
    };
    fetchAssignments();
  }, []);

  const handleSearch = () => {
    const match = assignments.find(
      (a) => a.title.toLowerCase() === searchTitle.toLowerCase()
    );
    if (match) {
      setSelectedAssignment(match);
      setNewDeadline(match.deadline?.slice(0, 16));
      setMessage('');
    } else {
      setSelectedAssignment(null);
      setNewDeadline('');
      setMessage('Assignment not found ❌');
    }
  };

  const handleUpdateDeadline = async () => {
    if (!newDeadline || !selectedAssignment) return;
    const token = localStorage.getItem('token');

    try {
      const res = await axios.put(
        `${server}/api/assignments/${selectedAssignment.id}/deadline`,
        {
          ...selectedAssignment,
          deadline: newDeadline,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('✅ Deadline updated successfully');

      setAssignments((prev) =>
        prev.map((a) =>
          a.id === selectedAssignment.id ? res.data.data : a
        )
      );

      setSelectedAssignment(null);
      setSearchTitle('');
      setNewDeadline('');
    } catch (err) {
      console.error('Update failed', err);
      setMessage('❌ Failed to update deadline');
    }
  };

  return (
    <div className="maincontainer flex min-h-screen  bg-gray-100">
        <TeachSidebar />

      {/* Main Content */}
      <div className="container flex-grow" >
        <header className="mb-6">
          <div className="flex items-center gap-3">
            <span className="w-3 h-10 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-sm"></span>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">
                Manage Assignment Deadlines
              </h1>
              <p className="text-sm md:text-base text-gray-500">
                Track, update, and organize all assignment due dates in one place
              </p>
            </div>
          </div>
        </header>

        {/* Message Alert */}
        {message && (
          <Alert variant={message.includes('✅') ? 'success' : 'danger'} className="text-center fw-semibold shadow-sm">
            {message}
          </Alert>
        )}

        {/* Search Form */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <input
            type="text"
            placeholder="Search by Assignment Title"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="col-span-2 w-50 px-2 py-1 border border-gray-300 rounded-lg bg-white"
          />

          <button
            onClick={handleSearch}
            className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition"
          >
            <FaSearch className="text-white" />
            Search
          </button>
        </div>
      </div>


        {/* Edit Deadline */}
        {selectedAssignment && (
          <div className="bg-light border rounded p-4 mb-4 shadow-sm">
            <h5 className="fw-semibold mb-3">
              🕒 Edit Deadline for: <span className="text-info">{selectedAssignment.title}</span>
            </h5>
            <Row className="align-items-center">
              <Col md={4}>
                <Form.Control
                  type="datetime-local"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                />
              </Col>
              <Col md={2}>
                <Button variant="success" className="w-100" onClick={handleUpdateDeadline}>
                  <FaSave className="me-2" /> Save
                </Button>
              </Col>
            </Row>
          </div>
        )}

        {/* Assignments Table */}
        {assignments.length > 0 && (
          <div className="bg-white rounded shadow-sm p-3">
            <h6 className="font-extrabold text-gray-800 text-xl mb-3"> All Assignments</h6>
           <div className="overflow-x-auto mt-8">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-xl">
              <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
                <tr>
                  <th className="px-4 py-2 text-left border border-gray-200">#</th>
                  <th className="px-4 py-2 text-left border border-gray-200">Title</th>
                  <th className="px-4 py-2 text-left border border-gray-200">Deadline</th>
                  <th className="px-4 py-2 text-left border border-gray-200">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {assignments.map((a, i) => (
                  <tr
                    key={a.id}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    <td className="px-4 py-2 border border-gray-200 text-gray-800">{i + 1}</td>
                    <td className="px-4 py-2 border border-gray-200 text-gray-800 font-medium">{a.title}</td>
                    <td className="px-4 py-2 border border-gray-200 text-gray-700">
                      {new Date(a.deadline).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border border-gray-200 text-gray-600">
                      {a.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
           </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default ManageDeadlines;
