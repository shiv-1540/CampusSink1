import React from "react";
// import "./Dashboard.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  const assignmentStatus = [
    { name: "Completed", value: 15, color: "#28a745" },
    { name: "Active", value: 2, color: "#007bff" },
    { name: "Overdue", value: 1, color: "#dc3545" }
  ];

  const submissionData = [
    { month: "Jan", submissions: 45 },
    { month: "Feb", submissions: 52 },
    { month: "Mar", submissions: 49 },
    { month: "Apr", submissions: 60 },
    { month: "May", submissions: 55 },
    { month: "Jun", submissions: 65 }
  ];

  return (
    <div className="dashboard-main">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <p className="subtext">System overview and management console</p>
      </div>

      <div className="dashboard-cards">
        {/* Stat cards */}
        <div className="stat-card">
          <div className="card-icon">📄</div>
          <div>
            <strong>Total Assignments</strong>
            <div>3 <span style={{ color: "green" }}>▲ 12%</span></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="card-icon">👨‍🏫</div>
          <div>
            <strong>Active Teachers</strong>
            <div>1 <span style={{ color: "green" }}>▲ 5%</span></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="card-icon">🎓</div>
          <div>
            <strong>Registered Students</strong>
            <div>1 <span style={{ color: "green" }}>▲ 18%</span></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="card-icon">⏰</div>
          <div>
            <strong>Upcoming Deadlines</strong>
            <div>2 <span style={{ color: "orange" }}>⚠ 3 urgent</span></div>
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h4>Submission Trends</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={submissionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="submissions" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4>Assignment Status Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={assignmentStatus}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label
              >
                {assignmentStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bottom-row">
        <div className="recent-card">
          <h4>Recent Assignments</h4>
          <ul>
            <li>Database Design Project <span className="badge active">active</span></li>
            <li>Machine Learning Research Paper <span className="badge active">active</span></li>
            <li>Web Development Portfolio <span className="badge overdue">overdue</span></li>
          </ul>
        </div>

        <div className="alert-card">
          <h4>System Alerts</h4>
          <div className="alert yellow">⚠ 3 assignments overdue - Requires immediate attention</div>
          <div className="alert blue">📈 Submission rate increased - 18% improvement this month</div>
          <div className="alert green">✅ System backup completed - All data successfully backed up</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
