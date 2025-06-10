import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

const ManageDeadlines = () => {
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleAdd = () => {
    if (!title || !deadline) return;
    setAssignments([...assignments, { title, deadline }]);
    setTitle('');
    setDeadline('');
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <h5 className="fw-semibold mb-4">
          <span className="me-2" style={{ color: '#399EFF' }}>■</span>
          Manage Assignment Deadlines
        </h5>

        <Row className="align-items-center mb-3">
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Assignment Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Button variant="link" onClick={handleAdd} className="text-primary text-decoration-none fw-bold">
              <FaPlus className="me-1" /> Add
            </Button>
          </Col>
        </Row>

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
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{a.title}</td>
                  <td>{new Date(a.deadline).toLocaleDateString()}</td>
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
