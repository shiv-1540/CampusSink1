import React, { useState, useEffect } from "react";
import AdSidebar from "../Admin/AdSidebar";
import axios from "axios";
import "./SystemSettings.css"; // Make sure to create this CSS file

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState({
    siteName: "CampusSink",
    siteDescription: "Academic Assignment Management Platform",
    academicYear: "",
    allowRegistration: true,
    maintenanceMode: false,
    sessionTimeout: 30,
    minPassword: 8,
    requireEmailVerification: false,
    maxFileSize: 10,
    allowedFileTypes: "pdf,doc,docx",
    emailNotifications: true,
    pushNotifications: false,
    backupFrequency: "daily",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/settings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSettings(res.data);
    } catch (err) {
      console.error("Error fetching settings:", err);
    }
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:5000/api/admin/settings", settings, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Settings updated successfully!");
    } catch (err) {
      alert("Error updating settings");
    }
  };

  const createBackup = async () => {
    try {
      await axios.post("http://localhost:5000/api/admin/backup", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Backup created successfully!");
    } catch (err) {
      alert("Error creating backup");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdSidebar />
      <div className="ml-64 p-8">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">⚙️ System Settings</h2>
            <p className="text-muted">Manage global platform configurations</p>
          </div>
          <button 
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </div>

        <div className="row g-4">
          {/* General Settings */}
          <div className="col-md-6">
            <div className="card p-4 h-100 bg-white rounded shadow-sm">
              <h5 className="font-bold text-lg mb-3">General Settings</h5>
              <input 
                className="form-control mb-2 border border-gray-300 rounded px-3 py-2 w-full" 
                type="text" 
                value={settings.siteName} 
                onChange={(e) => handleChange("siteName", e.target.value)} 
                placeholder="Site Name" 
              />
              <textarea 
                className="form-control mb-2 border border-gray-300 rounded px-3 py-2 w-full" 
                value={settings.siteDescription} 
                onChange={(e) => handleChange("siteDescription", e.target.value)} 
                placeholder="Site Description" 
              />
              <input
                type="text"
                className="form-control mb-2 border border-gray-300 rounded px-3 py-2 w-full"
                value={settings.academicYear}
                onChange={(e) => handleChange("academicYear", e.target.value)}
                placeholder="Academic Year (e.g., 2025-26)"
              />
              <div className="form-check mb-1">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  checked={settings.allowRegistration} 
                  onChange={(e) => handleChange("allowRegistration", e.target.checked)} 
                />
                <label className="form-check-label ml-2">Allow User Registration</label>
              </div>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  checked={settings.maintenanceMode} 
                  onChange={(e) => handleChange("maintenanceMode", e.target.checked)} 
                />
                <label className="form-check-label ml-2">Enable Maintenance Mode</label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="col-md-6">
            <div className="card p-4 h-100 bg-white rounded shadow-sm">
              <h5 className="font-bold text-lg mb-3">Security Settings</h5>
              <input 
                className="form-control mb-2 border border-gray-300 rounded px-3 py-2 w-full" 
                type="number" 
                value={settings.sessionTimeout} 
                onChange={(e) => handleChange("sessionTimeout", e.target.value)} 
                placeholder="Session Timeout (mins)" 
              />
              <input 
                className="form-control mb-2 border border-gray-300 rounded px-3 py-2 w-full" 
                type="number" 
                value={settings.minPassword} 
                onChange={(e) => handleChange("minPassword", e.target.value)} 
                placeholder="Min Password Length" 
              />
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  checked={settings.requireEmailVerification} 
                  onChange={(e) => handleChange("requireEmailVerification", e.target.checked)} 
                />
                <label className="form-check-label ml-2">Require Email Verification</label>
              </div>
            </div>
          </div>

          {/* File Upload Settings */}
          <div className="col-md-6">
            <div className="card p-4 h-100 bg-white rounded shadow-sm">
              <h5 className="font-bold text-lg mb-3">File Upload Settings</h5>
              <input 
                className="form-control mb-2 border border-gray-300 rounded px-3 py-2 w-full" 
                type="number" 
                value={settings.maxFileSize} 
                onChange={(e) => handleChange("maxFileSize", e.target.value)} 
                placeholder="Max File Size (MB)" 
              />
              <input 
                className="form-control border border-gray-300 rounded px-3 py-2 w-full" 
                type="text" 
                value={settings.allowedFileTypes} 
                onChange={(e) => handleChange("allowedFileTypes", e.target.value)} 
                placeholder="Allowed File Types (comma-separated)" 
              />
            </div>
          </div>

          {/* Notification Settings */}
          <div className="col-md-6">
            <div className="card p-4 h-100 bg-white rounded shadow-sm">
              <h5 className="font-bold text-lg mb-3">Notification Settings</h5>
              <div className="form-check mb-2">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  checked={settings.emailNotifications} 
                  onChange={(e) => handleChange("emailNotifications", e.target.checked)} 
                />
                <label className="form-check-label ml-2">Email Notifications</label>
              </div>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  checked={settings.pushNotifications} 
                  onChange={(e) => handleChange("pushNotifications", e.target.checked)} 
                />
                <label className="form-check-label ml-2">Push Notifications</label>
              </div>
            </div>
          </div>

          {/* Backup Settings */}
          <div className="col-12">
            <div className="card p-4 bg-white rounded shadow-sm">
              <h5 className="font-bold text-lg mb-3">Backup & Maintenance</h5>
              <select 
                className="form-select mb-3 border border-gray-300 rounded px-3 py-2 w-full" 
                value={settings.backupFrequency} 
                onChange={(e) => handleChange("backupFrequency", e.target.value)}
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <div className="d-flex gap-3">
                <button 
                  className="btn btn-outline-primary border border-indigo-600 text-indigo-600 px-4 py-2 rounded hover:bg-indigo-50"
                  onClick={createBackup}
                >
                  Create Backup Now
                </button>
                <button className="btn btn-outline-secondary border border-gray-600 text-gray-600 px-4 py-2 rounded hover:bg-gray-50">
                  View Backup History
                </button>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="col-12">
            <div className="card p-4 bg-white rounded shadow-sm">
              <h5 className="font-bold text-lg mb-3">System Status</h5>
              <div className="row g-3 mt-2">
                <div className="col-md-3"><span>Database:</span> <strong className="text-green-600">Healthy</strong></div>
                <div className="col-md-3"><span>Email Service:</span> <strong className="text-green-600">Active</strong></div>
                <div className="col-md-3"><span>Security:</span> <strong className="text-green-600">Secure</strong></div>
                <div className="col-md-3"><span>Last Backup:</span> <strong className="text-yellow-600">2 hours ago</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;