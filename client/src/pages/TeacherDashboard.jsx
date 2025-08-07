// TeacherDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Button, Modal } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaTasks, FaFileAlt, FaClock, FaExclamationCircle, FaCalendarAlt, FaCheckCircle, FaBookOpen } from 'react-icons/fa';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import TeachSidebar from '../components/Teacher/TeacherSidebar';

const server= import.meta.env.VITE_BACKEND_URL;

const TeacherDashboard = () => {
  const [date, setDate] = useState(new Date());
  const [activeAssignmentsCount, setActiveAssignmentsCount] = useState(0);
  const [totalSubmissionsCount, setTotalSubmissionsCount] = useState(0);
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [allAssignments, setAllAssignments] = useState([]);
  const [allSeminars,setAllSeminars]=useState([]);
  const [showDateEvents, setShowDateEvents] = useState(false);
  const [dateEvents, setDateEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  
useEffect(() => {
  const token = localStorage.getItem('token');
  console.log("token: ", token);

  // Fetch assignment stats
  axios.get(`${server}/api/assignments/get1`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  .then(res => {
    const assignments = res.data;
    setAllAssignments(assignments);

    const now = new Date();
    setActiveAssignmentsCount(assignments.length);
    setOverdueCount(assignments.filter(a => new Date(a.deadline) < now).length);

    const upcoming = assignments
      .filter(a => new Date(a.deadline) >= now)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 5);

    setUpcomingDeadlines(upcoming);
  })
  .catch(error => {
    console.error("Error fetching assignments:", error);
  });
}, []);

useEffect(() => {
  const fetchSeminars = async () => {
    const token = localStorage.getItem('token');
    console.log("token: ", token);

    try {
      const res = await axios.get(`${server}/api/seminars`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        const now = new Date();
        setAllSeminars(res.data.filter(a=>new Date(a.datetime)>=now));
        console.log("Seminars:", res.data);  // ✅ Print seminars here
      }
    } catch (err) {
      console.error("Error fetching seminars:", err);
    }
  };

  fetchSeminars();  // Call the async function
}, []);

  

  // Function to check if a date has any deadlines
  const dateHasDeadline = (date) => {
    return allAssignments.some(assignment => {
      const deadline = new Date(assignment.deadline);
      return (
        deadline.getDate() === date.getDate() &&
        deadline.getMonth() === date.getMonth() &&
        deadline.getFullYear() === date.getFullYear()
      );
    });
  };

  // Function to get events for a specific date
  const getDateEvents = (date) => {
    return allAssignments.filter(assignment => {
      const deadline = new Date(assignment.deadline);
      return (
        deadline.getDate() === date.getDate() &&
        deadline.getMonth() === date.getMonth() &&
        deadline.getFullYear() === date.getFullYear()
      );
    });
  };

  // Tile content for calendar
  const tileContent = ({ date, view }) => {
    if (view === 'month' && dateHasDeadline(date)) {
      return (
        <div className="calendar-event-dot">
          <FaExclamationCircle className="text-danger" size={10} />
        </div>
      );
    }
    return null;
  };

  // Handle date click
  const handleDateClick = (date) => {
    setSelectedDate(date);
    const events = getDateEvents(date);
    setDateEvents(events);
    if (events.length > 0) {
      setShowDateEvents(true);
    }
  };

  return (
    <div className="maincontainer flex min-h-screen  bg-gray-100">      
      <TeachSidebar/>

      <div className="container flex-grow">
        <h2 className="fw-bold mb-4">Teacher Dashboard</h2>

        {/* Summary Cards */}
        <Row className="mb-3 g-3">
          {[
            { icon: FaFileAlt, label: 'Active Assignments', count: activeAssignmentsCount, meta: `${activeAssignmentsCount - activeAssignmentsCount} this week` },
            { icon: FaFileAlt, label: 'Total Submissions', count: totalSubmissionsCount, meta: `+${totalSubmissionsCount} today` },
            { icon: FaClock, label: 'Pending Reviews', count: pendingReviewsCount, meta: `${pendingReviewsCount} urgent` },
            { icon: FaExclamationCircle, label: 'Overdue Items', count: overdueCount, meta: 'Needs attention' },
          ].map(({ icon: Icon, label, count, meta }, idx) => (
            <Col md={3} key={idx}>
              <Card className="text-center">
                <Card.Body>
                  <Icon size={30} className="text-primary mb-2" />
                  <h5>{label}</h5>
                  <p className="mb-0">{count}</p>
                  <small className="text-muted">{meta}</small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Upcoming Deadlines & Calendar */}
      <Row className="mb-4 g-3">
        {/* Left: Deadlines + Seminars */}
        <Col md={8}>
          <Card className="shadow rounded-4">
            <Card.Body>
              <h5 className="fw-bold mb-3">📌 Upcoming Deadlines</h5>
              <ListGroup variant="flush" className="mb-4">
                {upcomingDeadlines.map((a) => (
                  <ListGroup.Item key={a.id} className="bg-light border-0 rounded mb-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1 text-dark">{a.title}</h6>
                        <small className="text-muted">
                          {a.branch} • Year {a.year}
                        </small>
                      </div>
                      <div className="text-danger fw-semibold">
                        Due: {new Date(a.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}

                {upcomingDeadlines.length === 0 && (
                  <ListGroup.Item className="text-muted text-center bg-white">
                    No upcoming assignments
                  </ListGroup.Item>
                )}
              </ListGroup>

              <h5 className="fw-bold mb-3">🎤 Upcoming Seminars</h5>
              <div className="space-y-3">
                {allSeminars.length === 0 && (
                  <div className="text-muted text-center">No upcoming seminars</div>
                )}
                {allSeminars.map((seminar) => (
                  <div
                    key={seminar.id}
                    className="bg-white rounded-xl shadow-sm p-3 hover:shadow-md transition-shadow border"
                  >
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <div>
                        <h6 className="fw-semibold text-primary mb-1">{seminar.title}</h6>
                        <small className="text-muted">{seminar.description}</small>
                      </div>
                      <span className="badge bg-primary text-white">
                        {seminar.mode.toUpperCase()}
                      </span>
                    </div>

                    <div className="d-flex flex-wrap gap-3 text-sm text-dark">
                      <p className="mb-0"><strong>Speaker:</strong> {seminar.speaker}</p>
                      <p className="mb-0"><strong>Year:</strong> {seminar.year} ({seminar.branch})</p>
                      <p className="mb-0"><strong>Date:</strong> {new Date(seminar.datetime).toLocaleString()}</p>
                      <p className="mb-0"><strong>Venue:</strong> {seminar.venue}</p>
                    </div>

                    {seminar.link && (
                      <a
                        href={seminar.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm mt-2 d-block"
                      >
                        🔗 Join Link
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right: Calendar */}
        <Col md={4}>
          <Card className="shadow rounded-4">
            <Card.Body>
              <h5 className="d-flex align-items-center fw-bold mb-3">
                <FaCalendarAlt className="me-2" />
                {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
              </h5>

              <Calendar
                value={date}
                onChange={setDate}
                onClickDay={handleDateClick}
                tileContent={tileContent}
                tileClassName={({ date, view }) => {
                  if (view === 'month' && dateHasDeadline(date)) {
                    return 'bg-danger text-white rounded-circle'; // highlight days with deadlines
                  }
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

        {/* Recent Submissions */}
        <Card>
          <Card.Body>
            <h5 className="fw-bold">Recent Student Submissions</h5>
            <ListGroup>
              {recentSubmissions.map(s => (
                <ListGroup.Item key={s.id} className="d-flex justify-content-between align-items-center">
                  <div>
                    <FaCheckCircle className="text-success me-2" />
                    <strong>{s.student_name}</strong> submitted <em>{s.assignment_title}</em>
                  </div>
                  <div className="text-end">
                    <small className="text-muted">{new Date(s.submitted_at).toLocaleDateString()}</small><br/>
                    {s.graded && <span className="text-success fw-semibold">Grade: {s.grade}</span>}
                  </div>
                </ListGroup.Item>
              ))}
              {recentSubmissions.length === 0 && (
                <ListGroup.Item className="text-center text-muted">No submissions yet</ListGroup.Item>
              )}
            </ListGroup>
          </Card.Body>
        </Card>

        {/* Date Events Modal */}
        <Modal show={showDateEvents} onHide={() => setShowDateEvents(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              Events on {selectedDate && selectedDate.toLocaleDateString()}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {dateEvents.length > 0 ? (
              <ListGroup variant="flush">
                {dateEvents.map(event => (
                  <ListGroup.Item key={event.id}>
                    <h6>{event.title}</h6>
                    <p className="mb-1">Deadline: {new Date(event.deadline).toLocaleString()}</p>
                    <small className="text-muted">{event.branch} • Year {event.year}</small>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p>No events on this date</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDateEvents(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

     

    </div>
  );
};

export default TeacherDashboard;