import React from 'react';
import { Home, UserPlus, FileText, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AdSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white flex flex-col p-4 z-50">
      <h1 className="text-2xl font-bold mb-10 text-center">CampusSink Admin</h1>

      <nav className="flex flex-col gap-6">
        <SidebarItem icon={<Home size={20} />} label="Dashboard" to="/admin/dashboard" />
        <SidebarItem icon={<UserPlus size={20} />} label="Add Users" to="/admin/addusers" />
        <SidebarItem icon={<FileText size={20} />} label="Reports" to="/admin/reports" /> {/* ✅ Fixed path */}
        <SidebarItem icon={<Settings size={20} />} label="Manage Settings" to="/admin/settings" />
        <SidebarItem icon={<LogOut size={20} />} label="Logout" onClick={handleLogout} />
      </nav>
    </div>
  );
};

const SidebarItem = ({ icon, label, to, onClick }) => {
  const content = (
    <div className="flex items-center gap-4 text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-lg transition-all">
      {icon}
      <span className="text-base">{label}</span>
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return <div onClick={onClick} className="cursor-pointer">{content}</div>;
};

export default AdSidebar;
