import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRobot } from 'react-icons/fa';

const AISuggestionCard = () => {
  const [aiMessage, setAiMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const studinfo = JSON.parse(localStorage.getItem("studinfo"));
  console.log("Student ki info>> ",studinfo);

  const server = import.meta.env.VITE_BACKEND_URL;

useEffect(() => {
  const fetchSuggestions = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${server}/api/message`,
        { id: studinfo.user_id }, // ✅ Send as POST body
      );
      console.log("AI Response>> ",response.data);

      if (response.data.message) {
        setAiMessage(response.data.message);
      } else {
        setError('No suggestions generated');
      }
    } catch (err) {
      console.error('AI Suggestion error:', err);
      setError('Failed to load suggestions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (studinfo?.user_id) {
    fetchSuggestions();
  } else {
    setError('Student information not found');
    setIsLoading(false);
  }
}, [studinfo?._id, server]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mt-6 border border-blue-100">
      <div className="flex items-center mb-3 gap-2">
        <FaRobot className="text-blue-500 text-xl" />
        <h2 className="text-lg font-bold">Smart Suggestions from Gemini AI</h2>
      </div>
      
      {isLoading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      ) : error ? (
        <p className="text-red-500 bg-red-50 p-2 rounded">{error}</p>
      ) : (
        <div className="text-gray-700 whitespace-pre-line">
          {aiMessage}
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-500">
        Suggestions based on your assignments, seminars, and academic calendar.
      </div>
    </div>
  );
};

export default AISuggestionCard;