// src/components/SupplierManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Header, Table, Button, FormContainer, FormGroup, Input, ErrorMessage, LoadingContainer } from './SharedStyles';

const EMPTY_SUPPLIER = { name: '', contact: '', lead_time_days: '' };

function SupplierManager({ token }) {
  const [suppliers, setSuppliers] = useState([]);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const response = await axios.get('http://localhost:3000/api/suppliers', { headers });
        setSuppliers(response.data);
      } catch (err) {
        setError('Failed to fetch suppliers.');
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, [token]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingSupplier(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingSupplier) return;

    const isNew = !editingSupplier.id;
    const url = isNew ? 'http://localhost:3000/api/suppliers' : `http://localhost:3000/api/suppliers/${editingSupplier.id}`;
    const method = isNew ? 'post' : 'put';
    
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const response = await axios[method](url, editingSupplier, { headers });
      
      if (isNew) {
        setSuppliers(prev => [...prev, response.data]);
      } else {
        setSuppliers(prev => prev.map(s => s.id === editingSupplier.id ? response.data : s));
      }
      setEditingSupplier(null); // Close form
    } catch (err) {
      setError('Failed to save supplier. Is the name unique?');
    }
  };

  const handleDelete = async (supplierId) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await axios.delete(`http://localhost:3000/api/suppliers/${supplierId}`, { headers: { 'Authorization': `Bearer ${token}` } });
        setSuppliers(prev => prev.filter(s => s.id !== supplierId));
      } catch (err) {
        setError('Failed to delete supplier.');
      }
    }
  };

  if (loading) return <LoadingContainer>Loading Suppliers...</LoadingContainer>;

  return (
    <Container>
      <Header>
        <h2>Supplier Management</h2>
        <Button variant="success" onClick={() => setEditingSupplier(EMPTY_SUPPLIER)}>Add New Supplier</Button>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {editingSupplier && (
        <FormContainer onSubmit={handleSave}>
          <h3>{editingSupplier.id ? 'Edit Supplier' : 'Add New Supplier'}</h3>
          <FormGroup>
            <label>Name</label>
            <Input name="name" value={editingSupplier.name} onChange={handleInputChange} required />
          </FormGroup>
          <FormGroup>
            <label>Contact</label>
            <Input name="contact" value={editingSupplier.contact} onChange={handleInputChange} required />
          </FormGroup>
          <FormGroup>
            <label>Lead Time (days)</label>
            <Input name="lead_time_days" type="number" value={editingSupplier.lead_time_days} onChange={handleInputChange} />
          </FormGroup>
          <div>
            <Button type="submit" variant="primary">Save Supplier</Button>
            <Button type="button" variant="secondary" onClick={() => setEditingSupplier(null)}>Cancel</Button>
          </div>
        </FormContainer>
      )}

      <Table>
        <thead>
          <tr><th>Name</th><th>Contact</th><th>Lead Time (days)</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {suppliers.map(supplier => (
            <tr key={supplier.id}>
              <td>{supplier.name}</td>
              <td>{supplier.contact}</td>
              <td>{supplier.lead_time_days}</td>
              <td>
                <Button variant="primary" onClick={() => setEditingSupplier(supplier)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(supplier.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default SupplierManager;