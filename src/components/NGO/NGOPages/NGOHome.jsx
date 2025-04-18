import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NGOHome.css';

const NGOHome = ({ user }) => {
  const navigate = useNavigate();
  const userName = user?.name || "NGO Employee";

  const [totalWorkers, setTotalWorkers] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Toast states
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  useEffect(() => {
    setError(null);
    setIsLoading(true); // Start loading when component mounts

    // Fetch total workers
    axios.get('http://localhost:8080/api/workers/total')
      .then(response => {
        setTotalWorkers(response.data);  // Set total workers data
        setIsLoading(false);  // Set loading to false after data is fetched
        triggerToast("Total workers data loaded.");  // Show success toast
      })
      .catch(error => {
        console.error("Error fetching total worker count:", error);
        setError("Failed to fetch total worker data: " + (error.response?.data?.message || error.message));
        setTotalWorkers(null);
        setIsLoading(false); // Set loading to false even on error
      });
  }, []); // Empty dependency array ensures this runs once on mount

  const handleAddWorker = () => {
    navigate('/add-worker');
  };

  const handleViewAllWorkers = () => {
    navigate('/search-worker');
  };

  const handleViewAssignedJobs = () => {
    navigate('/job-request');
  };

  return (
    <Container className="mt-5">
      <h1>Welcome, {userName}!</h1>
      <p>Manage your workers and keep track of their verification status.</p>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="dashboard-cards mt-5">
        <Col lg={3} md={6} sm={12} className="mb-4">
          <Card className="dashboard-card h-100">
            <Card.Body>
              <Card.Title>Total Workers</Card.Title>
              <Card.Text className="dashboard-number">
                {isLoading ? "Loading..." : totalWorkers !== null ? totalWorkers : "N/A"}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} sm={12} className="mb-4">
          <Card className="dashboard-card h-100">
            <Card.Body>
              <Card.Title>Add Worker</Card.Title>
              <Button variant="primary" onClick={handleAddWorker} className="w-100">
                Add Worker
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} sm={12} className="mb-4">
          <Card className="dashboard-card h-100">
            <Card.Body>
              <Card.Title>View All Workers</Card.Title>
              <Button variant="primary" onClick={handleViewAllWorkers} className="w-100">
                View All Workers
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} sm={12} className="mb-4">
          <Card className="dashboard-card h-100">
            <Card.Body>
              <Card.Title>View Job Requests</Card.Title>
              <Button variant="info" onClick={handleViewAssignedJobs} className="w-100">
                View Job Requests
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Toast Notification */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast bg="info" onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">NGO Dashboard</strong>
          </Toast.Header>
          <Toast.Body className="text-dark">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default NGOHome;
