import React from 'react';

const SignUp = ({
  firstName,
  lastName,
  email,
  cnic,
  password,
  setFirstName,
  setLastName,
  setEmail,
  setCnic,
  setPassword,
  handleSignUp,
}) => {
  const styles = {
    signupPage: {
      backgroundImage: "url('/assets/bg1.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    signupContainer: {
      background: 'rgba(0, 0, 0, 0.6)',
      padding: '40px',
      borderRadius: '15px',
      width: '350px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    },
    signupTitle: {
      color: 'white',
      fontSize: '28px',
      textAlign: 'center',
    },
    signupInput: {
      padding: '12px',
      borderRadius: '8px',
      border: 'none',
      outline: 'none',
      fontSize: '16px',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
       color: 'white',
      backdropFilter: 'blur(4px)',
    },
    signupButton: {
      padding: '12px',
      backgroundColor: '#d94a27',
      color: 'white',
      border: 'none',
      fontSize: '16px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
  };

  return (
    <div style={styles.signupPage}>
      <div style={styles.signupContainer}>
        <h2 style={styles.signupTitle}>Create Account</h2>
        <input
          style={styles.signupInput}
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          style={styles.signupInput}
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          style={styles.signupInput}
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.signupInput}
          type="text"
          placeholder="CNIC"
          value={cnic}
          onChange={(e) => setCnic(e.target.value)}
        />
        <input
          style={styles.signupInput}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          style={styles.signupButton}
          onClick={handleSignUp}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#b83b1f')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#d94a27')}
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default SignUp;
