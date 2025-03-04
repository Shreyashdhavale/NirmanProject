import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignupProvider.css'; 

const  SignupProvider= () => {
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      
      const response = await axios.post('http://localhost:8080/api/signup', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Response:', response.data.message); // Debug the response
  
      if (response.data.success) {
        navigate('/jobproviderhome', { replace: true });
      } 
      // else {
        alert(response.data.message || 'Signup failed');
      // }
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      alert(error.response?.data?.message || 'An error occurred during signup');
    }
  };

  return (
    <Container className="mt-5">
      <h2>JobProvider Signup</h2>
      <Form onSubmit={handleSignup}>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
          />
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </Form.Group>
        
        <Button variant="success" type="submit" className="mt-3">
          Signup
        </Button>
      </Form>
    </Container>
  );
};

export default SignupProvider;