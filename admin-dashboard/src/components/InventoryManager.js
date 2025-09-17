// src/components/InventoryManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Header, Table, Button, FormContainer, FormGroup, Input, Select, ErrorMessage, LoadingContainer } from './SharedStyles';

const EMPTY_ITEM = { name: '', sku: '', category: '', quantity: 0, unit_price: '', cost_price: '', supplier_id: '' };

function InventoryManager({ token }) {
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const [itemsRes, suppliersRes] = await Promise.all([
          axios.get('http://localhost:3000/api/inventory', { headers }),
          axios.get('http://localhost:3000/api/suppliers', { headers }),
        ]);
        setItems(itemsRes.data);
        setSuppliers(suppliersRes.data);
      } catch (err) {
        setError('Failed to fetch inventory data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    
    const isNew = !editingItem.id;
    const url = isNew ? 'http://localhost:3000/api/inventory' : `http://localhost:3000/api/inventory/${editingItem.id}`;
    const method = isNew ? 'post' : 'put';

    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      await axios[method](url, editingItem, { headers });
      
      const updatedItemsRes = await axios.get('http://localhost:3000/api/inventory', { headers });
      setItems(updatedItemsRes.data);
      
      setEditingItem(null); // Close form
    } catch (err) {
      setError('Failed to save item. Is the SKU unique?');
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:3000/api/inventory/${itemId}`, { headers: { 'Authorization': `Bearer ${token}` } });
        setItems(prev => prev.filter(item => item.id !== itemId));
      } catch (err) {
        setError('Failed to delete item.');
      }
    }
  };

  if (loading) return <LoadingContainer>Loading Inventory...</LoadingContainer>;

  return (
    <Container>
      <Header>
        <h2>Inventory Management</h2>
        <Button variant="success" onClick={() => setEditingItem(EMPTY_ITEM)}>Add New Item</Button>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {editingItem && (
        <FormContainer onSubmit={handleSave}>
          <h3>{editingItem.id ? 'Edit Item' : 'Add New Item'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormGroup><label>Name</label><Input name="name" value={editingItem.name} onChange={handleInputChange} required /></FormGroup>
            <FormGroup><label>SKU</label><Input name="sku" value={editingItem.sku} onChange={handleInputChange} required /></FormGroup>
            <FormGroup><label>Category</label><Input name="category" value={editingItem.category} onChange={handleInputChange} /></FormGroup>
            <FormGroup><label>Quantity</label><Input name="quantity" type="number" value={editingItem.quantity} onChange={handleInputChange} required /></FormGroup>
            <FormGroup><label>Selling Price (Ksh)</label><Input name="unit_price" type="number" step="0.01" value={editingItem.unit_price} onChange={handleInputChange} required /></FormGroup>
            <FormGroup><label>Cost Price (Ksh)</label><Input name="cost_price" type="number" step="0.01" value={editingItem.cost_price} onChange={handleInputChange} required /></FormGroup>
            <FormGroup><label>Supplier</label>
              <Select name="supplier_id" value={editingItem.supplier_id} onChange={handleInputChange} required>
                <option value="">Select a Supplier</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Select>
            </FormGroup>
          </div>
          <div>
            <Button type="submit" variant="primary">Save Item</Button>
            <Button type="button" variant="secondary" onClick={() => setEditingItem(null)}>Cancel</Button>
          </div>
        </FormContainer>
      )}

      <Table>
        <thead><tr><th>Name</th><th>SKU</th><th>Category</th><th>Qty</th><th>Price</th><th>Cost</th><th>Supplier</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.sku}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
              <td>{`Ksh ${parseFloat(item.unit_price).toFixed(2)}`}</td>
              <td>{`Ksh ${parseFloat(item.cost_price).toFixed(2)}`}</td>
              <td>{item.supplier ? item.supplier.name : 'N/A'}</td>
              <td>
                <Button variant="primary" onClick={() => setEditingItem(item)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default InventoryManager;