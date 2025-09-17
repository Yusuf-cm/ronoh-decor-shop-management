// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Button, Input, FormGroup, ErrorMessage } from './SharedStyles';

const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.light};
`;

const LoginForm = styled.form`
  width: 400px;
  padding: ${({ theme }) => theme.spacing.xlarge};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.medium};

  h2 {
    text-align: center;
    margin-bottom: ${({ theme }) => theme.spacing.large};
  }
`;

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      onLoginSuccess(response.data.token);
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginWrapper>
      <LoginForm onSubmit={handleLogin}>
        <h2>Admin Login</h2>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <FormGroup>
          <label htmlFor="email">Email</label>
          <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </FormGroup>
        <FormGroup>
          <label htmlFor="password">Password</label>
          <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </FormGroup>
        <Button type="submit" variant="primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </LoginForm>
    </LoginWrapper>
  );
}

export default Login;