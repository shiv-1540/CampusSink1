import React, { useEffect, useState } from 'react';
import { FaUser, FaCheckCircle, FaClock, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
// import './ProjectReviews.css';
import StudSidebar from './StudSidebar';
const server= import.meta.env.VITE_BACKEND_URL;

const ProjectReviews = () => {
  const [scheduledReviews, setScheduledReviews] = useState([]);
  const [completedReviews, setCompletedReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const token=localStorage.getItem('token');
    try {
      const res = await axios.get(`${server}/api/reviews`,
        {
           headers:{
               'Content-Type':'application/json',
               'Authorization':`Bearer ${token}`
           }
        }
      );
      const all = res.data;
      const scheduled = all.filter(r => !r.completed);
      const completed = all.filter(r => r.completed);
      setScheduledReviews(scheduled);
      setCompletedReviews(completed);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  return (
    <div className="maincontainer flex min-h-screen  bg-gray-100">

    <StudSidebar />

  {/* Main Content */}
  <div className="container flex-grow">
    <h2 className="text-2xl font-bold text-gray-800 mb-1">📋 Project Reviews</h2>
    <p className="text-sm text-gray-600 mb-6">Track your project evaluations and feedback</p>

    {/* Summary Cards */}
    <div className="flex flex-wrap gap-6 mb-8">
      <div className="bg-yellow-100 text-yellow-900 border-l-4 border-yellow-500 p-4 rounded-lg shadow w-64">
        <h5 className="font-semibold text-lg">Total Reviews</h5>
        <span className="text-2xl font-bold">{scheduledReviews.length + completedReviews.length}</span>
      </div>

      <div className="bg-blue-100 text-blue-900 border-l-4 border-blue-500 p-4 rounded-lg shadow w-64">
        <h5 className="font-semibold text-lg flex items-center gap-2">
          <FaClock /> Scheduled
        </h5>
        <span className="text-2xl font-bold">{scheduledReviews.length}</span>
      </div>

      <div className="bg-green-100 text-green-900 border-l-4 border-green-500 p-4 rounded-lg shadow w-64">
        <h5 className="font-semibold text-lg flex items-center gap-2">
          <FaCheckCircle /> Completed
        </h5>
        <span className="text-2xl font-bold">{completedReviews.length}</span>
      </div>
    </div>

    {/* Scheduled Reviews */}
    <h4 className="text-xl font-bold text-gray-700 mb-4">Scheduled Reviews</h4>
    {scheduledReviews.length === 0 ? (
      <p className="text-gray-500">No scheduled reviews</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {scheduledReviews.map((review) => (
            <div key={review.id} className="bg-white p-5 rounded-lg shadow border-t-4 border-blue-400">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-200 text-blue-800 p-2 rounded-full">
                  <FaUser size={20} />
                </div>
                <h5 className="font-semibold text-lg">{review.title}</h5>
              </div>

              <p className="text-gray-600 text-sm mb-2 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-400" /> {review.date}
              </p>

              <p className="text-gray-700 mb-2 text-sm">
                {review.description || 'No description provided.'}
              </p>

              <p className="text-sm text-gray-700">
                <strong>Year:</strong> {review.year || '-'} <br />
                <strong>Branch:</strong> {review.branch || '-'}
              </p>

              <span className="inline-block mt-3 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Scheduled
              </span>
            </div>
          ))}
      </div>
    )}

    {/* Completed Reviews */}
    <h4 className="text-xl font-bold text-gray-700 mt-10 mb-4">Completed Reviews</h4>
    {completedReviews.length === 0 ? (
      <p className="text-gray-500">No completed reviews</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {completedReviews.map((review) => (
            <div key={review.id} className="bg-white p-5 rounded-lg shadow border-t-4 border-green-400">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-200 text-green-800 p-2 rounded-full">
                  <FaCheckCircle size={20} />
                </div>
                <h5 className="font-semibold text-lg">{review.title}</h5>
              </div>

              <p className="text-gray-600 text-sm mb-2">Reviewed on {review.date}</p>

              <p className="text-gray-700 mb-2 text-sm">
                {review.description || 'No review notes provided.'}
              </p>

              <p className="text-sm text-gray-700">
                <strong>Year:</strong> {review.year || '-'} <br />
                <strong>Branch:</strong> {review.branch || '-'}
              </p>

              <div className="flex justify-between items-center text-sm mt-3">
                <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs">
                  Grade: {review.grade || 'N/A'}
                </span>
                <span className="text-yellow-500">★★★★☆</span>
              </div>
            </div>
          ))}

     
      </div>
    )}
  </div>
</div>

  );
};

export default ProjectReviews;
