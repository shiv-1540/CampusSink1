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
import { FiClock } from "react-icons/fi";

const server = import.meta.env.VITE_BACKEND_URL;
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
  const [recentActivities, setRecentActivities] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    database: "operational",
    api: "operational",
    storage: "operational",
    lastBackup: "N/A",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStats();
    fetchRecentActivities();
    fetchPendingApprovals();
    fetchSystemStatus();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${server}/api/admin/report/stats`, {
        headers: { Authorization: `Bearer ${token}`},
      });
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const res = await axios.get(`${server}/api/admin/activities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecentActivities(res.data.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch recent activities:", err);
    }
  };

  const fetchPendingApprovals = async () => {
    try {
      const res = await axios.get(`${server}/api/admin/pending-approvals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingApprovals(res.data.slice(0, 3));
    } catch (err) {
      console.error("Failed to fetch pending approvals:", err);
    }
  };

  const fetchSystemStatus = async () => {
    try {
      const res = await axios.get(`${server}/api/admin/system-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSystemStatus(res.data);
    } catch (err) {
      console.error("Failed to fetch system status:", err);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "operational":
        return "text-green-600";
      case "degraded":
        return "text-yellow-600";
      case "outage":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdSidebar />
      <div className="ml-64 p-8 flex-grow">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          📊 Admin Analytics & Reports
        </h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {statLabels.map((label, i) => (
            <StatCard key={i} title={label} count={statValues[i]} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
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
                      "#4f46e5",
                      "#22c55e",
                      "#f59e0b",
                      "#ec4899",
                      "#3b82f6",
                      "#a855f7",
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Recent Activities</h3>
            <a href="/admin/activities" className="text-sm text-indigo-600 hover:underline">
              View All
            </a>
          </div>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-800">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      <FiClock className="inline mr-1" />
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent activities</p>
            )}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Pending Approvals</h3>
            <a href="/admin/approvals" className="text-sm text-indigo-600 hover:underline">
              View All
            </a>
          </div>
          <div className="space-y-4">
            {pendingApprovals.length > 0 ? (
              pendingApprovals.map((approval, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-yellow-50 rounded"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {approval.type}: {approval.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted {new Date(approval.date).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
                    Review
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No pending approvals</p>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">System Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StatusCard title="Database" status={systemStatus.database} color={getStatusColor(systemStatus.database)} />
            <StatusCard title="API Service" status={systemStatus.api} color={getStatusColor(systemStatus.api)} />
            <StatusCard title="File Storage" status={systemStatus.storage} color={getStatusColor(systemStatus.storage)} />
            <StatusCard title="Last Backup" status={systemStatus.lastBackup} color="text-gray-600" />
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

const StatusCard = ({ title, status, color }) => (
  <div className="p-4 border rounded-lg">
    <div className="flex items-center justify-between">
      <span className="font-medium">{title}</span>
      <span className={`text-sm ${color}`}>{status}</span>
    </div>
  </div>
);

export default AdminReportPage;