import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import { Modal, Button, Badge } from "react-bootstrap";
import "./StudentDashboard.css";
import StudSidebar from "./StudSidebar";
import { FaCalendarAlt, FaBell, FaFileAlt, FaBookOpen, FaTasks, FaGraduationCap } from "react-icons/fa";
import WorkloadSummary from "./WorkloadSummary";
import { useNavigate } from "react-router-dom";
import { ArrowRightCircleIcon } from '@heroicons/react/24/solid';
import AISuggestionCard from "../../AISuggestion";
import './workload.css';

const server = import.meta.env.VITE_BACKEND_URL;

const FeaturePoint = ({ text }) => (
  <li className="flex items-start gap-2 text-gray-700 text-sm sm:text-base">
    <ArrowRightCircleIcon className="h-5 w-5 text-blue-500 mt-1 shrink-0" />
    <span>{text}</span>
  </li>
);

const StudentDashboardHome = () => {
  const [error, setError] = useState("");
  const [date, setDate] = useState(new Date());
  const [assignments, setAssignments] = useState([]);
  const [seminars, setSeminars] = useState([]);
  const [projectReviews, setProjectReviews] = useState([]);
  const [academicEvents, setAcademicEvents] = useState([]);
  const [dueMap, setDueMap] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [modalEvents, setModalEvents] = useState([]);
  const navigate = useNavigate();

  const studinfo = JSON.parse(localStorage.getItem('studinfo'));
  const token = localStorage.getItem('token');

useEffect(() => {
  // Extract only primitives so dependency check works
  const dept_id = studinfo?.dept_id;
  const year = studinfo?.year;
  const prn = studinfo?.prn;

  if (!dept_id || !year || !prn || !token) {
    setError("Missing student information or authentication token. Please log in again.");
    return;
  }

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(
        `${server}/api/assignments?dept_id=${dept_id}&year=${year}&prn=${prn}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setAssignments(res.data.unsubmitted || []);
    } catch (err) {
      setError("Failed to fetch assignments: " + err.message);
    }
  };

  const fetchSeminars = async () => {
    try {
      const res = await axios.get(`${server}/api/seminars`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSeminars(res.data.filter(
        (s) => s.branch === studinfo.department && s.year === year
      ));
    } catch (err) {
      setError("Failed to fetch seminars: " + err.message);
    }
  };

  const fetchProjectReviews = async () => {
    try {
      const res = await axios.get(`${server}/api/reviews`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProjectReviews(res.data.filter(
        (p) => p.branch === studinfo.department && p.year === year
      ));
    } catch (err) {
      setError("Failed to fetch project reviews: " + err.message);
    }
  };

  const fetchAcademicEvents = async () => {
    try {
      const res = await axios.get(`${server}/api/academic-calendar`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAcademicEvents(res.data || []);
    } catch (err) {
      setError("Failed to fetch academic events: " + err.message);
    }
  };

  // Fetch all in parallel only when needed
  Promise.all([
    fetchAssignments(),
    fetchSeminars(),
    fetchProjectReviews(),
    fetchAcademicEvents()
  ]);
}, [
  studinfo?.dept_id,
  studinfo?.year,
  studinfo?.prn,
  token
]);

// Separate effect to update due map when data changes
useEffect(() => {
  const map = {};
  assignments.forEach(a => {
    const key = new Date(a.deadline).toDateString();
    if (!map[key]) map[key] = [];
    map[key].push({ type: 'assignment', data: a });
  });
  seminars.forEach(s => {
    const key = new Date(s.datetime).toDateString();
    if (!map[key]) map[key] = [];
    map[key].push({ type: 'seminar', data: s });
  });
  projectReviews.forEach(p => {
    const key = new Date(p.date).toDateString();
    if (!map[key]) map[key] = [];
    map[key].push({ type: 'project-review', data: p });
  });
  academicEvents.forEach(e => {
    const key = new Date(e.date).toDateString();
    if (!map[key]) map[key] = [];
    map[key].push({ type: 'academic', data: e });
  });
  setDueMap(map);
}, [assignments, seminars, projectReviews, academicEvents]);


  const handleNavigate = () => {
    navigate('/student/assignments');
  };

  const onDateClick = (d) => {
    const key = new Date(d).toDateString();
    const events = dueMap[key] || [];
    setModalEvents(events);
    setModalShow(events.length > 0);
    setDate(d);
  };

  const tileClassName = ({ date: d, view }) => {
    const key = new Date(d).toDateString();
    return view === "month" && dueMap[key] ? "bg-warning text-dark rounded-circle" : null;
  };

  const tileContent = ({ date: d, view }) => {
    if (view !== 'month') return null;
    const key = new Date(d).toDateString();
    const events = dueMap[key] || [];
    if (events.length === 0) return null;

    const eventTypes = [...new Set(events.map(e => e.type))];
    return (
      <div className="calendar-event-dots">
        {eventTypes.includes('assignment') && (
          <span className="event-dot assignment-dot" title="Assignment">
            <FaFileAlt size={10} />
          </span>
        )}
        {eventTypes.includes('seminar') && (
          <span className="event-dot seminar-dot" title="Seminar">
            <FaBookOpen size={10} />
          </span>
        )}
        {eventTypes.includes('project-review') && (
          <span className="event-dot project-dot" title="Project Review">
            <FaTasks size={10} />
          </span>
        )}
        {eventTypes.includes('academic') && (
          <span className="event-dot academic-dot" title="Academic Event">
            <FaGraduationCap size={10} />
          </span>
        )}
      </div>
    );
  };

  const getEventColor = (type) => {
    const colors = {
      assignment: '#e63946',
      seminar: '#118ab2',
      'project-review': '#f9844a',
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

  if (error) {
    return (
      <div className="maincontainer flex min-h-screen bg-gray-100">
        <StudSidebar />
        <div className="container flex-grow text-red-600 text-center py-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="maincontainer flex min-h-screen bg-gray-100">
      <StudSidebar />
      <div className="container flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Assignments, Seminars, Project Reviews, Academic Events */}
          <div className="col-span-2 space-y-6">
            {/* 📚 Assignments */}
            <div className="currAssiContainer bg-white rounded-xl shadow-md p-4">
              <h2 className="text-lg font-bold mb-3">📚 Current Assignments</h2>
              {assignments.length ? (
                [...assignments]
                  .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                  .map((assignment) => (
                    <div className="assignment border mb-3 rounded-md flex flex-col md:flex-row justify-between md:items-center gap-3" key={assignment.id}>
                      <div>
                        <h6 className="font-bold">{assignment.title}</h6>
                        <p className="text-sm">{assignment.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Due: {new Date(assignment.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      <button className="btn btn-sm btn-primary mt-2" onClick={handleNavigate}>Continue</button>
                    </div>
                  ))
              ) : <p className="text-gray-500">No assignments available.</p>}
            </div>

            {/* 🧑‍🏫 Seminars */}
            <div className="bg-white p-4 rounded-xl shadow-md">
              <h5 className="text-lg font-bold mb-3">🧑‍🏫 Upcoming Seminars</h5>
              {seminars.length > 0 ? (
                seminars
                  .filter(s => new Date(s.datetime) >= new Date())
                  .map((seminar) => (
                    <div className="border p-2 mb-1 rounded-md" key={seminar.id}>
                      <strong>{seminar.title}</strong>
                      <p className="text-xs text-gray-700">
                        {new Date(seminar.datetime).toLocaleString()} • {seminar.venue} • {seminar.speaker}
                      </p>
                      <p className="text-sm">{seminar.description}</p>
                    </div>
                  ))
              ) : <p className="text-gray-500">No upcoming seminars scheduled.</p>}
            </div>

            {/* 📋 Project Reviews */}
            <div className="bg-white p-4 rounded-xl shadow-md">
              <h5 className="text-lg font-bold mb-3">📋 Scheduled Project Reviews</h5>
              {projectReviews.length > 0 ? (
                projectReviews
                  .filter(r => !r.completed)
                  .map((review) => (
                    <div className="border p-2 mb-1 rounded-md" key={review.id}>
                      <strong>{review.title}</strong>
                      <p className="text-xs text-gray-700">
                        {new Date(review.date).toLocaleDateString()} • {review.branch} • Year {review.year}
                      </p>
                      <p className="text-sm">{review.description}</p>
                    </div>
                  ))
              ) : <p className="text-gray-500">No scheduled project reviews.</p>}
            </div>

            {/* 🎓 Academic Events */}
            <div className="bg-white p-4 rounded-xl shadow-md">
              <h5 className="text-lg font-bold mb-3">🎓 Academic Events</h5>
              {academicEvents.length > 0 ? (
                academicEvents.map((event) => (
                  <div className="border p-2 mb-1 rounded-md" key={event.id}>
                    <strong>{event.title}</strong>
                    <Badge bg="transparent" className="ms-2" style={{ 
                      color: getEventColor(event.type),
                      border: `1px solid ${getEventColor(event.type)}`
                    }}>
                      {event.type}
                    </Badge>
                    <p className="text-xs text-gray-700">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm">{event.description}</p>
                  </div>
                ))
              ) : <p className="text-gray-500">No academic events scheduled.</p>}
            </div>

            {/* 📆 Calendar + Events */}
            <div className="bg-white text-gray-900 p-4 rounded-md shadow-md">
              <h5 className="text-lg font-bold mb-1">📆 Events Calendar</h5>
              <Calendar
                value={date}
                onChange={onDateClick}
                tileClassName={tileClassName}
                tileContent={tileContent}
              />
              <h6 className="mt-4 text-md font-bold">Upcoming Events</h6>
              <ul className="text-sm mt-2 list-disc ml-5 text-gray-700">
                {[...assignments, ...seminars, ...projectReviews, ...academicEvents]
                  .sort((a, b) => new Date(a.deadline || a.datetime || a.date) - new Date(b.deadline || b.datetime || b.date))
                  .slice(0, 5)
                  .map((item) => (
                    <FeaturePoint
                      key={item.id}
                      text={`${new Date(item.deadline || item.datetime || item.date).toLocaleDateString()} — ${item.title} (${item.deadline ? 'Assignment' : item.datetime ? 'Seminar' : item.completed !== undefined ? 'Project Review' : 'Academic Event'})`}
                    />
                  ))}
              </ul>
            </div>
          </div>

          {/* RIGHT: Mini Calendar + Updates + AI */}
          <div className="space-y-5">
            {/* 📅 Mini Calendar */}
            <div className="bg-white p-4 rounded-xl shadow-md">
              <h5 className="text-lg font-semibold mb-2 flex items-center">
                <FaCalendarAlt className="mr-2" />
                {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
              </h5>
              <Calendar
                value={date}
                onChange={onDateClick}
                tileClassName={tileClassName}
                tileContent={tileContent}
              />
            </div>

            {/* 🤖 AI Suggestion */}
            <AISuggestionCard />

            {/* 🔔 Recent Updates */}
            <div className="bg-white p-4 rounded-xl shadow-md">
              <h5 className="text-lg font-semibold mb-3 flex items-center">
                <FaBell className="mr-2" />Recent Updates
              </h5>
              {[...assignments, ...seminars, ...projectReviews, ...academicEvents]
                .sort((a, b) => new Date(a.deadline || a.datetime || a.date) - new Date(b.deadline || b.datetime || b.date))
                .slice(0, 3)
                .map((item) => (
                  <div className="bg-gray-100 p-2 rounded mb-2" key={item.id}>
                    <strong>{item.deadline ? 'New Assignment' : item.datetime ? 'New Seminar' : item.completed !== undefined ? 'New Project Review' : 'New Academic Event'}:</strong> <br />
                    <small>{item.title}</small>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* 📋 Workload Summary Section */}
        <div className="workload mt-6">
          <h4 className="text-lg font-bold mb-3">📊 Overall Summary of Workload</h4>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <WorkloadSummary />
            <p className="text-sm text-gray-400 mt-2">Charts or advanced stats coming soon...</p>
          </div>
        </div>

        {/* 📆 Modal on Calendar Date Click */}
        <Modal show={modalShow} onHide={() => setModalShow(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Events on {date.toDateString()}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalEvents.length > 0 ? (
              modalEvents.map((event, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex align-items-start">
                    <div className="me-3">
                      {event.type === 'assignment' && (
                        <FaFileAlt size={24} style={{ color: getEventColor('assignment') }} />
                      )}
                      {event.type === 'seminar' && (
                        <FaBookOpen size={24} style={{ color: getEventColor('seminar') }} />
                      )}
                      {event.type === 'project-review' && (
                        <FaTasks size={24} style={{ color: getEventColor('project-review') }} />
                      )}
                      {event.type === 'academic' && (
                        <FaGraduationCap size={24} style={{ color: getEventColor(event.data.type) }} />
                      )}
                    </div>
                    <div>
                      <h6>
                        {event.data.title}
                        {event.type === 'academic' && (
                          <Badge bg="transparent" className="ms-2" style={{ 
                            color: getEventColor(event.data.type),
                            border: `1px solid ${getEventColor(event.data.type)}`
                          }}>
                            {event.data.type}
                          </Badge>
                        )}
                      </h6>
                      <p className="text-sm">{event.data.description}</p>
                      <small className="text-muted">
                        {event.type === 'assignment' && `Due: ${new Date(event.data.deadline).toLocaleString()}`}
                        {event.type === 'seminar' && `Time: ${new Date(event.data.datetime).toLocaleString()} • Venue: ${event.data.venue} • Speaker: ${event.data.speaker}`}
                        {event.type === 'project-review' && `Date: ${new Date(event.data.date).toLocaleDateString()} • Status: ${event.data.completed ? 'Completed' : 'Scheduled'}${event.data.grade ? ` • Grade: ${event.data.grade}` : ''}`}
                        {event.type === 'academic' && `Date: ${new Date(event.data.date).toLocaleDateString()}`}
                      </small>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No events on this date.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalShow(false)}>Close</Button>
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
        .project-dot {
          color: #f9844a;
        }
        .academic-dot {
          color: #43aa8b;
        }
        .react-calendar__tile--active {
          background-color: #0d6efd;
          color: white;
        }
        .bg-warning {
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
        }
      `}</style>
    </div>
  );
};

export default StudentDashboardHome;