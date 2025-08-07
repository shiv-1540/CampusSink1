import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserPlus, Users, Building2 } from 'lucide-react';
import axios from 'axios';
const server= import.meta.env.VITE_BACKEND_URL;
import { X } from "lucide-react"; // optional modern close icon

const AddUsersPage = () => {
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [view, setView] = useState('students'); // 'students' or 'teachers'

  const [selectedStud,setSelectedStud]=useState(null);
  const [selectedTeach,setSelectedTeacher]=useState(null);

  const [departments, setDepartments] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const token = localStorage.getItem('token');

  // Fetch all initial data
  useEffect(() => {
    fetchDepartments();
    fetchStudents();
    fetchTeachers();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${server}/api/admin/departments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(res.data);
      
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${server}/api/admin/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
      // console.log(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${server}/api/admin/teachers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(res.data);
      console.log(res.data);
    }
     catch (err) {
      console.error('Error fetching teachers:', err);
    }
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-6">College Management </h2>
      <div className="flex justify-start gap-8 mb-10">
      
         <div
          onClick={() => setShowStudentModal(true)}
          className="cursor-pointer bg-blue-100 hover:bg-blue-200 transition rounded-xl p-2 shadow flex items-center gap-4"
        >
           <Users className="text-blue-600" size={20} />
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Add Student</h3>
            <p className="text-sm text-green-700">Register new student</p>
          </div>
        </div>

        <div
          onClick={() => setShowTeacherModal(true)}
          className="cursor-pointer bg-green-100 hover:bg-green-200 transition rounded-xl p-2 shadow flex items-center gap-4"
        >
          <UserPlus className="text-green-600" size={20} />
          <div>
            <h3 className="text-lg font-semibold text-green-900">Add Teacher</h3>
            <p className="text-sm text-green-700">Register new faculty</p>
          </div>
        </div>

        <div
          onClick={() => setShowDeptModal(true)}
          className="cursor-pointer bg-purple-100 hover:bg-purple-200 transition rounded-xl p-2 shadow flex items-center gap-4"
        >
          <Building2 className="text-purple-600" size={28} />
          <div>
            <h3 className="text-lg font-semibold text-purple-900">Add Department</h3>
            <p className="text-sm text-purple-700">Create new department</p>
          </div>
        </div>
      </div>

     <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${view === 'students' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}
          onClick={() => setView('students')}
        >
          👨‍🎓 Students
        </button>
        <button
          className={`px-4 py-2 rounded ${view === 'teachers' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'}`}
          onClick={() => setView('teachers')}
        >
          👩‍🏫 Teachers
        </button>

         <button
          className={`px-4 py-2 rounded ${view === 'teachers' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'}`}
          onClick={() => setView('departments')}
        >
          👩‍🏫 Departments
        </button>
      </div>

     {/* Dynamic User Table with Students, Teachers, Departments */}
      <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-md overflow-hidden">
        <thead className="bg-gray-600 text-left text-white">
          <tr>
            {view === 'departments' ? (
              <>
                <th className="py-2 px-4 border-b">Dept. ID</th>
                <th className="py-2 px-4 border-b">Department Name</th>
                {/* <th className="py-2 px-4 border-b">Actions</th> */}
              </>
            ) : (
              <>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">PRN</th>
                <th className="py-2 px-4 border-b">Department</th>
                {view === 'students' && (
                  <>
                    <th className="py-2 px-4 border-b">Year</th>
                    <th className="py-2 px-4 border-b">Division</th>
                  </>
                )}
                {view === 'teachers' && (
                  <>
                    <th className="py-2 px-4 border-b">course_id</th>
                   
                  </>
                )}
                 <th className="py-2 px-4 border-b">Actions</th>
              </>
            )}
          </tr>
        </thead>

        <tbody>
          {(view === 'departments' ? departments : view === 'students' ? students : teachers).map((u, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-all font-normal">
              {view === 'departments' ? (
                <>
                  <td className="py-2 px-4 border-b">{u.id}</td>
                  <td className="py-2 px-4 border-b">{u.name}</td>
                  {/* <td className="py-2 px-4 border-b space-x-2">
                    <button
                      onClick={() => handleEditDepartment(u)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDepartment(u)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td> */}
                </>
              ) : (
                <>
                  <td className="py-2 px-4 border-b">{u.name}</td>
                  <td className="py-2 px-4 border-b">{u.email}</td>
                  <td className="py-2 px-4 border-b">{u.prn || '-'}</td>
                  <td className="py-2 px-4 border-b">{u.department}</td>
                  {view === 'students' && (
                    <>
                      <td className="py-2 px-4 border-b">{u.year || '-'}</td>
                      <td className="py-2 px-4 border-b">{u.division || '-'}</td>
                    </>
                  )}
                  {view === 'teachers' && (
                    <>
                      <td className="py-2 px-4 border-b">{u.course_id || '-'}</td>
                      
                    </>
                  )}
                   <td className="py-2 px-4 border-b space-x-2">
                    <button
                      onClick={() =>{
                        if(view === 'students'){
                             setSelectedStud(u);
                             setShowStudentModal(true);
                        }
                        else{
                           setSelectedTeacher(u);
                           setShowTeacherModal(true);
                        }

                      } }
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    {/* <button
                      onClick={() => view === 'students' ? handleDeleteStudent(u) : handleDeleteTeacher(u)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button> */}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>



      {/* Modals */}
      {showStudentModal && (
        <Modal title={selectedStud ? "Edit Student" : "Add Student"} onClose={() => {
          setShowStudentModal(false);
          setSelectedStud(null); // clear after close
        }}>
          <StudentForm 
            departments={departments} 
            studentData={selectedStud}  // ✅ Pass here
            onSuccess={() => {
              setShowStudentModal(false);
              setSelectedStud(null);  // ✅ Clear selected student
              fetchStudents(); // Refresh list
            }}
          />
        </Modal>
      )}

       {showTeacherModal && (
        <Modal title={selectedTeach ? "Edit Teacher" : "Add Teacher"} onClose={() => {
          setShowTeacherModal(false);
          setSelectedTeacher(null); // clear after close
        }}>
          <TeacherForm 
            departments={departments} 
            TeacherData={selectedTeach}  // ✅ Pass here
            onSuccess={() => {
              setShowTeacherModal(false);
              setSelectedTeacher(null);  // ✅ Clear selected student
              fetchTeachers(); // Refresh list
            }}
          />
        </Modal>
      )}

      {/* {showTeacherModal && (
        <Modal title="Add Teacher" onClose={() => setShowTeacherModal(false)}>
          <TeacherForm departments={departments} onSuccess={fetchTeachers} />
        </Modal>
      )} */}
      {showDeptModal && (
        <Modal title="Add Department" onClose={() => setShowDeptModal(false)}>
          <DepartmentForm onSuccess={fetchDepartments} />
        </Modal>
      )}

      <ToastContainer position="top-right" autoClose={5000} />
    </AdminLayout>
  );
};



// 🔵 Modal Component
const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
    <motion.div
      initial={{ scale: 0.70, opacity: 0 }}
      animate={{ scale: 0.80, opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="relative bg-white dark:bg-gray-900 w-full max-w-2xl rounded-xl shadow-lg overflow-hidden ring-1 ring-gray-300 dark:ring-gray-700"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 transition"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="px-6 py-5 text-gray-700 dark:text-gray-300 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {children}
      </div>
    </motion.div>
  </div>
);


// 🔵 Input Field Component
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

// 🔵 Student Form Component
const StudentForm = ({ departments, onSuccess, studentData }) => {
  const isEdit = !!studentData;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    prn: "",
    phoneno: "",
    year: "FE",
    division: "A",
    dept_id: "",
    id: null,
  });

  useEffect(() => {
    if (studentData) {
      console.log(studentData);
      setForm({
        name: studentData.name || "",
        email: studentData.email || "",
        password: "", // optional: allow user to update later
        prn: studentData.prn || "",
        phoneno: studentData.phoneno || "",
        year: studentData.year || "FE",
        division: studentData.division || "A",
        dept_id: studentData.dept_id || "",
        id: studentData.id ||null ,
      });
    }
  }, [studentData]);

  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.prn || !form.dept_id || !form.phoneno) {
      toast.error("❌ Please fill in all required fields");
      return;
    }

    try {
      if (isEdit) {
        await axios.put(`${server}/api/admin/update-student`, form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        });
        toast.success("✅ Student updated successfully");
      } else {
        await axios.post(`${server}/api/admin/add-student`, form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        });
        toast.success("✅ Student added successfully");
      }
      setForm({ name: "", email: "", password: "", prn: "",phoneno:"",role:"student",year: "FE",division: "A",dept_id: "" });
      onSuccess(); // Refresh list
    } catch (err) {
      console.error("Add student error:", err.message);
      toast.error(err.response?.data?.error || "Error adding student"|| err.messsage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
        <Input label="PRN" name="prn" value={form.prn} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
        <Input label="Password" name="password" value={form.password} onChange={handleChange} type="password" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm bg-white text-dark font-medium mb-1">Year</label>
          <select name="year" value={form.year} onChange={handleChange}
            className="w-full px-3 py-2 bg-white rounded border focus:ring-2 focus:ring-blue-400"
          >
            <option value=" ">Select Year</option>
            <option value="FE">FE</option>
            <option value="SE">SE</option>
            <option value="TE">TE</option>
            <option value="BE">BE</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Division</label>
          <select name="division" value={form.division} onChange={handleChange}
            className="w-full px-3 py-2  bg-white rounded border focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Division</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4 '>
        <div className='flex flex-col '>
          <label className=" text-md font-medium mb-1">Department</label>
            <select name="dept_id" value={form.dept_id} onChange={handleChange}
              className="w-full py-2 rounded bg-white border focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
          </select>
        </div>
        
         <Input label="Phone No" name="phoneno" value={form.phoneno} onChange={handleChange}/>
      </div>
      
      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
        {isEdit ? "Update Student" : "Add Student"}
      </button>
    </form>
  );
};

// 🔵 Teacher Form Component
const TeacherForm = ({ departments, onSuccess,TeacherData }) => {
   const isEdit=!!TeacherData;
   
   const [form, setForm] = useState({
    id: null,
    name: '',
    email: '',
    phoneno: '',
    password: '',
    prn: '',
    dept_id: '',
    course_id: '',
  });

  useEffect(() => {
    if (TeacherData) {
      setForm({
        id: TeacherData.id || null,
        name: TeacherData.name || '',
        email: TeacherData.email || '',
        phoneno: TeacherData.phoneno || '',
        password: '', // Leave blank on edit
        prn: TeacherData.prn || '',
        dept_id: TeacherData.dept_id || '',
        course_id: TeacherData.course_id || '',
      });
    }
  }, [TeacherData]);


  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.prn || !form.phoneno ||!form.dept_id) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
       if (isEdit) {
        await axios.put(`${server}/api/admin/update-teacher`, form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        toast.success('Teacher updated successfully!');
      } 
      else {
        await axios.post(`${server}/api/admin/add-teacher`, form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        toast.success('Teacher added successfully!');
      }

      setForm({ id: null, name: '', email: '', phoneno: '', password: '', prn: '', dept_id: '', course_id: '' });
      onSuccess();

    } 
    catch (err) {
      toast.error(err.response?.data?.error || 'Error adding teacher');
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input label="Name" name="name" value={form.name} onChange={handleChange} />
      <Input label="PRN" name="prn" value={form.prn} onChange={handleChange} />
      <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
      <Input label="Password" name="password" value={form.password} onChange={handleChange} />
      <div className='bg-white'>
        <label className="font-medium mb-1 bg-white">Department</label>
        <select name="dept_id" value={form.dept_id} onChange={handleChange} className="w-full px-3 py-2 rounded border bg-white">
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>
      <Input label="Phone No" name="phoneno" value={form.phoneno} onChange={handleChange}/>
      <Input label="Course ID (Optional)" name="course_id" value={form.course_id} onChange={handleChange} />

      <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
        {isEdit ? 'Update Teacher' : 'Add Teacher'}
      </button>
    </form>
  );
};

// 🔵 Department Form Component
const DepartmentForm = ({ onSuccess }) => {
  const [deptName, setDeptName] = useState('');

  const handleDeptSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${server}/api/admin/add-dept`, { name: deptName }, {
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
