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
            <p className="mt-2 fw-semibold mb-0">Dr. Jayesh Raut</p>
            <small className="text-muted">Teacher</small>
          </div>
          <ListGroup>
            <ListGroup.Item active><FaTasks className="me-2" />Dashboard</ListGroup.Item>
            <ListGroup.Item action as={Link} to="/teacher/add-assignment"><FaFileAlt className="me-2" />Add Assignment</ListGroup.Item>
            <ListGroup.Item><FaFileAlt className="me-2" />View/Edit Assignments</ListGroup.Item>
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
      <div className="flex-grow-1 p-3 p-md-4 bg-light">
        <h2 className="fw-bold mb-4">Teacher Dashboard</h2>
        
        {/* Stats Cards */}
        <Row className="mb-3 g-3">
          <Col xs={6} md={3}>
            <Card className="text-center h-100">
              <Card.Body>
                <FaFileAlt size={24} className="text-primary mb-2" />
                <h5>Active Assignments</h5>
                <p className="mb-0">7</p>
                <small className="text-muted">0 this week</small>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card className="text-center h-100">
              <Card.Body>
                <FaFileAlt size={24} className="text-success mb-2" />
                <h5>Total Submissions</h5>
                <p className="mb-0">0</p>
                <small className="text-muted">+0 today</small>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card className="text-center h-100">
              <Card.Body>
                <FaClock size={24} className="text-warning mb-2" />
                <h5>Pending Reviews</h5>
                <p className="mb-0">0</p>
                <small className="text-muted">0 urgent</small>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card className="text-center h-100">
              <Card.Body>
                <FaExclamationCircle size={24} className="text-danger mb-2" />
                <h5>Overdue Items</h5>
                <p className="mb-0">5</p>
                <small className="text-muted">Needs attention</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Upcoming Deadlines & Calendar */}
        <Row className="mb-4 g-3">
          <Col md={8}>
            <Card className="h-100">
              <Card.Body>
                <h5 className="fw-bold">Upcoming Deadlines</h5>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <div className="d-flex flex-column flex-md-row justify-content-between">
                      <div className="mb-2 mb-md-0">
                        <h6 className="mb-1">Cron Job Testing Assignment</h6>
                        <small className="text-muted">CSE - Year TE</small>
                      </div>
                      <div className="text-danger fw-semibold">Due: 24/7/2025</div>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className="d-flex flex-column flex-md-row justify-content-between">
                      <div className="mb-2 mb-md-0">
                        <h6 className="mb-1">Machine Learning Algorithms From scratch</h6>
                        <small className="text-muted">CSE - Year TE</small>
                      </div>
                      <div className="text-danger fw-semibold">Due: 26/7/2025</div>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <style>{`
                  .react-calendar {
                    width: 100% !important;
                    max-width: 100%;
                    border: none;
                    font-family: inherit;
                  }
                  .react-calendar__navigation {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 0.5rem;
                    margin-bottom: 0.5rem;
                  }
                  .react-calendar__navigation__label {
                    flex-grow: 0 !important;
                    padding: 0 1rem;
                    font-weight: bold;
                    font-size: 0.9rem;
                    white-space: nowrap;
                  }
                  .react-calendar__navigation__arrow {
                    min-width: 30px;
                    background: none;
                    border: none;
                    font-size: 1rem;
                  }
                  .react-calendar__month-view__weekdays {
                    text-align: center;
                    font-size: 0.7rem;
                    margin-bottom: 0.5rem;
                  }
                  .react-calendar__month-view__days {
                    gap: 2px;
                  }
                  .react-calendar__tile {
                    padding: 0.35em 0.1em;
                    font-size: 0.75rem;
                    max-width: calc(100% / 7);
                  }
                  .react-calendar__tile--now {
                    background-color: #e6f7ff;
                  }
                  .react-calendar__tile--active {
                    background-color: #006edc;
                    color: white;
                  }
                  .react-calendar__tile:enabled:hover,
                  .react-calendar__tile:enabled:focus {
                    background-color: #e6e6e6;
                  }
                  .react-calendar__tile--now:enabled:hover,
                  .react-calendar__tile--now:enabled:focus {
                    background: #ffffa9;
                  }
                `}</style>
                <h5 className="flex items-center">
                  <FaCalendarAlt className="me-2" />
                  {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
                </h5>
                <div className="calendar-container">
                  <Calendar 
                    value={date} 
                    onChange={setDate}
                    calendarType="gregory"
                    formatMonthYear={(locale, date) => 
                      `${date.toLocaleString(locale, { month: 'long' })} ${date.getFullYear()}`
                    }
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Submissions */}
        <Card>
          <Card.Body>
            <h5 className="fw-bold">Recent Student Submissions</h5>
            <p className="text-muted">No submissions yet</p>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;