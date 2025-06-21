import React, { useEffect, useState } from "react";
import axios from "axios";
import AdSidebar from "../components/Admin/AdSidebar";
import { FiUsers, FiBook, FiFileText, FiCalendar, FiAward, FiBarChart2, FiAlertCircle, FiClock } from "react-icons/fi";

const AdminDashboard = () => {
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
    lastBackup: "2 hours ago",
  });
  const [quickLinks] = useState([
    { name: "User Management", icon: <FiUsers />, path: "/admin/addusers" },
    { name: "Content Management", icon: <FiBook />, path: "/admin/settings" },
    { name: "Reports", icon: <FiFileText />, path: "/admin/reports" },
    { name: "Calendar", icon: <FiCalendar />, path: "/admin/calendar" },
  ]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStats();
    fetchRecentActivities();
    fetchPendingApprovals();
    fetchSystemStatus();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/report/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch report stats:", err);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/activities", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecentActivities(res.data.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch recent activities:", err);
    }
  };

  const fetchPendingApprovals = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/pending-approvals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingApprovals(res.data.slice(0, 3));
    } catch (err) {
      console.error("Failed to fetch pending approvals:", err);
    }
  };

  const fetchSystemStatus = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/system-status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSystemStatus(res.data);
    } catch (err) {
      console.error("Failed to fetch system status:", err);
    }
  };

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
    <div className="min-h-screen bg-gray-100">
      <AdSidebar />

      <div className="ml-64 p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome to Admin Dashboard</h2>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
          <StatCard title="👨‍🎓 Students" count={stats.students} color="blue" />
          <StatCard title="👩‍🏫 Teachers" count={stats.teachers} color="green" />
          <StatCard title="🏢 Departments" count={stats.departments} color="purple" />
          <StatCard title="🎤 Seminars" count={stats.seminars} color="orange" />
          <StatCard title="📚 Assignments" count={stats.assignments} color="indigo" />
          <StatCard title="📁 Project Reviews" count={stats.reviews} color="pink" />
        </div>

        {/* Quick Links Section */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.path}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center space-x-3"
              >
                <span className="text-xl text-indigo-600">{link.icon}</span>
                <span className="font-medium">{link.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Recent Activities and Pending Approvals Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm p-6">
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
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Pending Approvals</h3>
              <a href="/admin/approvals" className="text-sm text-indigo-600 hover:underline">
                View All
              </a>
            </div>
            <div className="space-y-4">
              {pendingApprovals.length > 0 ? (
                pendingApprovals.map((approval, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{approval.type}: {approval.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Submitted {new Date(approval.date).toLocaleDateString()}</p>
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
        </div>

        {/* System Status Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">System Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Database</span>
                <span className={`text-sm ${getStatusColor(systemStatus.database)}`}>
                  {systemStatus.database.charAt(0).toUpperCase() + systemStatus.database.slice(1)}
                </span>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">API Service</span>
                <span className={`text-sm ${getStatusColor(systemStatus.api)}`}>
                  {systemStatus.api.charAt(0).toUpperCase() + systemStatus.api.slice(1)}
                </span>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">File Storage</span>
                <span className={`text-sm ${getStatusColor(systemStatus.storage)}`}>
                  {systemStatus.storage.charAt(0).toUpperCase() + systemStatus.storage.slice(1)}
                </span>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Last Backup</span>
                <span className="text-sm text-gray-600">
                  {systemStatus.lastBackup}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, count, color }) => {
  const bg = `bg-${color}-100`;
  const text = `text-${color}-800`;
  return (
    <div className={`p-4 rounded-xl shadow-md ${bg}`}>
      <h4 className={`text-sm font-medium mb-1 ${text}`}>{title}</h4>
      <p className={`text-2xl font-bold ${text}`}>{count}</p>
    </div>
  );
};

export default AdminDashboard;