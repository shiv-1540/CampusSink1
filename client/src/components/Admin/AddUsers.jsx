import React, { useState } from 'react';
import axios from 'axios';
import AdSidebar from './AdSidebar';
import { motion } from "framer-motion"; // for animation
const server= import.meta.env.VITE_BACKEND_URL;

const AddUsersPage = () => {
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);

  return (
    <div className="flex min-h-screen gap-3 p-6">
     
         <div className="w-64 fixed top-0 left-0 h-full z-10">
          <AdSidebar/>
        </div>

      <div className="flex-grow ml-64 p-6 bg-gray-100 min-h-screen">
         <h2 className="text-2xl font-bold mb-6">Add Users</h2>
        <button
          onClick={() => setShowStudentModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Add Student
        </button>
        <button
          onClick={() => setShowTeacherModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
        >
          Add Teacher
        </button>
        <button
          onClick={() => setShowDeptModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
        >
          Add Department
        </button>
      </div>

      {/* Student Modal */}
      {showStudentModal && (
        <Modal title="Add Student" onClose={() => setShowStudentModal(false)}>
          <StudentForm />
        </Modal>
      )}

      {/* Teacher Modal */}
      {showTeacherModal && (
        <Modal title="Add Teacher" onClose={() => setShowTeacherModal(false)}>
          <TeacherForm />
        </Modal>
      )}

      {/* Department Modal */}
      {showDeptModal && (
        <Modal title="Add Department" onClose={() => setShowDeptModal(false)}>
          <DepartmentForm />
        </Modal>
      )}
    
     
    </div>
  );
};

const Modal = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-2xl relative mx-4"
      >
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-1xl transition duration-200"
            aria-label="Close Modal"
          >
            &times;
          </button>
        </div>
        <div className="text-gray-700 max-h-[60vh] overflow-y-auto">{children}</div>
        {/* Optional Footer */}
        {/* <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm">
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
            Confirm
          </button>
        </div> */}
      </motion.div>
    </div>
  );
};


const StudentForm = () => {
  return (
    <form className="space-y-4">
      <Input label="Name" />
      <Input label="PRN" />
      <Input label="Email" type="email" />
      <Input label="Password" placeholder="Default: PRN" />
      <Input label="Department" />
      <Input label="Division" />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
};

const TeacherForm = () => {
  return (
    <form className="space-y-4">
      <Input label="Name" />
      <Input label="PRN" />
      <Input label="Email" type="email" />
      <Input label="Department" />
      <Input label="Courses (comma separated)" />
      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
};

const DepartmentForm = () => {
  const [deptName,setdeptName]=useState("");
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");
  
  const handleDeptSubmit=async (e)=>{
    //prevents page reload --> to stop default behviour of event in js 
    e.preventDefault();
    setMessage("");
    setError("");

    console.log("Hii from department submission !")

    if(!deptName.trim()){
        setError('Department name is required');
        return ;
    }

    try{
      const token =localStorage.getItem('token');
      console.log("token: ",token);

      const res= await axios.post(`${server}/api/admin/add-dept`,
        {name:deptName},
        {
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
          }
        } 
      );

      const data=res.data;
       
      if(res.status==200){
        console.log("Data from backend : ",data);
        setMessage(data.message|| 'Department created sucessfully !');
        alert("Departement created sucessfully !");
        toast.success("Department Created sucessfully !");
        setdeptName("");
      }
     
    }
    catch(err){
      //  setError(`Failed to connect to server `);
      const res=err.response.data
      console.log(res.error);
      setError(res.error);
    }
  }

   
  return (
    <form className="space-y-4 flex flex-col mx-4" onSubmit={handleDeptSubmit}>

      <input type="text" value={deptName} 
         onChange={
           (e)=>{setdeptName(e.target.value)}
          }
         required className='bg-white p-1 border-2 border-dark mx-4'
         />

      <button
        type="submit"
        className="bg-white-600 hover:bg-blue-700 text-white px-4 py-2 rounded" 
      >
        Create Dept
      </button>
      
      {message && <p className='font-md text-green-500'>{message}</p>}
      {error && <p className='font-md text-red-500  text-center'>{error}</p>}

    </form>
  );
};

const Input = ({ label, type = 'text', placeholder = '', value, onChange }) => (
  <div className="flex flex-col">
    <label className="font-medium mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder || `Enter ${label}`}
      className="border border-gray-300 bg-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
);


export default AddUsersPage;
