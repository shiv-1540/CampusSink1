// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import Calendar from "react-calendar";
// import axios from "axios";
// import "react-calendar/dist/Calendar.css";
// import { Modal, Button } from "react-bootstrap";
// import "./StudentDashboard.css";
// import StudSidebar from "./StudSidebar";
// import { FaCalendarAlt,FaBell } from "react-icons/fa";
// import WorkloadSummary from "./WorkloadSummary";
// import { useNavigate } from "react-router-dom";
// import { LocateIcon } from "lucide-react";
// import AISuggestionCard from "../../AISuggestion";
// import 'react-calendar/dist/Calendar.css';
// import './workload.css'
// import { CheckCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/solid';

// const server= import.meta.env.VITE_BACKEND_URL;

// const FeaturePoint = ({ text }) => (
//   <li className="flex items-start gap-2 text-gray-700 text-sm sm:text-base">
//     <ArrowRightCircleIcon className="h-5 w-5 text-blue-500 mt-1 shrink-0" />
//     <span>{text}</span>
//   </li>
// );

// const StudentDashboardHome = () => {
//   const [error,setError]=useState("");

//   const [date, setDate] = useState(new Date());
//   const [assignments, setAssignments] = useState([]);
//   const [dueMap, setDueMap] = useState({});
//   const [modalShow, setModalShow] = useState(false);
//   const [modalAssignments, setModalAssignments] = useState([]);
//   const [seminars, setSeminars] = useState([]);
//   const navigate=useNavigate();

//  const studinfo=JSON.parse(localStorage.getItem('studinfo'));
//  const token=localStorage.getItem('token');
//  console.log("studingo from login>>",studinfo);

//   const handleNavigate=()=>{
//     navigate('/student/assignments')
//   }

//   const student = {
//     branch: studinfo.department,
//     year: studinfo.year,
//   };

//   useEffect(() => {
//     const token=localStorage.getItem('token');

//     const fetchAssignments = async () => {

//       try {
//         const res = await axios.get(
//              `${server}/api/assignments?dept_id=${studinfo.dept_id}&year=${studinfo.year}&prn=${studinfo.prn}`,
//              {
//               headers:{
//                 'Content-Type':'application/json',
//                 'Authorization':`Bearer ${token}`
//               }
//              }

//           );
//         const data = res.data.unsubmitted;
//         setAssignments(data);

//         const map = {};
//         data.forEach(a => {
//           const key = new Date(a.deadline).toDateString();
//           if (!map[key]) map[key] = [];
//           map[key].push(a);
//         });
//         setDueMap(map);
//       } catch (err) {
//         console.error("Failed to fetch assignments", err);
//       }
//     };

//     const fetchSeminars = async () => {
//       try {
//         //?branch=${student.branch}&year=${student.year}
//         const res = await axios.get(`${server}/api/seminars`,
//           {
//             headers:{
//               'Content-Type':'application/json',
//               'Authorization':`Bearer ${token}`
//             }
//           }
//         );
//         console.log("Seminars: ",res);

//         setSeminars(res.data);
//       } catch (err) {
//         console.error("Failed to fetch seminars", err);
//       }
//     };

//     fetchAssignments();
//     fetchSeminars();
//   }, []);

//   const onDateClick = (d) => {
//     const key = new Date(d).toDateString();
//     const items = dueMap[key] || [];
//     if (items.length > 0) {
//       setModalAssignments(items);
//       setModalShow(true);
//     }
//     setDate(d);
//   };

//   const tileClassName = ({ date: d, view }) => {
//     const key = new Date(d).toDateString();
//     return view === "month" && dueMap[key] ? "bg-warning text-dark-700 rounded-circle" : null;
//   };

//   // Filter today's and tomorrow's seminars
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const tomorrow = new Date();
//   tomorrow.setDate(today.getDate() + 1);
//   tomorrow.setHours(0, 0, 0, 0);

//   // const upcomingSeminars = seminars.filter((seminar) => {
//   //   const seminarDate = new Date(seminar.date);
//   //   seminarDate.setHours(0, 0, 0, 0);
//   //   return seminarDate.getTime() === today.getTime() || seminarDate.getTime() === tomorrow.getTime();
//   // });

//   return (
//   <div className="maincontainer flex min-h-screen  bg-gray-100">

//     <StudSidebar />

//     {/* Main Content */}
//     <div className="container flex-grow">

//       {/* Welcome Banner
//       <div className="banner bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//       <div>
//         <h3 className="welcome">
//          <strong>Welcome back, {studinfo.name} 👋</strong>
//         </h3>
//         <p className="text-sm sm:text-base text-blue-100 mt-1">
//           Here's a quick overview of your academic space.
//         </p>
//       </div>
//       <div className="sm:text-right">
//         <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-semibold">
//           {studinfo.year} • {studinfo.department}
//         </div>
//       </div>
//       </div> */}

