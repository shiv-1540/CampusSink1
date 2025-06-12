import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Form, Button, Row, Col, Table, Alert } from 'react-bootstrap';
import { FaSearch, FaSave } from 'react-icons/fa';
import axios from 'axios';

const ManageDeadlines = () => {
  const [assignments, setAssignments] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [newDeadline, setNewDeadline] = useState('');
  const [message, setMessage] = useState('');

  // Fetch all assignments once
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/assignments');
        setAssignments(res.data);
      } catch (err) {
        console.error('Error fetching assignments', err);
      }
    };
    fetchAssignments();
  }, []);

  // Handle search
  const handleSearch = () => {
    const match = assignments.find(
      (a) => a.title.toLowerCase() === searchTitle.toLowerCase()
    );
    if (match) {
      setSelectedAssignment(match);
      setNewDeadline(match.deadline?.slice(0, 16)); // 'yyyy-MM-ddTHH:mm'
      setMessage('');
    } else {
      setSelectedAssignment(null);
      setNewDeadline('');
      setMessage('Assignment not found');
    }
  };

  // Handle update deadline
  const handleUpdateDeadline = async () => {
    if (!newDeadline || !selectedAssignment) return;

    try {
      const res = await axios.put(
        `http://localhost:5000/api/assignments/${selectedAssignment.id}`,
        {
          ...selectedAssignment,
          deadline: newDeadline
        }
      );

      setMessage('Deadline updated successfully');
      // Update in UI
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
      setMessage('Failed to update deadline');
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <h5 className="fw-semibold mb-4">
          <span className="me-2" style={{ color: '#399EFF' }}>■</span>
          Manage Assignment Deadlines
        </h5>

        {message && <Alert variant="info">{message}</Alert>}

        <Row className="align-items-center mb-3">
          <Col md={5}>
            <Form.Control
              type="text"
              placeholder="Search by Assignment Title"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Button variant="primary" onClick={handleSearch}>
              <FaSearch className="me-1" /> Search
            </Button>
          </Col>
        </Row>

        {selectedAssignment && (
          <>
            <h6>Edit Deadline for: <strong>{selectedAssignment.title}</strong></h6>
            <Row className="align-items-center mb-3">
              <Col md={4}>
                <Form.Control
                  type="datetime-local"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                />
              </Col>
              <Col md={2}>
                <Button variant="success" onClick={handleUpdateDeadline}>
                  <FaSave className="me-1" /> Save
                </Button>
              </Col>
            </Row>
          </>
        )}

        {assignments.length > 0 && (
          <Table bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Assignment Title</th>
                <th>Deadline</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a, i) => (
                <tr key={a.id}>
                  <td>{i + 1}</td>
                  <td>{a.title}</td>
                  <td>{new Date(a.deadline).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default ManageDeadlines;
