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
    <div className="d-flex" style={{ fontFamily: "'Poppins', sans-serif", background: '#f9fafb', minHeight: '100vh' }}>
      
      {/* Sidebar */}
      <div className="shadow-lg border-end bg-white" style={{ width: '240px', position: 'fixed', height: '100vh', zIndex: 10 }}>
        <TeachSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow-1" style={{ marginLeft: '240px', padding: '2rem' }}>
        <h3 className="fw-bold mb-4 text-primary">📋 Manage Assignment Deadlines</h3>

        {/* Message Alert */}
        {message && (
          <Alert variant={message.includes('✅') ? 'success' : 'danger'} className="text-center fw-semibold shadow-sm">
            {message}
          </Alert>
        )}

        {/* Search Form */}
        <div className="bg-white p-4 rounded shadow-sm mb-4">
          <Row className="align-items-center">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Search by Assignment Title"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
              />
            </Col>
            <Col md={2}>
              <Button variant="outline-primary" className="w-100" onClick={handleSearch}>
                <FaSearch className="me-2" /> Search
              </Button>
            </Col>
          </Row>
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
            <h6 className="fw-bold text-secondary mb-3">📚 All Assignments</h6>
            <Table bordered hover responsive>
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Deadline</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a, i) => (
                  <tr key={a.id}>
                    <td>{i + 1}</td>
                    <td>{a.title}</td>
                    <td>{new Date(a.deadline).toLocaleString()}</td>
                    <td>{a.description}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageDeadlines;
