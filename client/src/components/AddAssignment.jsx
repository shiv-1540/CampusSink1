// src/components/AddAssignment.jsx
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
import Sidebar from "./Sidebar"; // ensure you have this component or create it based on your sidebar code

const AddAssignment = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [marks, setMarks] = useState(100);
  const [deadline, setDeadline] = useState("");
  const [file, setFile] = useState(null);
  const [instructions, setInstructions] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, you can handle file upload and form submission logic
    alert("Assignment created successfully!");
    navigate("/teacher/dashboard");
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <Container className="my-4">
        <h3 className="mb-4">Create New Assignment</h3>

        <Card className="mb-4 p-4">
          <h5 className="mb-3">🎯 Target Audience</h5>
          <Row>
            <Col md={4}>
              <Form.Group controlId="academicYear">
                <Form.Label>Academic Year *</Form.Label>
                <Form.Select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
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
                <Form.Label>Branch *</Form.Label>
                <Form.Select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
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
                <Form.Label>Total Marks</Form.Label>
                <Form.Control
                  type="number"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  placeholder="100"
                />
              </Form.Group>
            </Col>
          </Row>
        </Card>

        <Card className="mb-4 p-4">
          <h5 className="mb-3">🗓️ Deadline & Files</h5>
          <Row>
            <Col md={6}>
              <Form.Group controlId="deadline">
                <Form.Label>Deadline *</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="fileUpload">
                <Form.Label>Assignment File</Form.Label>
                <div className="border p-4 text-center" style={{ cursor: "pointer" }}>
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                  />
                  <div className="mt-2 text-muted">
                    Click to upload or drag and drop<br />
                    <small>PDF, DOC, DOCX (MAX. 10MB)</small>
                  </div>
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Card>

        <Card className="mb-4 p-4">
          <h5 className="mb-3">📝 Additional Instructions</h5>
          <Form.Group controlId="instructions">
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Add any additional instructions, submission guidelines, or grading criteria..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </Form.Group>
        </Card>

        <div className="d-flex justify-content-end gap-3">
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>
            📄 Create Assignment
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default AddAssignment;
