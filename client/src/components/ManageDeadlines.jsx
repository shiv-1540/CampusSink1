import React, { useState } from 'react';

import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import TeachSidebar from './Teacher/TeacherSidebar';

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
        <TeachSidebar/>
  <h2>shiva</h2>
      <div className="ml-64 ">
       <h5 className="flex items-center gap-2 text-lg md:text-xl font-semibold text-gray-800 mb-4">
          <span className="w-3 h-3 rounded-sm bg-blue-500"></span>
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
