import React, { useEffect, useState } from 'react';
import axios from 'axios';
const server= import.meta.env.VITE_BACKEND_URL;
const filterOptions = ['today', 'week', 'month', 'all'];

const WorkloadSummary = () => {
  const [counts, setCounts] = useState({ assignmentCount: 0, seminarCount: 0 });
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

const fetchCounts = async (filterType) => {
  setLoading(true);
   const token = localStorage.getItem('token');
   const studinfo=JSON.parse(localStorage.getItem('studinfo'));
  try {
    const res = await axios.post(
      `${server}/api/assignments/load`,
      {
        branch: studinfo.department,
        year: studinfo.year,
        filterType: filterType,
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    setCounts(res.data);
  } catch (err) {
    console.error("Error fetching counts:", err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchCounts(filter);
  }, [filter]);

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg max-w-full mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Workload Summary</h2>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        {filterOptions.map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={`px-3 py-1 rounded-full text-sm font-semibold 
              ${filter === option ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {option.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Summary */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-blue-100 p-4 rounded-xl">
            <h3 className="text-lg font-medium text-blue-800">Assignments</h3>
            <p className="text-2xl font-bold text-blue-900">{counts.assignmentCount}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-xl">
            <h3 className="text-lg font-medium text-green-800">Seminars</h3>
            <p className="text-2xl font-bold text-green-900">{counts.seminarCount}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkloadSummary;
