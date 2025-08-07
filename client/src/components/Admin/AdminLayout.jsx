import React from 'react';
import AdSidebar from './AdSidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="maincontainer flex min-h-screen  bg-gray-100">
      <AdSidebar />
      <main className="container flex-grow">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
