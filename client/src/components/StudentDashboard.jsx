import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import { Modal, Button } from "react-bootstrap";
import "./StudentDashboard.css";
import StudSidebar from "./StudSidebar";
import { FaCalendarAlt, FaBell } from "react-icons/fa";
const server= import.meta.env.VITE_BACKEND_URL;

const StudentDashboardHome = () => {
  const [date, setDate] = useState(new Date());
  const [assignments, setAssignments] = useState([]);
  const [dueMap, setDueMap] = useState({});
  const [academicEvents, setAcademicEvents] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalEvents, setModalEvents] = useState([]);
  const [seminars, setSeminars] = useState([]);

  const student = { branch: "CSE", year: "TE" };
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(
          `${server}/api/assignments?branch=${student.branch}&year=${student.year}`,
          { headers: { Authorization:` Bearer ${token}` } }
        );
        setAssignments(res.data);
        const map = {};
        res.data.forEach(a => {
          const key = new Date(a.deadline).toDateString();
          if (!map[key]) map[key] = [];
          map[key].push({ ...a, type: "Assignment" });
        });
        setDueMap(map);
      } catch (err) { console.error(err); }
    };

    const fetchAcademicEvents = async () => {
      try {
        const res = await axios.get(`${server}/api/academic-calendar`);
        setAcademicEvents(res.data.map(e => ({ ...e, type: "Academic" })));
      } catch (err) { console.error(err); }
    };

    const fetchSeminars = async () => {
      try {
        const res = await axios.get(
          `${server}/api/seminars?branch=${student.branch}&year=${student.year}`,
          { headers: { Authorization:` Bearer ${token}` } }
        );
        setSeminars(res.data);
      } catch (err) { console.error(err); }
    };

    fetchAssignments();
    fetchAcademicEvents();
    fetchSeminars();
  }, [student.branch, student.year, token]);

  const onDateClick = (d) => {
    const dateKey = new Date(d).toDateString();
    const assignmentEvents = dueMap[dateKey] || [];
    const academicOnDate = academicEvents.filter(e => new Date(e.date).toDateString() === dateKey);
    const combined = [...assignmentEvents, ...academicOnDate];
    if (combined.length) {
      setModalEvents(combined);
      setModalShow(true);
    }
    setDate(d);
  };

  const tileClassName = ({ date: d, view }) => {
    if (view === "month") {
      const key = new Date(d).toDateString();
      return dueMap[key] || academicEvents.some(e => new Date(e.date).toDateString() === key)
        ? "bg-warning text-dark rounded-circle"
        : null;
    }
  };

  const today = new Date(); today.setHours(0,0,0,0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const upcomingSeminars = seminars.filter(seminar => {
    const sd = new Date(seminar.date); sd.setHours(0,0,0,0);
    return sd.getTime() === today.getTime() || sd.getTime() === tomorrow.getTime();
  });

  return (
    <>
      <style>{`
        .react-calendar {
  width: 100%;
  background:rgb(1, 2, 2); /* Dark navy background */
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  font-family: 'Inter', sans-serif;
  color: #e6e6e6; /* Light gray text */
  overflow: hidden;
  padding: 12px;
}

.react-calendar__navigation {
  background: #16213e;
  color: white;
  height: 50px;
  border-radius: 8px 8px 0 0;
  margin-bottom: 12px;
}

.react-calendar__navigation button {
  color: white;
  font-weight: 600;
}

.react-calendar_month-view_weekdays {
  color: #4cc9f0; /* Light blue for weekdays */
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75em;
}

.react-calendar__tile {
  border-radius: 6px;
  transition: all 0.2s ease;
}

.react-calendar__tile--active {
  background: #4cc9f0; /* Bright blue for selected date */
  color: #1a1a2e; /* Dark text for contrast */
  font-weight: bold;
}

.react-calendar__tile--now {
  background: #f72585; /* Pink for current date */
  color: white;
  font-weight: bold;
}

.react-calendar__tile:enabled:hover {
  background: rgba(76, 201, 240, 0.2); /* Semi-transparent hover */
  color: #4cc9f0;
}
      `}</style>

      <div className="d-flex">
        <StudSidebar />
        <div className="flex-grow-1 p-4 bg-light" style={{ marginLeft: "240px" }}>
          <div className="bg-primary text-white p-4 rounded mb-4 d-flex justify-content-between align-items-center">
            <div>
              <h3>Welcome back, Alex! 👋</h3>
              <p className="mb-0">Computer Science • Year 3</p>
            </div>
            <div className="text-end">
              <small>Completion Rate</small>
              <h4 className="mb-0">71%</h4>
              <div className="progress mt-1" style={{ height: "6px", width: "120px" }}>
                <div className="progress-bar bg-white" style={{ width: "71%" }}></div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-8">
              <div className="bg-white p-4 rounded shadow-sm mb-4">
                <h5>📚 Current Assignments</h5>
                {assignments.length ? (
                  <>
                    <p className="text-muted mb-1">{assignments[0].title}</p>
                    <p className="small text-muted">
                      Due: {new Date(assignments[0].deadline).toLocaleDateString()}
                    </p>
                    <div className="progress mb-2" style={{ height: "6px" }}>
                      <div className="progress-bar bg-danger" style={{ width: "10%" }}></div>
                    </div>
                    <button className="btn btn-sm btn-primary">Continue</button>
                  </>
                ) : (
                  <p className="text-muted">No current assignments.</p>
                )}
              </div>

              <div className="bg-white p-4 rounded shadow-sm mb-4">
                <h5>🧑‍🏫 Upcoming Seminars</h5>
                {upcomingSeminars.length ? upcomingSeminars.map(seminar => (
                  <div key={seminar._id} className="mb-2">
                    <strong>{seminar.title}</strong><br />
                    <small className="text-muted">
                      {seminar.date} • {seminar.venue} • {seminar.speaker}
                    </small>
                    <p className="mb-1">{seminar.description}</p>
                  </div>
                )) : (
                  <p className="text-muted">No seminars scheduled.</p>
                )}
              </div>

              <div className="bg-white p-4 rounded shadow-sm">
                <h5>📆 Assignment & Academic Calendar</h5>
                <Calendar
                  value={date}
                  onClickDay={onDateClick}
                  tileClassName={tileClassName}
                />
                <h6 className="mt-3">Upcoming Events</h6>
                <ul className="list-unstyled small">
                  {assignments.slice(0, 5).map(a => (
                    <li key={a._id}>🔵 {new Date(a.deadline).toLocaleDateString()} &nbsp; {a.title}</li>
                  ))}
                  {academicEvents.slice(0, 5).map(e => (
                    <li key={e.id}>📅 {new Date(e.date).toLocaleDateString()} &nbsp; {e.title}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-md-4">
              <div className="bg-white p-4 rounded shadow-sm mb-4">
                <h5><FaCalendarAlt className="me-2" />{date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}</h5>
                <Calendar
                  value={date}
                  onClickDay={onDateClick}
                  tileClassName={tileClassName}
                />
              </div>

              <div className="bg-white p-4 rounded shadow-sm">
                <h5><FaBell className="me-2" />Recent Updates</h5>
                {assignments.slice(0, 3).map(a => (
                  <div key={a._id} className="p-2 rounded mb-2 bg-light">
                    <strong>New Assignment</strong><br />
                    <small className="text-muted">{a.title}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Modal show={modalShow} onHide={() => setModalShow(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Events on {date.toDateString()}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {modalEvents.map((ev, idx) => (
                <div key={idx} className="mb-3">
                  <h6>
                    {ev.type === "Assignment" ? "📘 Assignment: " : "📅 Academic: "}
                    {ev.title}
                  </h6>
                  <p>{ev.description}</p>
                  <small className="text-muted">
                    {ev.type === "Assignment"
                      ? `Due: ${new Date(ev.deadline).toLocaleString()}`
                      :` Date: ${new Date(ev.date).toLocaleDateString()}`}
                  </small>
                </div>
              ))}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setModalShow(false)}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default StudentDashboardHome;