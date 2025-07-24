import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { CalendarDays, Eye, Pencil } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TeachSidebar from './TeacherSidebar';
const server= import.meta.env.VITE_BACKEND_URL;

const ProjectReviewPage = () => {
  const [activeTab, setActiveTab] = useState('scheduled');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', year: '', branch: '', date: '',description:'' });
  const [scheduledReviews, setScheduledReviews] = useState([]);
  const [completedReviews, setCompletedReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const token =localStorage.getItem('token');
    try {
      const res = await axios.get(`${server}/api/reviews`,
        {
            headers:{
              'Content-Type':'application/json',
              'Authorization':`Bearer ${token}`
            }
        }
      );
      setScheduledReviews(res.data.filter(r => !r.completed));
      setCompletedReviews(res.data.filter(r => r.completed));
    } catch (err) {
      toast.error('❌ Failed to fetch reviews');
    }
  };

const handleSubmit = async () => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  if (!form.title || !form.year || !form.branch || !form.date) {
    toast.error('Please fill in all required fields');
    return;
  }

  try {
    if (editingId) {
      await axios.put(
        `${server}/api/reviews/${editingId}`,
        form,
        config
      );
      toast.success('✅ Review updated!');
    } else {
      await axios.post(
        `${server}/api/reviews`,
        form,
        config
      );
      toast.success('✅ Review created!');
    }

    fetchReviews();
    setShowModal(false);
    resetForm();
  } catch (err) {
    console.error("Review Error:", err?.response);
    toast.error('❌ ' + (err?.response?.data?.error || 'Submission failed'));
  }
};



  const handleComplete = async (id) => {
    
    const token=localStorage.getItem('token');
     const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

    try {
      await axios.put(`${server}/api/reviews/${id}/complete`,
        {},
        config
      );
      toast.success('✅ Marked as completed!');
      fetchReviews();
    } catch (err) {
      toast.error('❌ ' + (err.response?.data?.error || 'Failed to mark complete'));
    }
  };


  const resetForm = () => {
    setForm({ title: '', year: '', branch: '', date: '' ,description:''});
    setEditingId(null);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleEdit = (review) => {
    setEditingId(review.id);
    setForm({ title: review.title, year: review.year, branch: review.branch, date: review.date,description:review.description });
    setShowModal(true);
  };

  const ReviewCard = ({ review, completed }) => (
    <div className="bg-white shadow h-15 rounded-lg p-3  flex justify-between items-center">
      <div>
        <h4 className="font-bold text-sm ">{review.title}</h4>
        <p className="text-sm text-gray-600">{review.year} - {review.branch}</p>
        <p className="text-sm text-gray-600">{review.description}</p>
        <p className="text-sm text-gray-500 flex items-center">
          <CalendarDays className="w-4 h-4 mr-1" /> {review.date}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {completed ? (
          <>
            <span className="text-green-600 font-semibold">Completed</span>
            <span className="text-sm text-green-700">Grade: {review.grade || 'N/A'}</span>
          </>
        ) : (
          <>
            <button onClick={() => handleComplete(review.id)} className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
              Mark Complete
            </button>
            <button onClick={() => handleEdit(review)} className="text-sm border px-3 py-1 rounded hover:bg-gray-100">
              Reschedule
            </button>
          </>
        )}
        <Eye className="w-5 h-5 cursor-pointer" />
        {!completed && <Pencil className="w-5 h-5 cursor-pointer" onClick={() => handleEdit(review)} />}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
         <div className="w-64 fixed top-0 left-0 h-full z-10">
           <TeachSidebar/>
        </div>

      
      <ToastContainer />
      <div className="flex-grow ml-64 p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-extrabold">Project Reviews</h2>
            <p className="text-md text-gray-600">Track & schedule student project evaluations</p>
          </div>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            + Create Review
          </button>
        </div>

        <div className="mb-4">
          {['scheduled', 'completed'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 mr-2 rounded ${activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-gray-500 border'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div>
          {activeTab === 'scheduled' && scheduledReviews.length === 0 && (
            <p className="text-gray-500">No scheduled reviews</p>
          )}
          {activeTab === 'scheduled' &&
            scheduledReviews.map(r => <ReviewCard key={r.id} review={r} completed={false} />)}

          {activeTab === 'completed' && completedReviews.length === 0 && (
            <p className="text-gray-500">No completed reviews</p>
          )}
          {activeTab === 'completed' &&
            completedReviews.map(r => <ReviewCard key={r.id} review={r} completed={true} />)}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">
                {editingId ? 'Edit Project Review' : 'Create Project Review'}
              </h3>
              <form className="space-y-4">
                {['title', 'year', 'branch'].map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium capitalize">{field}</label>
                    <input
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      className="w-full mt-1 border rounded  text-gray-400 px-3 py-2"
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
                    className="w-full mt-1 border text-gray-400 rounded px-3 py-2"
                    
                  />
                </div>
              <div>
                <label className="block text-sm font-medium" >Description</label>
                <textarea 
                    type="text" 
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full mt-1 border text-gray-400 rounded px-3 py-2"
                    placeholder='Enter Description'

                />
              </div>
              </form>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
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
