import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { AlertCircle, Calendar, MapPin, Clock, Users, DollarSign, FileText } from "lucide-react";
import { Alert, Card, Modal, Button, Row, Col, Badge, Container } from "react-bootstrap";
import { UserContext } from "../../App";
import "./JobProviderHome.css";
import { useNavigate } from "react-router-dom";

const JobProviderHome = ({ user }) => {
  const [activeJobs, setActiveJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { User } = useContext(UserContext);
  const userName = User?.name || "Provider";
  const navigate = useNavigate();

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

  const totalWorkers = activeJobs.reduce(
    (sum, job) => sum + (job.numOfWorkers || 0),
    0
  );
  
  // Helper function to get status badge class
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

  // Format date for better display
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
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
        <span>
          Want to post a new job? Click "Post New Job" above to get started.
        </span>
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
                    <div className="image-container">
                      {job.employerIdProofBase64 ? (
                        <Card.Img
                          variant="top"
                          src={job.employerIdProofBase64}
                          alt="Employer Profile"
                          className="job-profile-img"
                        />
                      ) : (
                        <div className="d-flex align-items-center justify-content-center h-100">
                          <FileText size={50} color="#c7cdd3" />
                        </div>
                      )}
                    </div>
                    <Card.Body>
                      <span className={`status-badge ${getStatusBadgeClass(job.workerAssignedStatus)}`}>
                        {job.workerAssignedStatus || "Pending"}
                      </span>
                      <h3>{job.jobTitle || "Untitled Job"}</h3>
                      <div className="job-details">
                        <p>
                          <MapPin className="icon" size={20} /> 
                          {job.workLocation || "Location not specified"}
                        </p>
                        <p>
                          <Users className="icon" size={20} /> 
                          <strong>Workers:</strong> {job.numOfWorkers || 0}
                        </p>
                        <p>
                          <Calendar className="icon" size={20} /> 
                          <strong>Start:</strong> {formatDate(job.startDate)}
                        </p>
                        {job.endDate && (
                          <p>
                            <Clock className="icon" size={20} /> 
                            <strong>End:</strong> {formatDate(job.endDate)}
                          </p>
                        )}
                        <p className="wage">
                          <span className="currency">₹</span> {job.wagePerDay || 0}/day
                        </p>
                      </div>
                      <Button
                        variant="info"
                        onClick={() => handleViewDetails(job)}
                        className="w-100"
                      >
                        View Details
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col xs={12}>
                <div className="text-center p-4 bg-light rounded">
                  <AlertCircle size={40} color="#6c757d" className="mb-3" />
                  <p className="mb-0">No active job postings available.</p>
                  <Button 
                    variant="primary" 
                    className="mt-3"
                    onClick={handleCreateJob}
                  >
                    Create Your First Job Post
                  </Button>
                </div>
              </Col>
            )}
          </Row>
        )}
      </section>

      <Modal show={showModal} onHide={closeModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Job Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedJob ? (
            <div>
              <div className="modal-image">
                {selectedJob.employerIdProofBase64 ? (
                  <img
                    src={selectedJob.employerIdProofBase64}
                    alt="Employer Profile"
                    className="modal-profile-img"
                  />
                ) : (
                  <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{width: "120px", height: "120px", margin: "0 auto"}}>
                    <FileText size={50} color="#6a11cb" />
                  </div>
                )}
              </div>
              
              <Row>
                <Col md={6}>
                  <p>
                    <strong>Job Request ID:</strong> {selectedJob.jobRequestId}
                  </p>
                  <p>
                    <strong>Job Provider ID:</strong> {selectedJob.jobProviderId}
                  </p>
                  <p>
                    <strong>Contact Person:</strong> {selectedJob.contactPerson}
                  </p>
                  <p>
                    <strong>Contact Number:</strong> {selectedJob.contactNumber}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedJob.email}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedJob.address}
                  </p>
                  <p>
                    <strong>District:</strong> {selectedJob.district}
                  </p>
                  <p>
                    <strong>State:</strong> {selectedJob.state}
                  </p>
                  <p>
                    <strong>Pincode:</strong> {selectedJob.pincode}
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Job Title:</strong> {selectedJob.jobTitle}
                  </p>
                  <p>
                    <strong>Description:</strong> {selectedJob.jobDescription}
                  </p>
                  <p>
                    <strong>Skill Required:</strong> {selectedJob.skillRequired}
                  </p>
                  <p>
                    <strong>Skill Level:</strong> {selectedJob.skillLevel}
                  </p>
                  <p>
                    <strong>Workers Required:</strong> {selectedJob.numOfWorkers}
                  </p>
                  <p>
                    <strong>Work Location:</strong> {selectedJob.workLocation}
                  </p>
                  <p>
                    <strong>Start Date:</strong> {formatDate(selectedJob.startDate)}
                  </p>
                  <p>
                    <strong>End Date:</strong> {formatDate(selectedJob.endDate)}
                  </p>
                  <p>
                    <strong>Wage Per Day:</strong> ₹{selectedJob.wagePerDay}
                  </p>
                  <p>
                    <strong>Working Hours:</strong> {selectedJob.workingHours}
                  </p>
                  <p>
                    <strong>Job Type:</strong> {selectedJob.jobType}
                  </p>
                  <p>
                    <strong>Request Status:</strong> {selectedJob.workerAssignedStatus || "Pending"}
                  </p>
                  <p>
                    <strong>Assigned Workers:</strong>{" "}
                    {selectedJob.assignedWorkerIds && selectedJob.assignedWorkerIds.length > 0
                      ? selectedJob.assignedWorkerIds.join(", ")
                      : "None"}
                  </p>
                </Col>
              </Row>
            </div>
          ) : (
            <p>No job selected.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          {selectedJob && (
            <Button variant="primary">
              Edit Job
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Row className="quick-actions justify-content-center">
        <Col md={5}>
          <Card className="action-card blue">
            <Card.Body>
              <h3>Post a New Job</h3>
              <p>Create a new job posting to find workers quickly.</p>
              <Button variant="primary" onClick={handleCreateJob} className="w-100">
                Create Job Post
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="action-card green">
            <Card.Body>
              <h3>View Applications</h3>
              <p>Check and respond to worker applications.</p>
              <Button variant="success" className="w-100">
                View All Applications
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default JobProviderHome;