import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TeachSidebar from "./TeacherSidebar";
import './AddAssignment.css';
import { toast } from 'react-toastify';

const server = import.meta.env.VITE_BACKEND_URL;

const AddAssignment = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [cnt,SetCnt]=useState(0);

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const token =localStorage.getItem('token');
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    year: "",
    branch: "",
    marks: 100,
    deadline: "",
    file: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  useEffect(() => {
     fetchDepartments();
     fetchAssignments();
 }, []);
  


 const fetchAssignments=async ()=>{
   try{
    // ?year=${formData.year}?&branch=${formData.branch}
      const res=await axios.get(`${server}/api/assignments/getbyby`);
      setAssignments(res.data.assignments);
      SetCnt(res.data.count);
   }
   catch(err){
     console.log("Fetch Assignments err",err.message);
   }
 } 

 const fetchDepartments = async () => {
    try {
       const token=localStorage.getItem('token');
      const res = await axios.get(`${server}/api/admin/departments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(res.data);
      
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };
  
// //  const fetchAssignments = async () => { 
      
// //       try {
// //         const token=localStorage.getItem('token');
// //         const res = await axios.get(
// //              `${server}/api/assignments/get1`,
// //              {
// //               headers:{
// //                 'Content-Type':'application/json',
// //                 'Authorization':`Bearer ${token}`        
// //               }
// //              }
            
// //           );
// //         const data = res.data.unsubmitted;
// //         setAssignments(data);

// //         const map = {};
// //         data.forEach(a => {
// //           const key = new Date(a.deadline).toDateString();
// //           if (!map[key]) map[key] = [];
// //           map[key].push(a);
// //         });
// //         setDueMap(map);
// //       } catch (err) {
// //         console.error("Failed to fetch assignments", err);
// //       }
// //  };

// const getCntofYearDeptAssi = (year, dept,deadline) => {
//   console.log("Assignments>> ",assignments)
//   return assignments.filter(
//     e => e.year === year && e.branch === dept 
//   ).length;
// };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const targetDate = new Date(formData.deadline);
  const sevenDaysBefore = new Date(targetDate);
  sevenDaysBefore.setDate(sevenDaysBefore.getDate() - 7);
// console.log("SUbmit ke andar aa gya");
  const count = assignments.filter(e => {
    const deadlineDate = new Date(e.deadline);
    return (
      e.year === formData.year &&
      e.branch === formData.branch &&
      deadlineDate >= sevenDaysBefore &&
      deadlineDate <= targetDate
    );
  }).length;

  console.log("Count>>", count);

  if (count >= 3) {
    toast.warning(`This Division already has too much workload (${count} assignments).`);
    return;
  }

  const token = localStorage.getItem("token");
  const payload = {
    ...formData,
    description: formData.description || "No additional instructions",
    file_url: formData.file ? formData.file.name : "",
    created_by: user.name,
    status: "active",
  };

  try {
    const response = await axios.post(
      `${server}/api/assignments`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    

    toast.success(response.data.message);
    navigate("/teacher/dashboard");
  } catch (error) {
    console.error("Submission Error:", error);
    alert(error.response?.data?.error || "Network or server error!");
  }
};



  return (
    <div className="maincontainer flex min-h-screen  bg-gray-100">
      <TeachSidebar />
      
      <main className="container flex-grow">
        <div className="">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Create New Assignment
            </h1>
            <p className="text-gray-600">
              Fill in the details below to create a new assignment for your students
            </p>
          
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information Card */}
              <Card className="border-0 shadow-sm rounded-xl overflow-hidden">
                <Card.Body className="p-6">
                  <Card.Title className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                    </span>
                    Basic Information
                  </Card.Title>
                  
                  <Form.Group className="mb-4">
                    <Form.Label className="block text-sm font-medium text-gray-700 mb-1">
                      Assignment Title *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Enter assignment title"
                    />
                  </Form.Group>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Group className="mb-4">
                      <Form.Label className="block text-sm font-medium text-gray-700 mb-1">
                        Academic Year *
                      </Form.Label>
                      <Form.Select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      >
                        <option value="">Select Year</option>
                        <option value="FE">FE</option>
                        <option value="SE">SE</option>
                        <option value="TE">TE</option>
                        <option value="BE">BE</option>
                      </Form.Select>
                    </Form.Group>

                       <Form.Group className="mb-4">
                          <Form.Label className="block text-sm font-medium text-gray-700 mb-1">
                            Branch *
                          </Form.Label>
                          <Form.Select
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          >
                            <option value="">Select Branch</option>
                            {departments.map((dept, idx) => (
                              <option key={idx} value={dept.name || dept}>
                                {dept.name || dept}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>

                  </div>

                  <Form.Group className="mb-4">
                    <Form.Label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Marks
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="marks"
                      value={formData.marks}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="100"
                    />
                  </Form.Group>
                </Card.Body>
              </Card>

              {/* Deadline & Files Card */}
              <Card className="border-0 shadow-sm rounded-xl overflow-hidden">
                <Card.Body className="p-6">
                  <Card.Title className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="bg-purple-100 text-purple-600 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Deadline & Files
                  </Card.Title>

                  <Form.Group className="mb-4">
                    <Form.Label className="block text-sm font-medium text-gray-700 mb-1">
                      Deadline *
                    </Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className="block text-sm font-medium text-gray-700 mb-1">
                      Assignment File
                    </Form.Label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleFileChange}
                              accept=".pdf,.doc,.docx"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX up to 10MB
                        </p>
                        {formData.file && (
                          <p className="text-sm text-green-600 mt-2">
                            Selected: {formData.file.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </Form.Group>
                </Card.Body>
              </Card>
            </div>

            {/* Instructions Card */}
            <Card className="border-0 shadow-sm rounded-xl overflow-hidden">
              <Card.Body className="p-6">
                <Card.Title className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="bg-green-100 text-green-600 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </span>
                  Additional Instructions
                </Card.Title>
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Add any additional instructions, submission guidelines, or grading criteria..."
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <Button
                variant="outline-secondary"
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="px-6 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Create Assignment
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddAssignment;