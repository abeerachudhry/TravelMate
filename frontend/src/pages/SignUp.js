import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SignUpUI from '../components/SignUp'; 

function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [cnic, setCnic] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/signup', {
        firstName, lastName, email, cnic, password
      });
      navigate('/');
    } catch {
      alert('Sign up failed');
    }
  };

  return (
    <SignUpUI
      firstName={firstName}
      lastName={lastName}
      email={email}
      cnic={cnic}
      password={password}
      setFirstName={setFirstName}
      setLastName={setLastName}
      setEmail={setEmail}
      setCnic={setCnic}
      setPassword={setPassword}
      handleSignUp={handleSignUp}
    />
  );
}

export default SignUp;

