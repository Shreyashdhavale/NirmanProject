// src/components/NGO/NGOPages/LoginNGO.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';

const LoginNGO = ({ onLogin }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Simulate authentication - replace with actual API call if needed
    const userData = { name: 'NGO User', type: 'ngo' };
    onLogin(userData); // ✅ Correctly passing user data to App.jsx

    navigate('/ngohome'); // Redirect to NGO home page
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '500px' }}>
      <h2>NGO Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="ngoLoginEmail" className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="ngoLoginPassword" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default LoginNGO;
