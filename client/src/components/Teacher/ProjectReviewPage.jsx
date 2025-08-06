// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { CalendarDays, Eye, Pencil } from 'lucide-react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import TeachSidebar from './TeacherSidebar';

// const server = import.meta.env.VITE_BACKEND_URL;

// const ProjectReviewPage = () => {
//   const [activeTab, setActiveTab] = useState('scheduled');
//   const [showModal, setShowModal] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [form, setForm] = useState({ title: '', year: '', branch: '', date: '', description: '' });
//   const [scheduledReviews, setScheduledReviews] = useState([]);
//   const [completedReviews, setCompletedReviews] = useState([]);

//   useEffect(() => {
//     fetchReviews();
//   }, []);

//   const fetchReviews = async () => {
//     const token = localStorage.getItem('token');
//     try {
//       const res = await axios.get(`${server}/api/reviews`, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setScheduledReviews(res.data.filter((r) => !r.completed));
//       setCompletedReviews(res.data.filter((r) => r.completed));
//     } catch (err) {
//       toast.error('❌ Failed to fetch reviews');
//     }
//   };

//   const handleSubmit = async () => {
//     const token = localStorage.getItem('token');
//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     };

//     if (!form.title || !form.year || !form.branch || !form.date) {
//       toast.error('Please fill in all required fields');
//       return;
//     }

//     try {
//       if (editingId) {
//         await axios.put(`${server}/api/reviews/${editingId}`, form, config);
//         toast.success('✅ Review updated!');
//       } else {
//         await axios.post(`${server}/api/reviews`, form, config);
//         toast.success('✅ Review created!');
//       }

//       fetchReviews();
//       setShowModal(false);
//       resetForm();
//     } catch (err) {
//       toast.error('❌ ' + (err?.response?.data?.error || 'Submission failed'));
//     }
//   };

//   const handleComplete = async (id) => {
//     const token = localStorage.getItem('token');
//     try {
//       await axios.put(`${server}/api/reviews/${id}/complete`, {}, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       toast.success('✅ Marked as completed!');
//       fetchReviews();
//     } catch (err) {
//       toast.error('❌ ' + (err?.response?.data?.error || 'Failed to mark complete'));
//     }
//   };

