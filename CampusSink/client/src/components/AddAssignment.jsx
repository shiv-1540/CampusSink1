import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const AddAssignment = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [marks, setMarks] = useState(100);
  const [deadline, setDeadline] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      title,
      description: description || "No additional instructions",
      deadline,
      year,
      branch,
      file_url: file ? file.name : "", // Simulated; replace with actual uploaded file URL
      created_by: "teacher123", // Replace with actual teacher ID from auth context
      status: "active",
    };

    try {
      const response = await fetch("http://localhost:5000/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Assignment created successfully!");
        navigate("/teacher/dashboard");
      } else {
        alert("❌ Failed to create assignment: " + data.error);
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("❌ Network or server error!");
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <Sidebar />
      <Container className="py-4" style={{ marginTop: "20px" }}>
        <h3 className="mb-4" style={{ color: "#2c3e50", fontWeight: "600" }}>Create New Assignment</h3>

        <Card className="mb-4 p-4" style={{ border: "none", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <h5 className="mb-3" style={{ color: "#3498db" }}>📘 Assignment Details</h5>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label style={{ fontWeight: "500" }}>Title *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter assignment title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ borderRadius: "8px", padding: "10px" }}
            />
          </Form.Group>
          <Row>
            <Col md={4}>
              <Form.Group controlId="academicYear">
                <Form.Label style={{ fontWeight: "500" }}>Academic Year *</Form.Label>
                <Form.Select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  style={{ borderRadius: "8px", padding: "10px" }}
                >
                  <option value="">Select Year</option>
                  <option value="FE">FE</option>
                  <option value="SE">SE</option>
                  <option value="TE">TE</option>
                  <option value="BE">BE</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="branch">
                <Form.Label style={{ fontWeight: "500" }}>Branch *</Form.Label>
                <Form.Select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  style={{ borderRadius: "8px", padding: "10px" }}
                >
                  <option value="">Select Branch</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ENTC">ENTC</option>
                  <option value="Mechanical">Mechanical</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="marks">
                <Form.Label style={{ fontWeight: "500" }}>Total Marks</Form.Label>
                <Form.Control
                  type="number"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  placeholder="100"
                  style={{ borderRadius: "8px", padding: "10px" }}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card>

        <Card className="mb-4 p-4" style={{ border: "none", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <h5 className="mb-3" style={{ color: "#3498db" }}>🗓️ Deadline & Files</h5>
          <Row>
            <Col md={6}>
              <Form.Group controlId="deadline">
                <Form.Label style={{ fontWeight: "500" }}>Deadline *</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  style={{ borderRadius: "8px", padding: "10px" }}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="fileUpload">
                <Form.Label style={{ fontWeight: "500" }}>Assignment File</Form.Label>
                <div 
                  className="border p-4 text-center" 
                  style={{ 
                    cursor: "pointer", 
                    borderRadius: "8px",
                    border: "2px dashed #dee2e6",
                    transition: "all 0.3s",
                    backgroundColor: file ? "#e8f4fd" : "#f8f9fa"
                  }}
                >
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    style={{ display: "none" }}
                    id="fileInput"
                  />
                  <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
                    {file ? (
                      <div>
                        <p style={{ marginBottom: "5px", fontWeight: "500" }}>{file.name}</p>
                        <small className="text-success">Click to change file</small>
                      </div>
                    ) : (
                      <div>
                        <p style={{ marginBottom: "5px" }}>Click to upload or drag and drop</p>
                        <small className="text-muted">PDF, DOC, DOCX (MAX. 10MB)</small>
                      </div>
                    )}
                  </label>
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Card>

        <Card className="mb-4 p-4" style={{ border: "none", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <h5 className="mb-3" style={{ color: "#3498db" }}>📝 Additional Instructions</h5>
          <Form.Group controlId="description">
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Add any additional instructions, submission guidelines, or grading criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ borderRadius: "8px", padding: "10px" }}
            />
          </Form.Group>
        </Card>

        <div className="d-flex justify-content-end gap-3">
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate(-1)}
            style={{ 
              borderRadius: "8px", 
              padding: "8px 20px",
              fontWeight: "500"
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            style={{ 
              borderRadius: "8px", 
              padding: "8px 20px",
              fontWeight: "500",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}
          >
            📄 Create Assignment
          </Button>
        </div>
      </Container>

      <style>
        {`
          body {
            background-color: #f8f9fa !important;
          }
          .form-control:focus, .form-select:focus {
            border-color: #3498db;
            box-shadow: 0 0 0 0.25rem rgba(52, 152, 219, 0.25);
          }
          .btn-primary {
            background-color: #3498db;
            border-color: #3498db;
          }
          .btn-primary:hover {
            background-color: #2980b9;
            border-color: #2980b9;
          }
          .btn-outline-secondary:hover {
            background-color: #f8f9fa;
          }
        `}
      </style>
    </div>
  );
};

export default AddAssignment;