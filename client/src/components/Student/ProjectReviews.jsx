import React, { useEffect, useState } from 'react';
import { FaUser, FaCheckCircle, FaClock, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import './ProjectReviews.css';
import StudSidebar from './StudSidebar';
const server= import.meta.env.VITE_BACKEND_URL;

const ProjectReviews = () => {
  const [scheduledReviews, setScheduledReviews] = useState([]);
  const [completedReviews, setCompletedReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${server}/api/reviews`);
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
    <div className="dashboard">
       <div className="w-64 fixed top-0 left-0 h-full z-10">
          <StudSidebar/>
        </div>

      <div className="flex-grow ml-64 p-6 bg-gray-100 min-h-screen">
        <h2>Project Reviews</h2>
        <p>Track your project evaluations and feedback</p>

        <div className="cards-row">
          <div className="card">
            <h4>Total Reviews</h4>
            <span>{scheduledReviews.length + completedReviews.length}</span>
          </div>
          <div className="card">
            <h4>Scheduled</h4>
            <FaClock />
            <span>{scheduledReviews.length}</span>
          </div>
          <div className="card">
            <h4>Completed</h4>
            <FaCheckCircle />
            <span>{completedReviews.length}</span>
          </div>
        </div>

        <h3>Scheduled Reviews</h3>
        {scheduledReviews.length === 0 ? (
          <p>No scheduled reviews</p>
        ) : (
          scheduledReviews.map((review, index) => (
            <div className="scheduled" key={index}>
              <div className="icon-box user-icon-box">
                <FaUser className="default-user-icon" />
              </div>
              <div>
                <strong>{review.title}</strong><br />
                <small><FaCalendarAlt /> {review.date}</small>
                <p>Prepare your project presentation and be ready to discuss your implementation approach.</p>
                <ul>
                  <li>Prepare project demonstration</li>
                  <li>Review your code and documentation</li>
                  <li>Be ready to explain your design decisions</li>
                  <li>Prepare for technical questions</li>
                </ul>
                <p><strong>Year:</strong> {review.year || '-'} | <strong>Branch:</strong> {review.branch || '-'}</p>
              </div>
              <span className="scheduled-badge">Scheduled</span>
            </div>
          ))
        )}

        <h3>Completed Reviews</h3>
        {completedReviews.length === 0 ? (
          <p>No completed reviews</p>
        ) : (
          completedReviews.map((review, index) => (
            <div className="completed" key={index}>
              <div className="icon-box check-icon-box">
                <FaCheckCircle />
              </div>
              <div>
                <strong>{review.title}</strong><br />
                <small>Reviewed on {review.date}</small>
                <div className="feedback-box">
                  <p><strong>Feedback:</strong></p>
                  <p>Excellent implementation with clean code structure. Good understanding of the requirements and effective problem-solving approach. Consider optimizing the algorithm for better performance.</p>
                </div>
              </div>
              <div className="grade-box">
                <span className="green">{review.grade || 'N/A'}</span>
                <p>★★★★☆</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectReviews;
