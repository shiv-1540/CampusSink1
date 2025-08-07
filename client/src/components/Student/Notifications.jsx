import React,{useEffect,useState} from "react";
import { FaBell } from "react-icons/fa";
import axios from 'axios';
import StudSidebar from "./StudSidebar";
const server= import.meta.env.VITE_BACKEND_URL;


const Notifications=()=>{
    const [notifications,setNotifications]=useState("");
    const [error,setError]=useState("");

    useEffect(()=>{
        const fetchNotifications = async () => {
              const token = localStorage.getItem('token');
              const studinfo=JSON.parse(localStorage.getItem('user'));

              console.log("studinfo: >>",studinfo);
                try {
                const res = await axios.post(`${server}/api/assignments/nots?user_id=${studinfo.id}`, 
                      { user_id:studinfo.id},
                    {
                    headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                    },
                },
            );

                // Axios responses do not use `res.ok` like fetch
                // ✅ Access data directly
                setNotifications(res.data);
                console.log("Notifications from backend >>", res.data);

                } catch (err) {
                console.log("Error while fetching the notifications !!>>", err.message);
                setError(err.message);
                }
           };
        fetchNotifications();
      
    },[]);

    return (
      <div className="maincontainer flex min-h-screen  bg-gray-100">
        <StudSidebar />
  {/* Main Content */}
  <div className="container flex-grow">
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center mb-6">
        <FaBell className="text-blue-500 text-2xl mr-3" />
        <h4 className="text-2xl font-bold text-gray-800">Notifications</h4>
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center">No notifications yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {notifications.map((n, i) => (
            <li key={i} className="py-4 px-2 hover:bg-gray-50 rounded transition-all">
              <div className="flex justify-between items-center mb-1">
                <h5 className="text-lg font-semibold text-gray-800">{n.title}</h5>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full capitalize">
                  {n.type}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{n.message}</p>
              <span className="text-xs text-gray-400 italic">
                {new Date(n.created_at).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>

    {error && (
      <div className="mt-4 text-red-600 font-medium text-center">{error}</div>
    )}
  </div>
      </div>

    );

};

export default Notifications;
