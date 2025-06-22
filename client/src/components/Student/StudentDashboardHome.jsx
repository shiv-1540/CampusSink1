import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import { Modal, Button } from "react-bootstrap";
import "./StudentDashboard.css";
import StudSidebar from "./StudSidebar";
import { FaCalendarAlt,FaBell } from "react-icons/fa";
import WorkloadSummary from "./WorkLoadSummary";
import { useNavigate } from "react-router-dom";

const server= import.meta.env.VITE_BACKEND_URL;

const StudentDashboardHome = () => {
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
        //?branch=${student.branch}&year=${student.year}
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

  // Filter today's and tomorrow's seminars
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  // const upcomingSeminars = seminars.filter((seminar) => {
  //   const seminarDate = new Date(seminar.date);
  //   seminarDate.setHours(0, 0, 0, 0);
  //   return seminarDate.getTime() === today.getTime() || seminarDate.getTime() === tomorrow.getTime();
  // });

  return (
   <>
  {/* Custom Calendar Styles */}
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

  {/* Page Layout */}
  <div className="d-flex">
    <StudSidebar />

    <div className="flex-grow-1 p-4 bg-light" style={{ marginLeft: "240px", minHeight: "100vh" }}>

      {/* Header Welcome Card */}
      <div className="bg-primary text-white p-4 rounded mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h3>Welcome back,  {user.name}👋</h3>
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

     

      {/* Main Content Layout */}
      <div className="row g-4">

        {/* Left Column */}
        <div className="col-md-8">

         {/* Current Assignment Card */}
          <div className="bg-white p-4 rounded shadow-sm mb-4">
            <h5 className="font-bold py-2">📚 Current Assignments</h5>

            {[...assignments]
                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                .map((assignment) => (
                  <div className="flex justify-between border border-2 p-3 px-4 mb-3 rounded" key={assignment._id}>
                    <div>
                       <h6 className="fw-bold">{assignment.title}</h6>
                        <p className="mb-1">{assignment.description}</p>
                        <p className="small text-muted">
                          Due: {new Date(assignment.deadline).toLocaleDateString()}
                        </p>
                    </div>

                    <button className=" my-4 btn btn-sm btn-primary" onClick={handleNavigate}>Continue</button>
                  </div>
              ))}

          </div>


          {/* Upcoming Seminars Card */}
          <div className="bg-white p-2  border rounded shadow-sm mb-4">
            <h5 className="font-bold py-2">🧑‍🏫 Upcoming Seminars</h5>
            {seminars.length > 0 ? (
              seminars.map((seminar) => (
                <div key={seminar._id} className="mb-3 p-2 ml-6 border border-2">
                  <strong>{seminar.title}</strong><br />
                  <small className="text-muted">
                    {new Date(seminar.datetime).toLocaleString()} • {seminar.venue} • {seminar.speaker}
                  </small>
                  <p className="mb-1">{seminar.description}</p>
                </div>
              ))
            ) : (
              <p className="text-muted">No seminars scheduled.</p>
            )}
          </div>

          {/* Assignment Calendar Section */}
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
                <li key={a._id}>
                  🔵 {new Date(a.deadline).toLocaleDateString()} — {a.title}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-md-4">

          {/* Mini Calendar */}
          <div className="bg-white p-4 rounded shadow-sm mb-4">
            <h5>
              <FaCalendarAlt className="me-2" />
              {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
            </h5>
            <Calendar
              value={date}
              onChange={onDateClick}
              tileClassName={tileClassName}
            />
          </div>

          {/* Recent Updates */}
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
       {/* Workload Summary (Counts) */}
      <div  className="w-full bg-gray-300">
          <WorkloadSummary />
      </div>
      

      {/* Optional: Overall Summary Section */}
      <div className="mt-4">
        <h4 className="mb-3">📊 Overall Summary of Workload</h4>
        <div className="p-4 bg-white rounded shadow-sm">
          {/* Add chart, progress, or analytics here */}
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
