import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { AlertCircle, Calendar, MapPin, Clock, Users, DollarSign, FileText } from "lucide-react";
import { Alert, Card, Modal, Button, Row, Col, Badge, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./JobProviderHome.css";

const JobProviderHome = ({ user }) => {
  const [activeJobs, setActiveJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  // Use the user's name or fallback
  const userName = user?.name || "Provider";

  useEffect(() => {
    if (user?.jobProviderId) {
      console.log("Job Provider ID:", user.jobProviderId);
      setLoading(true);

      axios
        .get(`http://localhost:8080/api/jobs?jobProviderId=${user.jobProviderId}`)
        .then((response) => {
          console.log("API Response:", response.data);
          setActiveJobs(response.data || []);
          setError(null);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching jobs:", err);
          setError("Failed to load job postings. Please try again later.");
          setLoading(false);
        });
    } else {
      setError("Invalid Job Provider ID.");
      setLoading(false);
    }
  }, [user]);

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleCreateJob = () => {
    navigate("/jobproviderform");
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedJob(null);
  };

  const totalWorkers = activeJobs.reduce((sum, job) => sum + (job.numOfWorkers || 0), 0);

  const getStatusBadgeClass = (status) => {
    if (!status) return "status-pending";
    const statusLower = status.toLowerCase();
    if (statusLower.includes("assigned") || statusLower.includes("approved")) {
      return "status-assigned";
    } else if (statusLower.includes("completed") || statusLower.includes("closed")) {
      return "status-completed";
    }
    return "status-pending";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  return (
    <Container>
      <div className="welcome-section">
        <h1>Welcome, {userName}!</h1>
        <p>Manage your job postings and find skilled daily wage workers.</p>
      </div>

      <div className="stats-container">
        <Card className="stat-card">
          <div className="stat-content">
            <FontAwesomeIcon icon={faBriefcase} className="stat-icon blue" size="2x" />
            <div>
              <p>Active Jobs</p>
              <h3>{activeJobs.length}</h3>
            </div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-content">
            <Users className="icon" size={50} />
            <div>
              <p>Workers Required</p>
              <h3>{totalWorkers}</h3>
            </div>
          </div>
        </Card>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Alert variant="info" className="job-alert">
        <AlertCircle className="alert-icon" size={24} />
        <span>Want to post a new job? Click "Post New Job" above to get started.</span>
      </Alert>

      <section className="active-jobs">
        <h2>Active Job Postings</h2>
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading job postings...</p>
          </div>
        ) : (
          <Row className="job-grid">
            {activeJobs.length > 0 ? (
              activeJobs.map((job) => (
                <Col key={job.jobRequestId} lg={4} md={6} sm={12} className="mb-4">
                  <Card className="job-card h-100">
                    <Card.Body>
                      <span className={`status-badge ${getStatusBadgeClass(job.workerAssignedStatus)}`}>
                        {job.workerAssignedStatus || "Pending"}
                      </span>
                      <h3>{job.jobTitle || "Untitled Job"}</h3>
                      <p><MapPin size={20} /> {job.workLocation || "Location not specified"}</p>
                      <p><Users size={20} /> Workers: {job.numOfWorkers || 0}</p>
                      <p><Calendar size={20} /> Start: {formatDate(job.startDate)}</p>
                      <p><Clock size={20} /> End: {formatDate(job.endDate)}</p>
                      <p><DollarSign size={20} /> ₹{job.wagePerDay}/day</p>
                      <Button variant="info" onClick={() => handleViewDetails(job)}>View Details</Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col xs={12}>
                <Alert variant="secondary" className="text-center">No active job postings available.</Alert>
              </Col>
            )}
          </Row>
        )}
      </section>

      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton><Modal.Title>Job Details</Modal.Title></Modal.Header>
        <Modal.Body>
          {selectedJob ? (
            <>
              <p><strong>Job Title:</strong> {selectedJob.jobTitle}</p>
              <p><strong>Description:</strong> {selectedJob.jobDescription}</p>
              <p><strong>Location:</strong> {selectedJob.workLocation}</p>
              <p><strong>Wage Per Day:</strong> ₹{selectedJob.wagePerDay}</p>
              <p><strong>Workers Required:</strong> {selectedJob.numOfWorkers}</p>
              <p><strong>Status:</strong> {selectedJob.workerAssignedStatus || "Pending"}</p>
            </>
          ) : (
            <p>No job selected.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Row className="quick-actions">
        <Col>
          <Button variant="primary" onClick={handleCreateJob}>Post New Job</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default JobProviderHome;
