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
  const [showRemoveConfirmationModal, setShowRemoveConfirmationModal] = useState(false);
  const [requestToRemoveWorker, setRequestToRemoveWorker] = useState(null);
  const [workerIdToRemove, setWorkerIdToRemove] = useState(null);
  const [showingWorkersForJob, setShowingWorkersForJob] = useState(null);
  
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
      // If a specific job request is selected, use the eligible-workers endpoint
      let endpoint = selectedRequest 
        ? `${API_BASE_URL}/jobs/${selectedRequest.jobRequestId}/eligible-workers`
        : `${API_BASE_URL}/workers`;
        
      const response = await axios.get(endpoint);
      setWorkers(response.data);
      setFilteredWorkers(response.data);
      console.log("Fetched workers:", response.data);
    } catch (err) {
      console.error('Error fetching workers:', err);
      setNotification({
        type: 'danger',
        message: 'Failed to load workers. Please try again.'
      });
    }
  };

  // Apply filters and sorting for job requests - UPDATED
  useEffect(() => {
    let results = [...jobRequests];
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(job => 
        job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.jobDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.workLocation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter (map to workerAssignedStatus)
    if (statusFilter !== 'all') {
      // Convert frontend status values to backend values
      const statusMapping = {
        'pending': 'Pending',
        'assigned': 'Assigned',
        'completed': 'Completed'
      };
      results = results.filter(job => job.workerAssignedStatus === statusMapping[statusFilter]);
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

  // Toggle worker display for a specific job
  const toggleWorkerDisplay = (jobRequestId) => {
    if (showingWorkersForJob === jobRequestId) {
      setShowingWorkersForJob(null); // Hide if already showing
    } else {
      setShowingWorkersForJob(jobRequestId); // Show if not already showing
    }
  };

  // Open assign modal for a specific job request
  const handleAssignClick = (request) => {
    setSelectedRequest(request);
    setShowAssignModal(true);
    setWorkerSearchTerm('');
    setWorkers([]); // Reset workers list before fetching
    setFilteredWorkers([]);
    fetchWorkers(); // This will now use the eligible-workers endpoint
  };

  // Handle worker search input change
  const handleWorkerSearchChange = (e) => {
    setWorkerSearchTerm(e.target.value);
  };

  // Select a worker for assignment
  const handleSelectWorker = (worker) => {
    console.log("Selected Worker:", worker); // Debugging log
    setSelectedWorker(worker);
    setShowConfirmationModal(true);
  };
  
  
  // Updated function to accept both job request and worker ID
  const handleRemoveWorkerClick = (request, workerId) => {
    setRequestToRemoveWorker(request);
    setWorkerIdToRemove(workerId);
    setShowRemoveConfirmationModal(true);
  };

  // Updated confirmation handler for removing worker
  const handleConfirmRemoveWorker = async () => {
    if (!requestToRemoveWorker || !workerIdToRemove) {
      console.error("No job request or worker selected for removal.");
      return;
    }
    
    try {
      // Make API call with both required parameters
      await axios.post(`${API_BASE_URL}/jobs/cancel-worker`, {
        jobId: requestToRemoveWorker.jobRequestId,
        workerId: workerIdToRemove
      });
      
      // Update local state with the updated job request
      const updatedRequests = jobRequests.map(req => {
        if (req.jobRequestId === requestToRemoveWorker.jobRequestId) {
          // Remove the specific worker ID from the assigned workers array
          const updatedWorkerIds = req.assignedWorkerIds.filter(id => id !== workerIdToRemove);
          
          // Determine new status based on remaining workers
          const newStatus = updatedWorkerIds.length > 0 ? 'Assigned' : 'Pending';
          
          return {
            ...req,
            assignedWorkerIds: updatedWorkerIds,
            workerAssignedStatus: newStatus
          };
        }
        return req;
      });
      
      setJobRequests(updatedRequests);
      setNotification({
        type: 'success',
        message: `Worker has been removed from "${requestToRemoveWorker.jobTitle}".`
      });
      
      // Close modal and reset selections
      setShowRemoveConfirmationModal(false);
      setRequestToRemoveWorker(null);
      setWorkerIdToRemove(null);
    } catch (err) {
      console.error('Error removing worker assignment:', err.response?.data || err.message || err);
      setNotification({
        type: 'danger',
        message: `Failed to remove worker assignment: ${err.response?.data?.message || err.message || 'Please try again'}`
      });
    }
  };

  // Confirm worker assignment and update the job request in the database - UPDATED
  const handleConfirmAssignment = async () => {
    if (!selectedWorker || !selectedRequest) {
      console.error("Worker or request not selected.");
      return;
    }
    console.log('✅ handleConfirmAssignment triggered');
  
    // Check for missing data
    if (!selectedRequest) {
      console.error('❌ selectedRequest is null or undefined');
      return;
    }
    if (!selectedWorker) {
      console.error('❌ selectedWorker is null or undefined');
      return;
    }
  
    console.log('Assigning worker...', {
      jobId: selectedRequest.jobRequestId,
      workerId: selectedWorker.workerId
    });
  
    try {
      // API call to assign worker to the job request.
      await axios.post(
        `${API_BASE_URL}/jobs/assign-worker`,
        {
          jobId: selectedRequest.jobRequestId,
          workerId: selectedWorker.workerId
        }
      );
  
      // Update job request locally
      const updatedRequests = jobRequests.map(req => {
        if (req.jobRequestId === selectedRequest.jobRequestId) {
          let assignedWorkers = req.assignedWorkerIds ? [...req.assignedWorkerIds] : [];
  
          if (!assignedWorkers.includes(selectedWorker.workerId)) {
            assignedWorkers.push(selectedWorker.workerId);
          }
  
          const updatedStatus =
            assignedWorkers.length >= req.numOfWorkers
              ? 'Assigned'
              : req.workerAssignedStatus;
  
          return {
            ...req,
            assignedWorkerIds: assignedWorkers,
            workerAssignedStatus: updatedStatus
          };
        }
        return req;
      });
  
      setJobRequests(updatedRequests);
      setNotification({
        type: 'success',
        message: `Worker ${selectedWorker.fullName} has been added to ${selectedRequest.jobTitle}. ` +
          `${selectedRequest.numOfWorkers - (selectedRequest.assignedWorkerIds ? selectedRequest.assignedWorkerIds.length + 1 : 1)} more worker(s) required.`
      });
  
      // Close modals and reset selections
      setShowConfirmationModal(false);
      setShowAssignModal(false);
      setSelectedWorker(null);
      setSelectedRequest(null);
      setWorkerSearchTerm('');
    } catch (err) {
      console.error('❌ Error assigning worker:', err);
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

  // Render list of job requests - UPDATED
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
      <>
        {/* Job Requests */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredRequests.map((request) => (
            <div className="col" key={request.jobRequestId}>
              <div className={`card h-100 job-request-card ${
                request.workerAssignedStatus === 'Assigned' ? 'border-success' : 
                request.workerAssignedStatus === 'Completed' ? 'border-info' : 
                'border-warning'}`}>
                <div className="card-header d-flex  justify-content-between align-items-center ">
                  <h5 className="card-title mb-0 text-dark">{request.jobTitle}</h5>
                  <span className={`badge ${
                    request.workerAssignedStatus === 'Assigned' ? 'bg-success' : 
                    request.workerAssignedStatus === 'Completed' ? 'bg-info' : 
                    'bg-warning'}`}>
                    {request.workerAssignedStatus || 'Pending'}
                  </span>
                </div>
                <div className="card-body">
                  <div className="mb-3"><strong>Contact Person:</strong> {request.contactPerson}</div>
                  <div className="mb-3"><strong>Location:</strong> {request.workLocation}</div>
                  <div className="mb-3"><strong>Skills Required:</strong> {request.skillRequired}</div>
                  <div className="mb-3"><strong>Workers Needed:</strong> {request.numOfWorkers}</div>
                  <div className="mb-3"><strong>Duration:</strong> {formatDate(request.startDate)} to {formatDate(request.endDate)}</div>
                  <div className="mb-3"><strong>Daily Wage:</strong> ₹{request.wagePerDay}</div>
                  <p className="card-text job-description-preview"><strong>Description:</strong> {request.jobDescription}</p>
                </div>
                <div className="card-footer">
                  <div className="d-flex justify-content-between mb-2">
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleAssignClick(request)}
                      disabled={request.workerAssignedStatus === 'Completed'}
                    >
                      {request.workerAssignedStatus === 'Assigned' ? 'Assign More' : 'Assign Workers'}
                    </button>
                    
                    <button 
                      className="btn btn-outline-danger"
                      onClick={() => toggleWorkerDisplay(request.jobRequestId)}
                      disabled={!request.assignedWorkerIds || request.assignedWorkerIds.length === 0}
                    >
                      {showingWorkersForJob === request.jobRequestId ? 'Hide Workers' : 'Show & Remove Workers'}
                    </button>
                  </div>
                  
                  {/* Show workers list only when toggled for this specific job */}
                  {showingWorkersForJob === request.jobRequestId && request.assignedWorkerIds && request.assignedWorkerIds.length > 0 && (
                    <div className="mt-3 p-2 border rounded bg-light">
                      <h6 className="mb-2">Assigned Workers:</h6>
                      <ul className="list-group">
                        {request.assignedWorkerIds.map(workerId => (
                          <li key={workerId} className="list-group-item d-flex justify-content-between align-items-center">
                            Worker ID: {workerId}
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => handleRemoveWorkerClick(request, workerId)}
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
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

      {/* Confirmation Modal for Assigning Worker */}
      {showConfirmationModal && (
        <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Assignment</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirmationModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to assign{' '}
                  <strong>{selectedWorker?.fullName}</strong> to the job{' '}
                  <strong>{selectedRequest?.jobTitle}</strong>?
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowConfirmationModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleConfirmAssignment}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Removing Worker Assignment */}
      {showRemoveConfirmationModal && (
        <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Remove Assignment</h5>
                <button type="button" className="btn-close" onClick={() => setShowRemoveConfirmationModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to remove worker {workerIdToRemove} from{' '}
                  <strong>{requestToRemoveWorker?.jobTitle}</strong>?
                </p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowRemoveConfirmationModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleConfirmRemoveWorker}
                >
                  Remove Assignment
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