import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBookOpen } from "react-icons/fa";
import StudSidebar from "./StudSidebar";
const server= import.meta.env.VITE_BACKEND_URL;

const StudentSeminarsPage = () => {
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Replace with dynamic student data (e.g., from context or localStorage)
 

  const studinfo=JSON.parse(localStorage.getItem('studinfo'));

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
            seminar.branch === studinfo.department&&
            seminar.year === studinfo.year
        );
        console.log("Seminars: "+filtered);
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
   <div className="flex">
    {/* Sidebar */}
    <div className="w-64 fixed top-0 left-0 h-full bg-white shadow-lg z-10">
      <StudSidebar />
    </div>

  {/* Main Content */}
  <div className="flex-grow ml-64 p-2 px-4 bg-gradient-to-br from-gray-100 to-blue-50 min-h-screen">
    <h1 className="text-3xl font-bold text-gray-800 mb-2">🎓 My Seminars</h1>
    <p className="text-gray-600 mb-6 ml-11">Upcoming and past seminars curated for your department and academic year.</p>

    {/* Upcoming Seminars */}
    <section>

      <h2 className="text-xl font-bold text-blue-700 mb-4">📅 Upcoming Seminars</h2>
      <div className="flex gap-6 ">

     
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : upcomingSeminars.length === 0 ? (
        <div className="bg-white border border-black-2 border-solid py-3 px-4 mx-2 rounded-xl shadow text-center text-dark-500">
          <FaBookOpen size={36} className="mx-auto mb-3 text-gray-700" />
          <h4 className="text-lg font-semibold">No upcoming seminars</h4>
          <p>Check back later for announcements.</p>
        </div>
      ) : (
        upcomingSeminars.map((seminar) => (
          <div key={seminar.id} className="w-1/2 bg-white py-4 px-7 rounded-xl shadow mb-2">
            <h3 className="text-lg font-bold text-gray-800">{seminar.title}</h3>
            <p className="text-sm text-gray-500 mb-1">
              🕒 {formatDate(seminar.datetime)} • 🏛️ {seminar.venue} • 🎤 {seminar.speaker}
            </p>
            <p className="text-gray-700 mt-2">{seminar.description}</p>
            {seminar.mode === "online" && seminar.link && (
              <a
                href={seminar.link.startsWith("http") ? seminar.link : `https://${seminar.link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-blue-600 hover:underline font-medium"
              >
                🔗 Join Online
              </a>
            )}
          </div>

        ))
       
      )}
        </div>
    </section>

    {/* Past Seminars */}
    <section className="mt-10">
      <h2 className="text-xl font-bold text-green-700 mb-4">🗓️ Past Seminars</h2>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : pastSeminars.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
          <FaBookOpen size={36} className="mx-auto mb-3 text-green-400" />
          <h4 className="text-lg font-semibold">No past seminars</h4>
        </div>
      ) : (
        pastSeminars.map((seminar) => (
          <div
            key={seminar.id}
            className="bg-white p-5 rounded-xl shadow mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center"
          >
            <div>
              <h3 className="text-lg font-bold text-gray-800">{seminar.title}</h3>
              <p className="text-sm text-gray-500">
                🕒 {formatDate(seminar.datetime)} • 🏛️ {seminar.venue} • 🎤 {seminar.speaker}
              </p>
              <p className="text-gray-700 mt-2">{seminar.description}</p>
            </div>
            <div className="mt-4 sm:mt-0 sm:text-right">
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                ✅ Attended
              </span>
              {seminar.link && (
                <a
                  href={seminar.link.startsWith("http") ? seminar.link : `https://${seminar.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:underline font-medium"
                >
                  🔗 View Link
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
