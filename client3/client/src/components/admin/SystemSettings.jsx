import React, { useState } from "react";
import "./SystemSettings.css"; // Add custom CSS here if needed

const SystemSettings = () => {
  const [form, setForm] = useState({
    siteName: "CampusSink",
    siteDescription: "Academic Assignment Management Platform",
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

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveChanges = () => {
    console.table(form);
    alert("Settings saved!");
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">System Settings</h2>
          <p className="text-muted">Manage global platform configurations</p>
        </div>
        <button className="btn btn-primary" onClick={saveChanges}>Save Changes</button>
      </div>

      <div className="row g-4">
        {/* General Settings */}
        <div className="col-md-6">
          <div className="card p-4 h-100">
            <h5>General Settings</h5>
            <input className="form-control mb-2" type="text" value={form.siteName} onChange={(e) => handleChange("siteName", e.target.value)} placeholder="Site Name" />
            <textarea className="form-control mb-2" value={form.siteDescription} onChange={(e) => handleChange("siteDescription", e.target.value)} placeholder="Site Description" />
            <div className="form-check mb-1">
              <input className="form-check-input" type="checkbox" checked={form.allowRegistration} onChange={(e) => handleChange("allowRegistration", e.target.checked)} />
              <label className="form-check-label">Allow User Registration</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" checked={form.maintenanceMode} onChange={(e) => handleChange("maintenanceMode", e.target.checked)} />
              <label className="form-check-label">Enable Maintenance Mode</label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="col-md-6">
          <div className="card p-4 h-100">
            <h5>Security Settings</h5>
            <input className="form-control mb-2" type="number" value={form.sessionTimeout} onChange={(e) => handleChange("sessionTimeout", e.target.value)} placeholder="Session Timeout (mins)" />
            <input className="form-control mb-2" type="number" value={form.minPassword} onChange={(e) => handleChange("minPassword", e.target.value)} placeholder="Min Password Length" />
            <div className="form-check">
              <input className="form-check-input" type="checkbox" checked={form.requireEmailVerification} onChange={(e) => handleChange("requireEmailVerification", e.target.checked)} />
              <label className="form-check-label">Require Email Verification</label>
            </div>
          </div>
        </div>

        {/* File Upload Settings */}
        <div className="col-md-6">
          <div className="card p-4 h-100">
            <h5>File Upload Settings</h5>
            <input className="form-control mb-2" type="number" value={form.maxFileSize} onChange={(e) => handleChange("maxFileSize", e.target.value)} placeholder="Max File Size (MB)" />
            <input className="form-control" type="text" value={form.allowedFileTypes} onChange={(e) => handleChange("allowedFileTypes", e.target.value)} placeholder="Allowed File Types (comma-separated)" />
          </div>
        </div>

        {/* Notification Settings */}
        <div className="col-md-6">
          <div className="card p-4 h-100">
            <h5>Notification Settings</h5>
            <div className="form-check mb-2">
              <input className="form-check-input" type="checkbox" checked={form.emailNotifications} onChange={(e) => handleChange("emailNotifications", e.target.checked)} />
              <label className="form-check-label">Email Notifications</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" checked={form.pushNotifications} onChange={(e) => handleChange("pushNotifications", e.target.checked)} />
              <label className="form-check-label">Push Notifications</label>
            </div>
          </div>
        </div>

        {/* Backup Settings */}
        <div className="col-12">
          <div className="card p-4">
            <h5>Backup & Maintenance</h5>
            <select className="form-select mb-3" value={form.backupFrequency} onChange={(e) => handleChange("backupFrequency", e.target.value)}>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <div className="d-flex gap-3">
              <button className="btn btn-outline-primary">Create Backup Now</button>
              <button className="btn btn-outline-secondary">View Backup History</button>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="col-12">
          <div className="card p-4">
            <h5>System Status</h5>
            <div className="row g-3 mt-2">
              <div className="col-md-3"><span>Database:</span> <strong className="text-success">Healthy</strong></div>
              <div className="col-md-3"><span>Email Service:</span> <strong className="text-success">Active</strong></div>
              <div className="col-md-3"><span>Security:</span> <strong className="text-success">Secure</strong></div>
              <div className="col-md-3"><span>Last Backup:</span> <strong className="text-warning">2 hours ago</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
