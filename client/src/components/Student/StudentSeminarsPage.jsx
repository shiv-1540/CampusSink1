import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { FaBookOpen } from "react-icons/fa";
const server= import.meta.env.VITE_BACKEND_URL;

const StudentSeminarsPage = () => {
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Replace with dynamic student data (e.g., from context or localStorage)
  const student = {
    branch: "CSE",
    year: "TY"
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchSeminars = async () => {
      try {
        const res = await axios.get(`${server}/api/seminars`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const filtered = res.data.filter(
          (seminar) =>
            seminar.branch === student.branch &&
            seminar.year === student.year
        );

        setSeminars(filtered);
      } catch (err) {
        console.error("Error fetching seminars:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeminars();
  }, []);

  const today = new Date();

  const upcomingSeminars = seminars.filter(
    (s) => new Date(s.datetime) >= today
  );
  const pastSeminars = seminars.filter(
    (s) => new Date(s.datetime) < today
  );

  const formatDate = (isoDateStr) => {
    const date = new Date(isoDateStr);
    return (
      date.toLocaleDateString() +
      " • " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f0f4ff", minHeight: "100vh" }}>
        <h3 className="fw-bold mb-1">My Seminars</h3>
        <p className="text-muted mb-4">Upcoming and past seminars for your branch and year</p>

        {/* Upcoming Seminars */}
        <section>
          <h5 className="fw-semibold">Upcoming Seminars</h5>
          {loading ? (
            <div>Loading...</div>
          ) : upcomingSeminars.length === 0 ? (
            <div className="bg-white shadow-sm p-4 mb-4 text-center text-muted rounded">
              <FaBookOpen size={32} className="mb-2" />
              <h6>No upcoming seminars</h6>
              <p>Check back later for new seminar announcements.</p>
            </div>
          ) : (
            upcomingSeminars.map((seminar) => (
              <div key={seminar.id} className="bg-white shadow-sm p-3 mb-3 rounded">
                <h6 className="fw-bold">{seminar.title}</h6>
                <small className="text-muted">
                  {formatDate(seminar.datetime)} • {seminar.venue} • {seminar.speaker}
                </small>
                <p className="mt-2 mb-0">{seminar.description}</p>
                {seminar.mode === "online" && seminar.link && (
                  <div className="mt-1">
                    <a
                      href={seminar.link.startsWith("http") ? seminar.link : `https://${seminar.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary"
                    >
                      Join Online
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </section>

        {/* Past Seminars */}
        <section className="mt-5">
          <h5 className="fw-semibold">Past Seminars</h5>
          {loading ? (
            <div>Loading...</div>
          ) : pastSeminars.length === 0 ? (
            <div className="bg-white shadow-sm p-4 text-center text-muted rounded">
              <FaBookOpen size={32} className="mb-2" />
              <h6>No past seminars</h6>
            </div>
          ) : (
            pastSeminars.map((seminar) => (
              <div
                key={seminar.id}
                className="bg-white shadow-sm p-3 mb-3 rounded d-flex justify-content-between align-items-center"
              >
                <div>
                  <h6 className="fw-bold">{seminar.title}</h6>
                  <small className="text-muted">
                    {formatDate(seminar.datetime)} • {seminar.venue} • {seminar.speaker}
                  </small>
                  <p className="mb-1 mt-2">{seminar.description}</p>
                </div>
                <div className="text-end">
                  <span className="badge bg-success mb-2">Attended</span>
                  <br />
                  {seminar.link && (
                    <a
                      href={seminar.link.startsWith("http") ? seminar.link : `https://${seminar.link}`}
                      className="text-primary fw-semibold"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Link
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
};

export default StudentSeminarsPage;
