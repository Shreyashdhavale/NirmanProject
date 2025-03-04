// src/pages/NGOHome.jsx
import React, { useState } from 'react';
import NGOHomeNavbar from './NGOHomeNavbar';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NGOHome.css';  // Import CSS file for styling

const NGOHome = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const HandleSubmit = async (e) => {
        navigate('/add-worker');
  };

  return (
    <Container className="mt-5">
      <h1>Welcome, NGO Employee!</h1>
      <p>Please log in to access your dashboard and manage workers.</p>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="dashboard-cards mt-5">
        <Col lg={4} md={6} sm={12}>
          <Card className="dashboard-card">
            <Card.Body>
              <Card.Title>Total Workers</Card.Title>
              <Card.Text>150</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={6} sm={12}>
          <Card className="dashboard-card">
            <Card.Body>
              <Card.Title>Worker Registered by You</Card.Title>
              <Card.Text>50</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={6} sm={12}>
          <Card className="dashboard-card">
            <Card.Body>
              <Card.Title>Verified Workers</Card.Title>
              <Card.Text>10</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="dashboard-cards">
        <Col lg={4} md={6} sm={12}>
          <Card className="dashboard-card">
            <Card.Body>
              <Card.Title>Verification Pending Workers</Card.Title>
              <Card.Text>40</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={7} sm={12}>
          <Card className="dashboard-card">
            <Card.Body>
              <Card.Title>Quick Actions</Card.Title>
              <Button variant="secondary" onClick={HandleSubmit} block>Add Worker</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NGOHome;
