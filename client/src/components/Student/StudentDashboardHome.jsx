import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import { Modal, Button } from "react-bootstrap";
import "./StudentDashboard.css";
import StudSidebar from "./StudSidebar";
import { FaCalendarAlt,FaBell } from "react-icons/fa";
const server= import.meta.env.VITE_BACKEND_URL;

const StudentDashboardHome = () => {
  const [date, setDate] = useState(new Date());
  const [assignments, setAssignments] = useState([]);
  const [dueMap, setDueMap] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [modalAssignments, setModalAssignments] = useState([]);
  const [seminars, setSeminars] = useState([]);

  const student = {
    branch: "CSE",
    year: "TE",
  };

  useEffect(() => {
    const token=localStorage.getItem('token');
      
    const fetchAssignments = async () => {
      
      try {
        const res = await axios.get(
             `${server}/api/assignments?branch=${student.branch}&year=${student.year}`,
             {
              headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`        
              }
             }
            
          );
        const data = res.data;
        setAssignments(data);

        const map = {};
        data.forEach(a => {
          const key = new Date(a.deadline).toDateString();
          if (!map[key]) map[key] = [];
          map[key].push(a);
        });
        setDueMap(map);
      } catch (err) {
        console.error("Failed to fetch assignments", err);
      }
    };

    const fetchSeminars = async () => {
      try {
        const res = await axios.get(`${server}/api/seminars?branch=${student.branch}&year=${student.year}`,
          {
            headers:{
              'Content-Type':'application/json',
              'Authorization':`Bearer ${token}`
            }
          }
        );
        setSeminars(res.data);
      } catch (err) {
        console.error("Failed to fetch seminars", err);
      }
    };

    fetchAssignments();
    fetchSeminars();
  }, []);

  const onDateClick = (d) => {
    const key = new Date(d).toDateString();
    const items = dueMap[key] || [];
    if (items.length > 0) {
      setModalAssignments(items);
      setModalShow(true);
    }
    setDate(d);
  };

  const tileClassName = ({ date: d, view }) => {
    const key = new Date(d).toDateString();
    return view === "month" && dueMap[key] ? "bg-warning text-dark rounded-circle" : null;
  };

  // Filter today's and tomorrow's seminars
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const upcomingSeminars = seminars.filter((seminar) => {
    const seminarDate = new Date(seminar.date);
    seminarDate.setHours(0, 0, 0, 0);
    return seminarDate.getTime() === today.getTime() || seminarDate.getTime() === tomorrow.getTime();
  });

  return (
    <>
      <style>{`
        .react-calendar {
          width: 100%;
          background: white;
          border: 1px solid #a0a096;
          font-family: 'Arial', 'Helvetica', sans-serif;
          line-height: 1.125em;
          color: black;
        }
        .react-calendar *,
        .react-calendar__tile {
          color: black;
        }
        .react-calendar__tile--active {
          background: #006edc;
          color: white;
        }
        .react-calendar__tile--now {
          background: #ffff76;
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

      <div className="d-flex">
        <StudSidebar/>
        <div className="flex-grow-1 p-4 bg-light" style={{ marginLeft: "240px", minHeight: "100vh" }}>
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
                {assignments.length > 0 ? (
                  <div>
                    <p className="text-muted mb-1">{assignments[0].title}</p>
                    <p className="small text-muted">Due: {new Date(assignments[0].deadline).toLocaleDateString()}</p>
                    <div className="progress mb-2" style={{ height: "6px" }}>
                      <div className="progress-bar bg-danger" style={{ width: "10%" }}></div>
                    </div>
                    <button className="btn btn-sm btn-primary">Continue</button>
                  </div>
                ) : (
                  <p className="text-muted">No current assignments.</p>
                )}
              </div>

              <div className="bg-white p-4 rounded shadow-sm mb-4">
                <h5>🧑‍🏫 Upcoming Seminars</h5>
                {upcomingSeminars.length > 0 ? (
                  upcomingSeminars.map((seminar) => (
                    <div key={seminar._id} className="mb-2">
                      <strong>{seminar.title}</strong><br />
                      <small className="text-muted">
                        {seminar.date} • {seminar.venue} • {seminar.speaker}
                      </small>
                      <p className="mb-1">{seminar.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No seminars scheduled.</p>
                )}
              </div>

              <div className="bg-white p-4 rounded shadow-sm">
                <h5 className="mb-3">📆 Assignment Calendar</h5>
                <Calendar
                  value={date}
                  onChange={onDateClick}
                  tileClassName={tileClassName}
                />
                <h6 className="mt-3">Upcoming Events</h6>
                <ul className="list-unstyled small">
                  {assignments.slice(0, 5).map((a) => (
                    <li key={a._id}>🔵 {new Date(a.deadline).toLocaleDateString()} &nbsp; {a.title}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-md-4">
              <div className="bg-white p-4 rounded shadow-sm mb-4">
                <h5><FaCalendarAlt className="me-2" />{date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}</h5>
                <Calendar
                  value={date}
                  onChange={onDateClick}
                  tileClassName={tileClassName}
                />
              </div>

              <div className="bg-white p-4 rounded shadow-sm">
                <h5><FaBell className="me-2" />Recent Updates</h5>
                {assignments.slice(0, 3).map((a) => (
                  <div className="p-2 rounded mb-2 bg-light" key={a._id}>
                    <strong>New Assignment</strong><br />
                    <small className="text-muted">{a.title}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Modal show={modalShow} onHide={() => setModalShow(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Assignments Due on {date.toDateString()}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {modalAssignments.map((a) => (
                <div key={a._id} className="mb-3">
                  <h6>{a.title}</h6>
                  <p>{a.description}</p>
                  <small className="text-muted">Due: {new Date(a.deadline).toLocaleString()}</small>
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
