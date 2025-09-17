// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { GlobalStyle } from './GlobalStyle';
import styled from 'styled-components';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ClientManager from './components/ClientManager';
import InventoryManager from './components/InventoryManager';
import SupplierManager from './components/SupplierManager';
import ProjectManager from './components/ProjectManager';
import { Button } from './components/SharedStyles';

const AppWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 240px;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.large};
  display: flex;
  flex-direction: column;

  h1 {
    color: ${({ theme }) => theme.colors.white};
    font-size: 24px;
    margin-bottom: ${({ theme }) => theme.spacing.xlarge};
    text-align: center;
  }
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  a {
    text-decoration: none;
    color: #bdc3c7;
    font-weight: 500;
    padding: 15px;
    border-radius: ${({ theme }) => theme.borderRadius};
    margin-bottom: ${({ theme }) => theme.spacing.small};
    transition: all 0.2s;

    &:hover {
      background-color: ${({ theme }) => theme.colors.dark};
      color: ${({ theme }) => theme.colors.white};
    }

    &.active {
      background-color: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.white};
    }
  }
`;

const MainContent = styled.main`
  flex-grow: 1;
  background-color: ${({ theme }) => theme.colors.light};
`;

const HeaderBar = styled.header`
  padding: 0 ${({ theme }) => theme.spacing.large};
  height: 70px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) setToken(storedToken);
    setLoading(false);
  }, []);

  const handleLoginSuccess = (receivedToken) => {
    localStorage.setItem('authToken', receivedToken);
    setToken(receivedToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
  };
  
  if (loading) return <div>Loading Application...</div>;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {!token ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <AppWrapper>
          <Sidebar>
            <h1>Ronohs Decor</h1>
            <Nav>
              <NavLink to="/">Dashboard</NavLink>
              <NavLink to="/clients">Clients</NavLink>
              <NavLink to="/inventory">Inventory</NavLink>
              <NavLink to="/suppliers">Suppliers</NavLink>
              <NavLink to="/projects">Projects</NavLink>
            </Nav>
          </Sidebar>
          <MainContent>
            <HeaderBar>
                <Button variant="danger" onClick={handleLogout}>Logout</Button>
            </HeaderBar>
            <Routes>
              <Route path="/" element={<Dashboard token={token} />} />
              <Route path="/clients" element={<ClientManager token={token} />} />
              <Route path="/inventory" element={<InventoryManager token={token} />} />
              <Route path="/suppliers" element={<SupplierManager token={token} />} />
              <Route path="/projects" element={<ProjectManager token={token} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </MainContent>
        </AppWrapper>
      )}
    </ThemeProvider>
  );
}

export default App;