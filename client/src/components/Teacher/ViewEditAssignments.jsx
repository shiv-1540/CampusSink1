import React, { useEffect, useState } from 'react';
import { Badge, Row, Col, Form, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import TeachSidebar from './TeacherSidebar';
import './ViewEdit.css';
import { toast } from 'react-toastify';

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
        toast.success('✅ Assignment updated successfully!');
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
          toast.info('🗑️ Assignment deleted successfully!');
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
   <div className="maincontainer flex min-h-screen  bg-gray-100">
  <TeachSidebar />

  <div className="container flex-grow">
    <h3 className="text-3xl font-extrabold text-gray-800 mb-8 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
      View & Edit Assignments
    </h3>

    {error && (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl shadow-md animate-pulse">
        {error}
      </div>
    )}

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {assignments.map((assignment, index) => (
        <div
          key={assignment.id}
          className="rounded-2xl p-6 shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 border border-gray-200"
          style={{
            backgroundColor: [
              '#E8EAF6', // Indigo 50
              '#E3F2FD', // Blue 50
              '#E0F7FA', // Cyan 50
              '#E8F5E9', // Green 50
              '#FFFDE7', // Yellow 50
            ][index % 5],
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                assignment.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {assignment.status}
            </span>

         <div className="flex gap-2 text-md">
            <button
              onClick={() => handleEditClick(assignment)}
              className="text-green-600 hover:text-green-800 transition"
              title="Edit"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDelete(assignment.id)}
              className="text-red-500 hover:text-red-700 transition"
              title="Delete"
            >
              <FaTrash />
            </button>
          </div>

          </div>

          <h4 className="text-xl font-bold text-gray-800 mb-2">{assignment.title}</h4>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{assignment.description}</p>

          <div className="flex items-center text-gray-500 text-sm mb-2">
            <span className="mr-2">📚</span>
            <span>{assignment.branch} | {assignment.year}</span>
          </div>

          <div className="flex items-center text-gray-500 text-sm">
            <span className="mr-2">⏰</span>
            <span>Due: {formatDateTime(assignment.deadline)}</span>
          </div>
        </div>
      ))}
    </div>

    {/* Modal */}
    <Modal
      show={editing !== null}
      onHide={() => setEditing(null)}
      centered
      className="rounded-2xl"
    >
      <Modal.Header className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-t-2xl">
        <Modal.Title className="text-2xl font-semibold">Edit Assignment</Modal.Title>
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
            <Form.Label className="text-gray-700 font-medium">Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="text-gray-700 font-medium">Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group className="mb-4">
                <Form.Label className="text-gray-700 font-medium">Year</Form.Label>
                <Form.Control
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-4">
                <Form.Label className="text-gray-700 font-medium">Branch</Form.Label>
                <Form.Control
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  className="rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label className="text-gray-700 font-medium">Deadline</Form.Label>
            <Form.Control
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className="rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="text-gray-700 font-medium">Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer className="bg-gray-100 rounded-b-2xl">
        <button
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
          onClick={() => setEditing(null)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
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