import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

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

      setUser(user); // Save user in React state

      return { token, user }; // Return token and user for use in Login component
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

      return response.data; // e.g. { message: "User registered successfully" }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('authToken'); // Optional: clear token on logout
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
