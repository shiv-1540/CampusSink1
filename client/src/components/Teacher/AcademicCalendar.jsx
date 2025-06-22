import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Button, Form, Modal, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import TeachSidebar from "./TeacherSidebar";
const server= import.meta.env.VITE_BACKEND_URL;

const AcademicCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", type: "" });
  const [editEventId, setEditEventId] = useState(null);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${server}/api/academic-calendar`);
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch events", err);
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
  };

  const getLocalDateString = (date) => {
    const offset = date.getTimezoneOffset();
    const localTime = new Date(date.getTime() - offset * 60 * 1000);
    return localTime.toISOString().split("T")[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      date: getLocalDateString(selectedDate),
    };

    try {
      if (editEventId) {
        await axios.put(`${server}/api/academic-calendar/${editEventId}`, payload);
        Swal.fire("Updated!", "Event updated successfully.", "success");
      } else {
        await axios.post(`${server}/api/academic-calendar`, payload);
        Swal.fire("Saved!", "Event added successfully.", "success");
      }
      setShowModal(false);
      setFormData({ title: "", description: "", type: "" });
      setEditEventId(null);
      fetchEvents();
    } catch (err) {
      console.error("Error saving event", err);
      Swal.fire("Error", "Something went wrong!", "error");
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
        await axios.delete(`${server}/api/academic-calendar/${id}`);
        Swal.fire("Deleted!", "Event removed.", "success");
        fetchEvents();
      } catch (err) {
        console.error("Failed to delete", err);
        Swal.fire("Error", "Failed to delete event", "error");
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
  switch (type) {
    case "Holiday": return "#f94144";          // Red
    case "Exam": return "#577590";             // Blue-gray
    case "MSE": return "#43aa8b";              // Green
    case "ESE": return "#9b5de5";              // Purple
    case "Freshers": return "#f72585";         // Pink
    case "Days": return "#f9c74f";             // Yellow
    case "Orientation": return "#90be6d";      // Olive Green
    case "Seminar": return "#577590";          // Blue-gray
    case "Workshop": return "#277da1";         // Deep Blue
    case "Placement Drive": return "#f9844a";  // Orange
    case "Industrial Visit": return "#43aa8b"; // Teal
    case "Cultural Fest": return "#ff006e";    // Bright Pink
    case "Technical Fest": return "#8338ec";   // Indigo
    case "Farewell": return "#ffbe0b";         // Golden Yellow
    default: return "#adb5bd";                 // Light Gray for unknown
  }
};


  const tileClassName = ({ date }) => {
    return events.find((e) => new Date(e.date).toDateString() === date.toDateString())
      ? "has-event"
      : "";
  };

  return (
    <div className="d-flex">
      {/* ✅ Teacher Sidebar shown on the left */}
       <TeachSidebar/>

      {/* ✅ Main calendar container */}
      <div className=" ml-64 academic-calendar-container flex-grow-1">
        <style>{`
          .academic-calendar-container {
            padding: 20px;
            min-height: 100vh;
            background-color:rgb(49, 206, 206);
          }

          .react-calendar {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid rgb(28, 94, 159);
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(74, 16, 16, 0.1);
            padding: 10px;
            background: rgb(5, 56, 65);
          }

          .react-calendar__navigation button {
            min-width: 44px;
            background: none;
            font-size: 16px;
            margin-top: 8px;
          }

          .react-calendar__month-view__weekdays {
            text-align: center;
            text-transform: uppercase;
            font-weight: bold;
            font-size: 0.8em;
          }

          .react-calendar__month-view__days__day--weekend {
            color: #d10000;
          }

          .react-calendar__tile--now {
            background: #e6f7ff;
          }

          .react-calendar__tile--active {
            background: #006edc;
            color: white;
          }

          .calendar-event-indicator {
            display: flex;
            justify-content: center;
            margin-top: 2px;
          }

          .event-dot {
            height: 8px;
            width: 8px;
            border-radius: 50%;
            display: inline-block;
          }

          .has-event {
            background-color:rgb(133, 174, 210);
            border-radius: 50%;
          }

          .event-table {
            margin-top: 30px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
          }

          .event-table th {
            background-color: #343a40;
            color: white;
          }

          .event-type-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            color: white;
          }

          .modal-content {
            border-radius: 10px;
          }

          .form-control, .form-select {
            border-radius: 5px;
          }

          .btn-sm {
            padding: 0.25rem 0.5rem;
            font-size: 0.875rem;
          }
        `}</style>

        <h4 className="mb-4 text-center">📅 Academic Calendar</h4>

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
            {events.map((event) => (
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
                  <Button variant="warning" size="sm" onClick={() => handleEdit(event)} className="me-2">
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(event.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{editEventId ? "Edit Event" : "Add Academic Event"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
                  <option value="">Select Type</option>

                  {/* Academic Events */}
                  <option value="Exam">Exam</option>
                  <option value="MSE">MSE (Mid Sem Exam)</option>
                  <option value="ESE">ESE (End Sem Exam)</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Orientation">Orientation</option>
                  <option value="Project Submission">Project Submission</option>

                  {/* Campus Life */}
                  <option value="Freshers">Freshers</option>
                  <option value="Farewell">Farewell</option>
                  <option value="Days">College Days (Traditional, Tie Day, etc.)</option>
                  <option value="Cultural Fest">Cultural Fest</option>
                  <option value="Technical Fest">Technical Fest</option>
                  <option value="Industrial Visit">Industrial Visit</option>

                  {/* Career */}
                  <option value="Placement Drive">Placement Drive</option>

                  {/* Holiday */}
                  <option value="Holiday">Holiday</option>
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
      </div>
    </div>
  );
};

export default AcademicCalendar;
