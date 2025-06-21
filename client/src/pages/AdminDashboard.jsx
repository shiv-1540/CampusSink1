import React, { useState } from "react";
import AdSidebar from "../components/Admin/AdSidebar";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdSidebar />

      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome to Admin Dashboard</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Add Teacher */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4">Teacher Management</h3>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              onClick={() => setShowTeacherModal(true)}
            >
              Add Teacher
            </button>
          </div>

          {/* Add Student */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4">Student Management</h3>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              onClick={() => setShowStudentModal(true)}
            >
              Add Student
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={showTeacherModal} onClose={() => setShowTeacherModal(false)}>
        <h3 className="text-xl font-bold mb-4">Add Teacher</h3>
        <form className="space-y-4">
          <Input label="Name" />
          <Input label="PRN" />
          <Input label="Email" />
          <Input label="Department" />
          <Input label="Courses" />
          <SubmitButton />
        </form>
      </Modal>

      <Modal isOpen={showStudentModal} onClose={() => setShowStudentModal(false)}>
        <h3 className="text-xl font-bold mb-4">Add Student</h3>
        <form className="space-y-4">
          <Input label="Name" />
          <Input label="PRN" />
          <Input label="Email" />
          <Input label="Password" placeholder="Default is PRN" />
          <Input label="Department" />
          <Input label="Division" />
          <SubmitButton />
        </form>
      </Modal>
    </div>
  );
};

const Input = ({ label, placeholder = "" }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium mb-1">{label}</label>
    <input
      type="text"
      placeholder={placeholder || `Enter ${label}`}
      className="border border-gray-300 px-3 py-2 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
);

const SubmitButton = () => (
  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
    Submit
  </button>
);

export default AdminDashboard;
