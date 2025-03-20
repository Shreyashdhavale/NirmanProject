import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NGOHome.css';

const NGOHome = ({ user }) => {
  const navigate = useNavigate();
  const userName = user?.name || "NGO Employee";
  
  // State to store worker counts
  const [totalWorkers, setTotalWorkers] = useState(null);
  const [registeredWorkers, setRegisteredWorkers] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setError(null);
    setIsLoading(true);
    
    // Fetch total workers count data
    axios.get('http://localhost:8080/api/workers/total')
      .then(response => {
        setTotalWorkers(response.data);
      })
      .catch(error => {
        console.error("Error fetching total worker count:", error);
        setError("Failed to fetch total worker data: " + (error.response?.data?.message || error.message));
        setTotalWorkers(null);
      });
    
    // Fetch registered workers count data
    const email = user?.email || '';
    console.log("Fetching count for email:", email);
    console.log("Full URL:", `http://localhost:8080/api/workers/count-by-email/${encodeURIComponent(email)}`);
    
    if (email) {
      axios.get(`http://localhost:8080/api/workers/count-by-email/${encodeURIComponent(email)}`)
        .then(response => {
          console.log("Success response:", response);
          setRegisteredWorkers(response.data);
        })
        .catch(error => {
          console.error("Error fetching registered worker count:", error);
          console.error("Request URL:", `http://localhost:8080/api/workers/count-by-email/${encodeURIComponent(email)}`);
          console.error("Error status:", error.response?.status);
          setError("Failed to fetch registered worker data: " + (error.response?.data?.message || error.message));
          setRegisteredWorkers(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      console.log("No email available, skipping request");
      setRegisteredWorkers(0);
      setIsLoading(false);
    }
  }, [user?.email]); // Runs when the user email changes
  
  const handleAddWorker = () => {
    navigate('/add-worker');
  };
  
  return (
    <Container className="mt-5">
      <h1>Welcome, {userName}!</h1>
      <p>Manage your workers and keep track of their verification status.</p>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row className="dashboard-cards mt-5">
        <Col lg={4} md={6} sm={12}>
          <Card className="dashboard-card">
            <Card.Body>
              <Card.Title>Total Workers</Card.Title>
              <Card.Text>{isLoading ? "Loading..." : totalWorkers !== null ? totalWorkers : "N/A"}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4} md={6} sm={12}>
          <Card className="dashboard-card">
            <Card.Body>
              <Card.Title>Worker Registered by You</Card.Title>
              <Card.Text>{isLoading ? "Loading..." : registeredWorkers !== null ? registeredWorkers : "N/A"}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="dashboard-cards">
        <Col lg={4} md={7} sm={12}>
          <Card className="dashboard-card">
            <Card.Body>
              <Card.Title>Quick Actions</Card.Title>
              <Button variant="secondary" onClick={handleAddWorker} className="w-100">Add Worker</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NGOHome;