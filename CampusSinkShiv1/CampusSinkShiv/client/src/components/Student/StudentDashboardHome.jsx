import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import { Modal, Button } from "react-bootstrap";
import "./StudentDashboard.css";
import StudSidebar from "./StudSidebar";
import { FaCalendarAlt,FaBell } from "react-icons/fa";
import WorkloadSummary from "./WorkloadSummary";
import { useNavigate } from "react-router-dom";
import { LocateIcon } from "lucide-react";

const server= import.meta.env.VITE_BACKEND_URL;

const StudentDashboardHome = () => {
  const [error,setError]=useState("");
  const [date, setDate] = useState(new Date());
  const [assignments, setAssignments] = useState([]);
  const [dueMap, setDueMap] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [modalAssignments, setModalAssignments] = useState([]);
  const [seminars, setSeminars] = useState([]);
  const navigate=useNavigate();

  const user = JSON.parse(localStorage.getItem('user')) || {};

  const handleNavigate=()=>{
    navigate('/student/assignments')
  }

  const student = {
    branch: "CSE",
    year: "TE",
  };
  const studinfo=JSON.parse(localStorage.getItem('studinfo'));
  console.log("studinfo from login :",studinfo);

  useEffect(() => {
    const token=localStorage.getItem('token');
   
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(
             `${server}/api/assignments?dept_id=${studinfo.dept_id}&year=${studinfo.year}&prn=${studinfo.prn}`,
             {
              headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`        
              }
             }
          );
        const data = res.data.unsubmitted;
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
        const res = await axios.get(`${server}/api/seminars`,
          {
            headers:{
              'Content-Type':'application/json',
              'Authorization':`Bearer ${token}`
            }
          }
        );
        console.log("Seminars: ",res);
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

  return (
   <>
  {/* Custom Calendar Styles */}
  <style>{`
    .react-calendar {
      max-width: 100%;
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
    .react-calendar__navigation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.5rem;
    }
    .react-calendar__navigation button {
      min-width: 44px;
      background: none;
      border: none;
      font-size: 1rem;
    }
    @media (max-width: 768px) {
      .react-calendar__navigation button {
        min-width: 36px;
        font-size: 0.8rem;
      }
    }
  `}</style>

  {/* Page Layout */}
  <div className="d-flex">
    <StudSidebar />

    <div className="flex-grow-1 p-3 p-md-4 bg-light" style={{ marginLeft: "240px", minHeight: "100vh" }}>
      {/* Responsive Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4 p-md-6 rounded-xl shadow-md mb-4 mb-md-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="mb-3 sm:mb-0">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">Welcome back, {user.name} 👋</h3>
          <p className="text-xs sm:text-sm md:text-base text-blue-100">Here's a quick overview of your academic space</p>
        </div>
        <div className="bg-white/20 backdrop-blur-md px-3 py-1 md:px-4 md:py-2 rounded-lg text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
          {studinfo.year} • {studinfo.department}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="row g-3 g-md-4">
        {/* Left Column */}
        <div className="col-lg-8">
          {/* Current Assignment Card */}
          <div className="bg-white p-3 p-md-4 rounded shadow-sm mb-3 mb-md-4">
            <h5 className="font-bold py-2">📚 Current Assignments</h5>
            {[...assignments]
                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                .map((assignment) => (
                  <div className="flex flex-col sm:flex-row justify-between border border-2 p-2 p-md-3 px-3 px-md-4 mb-2 mb-md-3 rounded" key={assignment._id}>
                    <div className="mb-2 sm:mb-0">
                      <h6 className="fw-bold">{assignment.title}</h6>
                      <p className="mb-1 text-sm sm:text-base">{assignment.description}</p>
                      <p className="small text-muted">
                        Due: {new Date(assignment.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="btn btn-sm btn-primary sm:self-center" onClick={handleNavigate}>Continue</button>
                  </div>
              ))}
          </div>

          {/* Upcoming Seminars Card */}
          <div className="bg-white p-2 p-md-3 border rounded shadow-sm mb-3 mb-md-4">
            <h5 className="font-bold py-2">🧑‍🏫 Upcoming Seminars</h5>
            {seminars.length > 0 ? (
              seminars.map((seminar) => (
                <div key={seminar._id} className="mb-2 mb-md-3 p-2 ml-3 ml-md-6 border border-2">
                  <strong>{seminar.title}</strong><br />
                  <small className="text-muted">
                    {new Date(seminar.datetime).toLocaleString()} • {seminar.venue} • {seminar.speaker}
                  </small>
                  <p className="mb-1 text-sm sm:text-base">{seminar.description}</p>
                </div>
              ))
            ) : (
              <p className="text-muted">No seminars scheduled.</p>
            )}
          </div>

          {/* Assignment Calendar Section */}
          <div className="bg-white p-3 p-md-4 rounded shadow-sm">
            <h5 className="mb-2 mb-md-3">📆 Assignment Calendar</h5>
            <div className="overflow-x-auto">
              <Calendar
                value={date}
                onChange={onDateClick}
                tileClassName={tileClassName}
              />
            </div>
            <h6 className="mt-2 mt-md-3">Upcoming Events</h6>
            <ul className="list-unstyled small">
              {assignments.slice(0, 5).map((a) => (
                <li key={a._id} className="text-sm sm:text-base">
                  🔵 {new Date(a.deadline).toLocaleDateString()} — {a.title}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-lg-4">
          {/* Mini Calendar */}
          <div className="bg-white p-3 p-md-4 rounded shadow-sm mb-3 mb-md-4">
            <h5 className="flex items-center">
              <FaCalendarAlt className="me-2" />
              {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
            </h5>
            <div className="overflow-x-auto">
              <Calendar
                value={date}
                onChange={onDateClick}
                tileClassName={tileClassName}
              />
            </div>
          </div>

          {/* Recent Updates */}
          <div className="bg-white p-3 p-md-4 rounded shadow-sm">
            <h5 className="flex items-center">
              <FaBell className="me-2" />
              Recent Updates
            </h5>
            {assignments.slice(0, 3).map((a) => (
              <div className="p-2 rounded mb-2 bg-light" key={a._id}>
                <strong>New Assignment</strong><br />
                <small className="text-muted">{a.title}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Workload Summary (Counts) */}
      <div className="w-full bg-gray-300 mt-3 mt-md-4">
        <WorkloadSummary />
      </div>
      
      {/* Optional: Overall Summary Section */}
      <div className="mt-3 mt-md-4">
        <h4 className="mb-2 mb-md-3">📊 Overall Summary of Workload</h4>
        <div className="p-3 p-md-4 bg-white rounded shadow-sm">
          <p className="text-muted">Charts or advanced stats coming soon...</p>
        </div>
      </div>

      {/* Assignments Modal for Date Click */}
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assignments Due on {date.toDateString()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalAssignments.map((a) => (
            <div key={a._id} className="mb-3">
              <h6>{a.title}</h6>
              <p>{a.description}</p>
              <small className="text-muted">
                Due: {new Date(a.deadline).toLocaleString()}
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