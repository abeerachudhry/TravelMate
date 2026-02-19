import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import BookingPage from './pages/BookingPage'; // New Import
import MyBookings from './pages/MyBookings';   // New Import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/book/:type/:id" element={<BookingPage />} /> {/* New Route */}
        <Route path="/my-bookings" element={<MyBookings />} />     {/* New Route */}
      </Routes>
    </Router>
  );
}

export default App;