//   const resetForm = () => {
//     setForm({ title: '', year: '', branch: '', date: '', description: '' });
//     setEditingId(null);
//   };

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleEdit = (review) => {
//     setEditingId(review.id);
//     setForm({
//       title: review.title,
//       year: review.year,
//       branch: review.branch,
//       date: review.date,
//       description: review.description,
//     });
//     setShowModal(true);
//   };

//   const ReviewCard = ({ review, completed }) => (
//     <div className="bg-indigo-50 text-gray-800 border border-indigo-300 rounded-xl p-5 mb-5 flex flex-col md:flex-row justify-between gap-4 hover:shadow-md transition">
//       <div>
//         <h4 className="font-semibold text-lg">{review.title}</h4>
//         <p className="text-sm">{review.year} - {review.branch}</p>
//         <p className="text-sm text-gray-700">{review.description}</p>
//         <p className="text-sm flex items-center mt-1">
//           <CalendarDays className="w-4 h-4 mr-1" /> {review.date}
//         </p>
//       </div>
//       <div className="flex items-center gap-3 flex-wrap">
//         {completed ? (
//           <>
//             <span className="text-green-700 font-medium">Completed</span>
//             <span className="text-sm text-green-800">Grade: {review.grade || 'N/A'}</span>
//           </>
//         ) : (
//           <>
//             <button onClick={() => handleComplete(review.id)} className="bg-green-500 text-white px-4 py-1 rounded-full text-sm hover:bg-green-600 transition">
//               ✅ Complete
//             </button>
//             <button onClick={() => handleEdit(review)} className="text-sm bg-yellow-300 text-yellow-900 px-3 py-1 rounded-full hover:bg-yellow-400 transition">
//               ✏️ Reschedule
//             </button>
//           </>
//         )}
//         <Eye className="w-5 h-5 cursor-pointer text-gray-700 hover:text-black" />
//         {!completed && <Pencil className="w-5 h-5 cursor-pointer text-blue-500 hover:text-blue-700" onClick={() => handleEdit(review)} />}
//       </div>
//     </div>
//   );

//   return (
//     <div className="flex font-poppins bg-sky-50 min-h-screen text-gray-900">
//       <div className="w-64 fixed top-0 left-0 h-full z-10 bg-indigo-100 shadow-xl">
//         <TeachSidebar />
//       </div>

//       <ToastContainer />
//       <div className="flex-grow ml-64 p-6 w-full">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//           <div>
//             <h2 className="text-4xl font-extrabold text-indigo-900">📋 Project Reviews</h2>
//             <p className="text-sm text-indigo-700 mt-1">Manage, schedule, and complete evaluations</p>
//           </div>
//           <button
//             className="bg-teal-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-teal-700 transition font-medium"
//             onClick={() => {
//               resetForm();
//               setShowModal(true);
//             }}
//           >
//             ➕ Create Review
//           </button>
//         </div>

//         <div className="mb-6 flex flex-wrap gap-3">
//           {['scheduled', 'completed'].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-5 py-2 rounded-full font-medium transition ${
//                 activeTab === tab
//                   ? 'bg-indigo-500 text-white'
//                   : 'bg-indigo-200 text-indigo-800 hover:bg-indigo-300'
//               }`}
//             >
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//             </button>
//           ))}
//         </div>

//         <div>
//           {activeTab === 'scheduled' && scheduledReviews.length === 0 && (
//             <p className="text-indigo-600 italic">No scheduled reviews yet.</p>
//           )}
//           {activeTab === 'scheduled' &&
//             scheduledReviews.map((r) => <ReviewCard key={r.id} review={r} completed={false} />)}

//           {activeTab === 'completed' && completedReviews.length === 0 && (
//             <p className="text-indigo-600 italic">No completed reviews found.</p>
//           )}
//           {activeTab === 'completed' &&
//             completedReviews.map((r) => <ReviewCard key={r.id} review={r} completed={true} />)}
//         </div>

//         {showModal && (
//           <div className="fixed inset-0 bg-indigo-100 bg-opacity-90 flex justify-center items-center z-50 px-4">
//             <div className="bg-white text-gray-900 rounded-2xl p-8 w-full max-w-lg shadow-2xl animate-fade-in">
//               <h3 className="text-2xl font-bold mb-6">
//                 {editingId ? 'Edit Review' : 'Create New Review'}
//               </h3>
//               <form className="space-y-5">
//                 {['title', 'year', 'branch'].map((field) => (
//                   <div key={field}>
//                     <label className="block text-sm font-medium capitalize">{field}</label>
//                     <input
//                       name={field}
//                       value={form[field]}
//                       onChange={handleChange}
//                       className="w-full mt-1 border border-indigo-300 bg-indigo-50 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                       placeholder={`Enter ${field}`}
//                       type="text"
//                     />
//                   </div>
//                 ))}
//                 <div>
//                   <label className="block text-sm font-medium">Date & Time</label>
//                   <input
//                     type="datetime-local"
//                     name="date"
//                     value={form.date}
//                     onChange={handleChange}
//                     className="w-full mt-1 border border-indigo-300 bg-indigo-100 text-indigo-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium">Description</label>
//                   <textarea
//                     name="description"
//                     value={form.description}
//                     onChange={handleChange}
//                     rows={3}
//                     className="w-full mt-1 border border-indigo-300 bg-indigo-50 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                     placeholder="Enter description"
//                   />
//                 </div>
//               </form>
//               <div className="mt-6 flex justify-end gap-3">
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSubmit}
//                   className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
//                 >
//                   {editingId ? 'Update' : 'Submit'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProjectReviewPage;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarDays, Pencil } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TeachSidebar from './TeacherSidebar';

const server = import.meta.env.VITE_BACKEND_URL;

