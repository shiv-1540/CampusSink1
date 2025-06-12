// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch("http://localhost:5000/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // You can add a role check if you have it in the database
//         if (email === "admin@campus.edu") {
//           navigate("/admin/dashboard");
//         } else if (email.includes("teacher")) {
//           navigate("/teacher/dashboard");
//         } else {
//           navigate("/student/dashboard");
//         }
//       } else {
//         alert(data.error || "Login failed");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Something went wrong");
//     }
//   };

//   const fillDemo = (role) => {
//     if (role === "teacher") setEmail("sarah.johnson@university.edu");
//     if (role === "student") setEmail("alex.kumar@student.edu");
//     if (role === "admin") setEmail("admin@campus.edu");
//     setPassword("password123");
//   };

//   return (
//     <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
//       <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "400px" }}>
//         <div className="text-center mb-3">
//           <h2 className="fw-bold text-primary">CampusSink</h2>
//           <p className="text-muted">Academic Assignment Management</p>
//         </div>
//         <form onSubmit={handleLogin}>
//           <div className="mb-3">
//             <label>Email Address</label>
//             <input
//               type="email"
//               className="form-control"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label>Password</label>
//             <input
//               type="password"
//               className="form-control"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <button type="submit" className="btn btn-primary w-100">Sign In</button>
//         </form>

//         {/* Sign up and forgot password links */}
//         <p className="text-center mt-3">
//           Don’t have an account? <a href="/signup">Sign up here</a>
//         </p>
//         <p className="text-center">
//           <a href="/forgot-password">Forgot Password?</a>
//         </p>

//         <hr />
//         <div className="text-center">
//           <strong>Demo Accounts</strong>
//           <div className="mt-2">
//             <button className="btn btn-outline-secondary btn-sm mb-1 w-100" onClick={() => fillDemo("teacher")}>
//               Teacher: sarah.johnson@university.edu
//             </button>
//             <button className="btn btn-outline-secondary btn-sm mb-1 w-100" onClick={() => fillDemo("student")}>
//               Student: alex.kumar@student.edu
//             </button>
//             <button className="btn btn-outline-secondary btn-sm w-100" onClick={() => fillDemo("admin")}>
//               Admin: admin@campus.edu
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "sarah.johnson@university.edu") {
      navigate("/teacher/dashboard");
    } else if (email === "alex.kumar@student.edu") {
      navigate("/student/dashboard");
    } else if (email === "admin@campus.edu") {
      navigate("/admin/dashboard");
    } else {
      alert("Invalid credentials!");
    }
  };

  const fillDemo = (role) => {
    if (role === "teacher") setEmail("sarah.johnson@university.edu");
    if (role === "student") setEmail("alex.kumar@student.edu");
    if (role === "admin") setEmail("admin@campus.edu");
    setPassword("password123");
  };

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="text-center mb-3">
          <h2 className="fw-bold text-primary">CampusSink</h2>
          <p className="text-muted">Academic Assignment Management</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Sign In</button>
        </form>
        <p className="text-center mt-3">
          Don’t have an account? <a href="/signup">Sign up here</a>
        </p>


        <hr />

        <div className="text-center">
          <strong>Demo Accounts</strong>
          <div className="mt-2">
            <button className="btn btn-outline-secondary btn-sm mb-1 w-100" onClick={() => fillDemo("teacher")}>
              Teacher: sarah.johnson@university.edu
            </button>
            <button className="btn btn-outline-secondary btn-sm mb-1 w-100" onClick={() => fillDemo("student")}>
              Student: alex.kumar@student.edu
            </button>
            <button className="btn btn-outline-secondary btn-sm w-100" onClick={() => fillDemo("admin")}>
              Admin: admin@campus.edu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
