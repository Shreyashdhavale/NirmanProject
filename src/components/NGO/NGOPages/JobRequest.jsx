import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './JobRequest.css';

const JobRequest = () => {
  const [jobRequests, setJobRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [workerSearchTerm, setWorkerSearchTerm] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [notification, setNotification] = useState(null);

  // API base URL
  const API_BASE_URL = 'http://localhost:8080/api';

  // Fetch job requests from API
  useEffect(() => {
    const fetchJobRequests = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/jobs/all`);
        setJobRequests(response.data);
        console.log(response.data);
        setFilteredRequests(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load job requests. Please try again later.');
        setLoading(false);
        console.error('Error fetching job requests:', err);
      }
    };

    fetchJobRequests();
  }, []);

  // Fetch workers from API
  const fetchWorkers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/workers`);
      setWorkers(response.data);
      console.log(response.data);
    } catch (err) {
      console.error('Error fetching workers:', err);
      setNotification({
        type: 'danger',
        message: 'Failed to load workers. Please try again.'
      });
    }
  };

  // Apply filters and sorting for job requests
  useEffect(() => {
    let results = [...jobRequests];
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(job => 
        job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.jobDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(job => job.status === statusFilter);
    }

    // Apply sorting
    if (sortBy === 'date') {
      results.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    } else if (sortBy === 'title') {
      results.sort((a, b) => a.jobTitle.localeCompare(b.jobTitle));
    }

    setFilteredRequests(results);
  }, [jobRequests, searchTerm, statusFilter, sortBy]);

  // Filter workers based on job requirement and search term
  useEffect(() => {
    // If a job request is selected, filter workers by matching skill set
    if (workers.length > 0 && selectedRequest) {
      let filtered = workers.filter(worker =>
        worker.skillSet.toLowerCase().includes(selectedRequest.skillRequired.toLowerCase())
      );
      
      // Also apply search filter if a search term is provided
      if (workerSearchTerm) {
        filtered = filtered.filter(worker =>
          worker.fullName.toLowerCase().includes(workerSearchTerm.toLowerCase()) ||
          worker.skillSet.toLowerCase().includes(workerSearchTerm.toLowerCase())
        );
      }
      setFilteredWorkers(filtered);
    } else {
      setFilteredWorkers(workers);
    }
  }, [workers, workerSearchTerm, selectedRequest]);

  // Handle search input change for job requests
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Handle sort method change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Open assign modal for a specific job request
  const handleAssignClick = (request) => {
    setSelectedRequest(request);
    setShowAssignModal(true);
    setWorkerSearchTerm('');
    fetchWorkers();
  };

  // Handle worker search input change
  const handleWorkerSearchChange = (e) => {
    setWorkerSearchTerm(e.target.value);
  };

  // Select a worker for assignment
  const handleSelectWorker = (worker) => {
    setSelectedWorker(worker);
    setShowConfirmationModal(true);
  };

  // Confirm worker assignment and update the job request in the database
  const handleConfirmAssignment = async () => {
    try {
      // API call to assign worker to the job request.
      // Backend endpoint now expects an array (even if one worker is assigned at a time)
      await axios.post(
        `${API_BASE_URL}/jobs/${selectedRequest.jobRequestId}/assign-workers`,
        [selectedWorker.workerId]
      );
  
      // Update job request locally
      const updatedRequests = jobRequests.map(req => {
        if (req.jobRequestId === selectedRequest.jobRequestId) {
          // Initialize assignedWorkers if not already set
          let assignedWorkers = req.assignedWorkers ? [...req.assignedWorkers] : [];
          // Add the new worker if not already assigned
          if (!assignedWorkers.includes(selectedWorker.workerId)) {
            assignedWorkers.push(selectedWorker.workerId);
          }
          // Only change status to "assigned" if the required number of workers is met
          const updatedStatus = (assignedWorkers.length >= req.numOfWorkers)
            ? 'assigned'
            : req.status; // could remain 'pending' or another state
          return { ...req, assignedWorkers, status: updatedStatus };
        }
        return req;
      });
  
      setJobRequests(updatedRequests);
      setNotification({
        type: 'success',
        message: `Worker ${selectedWorker.fullName} has been added to ${selectedRequest.jobTitle}.` +
                 ` ${selectedRequest.numOfWorkers - (selectedRequest.assignedWorkers ? selectedRequest.assignedWorkers.length + 1 : 1)} more worker(s) required.`
      });
  
      // Close modals and reset selected items
      setShowConfirmationModal(false);
      setShowAssignModal(false);
      setSelectedWorker(null);
      setSelectedRequest(null);
      setWorkerSearchTerm('');
    } catch (err) {
      console.error('Error assigning worker:', err);
      setNotification({
        type: 'danger',
        message: 'Failed to assign worker. Please try again.'
      });
    }
  };

  // Close assign modal
  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setSelectedRequest(null);
    setWorkerSearchTerm('');
    setFilteredWorkers([]);
  };

  // Close confirmation modal
  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setSelectedWorker(null);
  };

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Format date to a readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render list of job requests
  const renderJobRequests = () => {
    if (loading) {
      return (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading job requests...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert alert-danger my-4" role="alert">
          {error}
        </div>
      );
    }

    if (filteredRequests.length === 0) {
      return (
        <div className="alert alert-info my-4" role="alert">
          No job requests found. Try adjusting your filters.
        </div>
      );
    }

    return (
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {filteredRequests.map((request) => (
          <div className="col" key={request.jobRequestId}>
            <div className={`card h-100 job-request-card ${request.status === 'assigned' ? 'border-success' : request.status === 'completed' ? 'border-info' : 'border-warning'}`}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">{request.jobTitle}</h5>
                <span className={`badge ${request.status === 'assigned' ? 'bg-success' : request.status === 'completed' ? 'bg-info' : 'bg-warning'}`}>
                  {request.status || 'Pending'}
                </span>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <strong>Employer:</strong> {request.contactPerson}
                </div>
                <div className="mb-3">
                  <strong>Location:</strong> {request.workLocation}
                </div>
                <div className="mb-3">
                  <strong>Skills Required:</strong> {request.skillRequired}
                </div>
                <div className="mb-3">
                  <strong>Workers Needed:</strong> {request.numOfWorkers}
                </div>
                <div className="mb-3">
                  <strong>Duration:</strong> {formatDate(request.startDate)} to {formatDate(request.endDate)}
                </div>
                <div className="mb-3">
                  <strong>Daily Wage:</strong> ₹{request.wagePerDay}
                </div>
                <p className="card-text job-description-preview">{request.jobDescription}</p>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button 
                  className="btn btn-outline-primary"
                  data-bs-toggle="modal"
                  data-bs-target={`#detailsModal-${request.jobRequestId}`}
                >
                  View Details
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleAssignClick(request)}
                  disabled={request.status === 'completed'}
                >
                  {request.status === 'assigned' ? 'Reassign' : 'Assign Workers'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render list of workers in assign modal
  const renderWorkersList = () => {
    if (filteredWorkers.length === 0) {
      return (
        <div className="alert alert-info">
          No workers found matching your criteria.
        </div>
      );
    }

    return (
      <div className="row row-cols-1 row-cols-md-2 g-3 mt-2">
        {filteredWorkers.map((worker) => (
          <div className="col" key={worker.workerId}>
            <div className="card worker-card h-100">
              <div className="card-body">
                <h5 className="card-title">{worker.fullName}</h5>
                <p className="card-text">
                  <strong>Skills:</strong> {worker.skillSet}
                </p>
                <p className="card-text">
                  <strong>Skill Level:</strong> {worker.skillLevel} 
                </p>
                <p className="card-text">
                  <strong>Availability:</strong> {worker.availability ? 'Available' : 'Busy'}
                </p>
              </div>
              <div className="card-footer">
                <button 
                  className="btn btn-success w-100"
                  onClick={() => handleSelectWorker(worker)}
                  disabled={!worker.availability}
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container-fluid py-4">
      {/* Notification */}
      {notification && (
        <div className={`alert alert-${notification.type} alert-dismissible fade show`} role="alert">
          {notification.message}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setNotification(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Header */}
      <header className="mb-4">
        <h1 className="display-5 fw-bold">Job Requests</h1>
        <p className="lead">Manage all raised job requests and assign them to appropriate workers</p>
      </header>

      {/* Filters and Search */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3 mb-md-0">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search job requests..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="col-md-4 mb-3 mb-md-0">
          <select 
            className="form-select"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="col-md-4">
          <select 
            className="form-select"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
      </div>

      {/* Job Requests List */}
      <div className="job-requests-container">
        {renderJobRequests()}
      </div>

      {/* Assign Worker Modal */}
      {showAssignModal && selectedRequest && (
        <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  Assign Workers to: {selectedRequest.jobTitle}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseAssignModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <h6>Job Details:</h6>
                  <p><strong>Location:</strong> {selectedRequest.workLocation}</p>
                  <p><strong>Skills Required:</strong> {selectedRequest.skillRequired}</p>
                  <p><strong>Workers Needed:</strong> {selectedRequest.numOfWorkers}</p>
                </div>
                <hr />
                <div className="mb-3">
                  <label htmlFor="workerSearch" className="form-label">Search Workers:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="workerSearch"
                    placeholder="Search by name or skills..."
                    value={workerSearchTerm}
                    onChange={handleWorkerSearchChange}
                  />
                </div>
                {renderWorkersList()}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseAssignModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && selectedWorker && selectedRequest && (
        <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Confirm Assignment</h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseConfirmationModal}></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to assign <strong>{selectedWorker.fullName}</strong> to the job <strong>{selectedRequest.jobTitle}</strong>?
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseConfirmationModal}>
                  Cancel
                </button>
                <button type="button" className="btn btn-success" onClick={handleConfirmAssignment}>
                  Confirm Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobRequest;
