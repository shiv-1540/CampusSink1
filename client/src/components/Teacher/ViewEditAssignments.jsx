import React, { useEffect, useState } from 'react';
import { Badge, Row, Col, Form, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import TeachSidebar from './TeacherSidebar';
const server = import.meta.env.VITE_BACKEND_URL;

const ViewEditAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState();
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
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${server}/api/assignments/get1`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setAssignments(data);
      } else {
        setError("Internal Server Error");
      }
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
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${server}/api/assignments/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
          },
        });

        if (res.status === 200) {
          alert('🗑️ Assignment deleted successfully!');
          fetchAssignments();
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
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-100 to-purple-50">
      <div className="w-64 fixed top-0 left-0 h-full z-10">
        <TeachSidebar />
      </div>

      <div className="flex-grow ml-64 p-8">
        <h3 className="text-4xl font-extrabold text-gray-900 mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          View & Edit Assignments
        </h3>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl shadow-lg animate-pulse">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment, index) => (
            <div
              key={assignment.id}
              className="rounded-2xl p-6 shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
              style={{
                backgroundColor: [
                  '#FFF3E0', // Orange 50
                  '#E6F3FA', // Light Blue 50
                  '#F3E5F5', // Purple 50
                  '#E8F5E9', // Green 50
                  '#FFFDE7', // Yellow 50
                ][index % 5],
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <Badge
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    assignment.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {assignment.status}
                </Badge>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(assignment)}
                    className="text-amber-500 hover:text-amber-700 transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(assignment.id)}
                    className="text-rose-500 hover:text-rose-700 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">{assignment.title}</h4>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{assignment.description}</p>
              <div className="flex items-center text-gray-500 text-xs mb-2">
                <span className="mr-2">📚</span>
                <span>{assignment.branch} | {assignment.year}</span>
              </div>
              <div className="flex items-center text-gray-500 text-xs">
                <span className="mr-2">⏰</span>
                <span>Due: {formatDateTime(assignment.deadline)}</span>
              </div>
            </div>
          ))}
        </div>

        <Modal
          show={editing !== null}
          onHide={() => setEditing(null)}
          centered
          className="rounded-2xl"
        >
          <Modal.Header className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-2xl">
            <Modal.Title className="text-2xl font-bold">Edit Assignment</Modal.Title>
            <button
              className="text-white hover:text-gray-200"
              onClick={() => setEditing(null)}
            >
              ✕
            </button>
          </Modal.Header>
          <Modal.Body className="p-6">
            <Form>
              <Form.Group className="mb-4">
                <Form.Label className="text-gray-700 font-semibold">Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="text-gray-700 font-semibold">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mb-4">
                    <Form.Label className="text-gray-700 font-semibold">Year</Form.Label>
                    <Form.Control
                      type="text"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-4">
                    <Form.Label className="text-gray-700 font-semibold">Branch</Form.Label>
                    <Form.Control
                      type="text"
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      className="border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-4">
                <Form.Label className="text-gray-700 font-semibold">Deadline</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="text-gray-700 font-semibold">Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="bg-gray-50 rounded-b-2xl">
            <button
              className="px-4 py-2 bg-yellow-200 text-gray-800 rounded-lg hover:bg-yellow-300 transition-colors"
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              onClick={handleUpdate}
            >
              Save Changes
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default ViewEditAssignments;