const ProjectReviewPage = () => {
  const [activeTab, setActiveTab] = useState('scheduled');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', year: '', branch: '', date: '', description: '' });
  const [scheduledReviews, setScheduledReviews] = useState([]);
  const [completedReviews, setCompletedReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${server}/api/reviews`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setScheduledReviews(res.data.filter((r) => !r.completed));
      setCompletedReviews(res.data.filter((r) => r.completed));
    } catch (err) {
      toast.error('❌ Failed to fetch reviews');
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    if (!form.title || !form.year || !form.branch || !form.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${server}/api/reviews/${editingId}`, form, config);
        toast.success('✅ Review updated!');
      } else {
        await axios.post(`${server}/api/reviews`, form, config);
        toast.success('✅ Review created!');
      }

      fetchReviews();
      setShowModal(false);
      resetForm();
    } catch (err) {
      toast.error('❌ ' + (err?.response?.data?.error || 'Submission failed'));
    }
  };

  const handleComplete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${server}/api/reviews/${id}/complete`, {}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('✅ Marked as completed!');
      fetchReviews();
    } catch (err) {
      toast.error('❌ ' + (err?.response?.data?.error || 'Failed to mark complete'));
    }
  };

  const resetForm = () => {
    setForm({ title: '', year: '', branch: '', date: '', description: '' });
    setEditingId(null);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEdit = (review) => {
    setEditingId(review.id);
    setForm({
      title: review.title,
      year: review.year,
      branch: review.branch,
      date: review.date,
      description: review.description,
    });
    setShowModal(true);
  };

  const ReviewCard = ({ review, completed }) => (
    <div className="bg-white shadow-md rounded-xl p-5 mb-4 border-l-4 border-indigo-400 hover:shadow-lg transition">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h4 className="text-xl font-bold text-indigo-700">{review.title}</h4>
          <p className="text-sm text-gray-600">{review.year} - {review.branch}</p>
          <p className="text-gray-700 mt-1">{review.description}</p>
          <p className="text-sm flex items-center mt-2 text-gray-500">
            <CalendarDays className="w-4 h-4 mr-1" /> {review.date}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {completed ? (
            <>
              <span className="text-green-600 font-semibold">✅ Completed</span>
              <span className="text-sm text-green-800">Grade: {review.grade || 'N/A'}</span>
            </>
          ) : (
            <>
              <button
                onClick={() => handleComplete(review.id)}
                className="bg-green-500 text-white px-4 py-1 rounded-full text-sm hover:bg-green-600 transition"
              >
                Complete
              </button>
              <button
                onClick={() => handleEdit(review)}
                className="text-sm bg-yellow-300 text-yellow-900 px-3 py-1 rounded-full hover:bg-yellow-400 transition"
              >
                Reschedule
              </button>
              <Pencil
                className="w-5 h-5 cursor-pointer text-blue-500 hover:text-blue-700"
                onClick={() => handleEdit(review)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex font-sans bg-gradient-to-br from-sky-50 to-indigo-100 min-h-screen text-gray-900">
      <div className="w-64 fixed top-0 left-0 h-full z-10 bg-indigo-100 shadow-xl">
        <TeachSidebar />
      </div>

      <ToastContainer />
      <div className="flex-grow ml-64 p-6 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-4xl font-bold text-indigo-900">📋 Project Reviews</h2>
            <p className="text-sm text-indigo-700 mt-1">Manage, schedule, and complete evaluations</p>
          </div>
          <button
            className="bg-indigo-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-indigo-700 transition font-medium"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            ➕ Create Review
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {['scheduled', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full font-medium transition ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-200 text-indigo-800 hover:bg-indigo-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div>
          {activeTab === 'scheduled' && scheduledReviews.length === 0 && (
            <p className="text-indigo-600 italic">No scheduled reviews yet.</p>
          )}
          {activeTab === 'scheduled' &&
            scheduledReviews.map((r) => <ReviewCard key={r.id} review={r} completed={false} />)}

          {activeTab === 'completed' && completedReviews.length === 0 && (
            <p className="text-indigo-600 italic">No completed reviews found.</p>
          )}
          {activeTab === 'completed' &&
            completedReviews.map((r) => <ReviewCard key={r.id} review={r} completed={true} />)}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 px-4">
            <div className="bg-white text-gray-900 rounded-2xl p-8 w-full max-w-lg shadow-2xl animate-fade-in">
              <h3 className="text-2xl font-bold mb-6">
                {editingId ? 'Edit Review' : 'Create New Review'}
              </h3>
              <form className="space-y-5">
                {['title', 'year', 'branch'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium capitalize">{field}</label>
                    <input
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      className="w-full mt-1 border border-indigo-300 bg-indigo-50 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder={`Enter ${field}`}
                      type="text"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium">Date & Time</label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full mt-1 border border-indigo-300 bg-indigo-100 text-indigo-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full mt-1 border border-indigo-300 bg-indigo-50 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Enter description"
                  />
                </div>
              </form>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  {editingId ? 'Update' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectReviewPage;
