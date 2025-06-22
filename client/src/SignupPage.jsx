import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Student"); // Default role
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }), // include role
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account created successfully!");
        navigate("/login");
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">CampusSink</h2>
        <p className="text-muted">Create your account</p>
      </div>
      <div className="card shadow p-4" style={{ width: "350px" }}>
        <h4 className="text-center mb-3">Sign Up</h4>
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <div className="mb-3">
            <label>Select Role</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>
        </form>
        <hr />
        <div className="text-center">
          <p>
            Already have an account? <a href="/login">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const SignupPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const navigate = useNavigate();

//   const handleSignup = (e) => {
//     e.preventDefault();
//     alert(`Account created for ${name}!`);
//     navigate("/login");
//   };

//   return (
//     <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
//       <div className="text-center mb-4">
//         <h2 className="fw-bold text-primary">CampusSink</h2>
//         <p className="text-muted">Create your account</p>
//       </div>
//       <div className="card shadow p-4" style={{ width: "350px" }}>
//         <h4 className="text-center mb-3">Sign Up</h4>
//         <form onSubmit={handleSignup}>
//           <div className="mb-3">
//             <label>Full Name</label>
//             <input type="text" className="form-control" value={name}
//               onChange={(e) => setName(e.target.value)} required />
//           </div>
//           <div className="mb-3">
//             <label>Email Address</label>
//             <input type="email" className="form-control" value={email}
//               onChange={(e) => setEmail(e.target.value)} required />
//           </div>
//           <div className="mb-3">
//             <label>Password</label>
//             <input type="password" className="form-control" value={password}
//               onChange={(e) => setPassword(e.target.value)} required />
//           </div>
//           <button type="submit" className="btn btn-primary w-100">Sign Up</button>
//         </form>
//         <hr />
//         <div className="text-center">
//           <p>Already have an account? <a href="/login">Login here</a></p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignupPage;
