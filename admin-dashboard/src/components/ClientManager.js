// src/components/ClientManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Header, Table, Button, FormContainer, FormGroup, Input, Select, ErrorMessage, LoadingContainer } from './SharedStyles';

const EMPTY_CLIENT = { name: '', contact: '', address: '', type: 'Residential' };

function ClientManager({ token }) {
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null); // Can be a new client object or an existing one
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const response = await axios.get('http://localhost:3000/api/clients', { headers });
        setClients(response.data);
      } catch (err) {
        setError('Failed to fetch clients.');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingClient(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingClient) return;

    const isNew = !editingClient.id;
    const url = isNew ? 'http://localhost:3000/api/clients' : `http://localhost:3000/api/clients/${editingClient.id}`;
    const method = isNew ? 'post' : 'put';
    
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const response = await axios[method](url, editingClient, { headers });
      
      if (isNew) {
        setClients(prev => [...prev, response.data]);
      } else {
        setClients(prev => prev.map(c => c.id === editingClient.id ? response.data : c));
      }
      setEditingClient(null); // Close form
    } catch (err) {
      setError('Failed to save client. Is the contact info unique?');
    }
  };

  const handleDelete = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await axios.delete(`http://localhost:3000/api/clients/${clientId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setClients(prev => prev.filter(c => c.id !== clientId));
      } catch (err) {
        setError('Failed to delete client.');
      }
    }
  };

  if (loading) return <LoadingContainer>Loading Clients...</LoadingContainer>;

  return (
    <Container>
      <Header>
        <h2>Client Management</h2>
        <Button variant="success" onClick={() => setEditingClient(EMPTY_CLIENT)}>Add New Client</Button>
      </Header>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {editingClient && (
        <FormContainer onSubmit={handleSave}>
          <h3>{editingClient.id ? 'Edit Client' : 'Add New Client'}</h3>
          <FormGroup>
            <label>Name</label>
            <Input name="name" value={editingClient.name} onChange={handleInputChange} required />
          </FormGroup>
          <FormGroup>
            <label>Contact</label>
            <Input name="contact" value={editingClient.contact} onChange={handleInputChange} required />
          </FormGroup>
          <FormGroup>
            <label>Address</label>
            <Input name="address" value={editingClient.address} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <label>Type</label>
            <Select name="type" value={editingClient.type} onChange={handleInputChange}>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
            </Select>
          </FormGroup>
          <div>
            <Button type="submit" variant="primary">Save Client</Button>
            <Button type="button" variant="secondary" onClick={() => setEditingClient(null)}>Cancel</Button>
          </div>
        </FormContainer>
      )}

      <Table>
        <thead>
          <tr><th>Name</th><th>Contact</th><th>Address</th><th>Type</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id}>
              <td>{client.name}</td>
              <td>{client.contact}</td>
              <td>{client.address}</td>
              <td>{client.type}</td>
              <td>
                <Button variant="primary" onClick={() => setEditingClient(client)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(client.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default ClientManager;