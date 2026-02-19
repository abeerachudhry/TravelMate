import React from 'react';
import { Link } from 'react-router-dom';

function LoginLayout({ email, setEmail, password, setPassword, handleLogin }) {
  return (
    <div
      className="login-container"
      style={{
        display: 'flex',
        height: '100vh',
        backgroundImage: "url('/assets/bg1.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        padding: '20px',
      }}
    >
      
      <div style={infoContainerStyle}>
        <h1 style={{ marginBottom: '10px' }}>Welcome To TravelMate</h1>
        <p style={{ lineHeight: '1.6' }}>
          Your trusted partner for seamless bus ticket booking. Whether you’re planning 
          a quick trip home or an exciting adventure, we make travel easy, fast, and reliable. 
          Browse through a wide selection of routes, compare prices, and secure your seat in just 
          a few clicks. Our platform is designed to provide you with a hassle-free experience 
          from start to finish, ensuring you get to your destination safely and comfortably. 
          Join thousands of happy travelers who choose TravelMate for their journeys every day.
        </p>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: '20px', display: 'inline-block' }}
        >
          <img src="/instagram_icon.avif" alt="Instagram" style={{ width: '30px' }} />
        </a>
      </div>

      <div style={loginBoxStyle}>
        <h2 style={{ marginBottom: '20px' }}>Log in</h2>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <div style={{ marginTop: '10px' }}>
          <input type="checkbox" /> Remember Me
        </div>
        <button onClick={handleLogin} style={buttonStyle}>
          Sign in now
        </button>
        <p style={{ marginTop: '20px' }}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
        <p style={{ fontSize: '12px', marginTop: '20px' }}>
          <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>
            Terms of Service
          </a>{' '}
          |{' '}
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}

// Styles
const infoContainerStyle = {
  flex: 1,
  maxWidth: '500px',
  padding: '40px',
  marginRight: '40px',
  // Transparent — no background or blur
};

const loginBoxStyle = {
  flex: 1,
  maxWidth: '400px',
  padding: '40px',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(8px)',
  borderRadius: '20px',
};

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '10px',
  margin: '10px 0',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '16px',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: '#fff',
  outline: 'none',
};

const buttonStyle = {
  backgroundColor: '#d84315',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  fontSize: '16px',
  cursor: 'pointer',
  marginTop: '10px',
};

export default LoginLayout;

