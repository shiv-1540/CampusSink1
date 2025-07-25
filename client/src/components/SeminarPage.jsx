// SEMINAR FRONTEND PAGE (React)
import React, { useEffect, useState } from 'react';

import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import TeachSidebar from './Teacher/TeacherSidebar';
const server= import.meta.env.VITE_BACKEND_URL;

const SeminarPage = () => {
  const [seminars, setSeminars] = useState([]);
  const [msg, setMsg] = useState('');
  const [show, setShow] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', datetime: '',
    venue: '', speaker: '', branch: '', year: '',
    mode: 'offline', link: ''
  });

const fetchSeminars = () => {
  const token = localStorage.getItem('token'); // ✅ make sure token is defined

  axios.get(`${server}/api/seminars`, {
    headers: {
      'Content-Type': 'application/json', // ✅ correct casing
      'Authorization': `Bearer ${token}`
    }
  })
  .then(res => setSeminars(res.data))
  .catch(err => {
    console.error('Failed to fetch seminars:', err);
  });
};


  useEffect(fetchSeminars, []);

  const resetForm = () => {
    setForm({
      title: '', description: '', datetime: '',
      venue: '', speaker: '', branch: '', year: '',
      mode: 'offline', link: ''
    });
    setEditingId(null);
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

const handleSave = async () => {
  const token = localStorage.getItem('token');

  const payload = {
    ...form,
    link: form.mode === 'online' ? form.link : '',
  };

  try {
    let response;

    if (editingId) {
      response = await axios.put(
        `${server}/api/seminars/${editingId}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
    } else {
      response = await axios.post(
        `${server}/api/seminars`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
    }

    setMsg(editingId ? '✅ Seminar updated!' : '✅ Seminar added!');
    setShow(false);
    fetchSeminars(); // Refresh list
    resetForm();     // Clear form

  } catch (error) {
    console.error("❌ Seminar save failed:", error);
    const errorMsg = error.response?.data?.error || 'Error saving seminar';
    setMsg("❌ " + errorMsg);
  }
};


  const handleEdit = (s) => {
    setEditingId(s.id);
    setForm({
      title: s.title, description: s.description,
      datetime: s.datetime.slice(0, 16), // input type="datetime-local" expects YYYY-MM-DDTHH:mm
      venue: s.venue, speaker: s.speaker,
      branch: s.branch, year: s.year,
      mode: s.mode, link: s.link || ''
    });
    setShow(true);
  };

  
const handleDelete = async (id) => {
  const token = localStorage.getItem('token');

  if (!window.confirm("Are you sure you want to delete this seminar?")) return;

  try {
    await axios.delete(`${server}/api/seminars/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    setMsg('✅ Seminar deleted!');
    fetchSeminars(); // Refresh list

  } catch (error) {
    console.error("❌ Delete error:", error);
    const errMsg = error.response?.data?.error || 'Error deleting seminar';
    setMsg("❌ " + errMsg);
  }
};


  return (
    <div className="d-flex">
         <div className="w-64 fixed top-0 left-0 h-full z-10">
          <TeachSidebar/>
        </div>

      <div className="flex-grow ml-64 p-6 bg-gray-100 min-h-screen">
        <div className="d-flex justify-content-between mb-3">
          <div>
            <h2 className="fw-bold">Seminars</h2>
            <p className="text-muted">Add, edit, or delete seminar records</p>
          </div>

          <Button onClick={() => { resetForm(); setShow(true); }}  className='m-4 '>+ Add Seminar</Button>
        </div>

        {msg && <Alert variant="info" onClose={() => setMsg('')} dismissible>{msg}</Alert>}

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Date & Time</th>
                <th>Venue</th>
                <th>Speaker</th>
                <th>Branch</th>
                <th>Year</th>
                <th>Mode</th>
                <th>Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {seminars.length > 0 ? seminars.map(s => (
                <tr key={s.id}>
                  <td>{s.title}</td>
                  <td>{s.description}</td>
                  <td>{formatDateTime(s.datetime)}</td>
                  <td>{s.venue}</td>
                  <td>{s.speaker}</td>
                  <td>{s.branch}</td>
                  <td>{s.year}</td>
                  <td>{s.mode}</td>
                  <td>{s.mode === 'online' ? <a href={`https://${s.link}`} target="_blank" rel="noreferrer">Join</a> : '-'}</td>
                  <td>
                    <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleEdit(s)}>Edit</Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(s.id)}>Delete</Button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="10" className="text-center text-muted">No seminars found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit Seminar' : 'Add Seminar'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {['title', 'description', 'venue', 'speaker', 'branch', 'year'].map(field => (
              <Form.Group key={field} className="mb-2">
                <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                <Form.Control
                  type="text"
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                />
              </Form.Group>
            ))}
            <Form.Group className="mb-2">
              <Form.Label>Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={form.datetime}
                onChange={(e) => setForm({ ...form, datetime: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Mode</Form.Label>
              <Form.Select
                value={form.mode}
                onChange={(e) => setForm({ ...form, mode: e.target.value })}
              >
                <option value="offline">Offline</option>
                <option value="online">Online</option>
              </Form.Select>
            </Form.Group>
            {form.mode === 'online' && (
              <Form.Group className="mb-2">
                <Form.Label>Online Link</Form.Label>
                <Form.Control
                  type="url"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>{editingId ? 'Update' : 'Save'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SeminarPage;
