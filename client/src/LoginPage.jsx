import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button ,Form,Alert} from "react-bootstrap";
// import logo from './assets/workloadlogin.png'

const server= import.meta.env.VITE_BACKEND_URL;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const navigate = useNavigate();


   const fetchStudentInfo = async () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user')); // Get user object
      const email = user?.email;

      if (!email || !token) {
        setError("Missing token or email");
        return;
      }

      try {
        const res = await axios.post(`${server}/api/auth/getstudinfo`, 
          { email }, // Pass email in body
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        // Save student info to localStorage
        localStorage.setItem('studinfo', JSON.stringify(res.data));
        console.log("✅ Student info fetched & stored:", res.data);
      } catch (err) {
        console.error("Error fetching student info --> ", err.message);
        setError(err.message);
      }
    };
   
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${server}/api/auth/login`, {
        email,
        password
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
       
      switch (response.data.user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "teacher":
          navigate("/teacher/dashboard");
          break;
        case "student":{
          await fetchStudentInfo();
          navigate("/student/dashboard");
          break;
        }
        default:
          navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    console.log("FOrgot me aa gya");
    console.log("Mail >>",forgotEmail);
    try {
        setError("");
      await axios.post(`${server}/api/auth/forgot-password`, {
        email: forgotEmail
      });
      console.log("AAge bhi aaya..")
      setStep(2);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
        setError("");
      await axios.post(`${server}/api/auth/verify-otp`, {
        email: forgotEmail,
        otp
      });
      setStep(3);
      setError("");
      
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  };

  const resetPassword = async () => {
    try {
      setError("");
      console.log("Frontend sending:", { email: forgotEmail, otp, newPassword });

      await axios.post(`${server}/api/auth/reset-password`, {
        email: forgotEmail,
        otp,
        newPassword
      });
      setError("Password reset successfully!");
      setShowForgotPassword(false);
      setError("");
      setStep(1);
    } catch (err) {
      console.log("Error from reset: ",err.response.data);
      setError(err.response?.data?.error || "Failed to reset password");
    }
  };

  const fillDemo = (role) => {
    switch(role) {
      case "admin":
        setEmail("shivshankar.ghyar@mitaoe.ac.in");
        setPassword("12345678");
        break;
      case "student":
        setEmail("tejas.gophane@mitaoe.ac.in");
        setPassword("4102");
        break;
      case "teacher":
        setEmail("atish.shinde@mitaoe.ac.in");
        setPassword("12345678");
        break;
      default:
        setEmail("");
        setPassword("");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
       
       
      <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "400px" }}>
         <div className="text-center mb-3">
          <h2 className="font-extrabold text-primary text-3xl">CampusSink</h2>
          <p className="text-muted">Academic Assignment Management</p>
        </div>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

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
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
        
          </div>
          
            
          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Signing In...
              </>
            ) : "Sign In"}
          </button>

          

        </form>
         <button 
              className="btn btn-link mt-2" 
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </button>

        <hr />

       <div className="text-center">
          <strong>Demo Account</strong>
          <div className="m-2 gap-2">
            <button 
              className="btn btn-outline-secondary btn-sm w-100" 
              onClick={() => fillDemo("admin")}
            >
              Admin: shivshankar.ghyar@mitaoe.ac.in
            </button>

            <button 
              className="btn btn-outline-secondary btn-sm w-100" 
              onClick={() => fillDemo("student")}
            >
              Student: tejas.gophane@mitaoe.ac.in
            </button>
            
            <button 
              className="btn btn-outline-secondary btn-sm w-100" 
              onClick={() => fillDemo("teacher")}
            >
              Teacher: atish.shinde@mitaoe.ac.in
            </button>
          </div>
       </div>

       

   <Modal
        show={showForgotPassword}
        onHide={() => {
          setShowForgotPassword(false);
          setStep(1);
          setError("");
        }}
        centered
        size="md"
        className="forgot-password-modal"
      >
     {/* Header */}
    <Modal.Header closeButton className="border-0 pb-0">
      <Modal.Title className="fw-bold text-primary fs-4">
        🔐 Reset Your Password
      </Modal.Title>
    </Modal.Header>

      <Modal.Body className="pt-2">
      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="rounded-3 shadow-sm py-2 px-3 mb-3">
          {error}
        </Alert>
      )}

          {/* Step Indicator */}
          <div className="d-flex justify-content-between align-items-center mb-4 px-2">
            {["Verify Email", "Enter OTP", "New Password"].map((label, index) => {
              const stepNumber = index + 1;
              const active = step === stepNumber;
              const completed = step > stepNumber;
              return (
                <div
                  key={label}
                  className={`d-flex flex-column align-items-center flex-fill position-relative`}
                >
                  <div
                    className={`rounded-circle border d-flex align-items-center justify-content-center 
                      ${completed ? "bg-success text-white border-success" : active ? "bg-primary text-white border-primary" : "bg-light text-muted border-secondary"}
                    `}
                    style={{ width: 36, height: 36 }}
                  >
                    {completed ? <i className="bi bi-check-lg"></i> : stepNumber}
                  </div>
                  <small className={`mt-1 ${active ? "text-primary fw-semibold" : "text-muted"}`}>
                    {label}
                  </small>
                  {stepNumber < 3 && (
                    <div
                      className="position-absolute"
                      style={{
                        top: 18,
                        left: "calc(100% + 5px)",
                        width: "100%",
                        height: 2,
                        backgroundColor: completed ? "#198754" : "#dee2e6",
                        zIndex: -1
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step 1: Email */}
    {step === 1 && (
      <>
        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold">Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your registered email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            required
            className="shadow-sm"
          />
        </Form.Group>
        <Button variant="primary" onClick={handleForgotPassword} className="w-100 py-2 fw-semibold">
          Send OTP <i className="bi bi-send ms-1"></i>
        </Button>
      </>
    )}

    {/* Step 2: OTP */}
    {step === 2 && (
      <>
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">Verification Code</Form.Label>
          <div className="d-flex align-items-center">
            <Form.Control
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
              className="shadow-sm"
            />
            <Button variant="link" className="ms-2 p-0 text-primary fw-semibold" onClick={handleForgotPassword}>
              Resend OTP
            </Button>
          </div>
          <Form.Text className="text-muted">
            Check your email for the verification code.
          </Form.Text>
        </Form.Group>
        <Button variant="primary" onClick={verifyOtp} className="w-100 py-2 fw-semibold">
          Verify Code <i className="bi bi-check-circle ms-1"></i>
        </Button>
      </>
    )}

    {/* Step 3: New Password */}
    {step === 3 && (
      <>
        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold">New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
            required
            className="shadow-sm"
          />
          <Form.Text className="text-muted">Minimum 8 characters required</Form.Text>
        </Form.Group>
        <Button variant="success" onClick={resetPassword} className="w-100 py-2 fw-semibold">
          Reset Password <i className="bi bi-arrow-repeat ms-1"></i>
        </Button>
      </>
    )}
  </Modal.Body>
</Modal>

      </div>
    </div>
  );
};

export default LoginPage;
