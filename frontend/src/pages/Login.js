import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoginLayout from '../components/Login'; // Assuming this is correct path to your LoginLayout component

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // <--- ADD THIS LINE to manage login errors
  const navigate = useNavigate();

  // Make sure to accept the 'event' parameter (e) and prevent default form submission
  const handleLogin = async (e) => { // <--- ADD '(e)' here
    e.preventDefault(); // <--- ADD THIS LINE to prevent default form refresh
    setError(''); // Clear previous errors

    try {
      // 1. Await the response from the backend
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      // 2. Access the data sent by your backend
      const userData = response.data;

      // 3. Check if userId exists in the data and save it to sessionStorage
      if (userData && userData.userId) {
        sessionStorage.setItem('userId', userData.userId);
        sessionStorage.setItem('firstName', userData.firstName); // As per your auth.js backend
        sessionStorage.setItem('lastName', userData.lastName);   // As per your auth.js backend
        sessionStorage.setItem('email', userData.email);         // As per your auth.js backend

        navigate('/dashboard'); // Redirect to dashboard after successful login
      } else {
        // This case should ideally not happen if backend is correct, but good for debugging
        setError('Login successful, but user details were incomplete from server.');
      }

    } catch (err) {
      // Improve error handling: show specific error message from backend if available
      console.error('Login failed:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <LoginLayout
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleLogin={handleLogin}
      error={error} // <--- PASS THE ERROR STATE TO YOUR LAYOUT COMPONENT
    />
  );
}

export default Login;