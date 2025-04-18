import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, Row, Col, InputGroup } from 'react-bootstrap';
import { Search, Filter, User, MapPin } from 'lucide-react';
import WorkerProfileModal from './form/WorkerProfileModal';
import './SearchWorker.css';

const WorkerSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [workers, setWorkers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);
  const [filters, setFilters] = useState({
    skill: '',
    preferredWorkLocation: ''
  });

  useEffect(() => {
    fetchWorkers('', filters);
  }, []);

  const fetchWorkers = async (name, filterOptions = {}) => {
    try {
      const queryParams = new URLSearchParams({
        name: name,
        skill: filterOptions.skill || '',
        preferredWorkLocation: filterOptions.location || ''
      });

      const response = await axios.get(`http://localhost:8080/api/workers/search?${queryParams}`);
      const workersData = Array.isArray(response.data) ? response.data : [];
      setWorkers(workersData);
    } catch (error) {
      console.error("Error fetching workers:", error);
      setWorkers([]); 
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWorkers(searchTerm, filters);
  };

  const handleViewProfile = (workerId) => {
    if (!workerId) {
      console.error('Worker ID is missing!');
      return;
    }
    setSelectedWorkerId(workerId);
    setShowModal(true);
  };

  return (
    <div className="worker-search-fullpage">
      <div className="search-section">
          <Form onSubmit={handleSearch} className="search-form">
            <Row className="align-items-center">
              <Col md={4} className="mb-2 mb-md-0">
                <InputGroup>
                  <InputGroup.Text><Search size={20} /></InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </InputGroup>
            
              </Col>
              <Col md={2} className="mb-2 mb-md-0">
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="search-button w-100"
                >
                  Search
                </Button>
              </Col>
            </Row>
          </Form>
        
      </div>

      <div className="workers-list-container">
        <Container fluid>
          {workers.length === 0 ? (
            <div className="no-workers-message">
              <p>No workers found. Try adjusting your search.</p>
            </div>
          ) : (
            <Row className="workers-grid">
              {workers.map((worker, index) => (
                <Col key={worker.workerId || index} md={3} sm={6} xs={12} className="mb-4">
                  <Card className="worker-card">
                    <div className="worker-card-content">
                      <div className="worker-card-header">
                        {worker.profilePhoto ? (
                          <img 
                            src={worker.profilePhoto} 
                            alt={`${worker.fullName}'s Profile`} 
                            className="worker-profile-image"
                          />
                        ) : (
                          <div className="default-profile-icon">
                            <User size={50} />
                          </div>
                        )}
                      </div>
                      <div className="worker-card-body">
                        <h5 className="worker-name">{worker.fullName}</h5>
                        <div className="worker-details">
                          <div className="detail-item">
                            <Filter size={16} />
                            <span>{worker.skillSet}</span>
                          </div>
                          <div className="detail-item">
                            <MapPin size={16} />
                            <span>{worker.preferredWorkLocation || 'Not specified'}</span>
                          </div>
                        </div>
                        <Button 
                          variant="outline-primary" 
                          onClick={() => handleViewProfile(worker.workerId)}
                          className="view-profile-btn"
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>

      {showModal && (
        <WorkerProfileModal
          workerId={selectedWorkerId}
          show={showModal}
          handleClose={() => setShowModal(false)}
          onUpdateSuccess={() => fetchWorkers(searchTerm, filters)}
        />
      )}
    </div>
  );
};

export default WorkerSearch;

