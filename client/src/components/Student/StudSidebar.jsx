// import React from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import {
//   FaTasks,
//   FaFileAlt,
//   FaClock,
//   FaBookOpen,
//   FaSignOutAlt,
// } from 'react-icons/fa';
// import ProfilePicture from '../ProfilePicture';
// import logo from '../../assets/logo.png'
// import './studsidebar.css';

// const StudSidebar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
  
//   const studinfo=JSON.parse(localStorage.getItem('studinfo'));

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/');
//   };

//   const menuItems = [
//     { path: '/student/dashboard', label: 'Home', icon: <FaTasks /> },
//     { path: '/student/assignments', label: 'My Assignments', icon: <FaFileAlt /> },
//     { path: '/student/reviews', label: 'MY Projects', icon: <FaBookOpen /> },
//     { path: '/student/seminars', label: 'Seminars', icon: <FaBookOpen /> },
//     { path:'/student/notifications',label:'Notifications' ,icon: <FaClock/>}
//   ];

//   return (
//     <aside className="sidebar">
//       {/* Top Section */}
//       <div>
//         {/* Branding */}
//         <div className="px-6 py-2 border-b">
//           {/* <h2 className="text-xl font-bold text-blue-700 text-center">📘 CampusSink</h2> */}
//            <img src={logo} alt="Campusink" className='my-1 mt-1'/>
//         </div>

//         {/* Profile */}
//         <div className="flex flex-col items-center text-center p-3 border-b">
          
//           <ProfilePicture name={studinfo.name} backgroundColor="#4A4A4A" size={60}/>
          
//           <p className="py-1 font-semibold text-gray-800">{studinfo.name}</p>
//           <li className='font-semibold text-sm list-none'>{studinfo.email}</li>
//           <li className="py-1 font-semibold text-sm text-gray-500 list-none">{studinfo.year} <strong>||</strong>{studinfo.role}</li>
//           <li className='py-1 font-semibold text-sm text-gray-500 list-none'></li>
//           <li className='py-1 font-semibold text-sm text-gray-500 list-none'>{studinfo.prn}</li>
//         </div>

//         {/* Navigation */}
//         <nav className="mt-4 space-y-1 px-3">
//           {menuItems.map((item, idx) => (
//             <Link
//               key={idx}
//               to={item.path}
//               className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
//                 location.pathname === item.path
//                   ? 'bg-blue-600 text-white font-semibold'
//                   : 'text-gray-700 hover:bg-blue-100'
//               }`}
//             >
//               {item.icon}
//               <span>{item.label}</span>
//             </Link>
//           ))}
//         </nav>
//       </div>

//       {/* Logout Button */}
//       <div className="p-4 border-t">
//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
//         >
//           <FaSignOutAlt />
//           Logout
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default StudSidebar;

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaTasks,
  FaFileAlt,
  FaClock,
  FaBookOpen,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import ProfilePicture from '../ProfilePicture';
import logo from '../../assets/logo.png';
import './studsidebar.css';

const StudSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const studinfo = JSON.parse(localStorage.getItem('studinfo'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const menuItems = [
    { path: '/student/dashboard', label: 'Home', icon: <FaTasks /> },
    { path: '/student/assignments', label: 'My Assignments', icon: <FaFileAlt /> },
    { path: '/student/reviews', label: 'MY Projects', icon: <FaBookOpen /> },
    { path: '/student/seminars', label: 'Seminars', icon: <FaBookOpen /> },
    { path: '/student/notifications', label: 'Notifications', icon: <FaClock /> },
  ];

  return (
    <>
      {/* Top mobile header with hamburger */}
      <div className="mobile-header md:hidden flex justify-between items-center px-4 py-2 bg-white shadow fixed top-0 left-0 right-0 z-50">
        <img src={logo} alt="Campusink" className="h-8" />
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Top Branding */}
        <div className="px-6 py-2 border-b flex justify-center items-center mt-12 md:mt-0">
          <img src={logo} alt="Campusink" className="my-1 mt-1 h-10" />
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-center text-center p-3 border-b">
          <ProfilePicture name={studinfo.name} backgroundColor="#4A4A4A" size={60} />
          <p className="py-1 font-semibold text-gray-800">{studinfo.name}</p>
          <li className="font-semibold text-sm list-none">{studinfo.email}</li>
          <li className="py-1 font-semibold text-sm text-gray-500 list-none">
            {studinfo.year} <strong>||</strong> {studinfo.role}
          </li>
          <li className="py-1 font-semibold text-sm text-gray-500 list-none">{studinfo.prn}</li>
        </div>

        {/* Menu */}
        <nav className="mt-4 space-y-1 px-3">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              onClick={() => setSidebarOpen(false)} // close on mobile click
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

        {/* Logout */}
        <div className="p-4 border-t mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay to close sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default StudSidebar;
