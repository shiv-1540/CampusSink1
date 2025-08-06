import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Button, Modal } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaTasks, FaFileAlt, FaClock, FaExclamationCircle, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
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
  const [showDateEvents, setShowDateEvents] = useState(false);
  const [dateEvents, setDateEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

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
      try {
        const res = await axios.get(`${server}/api/seminars`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 200) {
          const now = new Date();
          setAllSeminars(res.data.filter(a => new Date(a.datetime) >= now));
        }
      } catch (err) {
        console.error("Error fetching seminars:", err);
      }
    };

    fetchSeminars();
  }, []);

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

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const events = getDateEvents(date);
    setDateEvents(events);
    if (events.length > 0) {
      setShowDateEvents(true);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <TeachSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-3 p-md-4 p-lg-5 bg-gray-100">
        <Button
          variant="primary"
          className="d-lg-none mb-3"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? 'Close Menu' : 'Open Menu'}
        </Button>

        <h2 className="fw-bold mb-4">Teacher Dashboard</h2>

        {/* Summary Cards */}
        <Row xs={1} sm={2} lg={4} className="mb-3 g-3">
          {[
            { icon: FaFileAlt, label: 'Active Assignments', count: activeAssignmentsCount, meta: `${activeAssignmentsCount - activeAssignmentsCount} this week` },
            { icon: FaFileAlt, label: 'Total Submissions', count: totalSubmissionsCount, meta: `+${totalSubmissionsCount} today` },
            { icon: FaClock, label: 'Pending Reviews', count: pendingReviewsCount, meta: `${pendingReviewsCount} urgent` },
            { icon: FaExclamationCircle, label: 'Overdue Items', count: overdueCount, meta: 'Needs attention' },
          ].map(({ icon: Icon, label, count, meta }, idx) => (
            <Col key={idx}>
              <Card className="text-center h-100">
                <Card.Body>
                  <Icon size={30} className="text-primary mb-2" />
                  <h5 className="fs-6 fs-md-5">{label}</h5>
                  <p className="mb-0">{count}</p>
                  <small className="text-muted">{meta}</small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Upcoming Deadlines & Calendar */}
        <Row xs={1} md={2} className="mb-4 g-3">
          {/* Left: Deadlines + Seminars */}
          <Col md={8}>
            <Card className="shadow rounded-4">
              <Card.Body>
                <h5 className="fw-bold mb-3">📌 Upcoming Deadlines</h5>
                <ListGroup variant="flush" className="mb-4">
                  {upcomingDeadlines.map((a) => (
                    <ListGroup.Item key={a.id} className="bg-light border-0 rounded mb-2">
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                        <div>
                          <h6 className="mb-1 text-dark">{a.title}</h6>
                          <small className="text-muted">
                            {a.branch} • Year {a.year}
                          </small>
                        </div>
                        <div className="text-danger fw-semibold mt-2 mt-sm-0">
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
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start mb-1">
                        <div>
                          <h6 className="fw-semibold text-primary mb-1">{seminar.title}</h6>
                          <small className="text-muted">{seminar.description}</small>
                        </div>
                        <span className="badge bg-primary text-white mt-2 mt-sm-0">
                          {seminar.mode.toUpperCase()}
                        </span>
                      </div>
                      <div className="d-flex flex-column flex-sm-row flex-wrap gap-3 text-sm text-dark">
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
                <div className="calendar-wrapper">
                  <Calendar
                    value={date}
                    onChange={setDate}
                    onClickDay={handleDateClick}
                    tileContent={tileContent}
                    tileClassName={({ date: d, view }) => {
                      const key = new Date(d).toDateString();
                      return view === 'month' && dateHasDeadline(d)
                        ? 'bg-warning text-dark-700 rounded-circle'
                        : null;
                    }}
                    className="w-100"
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
            <ListGroup>
              {recentSubmissions.map(s => (
                <ListGroup.Item key={s.id} className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                  <div>
                    <FaCheckCircle className="text-success me-2" />
                    <strong>{s.student_name}</strong> submitted <em>{s.assignment_title}</em>
                  </div>
                  <div className="text-end mt-2 mt-sm-0">
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
        <Modal show={showDateEvents} onHide={() => setShowDateEvents(false)} centered>
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

      <style>{`
        /* Sidebar */
        .sidebar {
          width: 250px;
          position: fixed;
          top: 0;
          left: -250px;
          height: 100%;
          z-index: 1000;
          transition: left 0.3s ease-in-out;
          background: #fff;
        }
        .sidebar.open {
          left: 0;
        }
        @media (min-width: 992px) {
          .sidebar {
            left: 0;
          }
          .sidebar.open {
            left: 0;
          }
        }

        /* Main Content */
        .flex-grow-1 {
          margin-left: 0;
          transition: margin-left 0.3s ease-in-out;
        }
        @media (min-width: 992px) {
          .flex-grow-1 {
            margin-left: 250px;
          }
        }

        /* Calendar Wrapper */
        .calendar-wrapper {
          overflow-x: auto;
          max-width: 100%;
        }
        .react-calendar {
          width: 100%;
          max-width: 100%;
          background: #fff;
          border: 1px solid #dee2e6;
          border-radius: 0.375rem;
          font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
          padding: 0.5rem;
        }

        /* Navigation */
        .react-calendar__navigation {
          display: flex;
          height: 44px;
          margin-bottom: 1em;
        }

        .react-calendar__navigation button {
          min-width: 44px;
          background: none;
          border: none;
          color: #212529 !important;
          font-weight: 500;
        }

        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: #f8f9fa;
          border-radius: 0.25rem;
        }

        .react-calendar__navigation button[disabled] {
          background-color: transparent;
          color: #adb5bd !important;
        }

        /* Month View */
        .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: 600;
          font-size: 0.75em;
          color: #495057 !important;
          padding-bottom: 0.5em;
        }

        .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
          border-bottom: none;
        }

        .react-calendar__month-view__days__day--weekend {
          color: #dc3545 !important;
        }

        /* Tiles */
        .react-calendar__tile {
          max-width: 100%;
          padding: 0.5em;
          background: none;
          text-align: center;
          line-height: 1;
          border-radius: 0.25rem;
          color: #212529 !important;
        }

        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: #f8f9fa;
          color: #000 !important;
        }

        .react-calendar__tile--now {
          background: #fff3cd;
          font-weight: bold;
        }

        .react-calendar__tile--active {
          background: #0d6efd !important;
          color: white !important;
        }

        .react-calendar__tile--active:enabled:hover,
        .react-calendar__tile--active:enabled:focus {
          background: #0b5ed7 !important;
        }

        .react-calendar__tile:disabled {
          background-color: #f8f9fa;
          color: #adb5bd !important;
        }

        /* Event dots */
        .calendar-event-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #dc3545;
        }

        /* Highlight tiles with events */
        .has-event {
          background-color: #fff3cd;
          position: relative;
        }

        .has-event:enabled:hover {
          background-color: #ffe69c !important;
        }

        .react-calendar__tile--active.has-event {
          background: #0d6efd !important;
        }

        /* Responsive adjustments */
        @media (max-width: 576px) {
          .react-calendar__tile {
            padding: 0.3em;
            font-size: 0.9em;
          }
          .react-calendar__navigation button {
            min-width: 30px;
            font-size: 0.9em;
          }
          .react-calendar__month-view__weekdays {
            font-size: 0.65em;
          }
          h5 {
            font-size: 1.1rem;
          }
          h6 {
            font-size: 0.95rem;
          }
          .fs-6 {
            font-size: 0.9rem !important;
          }
          .calendar-wrapper {
            max-height: 300px;
            overflow-y: auto;
          }
        }
        @media (max-width: 768px) {
          .calendar-wrapper {
            max-width: 100%;
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default TeacherDashboard;