// src/components/SharedStyles.js
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.large};
  animation: ${fadeIn} 0.5s ease-out;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.large};
  padding-bottom: ${({ theme }) => theme.spacing.medium};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.small};
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;

  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  th {
    background-color: ${({ theme }) => theme.colors.light};
  }
  
  tbody tr:last-child td {
      border-bottom: none;
  }

  tbody tr:hover {
    background-color: #f9fafb;
  }
`;

export const Button = styled.button`
  padding: 8px 15px;
  border: 1px solid transparent;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  background-color: ${props => props.theme.colors[props.variant] || props.theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};

  &:hover {
    opacity: 0.85;
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.small};
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }

  & + & {
    margin-left: ${({ theme }) => theme.spacing.small};
  }
`;

export const FormContainer = styled.form`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.small};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  animation: ${fadeIn} 0.3s ease-out;
`;

export const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 5px;
  font-size: 14px;
  background-color: white;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

export const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  background-color: #ffebee;
  padding: 10px;
  border-radius: 5px;
  margin-top: 0;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
`;

// Dashboard Specific
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${({ theme }) => theme.spacing.large};
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

export const StatCard = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadows.small};
  position: relative;
  overflow: hidden;
  border-left: 5px solid ${props => props.theme.colors[props.variant] || '#ccc'};
  h3 {
    margin: 0 0 10px;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textLight};
    text-transform: uppercase;
  }
  .value {
    font-size: 32px;
    font-weight: 700;
  }
`;