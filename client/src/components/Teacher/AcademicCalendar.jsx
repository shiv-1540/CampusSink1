import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Button, Form, Modal, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import TeachSidebar from "./TeacherSidebar";

const server = import.meta.env.VITE_BACKEND_URL;

const AcademicCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", type: "" });
  const [editEventId, setEditEventId] = useState(null);
  const [error, setError] = useState("");

  const eventTypes = [
    "Holiday",
    "Exam",
    "MSE",
    "ESE",
    "Freshers",
    "Days",
    "Orientation",
    "Seminar",
    "Workshop",
    "Placement Drive",
    "Industrial Visit",
    "Cultural Fest",
    "Technical Fest",
    "Farewell",
  ];

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token missing. Please log in again.");
        return;
      }

      const res = await axios.get(`${server}/api/academic-calendar`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setEvents(res.data || []);
      console.log("Fetched Events:", res.data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Failed to fetch events: " + err.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setFormData({ title: "", description: "", type: "" });
    setEditEventId(null);
    setShowModal(true);
    setError("");
  };

  const getLocalDateString = (date) => {
    const offset = date.getTimezoneOffset();
    const localTime = new Date(date.getTime() - offset * 60 * 1000);
    return localTime.toISOString().split("T")[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type) {
      setError("Please select an event type.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token missing. Please log in again.");
      return;
    }

    const payload = { ...formData, date: getLocalDateString(selectedDate) };

    try {
      if (editEventId) {
        await axios.put(`${server}/api/academic-calendar/${editEventId}`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire("Updated!", "Event updated successfully.", "success");
      } else {
        await axios.post(`${server}/api/academic-calendar`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire("Saved!", "Event added successfully.", "success");
      }
      setShowModal(false);
      setFormData({ title: "", description: "", type: "" });
      setEditEventId(null);
      setError("");
      fetchEvents();
    } catch (err) {
      console.error("Error saving event:", err);
      Swal.fire("Error", `Failed to ${editEventId ? "update" : "add"} event: ${err.message}`, "error");
    }
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      description: event.description,
      type: event.type,
    });
    setSelectedDate(new Date(event.date));
    setEditEventId(event.id);
    setShowModal(true);
    setError("");
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the event permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${server}/api/academic-calendar/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire("Deleted!", "Event removed.", "success");
        fetchEvents();
      } catch (err) {
        console.error("Failed to delete:", err);
        Swal.fire("Error", "Failed to delete event: " + err.message, "error");
      }
    }
  };

  const tileContent = ({ date }) => {
    const event = events.find((e) => new Date(e.date).toDateString() === date.toDateString());
    return event ? (
      <div className="calendar-event-indicator" title={`${event.title} - ${event.description}`}>
        <span className="event-dot" style={{ backgroundColor: getEventColor(event.type) }}></span>
      </div>
    ) : null;
  };

  const getEventColor = (type) => {
    const colors = {
      Holiday: "#e63946",
      Exam: "#457b9d",
      MSE: "#43aa8b",
      ESE: "#9b5de5",
      Freshers: "#f72585",
      Days: "#f9c74f",
      Orientation: "#90be6d",
      Seminar: "#118ab2",
      Workshop: "#277da1",
      "Placement Drive": "#f9844a",
      "Industrial Visit": "#43aa8b",
      "Cultural Fest": "#ff006e",
      "Technical Fest": "#8338ec",
      Farewell: "#ffbe0b",
    };
    return colors[type] || "#adb5bd";
  };

  const tileClassName = ({ date }) => {
    return events.find((e) => new Date(e.date).toDateString() === date.toDateString()) ? "has-event" : "";
  };

  return (
    <div className="maincontainer flex min-h-screen bg-gray-100">
      <TeachSidebar />
      <div className="container flex-grow">
        <h4 className="mb-4 text-center text-3xl font-extrabold text-gray-800">📅 Academic Calendar</h4>
        {error && <div className="alert alert-danger text-center">{error}</div>}

        <Calendar
          value={selectedDate}
          onClickDay={handleDateClick}
          tileContent={tileContent}
          tileClassName={tileClassName}
        />

        <Table striped bordered hover responsive className="event-table mt-4">
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Description</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-500">
                  No events found.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id}>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.title}</td>
                  <td>{event.description}</td>
                  <td>
                    <span
                      className="event-type-badge"
                      style={{ backgroundColor: getEventColor(event.type) }}
                    >
                      {event.type}
                    </span>
                  </td>
                  <td>
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={() => handleEdit(event)}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(event.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{editEventId ? "Edit Event" : "Add Academic Event"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Event Title *</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter event title"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter event description"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Event Type *</Form.Label>
                <Form.Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="">Select Event Type</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button variant="secondary" onClick={() => setShowModal(false)} className="me-2">
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {editEventId ? "Update Event" : "Add Event"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        <style jsx>{`
          .academic-calendar-container {
            padding: 24px;
            min-height: 100vh;
            background: linear-gradient(to bottom right, #f0f4f8, #d6e4f0);
          }
          .react-calendar {
            width: 100%;
            max-width: 850px;
            margin: 0 auto;
            border: none;
            border-radius: 16px;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
            padding: 20px;
            background: #ffffff;
          }
          .react-calendar__navigation button {
            font-weight: 600;
            color: #2a4365;
          }
          .react-calendar__tile--active {
            background: #2b6cb0;
            color: white;
            border-radius: 10px;
          }
          .calendar-event-indicator {
            display: flex;
            justify-content: center;
            margin-top: 4px;
          }
          .event-dot {
            height: 10px;
            width: 10px;
            border-radius: 50%;
            display: inline-block;
          }
          .has-event {
            border: 2px solid #2b6cb0;
            border-radius: 10px;
          }
          .event-table th {
            background-color: #2b6cb0;
            color: white;
          }
          .event-type-badge {
            padding: 4px 10px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 600;
            color: white;
          }
          .modal-content {
            border-radius: 16px;
          }
        `}</style>
      </div>
    </div>
  );
};

export default AcademicCalendar;