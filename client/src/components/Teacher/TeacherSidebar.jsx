// import React from 'react';
// import { Home, UserPlus, FileText, Settings, LogOut } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';

// const AdSidebar = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/');
//   };

//   return (
//     <div className="fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white flex flex-col p-4 z-50">
//       <h1 className="text-2xl font-bold mb-10 text-center">CampusSink Admin</h1>

//       <nav className="flex flex-col gap-6">
//         <SidebarItem icon={<Home size={20} />} label="Dashboard" to="/admin/dashboard" />
//         <SidebarItem icon={<UserPlus size={20} />} label="Add Users" to="/admin/addusers" />
//         <SidebarItem icon={<FileText size={20} />} label="Reports" to="/admin/reports" /> {/* ✅ Fixed path */}
//         <SidebarItem icon={<Settings size={20} />} label="Manage Settings" to="/admin/settings" />
//         <SidebarItem icon={<LogOut size={20} />} label="Logout" onClick={handleLogout} />
//       </nav>
//     </div>
//   );
// };

// const SidebarItem = ({ icon, label, to, onClick }) => {
//   const content = (
//     <div className="flex items-center gap-4 text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-lg transition-all">
//       {icon}
//       <span className="text-base">{label}</span>
//     </div>
//   );

//   if (to) {
//     return <Link to={to}>{content}</Link>;
//   }

//   return <div onClick={onClick} className="cursor-pointer">{content}</div>;
// };

// export default AdSidebar;



import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaTasks,
  FaFileAlt,
  FaClock,
  FaBookOpen,
  FaSignOutAlt,
} from 'react-icons/fa';

const TeachSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const menuItems = [
    { path: '/teacher/dashboard', label: 'Dashboard', icon: <FaTasks /> },
    { path: '/teacher/add-assignment', label: 'Add Assignment', icon: <FaFileAlt /> },
    { path: '/teacher/view-assignments', label: 'View/Edit Assignments', icon: <FaFileAlt /> },
    { path: '/teacher/manage-deadlines', label: 'Manage Deadlines', icon: <FaBookOpen /> },
     { path: '/teacher/project-reviews', label: 'Project Reviews', icon: <FaFileAlt /> },
      { path: '/teacher/seminars', label: 'Seminars', icon: <FaBookOpen /> },
     { path: '/teacher/calendar', label: 'Academic Calendar', icon: <FaFileAlt /> },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white shadow-md flex flex-col justify-between border-r z-50">
      {/* Top Section */}
      <div>
        {/* Branding */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-blue-700 text-center">📘 CampusSink</h2>
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center text-center p-2 border-b">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="Teacher"
            className="rounded-full w-20 h-20 border-2 border-blue-500"
          />
          <p className="mt-2 font-semibold text-gray-800">{user.name}</p>
          <p className="text-sm text-gray-500">{user.role}</p>
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

export default TeachSidebar;
