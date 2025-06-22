import React, { useEffect, useState } from 'react';
import { Card, Button, Badge, Row, Col, Form, Modal } from 'react-bootstrap';

import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import TeachSidebar from './TeacherSidebar';
const server= import.meta.env.VITE_BACKEND_URL;

const ViewEditAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    year: '',
    branch: '',
    deadline: '',
    file_url: '',
    status: 'active',
  });

  const fetchAssignments = async () => {
    const token=localStorage.getItem('token');
    try {
      const res = await fetch(`${server}/api/assignments`,
        {
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
          }
        }

      );
      const data = await res.json();
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleEditClick = (assignment) => {
    setEditing(assignment.id);
    setFormData({ ...assignment });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const token=localStorage.getItem('token');
    try {
      const res = await fetch(`${server}/api/assignments/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        alert('✅ Assignment updated successfully!');
        setEditing(null);
        fetchAssignments();
      } else {
        alert('❌ Failed to update assignment: ' + result.error);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('❌ Server or network error!');
    }
  };

 const handleDelete = async (id) => {
  const token = localStorage.getItem('token');

  if (window.confirm('Are you sure you want to delete this assignment?')) {
    try {
      const res = await axios.delete(`${server}/api/assignments/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (res.status === 200) {
        alert('🗑️ Assignment deleted successfully!');
        fetchAssignments(); // refresh list
      } else {
        alert('❌ Failed to delete assignment');
      }
    } catch (error) {
      console.error('Delete error:', error);
      const errMsg = error.response?.data?.error || 'Server or network error!';
      alert(`❌ ${errMsg}`);
    }
  }
};


  const formatDateTime = (isoDateStr) => {
    const date = new Date(isoDateStr);
    const datePart = date.toLocaleDateString();
    const timePart = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${datePart} at ${timePart}`;
  };

  return (
    <div className="d-flex">
      <div className="w-64 fixed top-0 left-0 h-full z-10">
        <TeachSidebar />
      </div>

      <div className="flex-grow ml-64 p-6 bg-gray-100 min-h-screen">
        <h3 className="fw-bold mb-3">View & Edit Assignments</h3>

        <Row>
          {assignments.map((assignment) => (
            <Col md={4} key={assignment.id} className="mb-4">
              <Card>
                <Card.Body>
                  <Badge bg={assignment.status === 'active' ? 'success' : 'danger'} className="mb-2">
                    {assignment.status}
                  </Badge>
                  <Card.Title>{assignment.title}</Card.Title>
                  <Card.Text>{assignment.description}</Card.Text>
                  <div className="text-muted mb-2">
                    📘 {assignment.branch} &nbsp;&nbsp;|&nbsp;&nbsp; {assignment.year}
                  </div>
                  <div className="text-muted mb-2">
                    📅 Due: {formatDateTime(assignment.deadline)}
                  </div>
                  <div className="mt-2 d-flex justify-content-end gap-3">
                    <FaEdit
                      role="button"
                      title="Edit"
                      onClick={() => handleEditClick(assignment)}
                      style={{ cursor: 'pointer' }}
                    />
                    <FaTrash
                      role="button"
                      title="Delete"
                      className="text-danger"
                      onClick={() => handleDelete(assignment.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Modal show={editing !== null} onHide={() => setEditing(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Assignment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Year</Form.Label>
                    <Form.Control
                      type="text"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Branch</Form.Label>
                    <Form.Control
                      type="text"
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Deadline</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default ViewEditAssignments;
