import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const SeminarPage = () => {
  const [seminars, setSeminars] = useState([]);
  const [msg, setMsg] = useState('');
  const [show, setShow] = useState(false);
  const [editingId, setEditingId] = useState(null); // null means create mode
  const [form, setForm] = useState({
    title: '', description: '', datetime: '',
    venue: '', speaker: '', branch: '', year: '',
    mode: 'offline', link: ''
  });

  const fetchSeminars = () => {
    axios.get('http://localhost:5000/api/seminars')
      .then(res => setSeminars(res.data))
      .catch(console.error);
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

  const formatAMPM = (isoTimeStr) => {
    const date = new Date(`1970-01-01T${isoTimeStr}`);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleSave = () => {
    const datetimeObj = new Date(form.datetime);
    const date = datetimeObj.toISOString().split('T')[0];
    const time = datetimeObj.toTimeString().split(' ')[0];

    const payload = {
      title: form.title,
      description: form.description,
      date,
      time,
      venue: form.venue,
      speaker: form.speaker,
      branch: form.branch,
      year: form.year,
      mode: form.mode,
      link: form.mode === 'online' ? form.link : ''
    };

    const request = editingId
      ? axios.put(`http://localhost:5000/api/seminars/${editingId}`, payload)
      : axios.post('http://localhost:5000/api/seminars', payload);

    request.then(() => {
      setMsg(editingId ? 'Seminar updated!' : 'Seminar added!');
      setShow(false);
      fetchSeminars();
      resetForm();
    }).catch(() => setMsg('Error saving seminar'));
  };

  const handleEdit = (seminar) => {
    setEditingId(seminar.id);
    setForm({
      title: seminar.title,
      description: seminar.description,
      datetime: `${seminar.date}T${seminar.time}`,
      venue: seminar.venue,
      speaker: seminar.speaker,
      branch: seminar.branch,
      year: seminar.year,
      mode: seminar.mode,
      link: seminar.link || ''
    });
    setShow(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this seminar?")) return;
    axios.delete(`http://localhost:5000/api/seminars/${id}`)
      .then(() => {
        setMsg('Seminar deleted!');
        fetchSeminars();
      })
      .catch(() => setMsg('Error deleting seminar'));
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between mb-3">
          <div>
            <h2 className="fw-bold">Seminars</h2>
            <p className="text-muted">Add, edit, or delete seminar records</p>
          </div>
          <Button onClick={() => { resetForm(); setShow(true); }}>+ Add Seminar</Button>
        </div>

        {msg && <Alert variant="info" onClose={() => setMsg('')} dismissible>{msg}</Alert>}

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Date</th>
                <th>Time</th>
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
                  <td>{s.date}</td>
                  <td>{formatAMPM(s.time)}</td>
                  <td>{s.venue}</td>
                  <td>{s.speaker}</td>
                  <td>{s.branch}</td>
                  <td>{s.year}</td>
                  <td>{s.mode}</td>
                  <td>
                    {s.mode === 'online'
                      ? <a href={s.link} target="_blank" rel="noreferrer">Join</a>
                      : '-'}
                  </td>
                  <td>
                    <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleEdit(s)}>Edit</Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(s.id)}>Delete</Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="11" className="text-center text-muted">No seminars found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
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
                  name={field}
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
                name="mode"
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
                  name="link"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>
            {editingId ? 'Update' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SeminarPage;