//       {/* Grid: Main + Right */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//         {/* LEFT: Assignments, Seminars, Calendar */}
//         <div className="col-span-2 space-y-6">

//           {/* 📚 Assignments */}
//           <div className="currAssiContainer bg-white  rounded-xl shadow-md">
//             <h2 className=""> Current Assignments</h2>
//             {assignments.length ? (
//               [...assignments]
//                 .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
//                 .map((assignment) => (
//                  <div className="assignment border  mb-3 rounded-md flex flex-col md:flex-row justify-between md:items-center gap-3" key={assignment._id}>

//                     <div>
//                       <h6 className="font-bold">{assignment.title}</h6>
//                       <p className="text-sm">{assignment.description}</p>
//                       <p className="text-xs text-gray-500 mt-1">
//                         Due: {new Date(assignment.deadline).toLocaleDateString()}
//                       </p>
//                     </div>
//                     <button className="btn btn-sm btn-primary mt-2" onClick={handleNavigate}>Continue</button>
//                   </div>
//               ))
//             ) : <p className="text-gray-500">No assignments available.</p>}
//           </div>

//           {/* 🧑‍🏫 Seminars */}
//           <div className="bg-white p-2 rounded-xl shadow-md">
//             <h5 className="text-lg font-bold mb-3">🧑‍🏫 Upcoming Seminars</h5>
//             {seminars.length > 0 ? (
//               seminars.map((seminar) => (
//                 <div className="border p-2 mb-1 rounded-md" key={seminar._id}>
//                   <strong>{seminar.title}</strong>
//                   <p className="text-xs text-gray-700">
//                     {new Date(seminar.datetime).toLocaleString()} • {seminar.venue} • {seminar.speaker}
//                   </p>
//                   <p className="text-sm">{seminar.description}</p>
//                 </div>
//               ))
//             ) : <p className="text-gray-500">No seminars scheduled.</p>}
//           </div>

//           {/* 📆 Calendar + Events */}
//           <div className="bg-white text-gray-900 p-2 rounded-md shadow-md">
//             <h5 className="text-lg font-bold mb-1">📆 Assignment Calendar</h5>
//             <Calendar
//               value={date}
//               onChange={onDateClick}
//               tileClassName={tileClassName}
//             />

//             <h6 className="mt-4 text-md font-bold">Upcoming Deadlines</h6>
//             <ul className="text-sm mt-2 list-disc ml-5 text-gray-700">
//               {assignments.slice(0, 5).map((a) => (
//                 <FeaturePoint
//                   key={a._id}
//                   text={`${new Date(a.deadline).toLocaleDateString()} — ${a.title}`}
//                 />
//               ))}

//             </ul>
//           </div>

//         </div>

//         {/* RIGHT: Mini Calendar + Updates + AI */}
//         <div className="space-y-5">

//           {/* 📅 Mini Calendar */}
//           <div className="bg-white p-4 rounded-xl shadow-md">
//             <h5 className="text-lg font-semibold mb-2 flex items-center">
//               <FaCalendarAlt className="mr-2" />
//               {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
//             </h5>
//             <Calendar
//               value={date}
//               onChange={onDateClick}
//               tileClassName={tileClassName}
//             />
//           </div>

//           {/* 🤖 AI Suggestion */}
//           <AISuggestionCard />

//           {/* 🔔 Recent Updates */}
//           <div className="bg-white p-4 rounded-xl shadow-md">
//             <h5 className="text-lg font-semibold mb-3 flex items-center">
//               <FaBell className="mr-2" />Recent Updates
//             </h5>
//             {assignments.slice(0, 3).map((a) => (
//               <div className="bg-gray-100 p-2 rounded mb-2" key={a._id}>
//                 <strong>New Assignment:</strong> <br />
//                 <small>{a.title}</small>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* 📋 Workload Summary Section */}
//       <div className="workload">
//         <h4 className="text-lg font-bold mb-3">📊 Overall Summary of Workload</h4>
//         <div className="bg-white p-2 rounded-xl shadow-md">
//           <WorkloadSummary />
//           <p className="text-sm text-gray-400 mt-2">Charts or advanced stats coming soon...</p>
//         </div>
//       </div>

//       {/* 📆 Modal on Calendar Date Click */}
//       <Modal show={modalShow} onHide={() => setModalShow(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Assignments Due on {date.toDateString()}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {modalAssignments.map((a) => (
//             <div key={a._id} className="mb-3">
//               <h6>{a.title}</h6>
//               <p>{a.description}</p>
//               <small className="text-muted">Due: {new Date(a.deadline).toLocaleString()}</small>
//             </div>
//           ))}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setModalShow(false)}>Close</Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   </div>
//   );
// };

