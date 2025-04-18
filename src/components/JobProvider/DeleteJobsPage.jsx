import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Container, Row, Col, Modal, Alert, Toast, ToastContainer } from "react-bootstrap";
import "./DeleteJobsPage.css";

const DeleteJobsPage = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (user?.jobProviderId) {
      axios
        .get(`http://localhost:8080/api/jobs?jobProviderId=${user.jobProviderId}`)
        .then((res) => {
          setJobs(res.data || []);
          setError(null);
        })
        .catch((err) => {
          console.error("Error fetching jobs:", err);
          setError("Unable to fetch jobs.");
        });
    }
  }, [user]);

  const confirmDelete = (job) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (!jobToDelete) return;
    axios
      .delete(`http://localhost:8080/api/jobs/${jobToDelete.jobRequestId}`)
      .then(() => {
        setJobs(jobs.filter((j) => j.jobRequestId !== jobToDelete.jobRequestId));
        setToastMsg("Job deleted successfully.");
        setShowToast(true);
      })
      .catch((err) => {
        console.error("Error deleting job:", err);
        setError("Failed to delete job.");
      })
      .finally(() => {
        setShowDeleteModal(false);
        setJobToDelete(null);
      });
  };

  return (
    <Container className="delete-jobs-container">
      <h2 className="delete-jobs-header">Delete Job Postings</h2>

      {error && <Alert variant="danger" className="error-alert">{error}</Alert>}

      <Row>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Col md={6} lg={4} key={job.jobRequestId} className="mb-3">
              <Card className="job-card">
                <Card.Body>
                  <Card.Title className="card-title">{job.jobTitle}</Card.Title>
                  <Card.Text className="card-text">
                    <strong>Location:</strong> {job.workLocation}<br />
                    <strong>Workers:</strong> {job.numOfWorkers}<br />
                    <strong>Status:</strong> {job.workerAssignedStatus || "Pending"}
                  </Card.Text>
                  <Button className="delete-btn" onClick={() => confirmDelete(job)}>
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <Alert variant="info" className="no-jobs-alert">No job postings found.</Alert>
          </Col>
        )}
      </Row>

      {/* Delete confirmation modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered className="delete-modal">
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          Are you sure you want to delete <strong>{jobToDelete?.jobTitle}</strong>?
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>

      {/* Toast */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast className="success-toast" onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Header className="toast-header">
            <strong className="me-auto">Job Provider</strong>
          </Toast.Header>
          <Toast.Body className="toast-body">{toastMsg}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default DeleteJobsPage;
