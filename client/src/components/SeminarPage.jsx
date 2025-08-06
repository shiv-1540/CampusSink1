import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import TeachSidebar from './Teacher/TeacherSidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const server = import.meta.env.VITE_BACKEND_URL;

const SeminarPage = () => {
  const [seminars, setSeminars] = useState([]);
  const [show, setShow] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', datetime: '',
    venue: '', speaker: '', branch: '', year: '',
    mode: 'offline', link: ''
  });

  const fetchSeminars = () => {
    const token = localStorage.getItem('token');
    axios.get(`${server}/api/seminars`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => setSeminars(res.data))
    .catch(() => toast.error('❌ Failed to fetch seminars'));
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

  const formatDateTime = (iso) => new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
  });

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const payload = { ...form, link: form.mode === 'online' ? form.link : '' };

    try {
      if (editingId) {
        await axios.put(`${server}/api/seminars/${editingId}`, payload, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        toast.success('✅ Seminar updated!');
      } else {
        await axios.post(`${server}/api/seminars`, payload, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        toast.success('✅ Seminar added!');
      }
      fetchSeminars();
      resetForm();
      setShow(false);
    } catch (error) {
      toast.error('❌ ' + (error?.response?.data?.error || 'Error saving seminar'));
    }
  };

  const handleEdit = (s) => {
    setEditingId(s.id);
    setForm({ ...s, datetime: s.datetime.slice(0, 16), link: s.link || '' });
    setShow(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Delete this seminar?')) return;
    try {
      await axios.delete(`${server}/api/seminars/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success('✅ Seminar deleted!');
      fetchSeminars();
    } catch (err) {
      toast.error('❌ ' + (err?.response?.data?.error || 'Error deleting'));
    }
  };

  return (
    <div className="flex font-poppins bg-sky-50 min-h-screen text-gray-900">
      <ToastContainer />
      <div className="w-64 fixed top-0 left-0 h-full z-10 bg-indigo-100 shadow-xl">
        <TeachSidebar />
      </div>

      <div className="flex-grow ml-64 p-6 w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-indigo-900">🎓 Seminars</h2>
            <p className="text-sm text-indigo-600">Manage seminars - add, edit, delete</p>
          </div>
          <button
            onClick={() => { resetForm(); setShow(true); }}
            className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition"
          >
            ➕ Add Seminar
          </button>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="min-w-full table-auto">
            <thead className="bg-indigo-600 text-white">
              <tr>
                {['Title', 'Description', 'Date & Time', 'Venue', 'Speaker', 'Branch', 'Year', 'Mode', 'Link', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-sm font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {seminars.length > 0 ? seminars.map(s => (
                <tr key={s.id} className="border-b hover:bg-indigo-50">
                  <td className="px-4 py-2">{s.title}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{s.description}</td>
                  <td className="px-4 py-2 text-sm">{formatDateTime(s.datetime)}</td>
                  <td className="px-4 py-2">{s.venue}</td>
                  <td className="px-4 py-2">{s.speaker}</td>
                  <td className="px-4 py-2">{s.branch}</td>
                  <td className="px-4 py-2">{s.year}</td>
                  <td className="px-4 py-2">{s.mode}</td>
                  <td className="px-4 py-2">
                    {s.mode === 'online' ? <a href={s.link} className="text-indigo-600 underline" target="_blank">Join</a> : '-'}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button onClick={() => handleEdit(s)} className="text-sm text-yellow-700 bg-yellow-200 px-2 py-1 rounded hover:bg-yellow-300">Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="text-sm text-red-700 bg-red-200 px-2 py-1 rounded hover:bg-red-300">Delete</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="10" className="text-center py-4 text-gray-500">No seminars found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <Modal show={show} onHide={() => setShow(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{editingId ? 'Edit Seminar' : 'Add Seminar'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {['title', 'description', 'venue', 'speaker', 'branch', 'year'].map(f => (
                <Form.Group key={f} className="mb-2">
                  <Form.Label>{f.charAt(0).toUpperCase() + f.slice(1)}</Form.Label>
                  <Form.Control
                    type="text"
                    value={form[f]}
                    onChange={(e) => setForm({ ...form, [f]: e.target.value })}
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
                  <Form.Label>Link</Form.Label>
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
    </div>
  );
};

export default SeminarPage;