// export default StudentDashboardHome;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import { Modal, Button } from "react-bootstrap";
import StudSidebar from "./StudSidebar";
import { FaCalendarAlt, FaBell } from "react-icons/fa";
import WorkloadSummary from "./WorkloadSummary";
import AISuggestionCard from "../../AISuggestion";
import {
  CheckCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";
import "./StudentDashboard.css";
import "./workload.css";

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
  const [dueMap, setDueMap] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [modalAssignments, setModalAssignments] = useState([]);
  const [seminars, setSeminars] = useState([]);
  const navigate = useNavigate();

  const studinfo = JSON.parse(localStorage.getItem("studinfo"));
  const token = localStorage.getItem("token");

  const handleNavigate = () => {
    navigate("/student/assignments");
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(
          `${server}/api/assignments?dept_id=${studinfo.dept_id}&year=${studinfo.year}&prn=${studinfo.prn}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = res.data.unsubmitted;
        setAssignments(data);

        const map = {};
        data.forEach((a) => {
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
        const res = await axios.get(`${server}/api/seminars`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
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
    return view === "month" && dueMap[key]
      ? "bg-warning text-dark-700 rounded-circle"
      : null;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <StudSidebar />
      <div className="flex-grow p-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-md p-3">
              <h2 className="font-bold text-lg">Current Assignments</h2>
              {assignments.length ? (
                [...assignments]
                  .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                  .map((assignment) => (
                    <div
                      className="border mb-2 rounded-md p-3 flex justify-between items-center"
                      key={assignment._id}
                    >
                      <div className="flex-1 pr-4">
                        <h6 className="font-semibold">{assignment.title}</h6>
                        <p className="text-sm">{assignment.description}</p>
                        <p className="text-xs text-gray-500">
                          Due:{" "}
                          {new Date(assignment.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <button
                          className="btn btn-primary w-28 h-10 text-sm"
                          onClick={handleNavigate}
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500">No assignments available.</p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-3">
              <h5 className="font-bold text-lg mb-2">Upcoming Seminars</h5>
              {seminars.length > 0 ? (
                seminars.map((seminar) => (
                  <div className="border p-2 mb-2 rounded-md" key={seminar._id}>
                    <strong>{seminar.title}</strong>
                    <p className="text-xs text-gray-700">
                      {new Date(seminar.datetime).toLocaleString()} •{" "}
                      {seminar.venue} • {seminar.speaker}
                    </p>
                    <p className="text-sm">{seminar.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No seminars scheduled.</p>
              )}
            </div>

            <div className="bg-white p-3 rounded-md shadow-md">
              <h5 className="font-bold text-md mb-2">Assignment Calendar</h5>
              <Calendar
                value={date}
                onChange={onDateClick}
                tileClassName={tileClassName}
              />
              <h6 className="mt-3 font-semibold">Upcoming Deadlines</h6>
              <ul className="mt-1 ml-5 list-disc">
                {assignments.slice(0, 5).map((a) => (
                  <FeaturePoint
                    key={a._id}
                    text={`${new Date(a.deadline).toLocaleDateString()} — ${
                      a.title
                    }`}
                  />
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-md">
              <h5 className="text-lg font-semibold mb-2 flex items-center">
                <FaCalendarAlt className="mr-2" />
                {date.toLocaleString("default", { month: "long" })}{" "}
                {date.getFullYear()}
              </h5>
              <Calendar
                value={date}
                onChange={onDateClick}
                tileClassName={tileClassName}
              />
            </div>

            <AISuggestionCard />

            <div className="bg-white p-4 rounded-xl shadow-md">
              <h5 className="text-lg font-semibold mb-3 flex items-center">
                <FaBell className="mr-2" />
                Recent Updates
              </h5>
              {assignments.slice(0, 3).map((a) => (
                <div className="bg-gray-100 p-2 rounded mb-2" key={a._id}>
                  <strong>New Assignment:</strong> <br />
                  <small>{a.title}</small>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-lg font-bold mb-2">
            📊 Overall Summary of Workload
          </h4>
          <div className="bg-white p-3 rounded-xl shadow-md">
            <WorkloadSummary />
            <p className="text-sm text-gray-400 mt-2">
              Charts or advanced stats coming soon...
            </p>
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
                <small className="text-muted">
                  Due: {new Date(a.deadline).toLocaleString()}
                </small>
              </div>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalShow(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default StudentDashboardHome;
