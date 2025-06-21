import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ❌ Removed Sidebar import

const submissionData = [
  { month: "Jan", submissions: 50, assignments: 5 },
  { month: "Feb", submissions: 52, assignments: 6 },
  { month: "Mar", submissions: 49, assignments: 4 },
  { month: "Apr", submissions: 55, assignments: 5 },
  { month: "May", submissions: 57, assignments: 6 },
  { month: "Jun", submissions: 63, assignments: 7 },
];

const branchData = [
  { name: "Computer Science", value: 45 },
  { name: "Information Technology", value: 30 },
  { name: "Electronics", value: 20 },
  { name: "Mechanical", value: 15 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const performanceData = [
  { year: "Year 1", scoreA: 75, scoreB: 120 },
  { year: "Year 2", scoreA: 80, scoreB: 110 },
  { year: "Year 3", scoreA: 78, scoreB: 100 },
  { year: "Year 4", scoreA: 85, scoreB: 70 },
];

const Report = () => {
  return (
    <div className="container-fluid p-4 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Reports & Analytics</h3>
          <p className="text-muted">Comprehensive insights into platform performance</p>
        </div>
        <div>
          <button className="btn btn-outline-primary me-2">This Month</button>
          <button className="btn btn-primary">Export Report</button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {[
          { title: "Total Users", value: "3", trend: "+12%" },
          { title: "Active Assignments", value: "2", trend: "-8%" },
          { title: "Avg Submission Rate", value: "78%", trend: "+15%" },
          { title: "Platform Engagement", value: "92%", trend: "+7%" },
        ].map((stat, idx) => (
          <div key={idx} className="col-md-3">
            <div className="card p-3 shadow-sm">
              <div className="fw-semibold text-muted">{stat.title}</div>
              <h4 className="fw-bold">{stat.value}</h4>
              <span className={`small ${stat.trend.includes('-') ? 'text-danger' : 'text-success'}`}>
                {stat.trend} from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <div className="card p-3 shadow-sm">
            <h6 className="fw-semibold mb-3">Submission Trends</h6>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={submissionData}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="submissions" stroke="#8884d8" />
                <Line type="monotone" dataKey="assignments" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h6 className="fw-semibold mb-3">Student Distribution by Branch</h6>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={branchData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {branchData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Academic Performance Chart */}
      <div className="card p-3 shadow-sm mb-4">
        <h6 className="fw-semibold mb-3">Academic Performance by Year</h6>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="scoreA" fill="#8884d8" name="Score A" />
            <Bar dataKey="scoreB" fill="#00C49F" name="Score B" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Section */}
      <div className="row g-3">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h6 className="fw-semibold mb-2">Teacher Statistics</h6>
            <ul className="list-unstyled small">
              <li>Total Teachers: 1</li>
              <li>Avg Assignments per Teacher: 3</li>
              <li>Most Active Teacher: Dr. Sarah Johnson</li>
              <li>Avg Response Time: 2.3 days</li>
            </ul>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h6 className="fw-semibold mb-2">Student Statistics</h6>
            <ul className="list-unstyled small">
              <li>Total Students: 1</li>
              <li>Avg Submissions per Student: 8.5</li>
              <li>Top Performing Branch: Computer Science</li>
              <li>Overall Satisfaction: 4.2 / 5.0</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
