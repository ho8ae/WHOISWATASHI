
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
// import AdminChatNotification from './chat/AdminChatNotification';


const AdminLayout = () => {

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6 w-full">
        <Outlet />
      </div>
      {/* <AdminChatNotification /> */}
    </div>
  );
};

export default AdminLayout;