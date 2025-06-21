import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserPlus, Users, Building2 } from 'lucide-react';
import axios from 'axios';

const AddUsersPage = () => {
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDepartments();
    fetchStudents();
    fetchTeachers();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/departments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(res.data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/teachers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(res.data);
    } catch (err) {
      console.error('Error fetching teachers:', err);
    }
  };

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold mb-6">Add Users</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <UserCard
          icon={<Users className="text-blue-600" size={32} />}
          title="Add Student"
          onClick={() => setShowStudentModal(true)}
          className="bg-blue-100"
        />
        <UserCard
          icon={<UserPlus className="text-green-600" size={32} />}
          title="Add Teacher"
          onClick={() => setShowTeacherModal(true)}
          className="bg-green-100"
        />
        <UserCard
          icon={<Building2 className="text-purple-600" size={32} />}
          title="Add Department"
          onClick={() => setShowDeptModal(true)}
          className="bg-purple-100"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">All Students</h3>
          <ul className="bg-white p-4 rounded shadow space-y-2">
            {students.map((s, i) => (
              <li key={i} className="border-b pb-2">
                {s.name} ({s.prn}) - {s.department} / {s.year}-{s.division}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">All Teachers</h3>
          <ul className="bg-white p-4 rounded shadow space-y-2">
            {teachers.map((t, i) => (
              <li key={i} className="border-b pb-2">
                {t.name} ({t.prn}) - {t.department}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showStudentModal && (
        <Modal title="Add Student" onClose={() => setShowStudentModal(false)}>
          <StudentForm departments={departments} onSuccess={fetchStudents} />
        </Modal>
      )}
      {showTeacherModal && (
        <Modal title="Add Teacher" onClose={() => setShowTeacherModal(false)}>
          <TeacherForm departments={departments} onSuccess={fetchTeachers} />
        </Modal>
      )}
      {showDeptModal && (
        <Modal title="Add Department" onClose={() => setShowDeptModal(false)}>
          <DepartmentForm onSuccess={fetchDepartments} />
        </Modal>
      )}

      <ToastContainer position="top-right" autoClose={5000} />
    </AdminLayout>
  );
};

const UserCard = ({ icon, title, onClick, className }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer ${className} rounded-xl p-6 shadow hover:shadow-xl transition`}
  >
    <div className="flex items-center gap-4">
      {icon}
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-2xl relative z-[60]"
    >
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 text-2xl"
        >
          &times;
        </button>
      </div>
      <div className="text-gray-700 max-h-[70vh] overflow-y-auto pr-1 z-[70]">{children}</div>
    </motion.div>
  </div>
);

const Input = ({ label, type = 'text', placeholder = '', value, onChange, name }) => (
  <div className="flex flex-col">
    <label className="font-medium mb-1">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder || `Enter ${label}`}
      className="border border-gray-300 bg-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
    />
  </div>
);

const TeacherForm = ({ departments, onSuccess }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', prn: '', dept_id: '', course_id: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.prn || !form.dept_id) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/admin/add-teacher', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Teacher added successfully!');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error adding teacher');
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input label="Name" name="name" value={form.name} onChange={handleChange} />
      <Input label="PRN" name="prn" value={form.prn} onChange={handleChange} />
      <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
      <Input label="Password" name="password" value={form.password} onChange={handleChange} />
      <div>
        <label>Department</label>
        <select name="dept_id" value={form.dept_id} onChange={handleChange} className="w-full px-3 py-2 rounded border">
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>
      <Input label="Course ID (Optional)" name="course_id" value={form.course_id} onChange={handleChange} />
      <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
};

const DepartmentForm = ({ onSuccess }) => {
  const [deptName, setDeptName] = useState('');

  const handleDeptSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/add-dept', { name: deptName }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Department created successfully!');
      setDeptName('');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error adding department');
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleDeptSubmit}>
      <Input label="Department Name" name="deptName" value={deptName} onChange={(e) => setDeptName(e.target.value)} />
      <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
        Create Department
      </button>
    </form>
  );
};

export default AddUsersPage;
