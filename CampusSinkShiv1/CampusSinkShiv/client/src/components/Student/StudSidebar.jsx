import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaTasks,
  FaFileAlt,
  FaClock,
  FaBookOpen,
  FaSignOutAlt,
} from 'react-icons/fa';
import ProfilePicture from '../ProfilePicture';
import logo from '../../assets/logo.jpg'


const StudSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const studinfo=JSON.parse(localStorage.getItem('studinfo'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const menuItems = [
    { path: '/student/dashboard', label: 'Home', icon: <FaTasks /> },
    { path: '/student/assignments', label: 'My Assignments', icon: <FaFileAlt /> },
    { path: '/student/reviews', label: 'MY Projects', icon: <FaBookOpen /> },
    { path: '/student/seminars', label: 'Seminars', icon: <FaBookOpen /> },
    { path:'/student/notifications',label:'Notifications' ,icon: <FaClock/>}
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white shadow-md flex flex-col justify-between border-r z-50">
      {/* Top Section */}
      <div>
        {/* Branding */}
        <div className="px-6 py-2 border-b">
          {/* <h2 className="text-xl font-bold text-blue-700 text-center">📘 CampusSink</h2> */}
           <img src={logo} alt="Campusink" className='my-1 mt-1'/>
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center text-center p-3 border-b">
          {/* <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="Teacher"
            className="rounded-full w-20 h-20 border-2 border-blue-500"
          /> */}
          
          <ProfilePicture name={studinfo.name} backgroundColor="#4A4A4A" size={60}/>
          
          <p className="py-1 font-semibold text-gray-800">{user.name}</p>
          <li className='font-semibold text-sm list-none'>{user.email}</li>
          <li className="py-1 font-semibold text-sm text-gray-500 list-none">{studinfo.year} <strong>||</strong>{user.role}</li>
          <li className='py-1 font-semibold text-sm text-gray-500 list-none'></li>
          <li className='py-1 font-semibold text-sm text-gray-500 list-none'>{studinfo.prn}</li>
        </div>

        {/* Navigation */}
        <nav className="mt-4 space-y-1 px-3">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-gray-700 hover:bg-blue-100'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default StudSidebar;
