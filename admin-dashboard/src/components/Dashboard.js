// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Header, StatsGrid, StatCard, LoadingContainer, ErrorMessage, Table } from './SharedStyles';
import { formatCurrency } from '../utils/format';

function Dashboard({ token }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const response = await axios.get('http://localhost:3000/api/dashboard/summary', { headers });
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard data. Please ensure you are an Administrator.');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  if (loading) return <LoadingContainer>Loading Dashboard...</LoadingContainer>;
  if (error) return <Container><ErrorMessage>{error}</ErrorMessage></Container>;
  if (!data) return null;

  return (
    <Container>
      <Header>
        <h2>Dashboard</h2>
      </Header>

      <StatsGrid>
        <StatCard variant="revenue"><h3>Total Revenue</h3><div className="value">{formatCurrency(data.totalRevenue)}</div></StatCard>
        <StatCard variant="profit"><h3>Total Profit</h3><div className="value">{formatCurrency(data.totalProfit)}</div></StatCard>
        <StatCard variant="success"><h3>Total Sales</h3><div className="value">{data.totalSales}</div></StatCard>
        <StatCard variant="warning"><h3>Total Clients</h3><div className="value">{data.totalClients}</div></StatCard>
      </StatsGrid>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div>
            <h3>Top 5 Selling Items</h3>
            <Table>
                <thead><tr><th>Item</th><th>Quantity Sold</th></tr></thead>
                <tbody>
                    {data.topSellingItems.map(item => (
                        <tr key={item.product_id}>
                            <td>{item.Inventory.name}</td>
                            <td>{item.totalQuantity}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
        <div>
            <h3>Low Stock Items</h3>
            <Table>
                <thead><tr><th>Item</th><th>Quantity Left</th></tr></thead>
                <tbody>
                    {data.lowStockItems.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
      </div>
    </Container>
  );
}

export default Dashboard;