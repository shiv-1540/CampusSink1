import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Button, Modal, Badge } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaTasks, FaFileAlt, FaClock, FaExclamationCircle, FaCalendarAlt, FaCheckCircle, FaBookOpen } from 'react-icons/fa';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import TeachSidebar from '../components/Teacher/TeacherSidebar';

const server = import.meta.env.VITE_BACKEND_URL;

const TeacherDashboard = () => {
  const [date, setDate] = useState(new Date());
  const [activeAssignmentsCount, setActiveAssignmentsCount] = useState(0);
  const [totalSubmissionsCount, setTotalSubmissionsCount] = useState(0);
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [allAssignments, setAllAssignments] = useState([]);
  const [allSeminars, setAllSeminars] = useState([]);
  const [academicEvents, setAcademicEvents] = useState([]);
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

    // Fetch seminars
    axios.get(`${server}/api/seminars`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      const now = new Date();
      setAllSeminars(res.data.filter(a => new Date(a.datetime) >= now));
    })
    .catch(error => {
      console.error("Error fetching seminars:", error);
    });

    // Fetch academic events
    axios.get(`${server}/api/academic-calendar`)
    .then(res => {
      setAcademicEvents(res.data);
    })
    .catch(error => {
      console.error("Error fetching academic events:", error);
    });
  }, []);

  // Function to check if a date has any events
  const dateHasEvents = (date) => {
    return (
      allAssignments.some(assignment => isSameDate(new Date(assignment.deadline), date)) ||
      allSeminars.some(seminar => isSameDate(new Date(seminar.datetime), date)) ||
      academicEvents.some(event => isSameDate(new Date(event.date), date))
    );
  };

  // Helper function to compare dates
  const isSameDate = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  // Function to get events for a specific date
  const getDateEvents = (date) => {
    const events = [];
    
    // Add assignments
    allAssignments.forEach(assignment => {
      const deadline = new Date(assignment.deadline);
      if (isSameDate(deadline, date)) {
        events.push({
          type: 'assignment',
          title: assignment.title,
          date: deadline,
          description: `Deadline for ${assignment.branch} Year ${assignment.year}`,
          data: assignment
        });
      }
    });

    // Add seminars
    allSeminars.forEach(seminar => {
      const seminarDate = new Date(seminar.datetime);
      if (isSameDate(seminarDate, date)) {
        events.push({
          type: 'seminar',
          title: seminar.title,
          date: seminarDate,
          description: `Seminar by ${seminar.speaker} (${seminar.mode})`,
          data: seminar
        });
      }
    });

    // Add academic events
    academicEvents.forEach(event => {
      const eventDate = new Date(event.date);
      if (isSameDate(eventDate, date)) {
        events.push({
          type: 'academic',
          title: event.title,
          date: eventDate,
          description: event.description,
          eventType: event.type,
          data: event
        });
      }
    });

    return events;
  };

  // Tile content for calendar
  const tileContent = ({ date, view }) => {
    if (view === 'month' && dateHasEvents(date)) {
      const events = getDateEvents(date);
      const eventTypes = [...new Set(events.map(e => e.type))];
      
      return (
        <div className="calendar-event-dots">
          {eventTypes.includes('assignment') && (
            <span className="event-dot assignment-dot" title="Assignment Deadline">
              <FaFileAlt size={10} />
            </span>
          )}
          {eventTypes.includes('seminar') && (
            <span className="event-dot seminar-dot" title="Seminar">
              <FaBookOpen size={10} />
            </span>
          )}
          {eventTypes.includes('academic') && (
            <span className="event-dot academic-dot" title="Academic Event">
              <FaCalendarAlt size={10} />
            </span>
          )}
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

  // Get color based on event type
  const getEventColor = (type) => {
    const colors = {
      assignment: '#e63946',
      seminar: '#118ab2',
      academic: '#43aa8b',
      Holiday: '#e63946',
      Exam: '#457b9d',
      MSE: '#43aa8b',
      ESE: '#9b5de5',
      Freshers: '#f72585',
      Days: '#f9c74f',
      Orientation: '#90be6d',
      Workshop: '#277da1',
      'Placement Drive': '#f9844a',
      'Industrial Visit': '#43aa8b',
      'Cultural Fest': '#ff006e',
      'Technical Fest': '#8338ec',
      Farewell: '#ffbe0b',
    };
    return colors[type] || '#adb5bd';
  };

  return (
    <div className="maincontainer flex min-h-screen bg-gray-100">      
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
                    if (view === 'month' && dateHasEvents(date)) {
                      return 'has-event'; // highlight days with events
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
        <Modal show={showDateEvents} onHide={() => setShowDateEvents(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              Events on {selectedDate && selectedDate.toLocaleDateString()}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {dateEvents.length > 0 ? (
              <ListGroup variant="flush">
                {dateEvents.map((event, index) => (
                  <ListGroup.Item key={index}>
                    <div className="d-flex align-items-start">
                      <div className="me-3">
                        {event.type === 'assignment' && (
                          <FaFileAlt size={24} className="text-danger" />
                        )}
                        {event.type === 'seminar' && (
                          <FaBookOpen size={24} className="text-primary" />
                        )}
                        {event.type === 'academic' && (
                          <FaCalendarAlt size={24} style={{ color: getEventColor(event.eventType) }} />
                        )}
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="mb-1">
                          {event.title}
                          {event.type === 'academic' && (
                            <Badge bg="transparent" className="ms-2" style={{ 
                              color: getEventColor(event.eventType),
                              border: `1px solid ${getEventColor(event.eventType)}`
                            }}>
                              {event.eventType}
                            </Badge>
                          )}
                        </h5>
                        <p className="mb-1">{event.description}</p>
                        <small className="text-muted">
                          {event.type === 'assignment' && (
                            <>Deadline: {event.date.toLocaleString()}</>
                          )}
                          {event.type === 'seminar' && (
                            <>Time: {event.date.toLocaleString()}</>
                          )}
                          {event.type === 'academic' && (
                            <>Date: {event.date.toLocaleDateString()}</>
                          )}
                        </small>
                      </div>
                    </div>
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

      <style jsx>{`
        .calendar-event-dots {
          display: flex;
          justify-content: center;
          gap: 2px;
          margin-top: 2px;
        }
        .event-dot {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          border-radius: 50%;
        }
        .assignment-dot {
          color: #e63946;
        }
        .seminar-dot {
          color: #118ab2;
        }
        .academic-dot {
          color: #43aa8b;
        }
        .react-calendar__tile--hasActive {
          background-color: #f0f8ff;
        }
        .react-calendar__tile--active {
          background-color: #0d6efd;
          color: white;
        }
        .has-event {
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
        }
      `}</style>
    </div>
  );
};

export default TeacherDashboard;