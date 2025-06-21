import {
  FaHome,
  FaBook,
  FaChalkboardTeacher,
  FaClipboardList,
  FaSignOutAlt,
  FaCalendarAlt,
  FaBell,
} from "react-icons/fa";
import { useNavigate,Link } from "react-router-dom";

const StudSidebar = () => {
   const navigate=useNavigate();

  const handleLogout = () => {
      // Clear any session/auth storage if used
      localStorage.clear();  // optional if you use localStorage
      navigate('/'); // Redirect to sign-in page
  };
  return (
      <div className="bg-white border-end vh-100 d-flex flex-column justify-content-between position-fixed" style={{ width: "240px" }}>
        <div>
        <div className="p-4 text-center border-bottom">
            <h5 className="mb-0 fw-bold text-primary">CampusSink</h5>
            <small className="text-muted">Academic Portal</small>
        </div>
        <div className="text-center mt-3 mb-4">
            <img src="https://randomuser.me/api/portraits/men/75.jpg" className="rounded-circle mb-2" width="60" alt="profile" />
            <h6 className="mb-0">Alex Kumar</h6>
            <small className="text-muted">Student</small>
        </div>

        <ul className="nav flex-column px-3">
            <li className="nav-item mb-2">
            <Link className="nav-link text-dark" to="/student/dashboard"><FaHome className="me-2" /> Home</Link>
            </li>
            <li className="nav-item mb-2">
            <Link className="nav-link text-dark" to="/student/assignments"><FaBook className="me-2" /> My Assignments</Link>
            </li>
            <li className="nav-item mb-2">
            <Link className="nav-link text-dark" to="/student/seminars"><FaChalkboardTeacher className="me-2" /> Seminars</Link>
            </li>
            <li className="nav-item mb-2">
            <Link className="nav-link text-dark" to="/student/reviews"><FaClipboardList className="me-2" /> Project Reviews</Link>
            </li>
        </ul>
        </div>

        <div className="text-center p-3 border-top">
           <button className="btn btn-outline-danger btn-sm w-100" onClick={handleLogout} ><FaSignOutAlt className="me-1" /> Logout</button>
        </div>

  </div>
  );

};

export default StudSidebar;