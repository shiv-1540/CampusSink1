/*
This React project creates a full Teacher Dashboard UI as shown in your image.
It uses only React + Bootstrap + React Icons (no custom CSS).
*/

// 1. INSTALL DEPENDENCIES
// npm install react-bootstrap bootstrap react-icons react-calendar

// 2. ADD TO main.jsx or index.js
import 'bootstrap/dist/css/bootstrap.min.css';


// Inline fix: Adjust calendar colors to work well with Bootstrap
import './TeacherDashboard.css'; // Create this file in the same folder

// 3. TeacherDashboard.jsx (Save in /components)
import { Route } from 'react-router-dom';

import React, { useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaTasks, FaFileAlt, FaClock, FaExclamationCircle, FaCalendarAlt, FaCheckCircle, FaBookOpen } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-light border-end" style={{ width: '250px', minHeight: '100vh' }}>
        <div className="p-3">
          <h4 className="fw-bold mb-4">📘 CampusSink</h4>
          <div className="text-center mb-4">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" className="rounded-circle" width="70" alt="Teacher" />
            <p className="mt-2 fw-semibold mb-0">Dr. Sarah Johnson</p>
            <small className="text-muted">Teacher</small>
          </div>
          <ListGroup>
            <ListGroup.Item active><FaTasks className="me-2" />Dashboard</ListGroup.Item>
            <ListGroup.Item action as={Link} to="/teacher/add-assignment"><FaFileAlt className="me-2" />Add Assignment</ListGroup.Item>
            <ListGroup.Item ><FaFileAlt className="me-2" />View/Edit Assignments</ListGroup.Item>
            <ListGroup.Item><FaClock className="me-2" />Manage Deadlines</ListGroup.Item>
            <ListGroup.Item><FaBookOpen className="me-2" />Project Reviews</ListGroup.Item>
            <ListGroup.Item><FaBookOpen className="me-2" />Seminars</ListGroup.Item>
          </ListGroup>
        </div>
        <div className="p-3 border-top text-center">
          <Button variant="outline-danger" size="sm">Logout</Button>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="flex-grow-1 p-4 bg-light">
        <h2 className="fw-bold mb-4">Teacher Dashboard</h2>
        <Row className="mb-3 g-3">
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <FaFileAlt size={30} className="text-primary mb-2" />
                <h5>Active Assignments</h5>
                <p className="mb-0">2</p>
                <small className="text-muted">+2 this week</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <FaFileAlt size={30} className="text-success mb-2" />
                <h5>Total Submissions</h5>
                <p className="mb-0">2</p>
                <small className="text-muted">+12 today</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <FaClock size={30} className="text-warning mb-2" />
                <h5>Pending Reviews</h5>
                <p className="mb-0">1</p>
                <small className="text-muted">5 urgent</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <FaExclamationCircle size={30} className="text-danger mb-2" />
                <h5>Overdue Items</h5>
                <p className="mb-0">1</p>
                <small className="text-muted">Needs attention</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Upcoming Deadlines & Calendar */}
        <Row className="mb-4 g-3">
          <Col md={8}>
            <Card>
              <Card.Body>
                <h5 className="fw-bold">Upcoming Deadlines</h5>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="mb-1">Database Design Project</h6>
                        <small className="text-muted">Database Systems • Year 3</small>
                      </div>
                      <div className="text-danger fw-semibold">Due: 15/12/2024</div>
                    </div>
                    <div className="progress mt-2">
                      <div className="progress-bar bg-primary" style={{ width: '75%' }}></div>
                      <div className="progress-bar bg-secondary" style={{ width: '25%' }}></div>
                    </div>
                    <small>45/60 submissions</small>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="mb-1">Machine Learning Research Paper</h6>
                        <small className="text-muted">Machine Learning • Year 4</small>
                      </div>
                      <div className="text-danger fw-semibold">Due: 20/12/2024</div>
                    </div>
                    <div className="progress mt-2">
                      <div className="progress-bar bg-primary" style={{ width: '50%' }}></div>
                      <div className="progress-bar bg-secondary" style={{ width: '50%' }}></div>
                    </div>
                    <small>12/25 submissions</small>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
  <Card>
    <Card.Body>
      <h5>
        <FaCalendarAlt className="me-2" />
        {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
      </h5>
      <div className="calendar-container">
        <Calendar value={date} onChange={setDate} />
      </div>
    </Card.Body>
  </Card>
</Col>

        </Row>

        {/* Recent Submissions */}
        <Card>
          <Card.Body>
            <h5 className="fw-bold">Recent Student Submissions</h5>
            <ListGroup>
              <ListGroup.Item className="bg-success-subtle d-flex justify-content-between align-items-center">
                <div>
                  <FaCheckCircle className="text-success me-2" />
                  <strong>Alex Kumar</strong> <br />Submitted Database Design Project
                </div>
                <div className="text-end">
                  <small className="text-muted">15/11/2024</small>
                </div>
              </ListGroup.Item>
              <ListGroup.Item className="bg-success-subtle d-flex justify-content-between align-items-center">
                <div>
                  <FaCheckCircle className="text-success me-2" />
                  <strong>Alex Kumar</strong> <br />Submitted Machine Learning Research Paper
                </div>
                <div className="text-end">
                  <small className="text-muted">10/11/2024</small><br />
                  <span className="text-success fw-semibold">Grade: 85%</span>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </div>
    </div>

    
  );
};

export default TeacherDashboard;

// 4. Add a Route in App.jsx
<Route path="/teacher/dashboard" element={<TeacherDashboard />} /> 
