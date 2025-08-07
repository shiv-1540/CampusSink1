import React, { useEffect, useState } from "react";
import AdSidebar from "./AdSidebar";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminReportPage = () => {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    departments: 0,
    seminars: 0,
    assignments: 0,
    reviews: 0,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${server}/api/admin/report/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const statLabels = ["Students", "Teachers", "Departments", "Seminars", "Assignments", "Reviews"];
  const statValues = [
    stats.students,
    stats.teachers,
    stats.departments,
    stats.seminars,
    stats.assignments,
    stats.reviews,
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <AdSidebar />
      <div className="ml-64 p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">📊 Admin Statistics Dashboard</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {statLabels.map((label, i) => (
            <StatCard key={i} title={label} count={statValues[i]} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">📈 Entity Bar Chart</h3>
            <Bar
              data={{
                labels: statLabels,
                datasets: [
                  {
                    label: "Count",
                    data: statValues,
                    backgroundColor: "#6366f1",
                    borderRadius: 8,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
              }}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">📊 Distribution Pie Chart</h3>
            <Pie
              data={{
                labels: statLabels,
                datasets: [
                  {
                    label: "Distribution",
                    data: statValues,
                    backgroundColor: [
                      "#4f46e5", "#22c55e", "#f59e0b", "#ec4899", "#3b82f6", "#a855f7",
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, count }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h4 className="text-lg font-semibold mb-2 text-gray-700">{title}</h4>
    <p className="text-2xl font-bold text-indigo-600">{count}</p>
  </div>
);

export default AdminReportPage;
