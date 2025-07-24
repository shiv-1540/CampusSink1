import React from 'react';
import AdSidebar from './AdSidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <AdSidebar />
      <main className="ml-64 w-full min-h-screen bg-gray-100 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
