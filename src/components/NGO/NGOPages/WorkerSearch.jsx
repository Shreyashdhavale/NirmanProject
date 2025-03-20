import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import WorkerProfileModal from './form/WorkerProfileModal';
import './SearchWorker.css';

const WorkerSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [workers, setWorkers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkers('');
  }, []);

  const fetchWorkers = async (name) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/workers/search?name=${name}`);
      const workersData = Array.isArray(response.data) ? response.data : [];
      console.log('Workers data:', workersData);
      setWorkers(workersData);
    } catch (error) {
      console.error("Error fetching workers:", error);
      setWorkers([]); // Clear the list on error
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWorkers(searchTerm);
  };

  const handleViewProfile = (workerId) => {
    if (!workerId) {
      console.error('Worker ID is missing!');
      return;
    }
    console.log('Selected worker ID:', workerId);
    setSelectedWorkerId(workerId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedWorkerId(null);
  };

  const handleUpdateSuccess = () => {
    fetchWorkers(searchTerm); // Refresh workers list after update
  };

  return (
    <Container className="search-container">
      <Form onSubmit={handleSearch} className="search-form mb-4">
        <Row>
          <Col md={10} sm={12}>
            <Form.Control
              type="text"
              placeholder="Search workers by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </Col>
          <Col md={2} sm={12} className="mt-2 mt-md-0">
            <Button variant="primary" type="submit" className="search-button">
              Search
            </Button>
          </Col>
        </Row>
      </Form>

      <div className="workers-container">
        <Row>
          {workers.map((worker, index) => (
            <Col md={4} sm={6} xs={12} key={worker.workerId || index} className="mb-4">
              <Card className="worker-card h-100">
                {worker.profilePhoto && (
                  <Card.Img
                    variant="top"
                    src={worker.profilePhoto}
                    alt={`${worker.fullName}'s Profile Photo`}
                    className="worker-image"
                  />
                )}
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="worker-name">{worker.fullName}</Card.Title>
                  <Card.Text className="worker-details">
                    <strong>Skill:</strong> {worker.skillSet}
                  </Card.Text>
                  <Card.Text className="worker-details">
                    <strong>Contact:</strong> {worker.contact}
                  </Card.Text>
                  <Button
                    variant="info"
                    onClick={() => handleViewProfile(worker.workerId)}  // Use workerId here
                    className="profile-button mt-auto"
                  >
                    View Entire Profile
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {showModal && (
        <WorkerProfileModal
          workerId={selectedWorkerId}
          show={showModal}
          handleClose={handleCloseModal}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </Container>
  );
};

export default WorkerSearch;
