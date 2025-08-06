// src/pages/Teacher/ViewEditAssignments.jsx
import React from 'react';
import { Card, Button, Badge, ProgressBar, Row, Col, Form } from 'react-bootstrap';
import Sidebar from "./Sidebar"; 
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const assignments = [
  {
    id: 1,
    status: 'Active',
    title: 'Database Design Project',
    description:
      'Design and implement a complete database system for a library management system including ER diagrams, normalization, and SQL queries.',
    subject: 'Database Systems',
    year: 'Year 3 • Computer Science',
    dueDate: '15/12/2024',
    created: '1/11/2024',
    submissions: '45/60',
    progress: 75,
  },
  {
    id: 2,
    status: 'Active',
    title: 'Machine Learning Research Paper',
    description:
      'Write a comprehensive research paper on recent advances in deep learning, focusing on transformer architectures and their applications.',
    subject: 'Machine Learning',
    year: 'Year 4 • Computer Science',
    dueDate: '20/12/2024',
    created: '5/11/2024',
    submissions: '12/25',
    progress: 48,
  },
  {
    id: 3,
    status: 'Overdue',
    title: 'Web Development Portfolio',
    description:
      'Create a full-stack web application portfolio showcasing your skills in React, Node.js, and database integration.',
    subject: 'Web Development',
    year: 'Year 3 • Computer Science',
    dueDate: '30/11/2024',
    created: '15/10/2024',
    submissions: '55/60',
    progress: 92,
  },
];

const ViewEditAssignments = () => {
  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1 p-4">
        <h3 className="fw-bold mb-3">View & Edit Assignments</h3>
        <p className="text-muted mb-4">Manage your assignments and track student progress</p>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Control placeholder="Search assignments..." />
          </Col>
          <Col md={3}>
            <Form.Select>
              <option>All Status</option>
              <option>Active</option>
              <option>Overdue</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select>
              <option>All Subjects</option>
              <option>Web Development</option>
              <option>Database Systems</option>
              <option>Machine Learning</option>
            </Form.Select>
          </Col>
        </Row>

        <Row>
          {assignments.map((assignment) => (
            <Col md={4} key={assignment.id} className="mb-4">
              <Card>
                <Card.Body>
                  <Badge bg={assignment.status === 'Active' ? 'success' : 'danger'} className="mb-2">
                    {assignment.status}
                  </Badge>
                  <Card.Title>{assignment.title}</Card.Title>
                  <Card.Text>{assignment.description}</Card.Text>
                  <div className="text-muted mb-2">
                    📘 {assignment.subject} &nbsp;&nbsp;|&nbsp;&nbsp; {assignment.year}
                  </div>
                  <div className="text-muted mb-2">📅 Due: {assignment.dueDate}</div>
                  <div className="mb-2">👥 {assignment.submissions}</div>
                  <div className="mb-2">
                    <ProgressBar now={assignment.progress} label={`${assignment.progress}%`} />
                  </div>
                  <div className="text-muted small mb-2">Created {assignment.created}</div>
                  <div className="d-flex justify-content-between">
                    <Button size="sm" variant="link" className="p-0">
                      View Details
                    </Button>
                    <Button size="sm" variant="link" className="p-0">
                      View Submissions
                    </Button>
                  </div>
                  <div className="mt-2 d-flex justify-content-end gap-2">
                    <FaEye role="button" title="View" />
                    <FaEdit role="button" title="Edit" />
                    <FaTrash role="button" title="Delete" className="text-danger" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default ViewEditAssignments;
