import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Save user and token to localStorage on login
  async function login({ email, password }) {
    try {
      const response = await axios.post('http://localhost:3001/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error('Invalid login response');
      }

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      return { token, user };
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  }

  async function register({ name, email, phone, address, gender, password }) {
    try {
      const response = await axios.post('http://localhost:3001/auth/register', {
        name,
        email,
        phone,
        address,
        gender,
        password,
      });

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
