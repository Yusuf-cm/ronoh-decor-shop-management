// src/components/ProjectManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Header, Table, Button, FormContainer, FormGroup, Input, Select, ErrorMessage, LoadingContainer } from './SharedStyles';

const EMPTY_PROJECT = { client_id: '', type: '', site_address: '', start_date: '', status: 'Planning' };

function ProjectManager({ token }) {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const [projectsRes, clientsRes] = await Promise.all([
          axios.get('http://localhost:3000/api/projects', { headers }),
          axios.get('http://localhost:3000/api/clients', { headers }),
        ]);
        setProjects(projectsRes.data);
        setClients(clientsRes.data);
      } catch (err) {
        setError('Failed to fetch project data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProject(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingProject) return;

    const isNew = !editingProject.id;
    const url = isNew ? 'http://localhost:3000/api/projects' : `http://localhost:3000/api/projects/${editingProject.id}`;
    const method = isNew ? 'post' : 'put';

    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      await axios[method](url, editingProject, { headers });
      
      const updatedProjectsRes = await axios.get('http://localhost:3000/api/projects', { headers });
      setProjects(updatedProjectsRes.data);

      setEditingProject(null); // Close form
    } catch (err) {
      setError('Failed to save project.');
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`http://localhost:3000/api/projects/${projectId}`, { headers: { 'Authorization': `Bearer ${token}` } });
        setProjects(prev => prev.filter(p => p.id !== projectId));
      } catch (err) {
        setError('Failed to delete project.');
      }
    }
  };

  if (loading) return <LoadingContainer>Loading Projects...</LoadingContainer>;

  return (
    <Container>
      <Header>
        <h2>Project Management</h2>
        <Button variant="success" onClick={() => setEditingProject(EMPTY_PROJECT)}>Add New Project</Button>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {editingProject && (
        <FormContainer onSubmit={handleSave}>
          <h3>{editingProject.id ? 'Edit Project' : 'Add New Project'}</h3>
          <FormGroup>
            <label>Client</label>
            <Select name="client_id" value={editingProject.client_id} onChange={handleInputChange} required>
              <option value="">Select a Client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </FormGroup>
          <FormGroup><label>Project Type</label><Input name="type" value={editingProject.type} onChange={handleInputChange} required /></FormGroup>
          <FormGroup><label>Site Address</label><Input name="site_address" value={editingProject.site_address} onChange={handleInputChange} required /></FormGroup>
          <FormGroup><label>Start Date</label><Input name="start_date" type="date" value={editingProject.start_date.split('T')[0]} onChange={handleInputChange} required /></FormGroup>
          <FormGroup><label>Status</label>
            <Select name="status" value={editingProject.status} onChange={handleInputChange}>
              <option value="Planning">Planning</option><option value="In Progress">In Progress</option><option value="Completed">Completed</option><option value="On Hold">On Hold</option>
            </Select>
          </FormGroup>
          <div>
            <Button type="submit" variant="primary">Save Project</Button>
            <Button type="button" variant="secondary" onClick={() => setEditingProject(null)}>Cancel</Button>
          </div>
        </FormContainer>
      )}

      <Table>
        <thead><tr><th>Client</th><th>Type</th><th>Address</th><th>Start Date</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {projects.map(p => (
            <tr key={p.id}>
              <td>{p.Client ? p.Client.name : 'N/A'}</td>
              <td>{p.type}</td>
              <td>{p.site_address}</td>
              <td>{new Date(p.start_date).toLocaleDateString()}</td>
              <td>{p.status}</td>
              <td>
                <Button variant="primary" onClick={() => setEditingProject(p)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(p.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default ProjectManager;