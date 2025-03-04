import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './JobProviderForm.css';

const JobProviderForm = ({ user }) => {
  // Initialize jobProviderId here.
  // You could pass it as a prop or retrieve it from context if needed.
  const [formData, setFormData] = useState({
    jobProviderId: user?.jobProviderId || "",
    // Employer Details
    location: "",
    contactPerson: "",
    contactNumber: "",
    email: "",
    address: "",
    district: "",
    state: "",
    pincode: "",

    // Job Details
    jobTitle: "",
    jobDescription: "",
    skillRequired: "",
    skillLevel: "",
    numOfWorkers: "",
    workLocation: "",
    startDate: "",
    endDate: "",
    wagePerDay: "",
    workingHours: "",
    jobType: "", // Full-time / Part-time

    // Verification
    employerIdProofBase64: "",

    // Consent
    consent: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    body: '',
    type: 'success'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prevData => ({
          ...prevData,
          employerIdProofBase64: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const showMessageModal = (title, body, type = 'success') => {
    setModalContent({ title, body, type });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user?.jobProviderId);
    
    if (!formData.consent) {
      showMessageModal('Consent Required', 'You must provide consent to submit the form', 'danger');
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      // The jobProviderId field will now be sent along with the rest of the form data.
      const response = await axios.post('http://localhost:8080/api/jobs', formData);
      setMessage({ type: 'success', text: 'Job posting submitted successfully!' });
      showMessageModal('Success', 'Job posting submitted successfully!');
      
      // Reset form after successful submission, preserving jobProviderId if necessary.
      setFormData(prevData => ({
        ...prevData,
        location: "",
        contactPerson: "",
        contactNumber: "",
        email: "",
        address: "",
        district: "",
        state: "",
        pincode: "",
        jobTitle: "",
        jobDescription: "",
        skillRequired: "",
        skillLevel: "",
        numOfWorkers: "",
        workLocation: "",
        startDate: "",
        endDate: "",
        wagePerDay: "",
        workingHours: "",
        jobType: "",
        employerIdProofBase64: "",
        consent: false,
      }));
    } catch (error) {
      console.error('Submission error:', error);
      showMessageModal(
        'Submission Error', 
        error.response?.data?.message || 'Failed to submit job posting. Please try again.',
        'danger'
      );
    } finally {
      setLoading(false);
    }
  };

  // Modal component
  const Modal = () => {
    if (!showModal) return null;
    
    return (
      <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className={`modal-header bg-${modalContent.type === 'success' ? 'success' : 'danger'} text-white`}>
              <h5 className="modal-title">{modalContent.title}</h5>
              <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
            </div>
            <div className="modal-body">
              <p>{modalContent.body}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="card-title mb-0 text-center">Employment Posting Form</h2>
            </div>
            
            <div className="card-body">
              {message && (
                <div className={`alert alert-${message.type}`} role="alert">
                  {message.text}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                {/* Hidden field for JobProviderId */}
                <input 
                  type="hidden" 
                  name="jobProviderId" 
                  value={formData.jobProviderId} 
                />

                {/* Employer Details Section */}
                <div className="mb-4">
                  <h3 className="form-section-title border-bottom pb-2 mb-4">Employer Details</h3>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="contactPerson" className="form-label">Contact Person*</label>
                      <input
                        type="text"
                        className="form-control"
                        id="contactPerson"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="contactNumber" className="form-label">Contact Number*</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="contactNumber"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label">Email*</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="location" className="form-label">Location*</label>
                      <input
                        type="text"
                        className="form-control"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="address" className="form-label">Address*</label>
                      <textarea
                        className="form-control"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="district" className="form-label">District*</label>
                      <input
                        type="text"
                        className="form-control"
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="state" className="form-label">State*</label>
                      <input
                        type="text"
                        className="form-control"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="pincode" className="form-label">Pincode*</label>
                      <input
                        type="text"
                        className="form-control"
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Job Details Section */}
                <div className="mb-4">
                  <h3 className="form-section-title border-bottom pb-2 mb-4">Job Details</h3>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="jobTitle" className="form-label">Job Title*</label>
                      <input
                        type="text"
                        className="form-control"
                        id="jobTitle"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="jobType" className="form-label">Job Type*</label>
                      <select
                        className="form-select"
                        id="jobType"
                        name="jobType"
                        value={formData.jobType}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label htmlFor="jobDescription" className="form-label">Job Description*</label>
                      <textarea
                        className="form-control"
                        id="jobDescription"
                        name="jobDescription"
                        value={formData.jobDescription}
                        onChange={handleChange}
                        rows="4"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="skillRequired" className="form-label">Skills Required*</label>
                      <select
                        className="form-select"
                        id="skillRequired"
                        name="skillRequired"
                        value={formData.skillRequired}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Skill</option>
                        <option value="Construction Work (Nirmaan Kaam)">Construction Work (Nirmaan Kaam)</option>
                        <option value="Brick Work (Eet Uthana aur Lagana)">Brick Work (Eet Uthana aur Lagana)</option>
                        <option value="Cement Mixing (Cement Milana)">Cement Mixing (Cement Milana)</option>
                        <option value="Digging Work (Gadda Khodna)">Digging Work (Gadda Khodna)</option>
                        <option value="Painting Work (Rangai Putai)">Painting Work (Rangai Putai)</option>
                        <option value="Loading and Unloading (Bojh Uthana aur Utarna)">Loading and Unloading (Bojh Uthana aur Utarna)</option>
                        <option value="Road Cleaning (Sadak Safai)">Road Cleaning (Sadak Safai)</option>
                        <option value="Building Cleaning (Imarat Safai)">Building Cleaning (Imarat Safai)</option>
                        <option value="Toilet Cleaning (Sauchalaya Safai)">Toilet Cleaning (Sauchalaya Safai)</option>
                        <option value="Farming Work (Kheti Ka Kaam)">Farming Work (Kheti Ka Kaam)</option>
                        <option value="Cutting Crops (Fasal Kaatna)">Cutting Crops (Fasal Kaatna)</option>
                        <option value="Planting Seeds (Beej Bona)">Planting Seeds (Beej Bona)</option>
                        <option value="Watering Fields (Paani Dena)">Watering Fields (Paani Dena)</option>
                        <option value="Removing Weeds (Ghas Phus Hatana)">Removing Weeds (Ghas Phus Hatana)</option>
                        <option value="Road Making (Sadak Banana)">Road Making (Sadak Banana)</option>
                        <option value="Tar and Concrete Work (Tar aur Cement Ka Kaam)">Tar and Concrete Work (Tar aur Cement Ka Kaam)</option>
                        <option value="Helper Work (Madadgaar Kaam)">Helper Work (Madadgaar Kaam)</option>
                        <option value="Shop Helper (Dukaan Mein Madad Karna)">Shop Helper (Dukaan Mein Madad Karna)</option>
                        <option value="Loading Goods in Market (Bazaar Mein Saman Ladna)">Loading Goods in Market (Bazaar Mein Saman Ladna)</option>
                        <option value="Transport Work (Parivahan Ka Kaam)">Transport Work (Parivahan Ka Kaam)</option>
                        <option value="Rickshaw or Cart Pulling (Thela Chalana)">Rickshaw or Cart Pulling (Thela Chalana)</option>
                        <option value="Factory Work (Factory Mein Kaam)">Factory Work (Factory Mein Kaam)</option>
                        <option value="Packing Work (Saman Pack Karna)">Packing Work (Saman Pack Karna)</option>
                        <option value="Machine Cleaning (Machine Saaf Karna)">Machine Cleaning (Machine Saaf Karna)</option>
                        <option value="House Cleaning (Ghar Ki Safai)">House Cleaning (Ghar Ki Safai)</option>
                        <option value="Washing Utensils (Bartan Dhona)">Washing Utensils (Bartan Dhona)</option>
                        <option value="Washing Clothes (Kapde Dhona)">Washing Clothes (Kapde Dhona)</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="skillLevel" className="form-label">Skill Level*</label>
                      <select
                        className="form-select"
                        id="skillLevel"
                        name="skillLevel"
                        value={formData.skillLevel}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="numOfWorkers" className="form-label">Number of Workers*</label>
                      <input
                        type="number"
                        className="form-control"
                        id="numOfWorkers"
                        name="numOfWorkers"
                        value={formData.numOfWorkers}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-8">
                      <label htmlFor="workLocation" className="form-label">Work Location*</label>
                      <input
                        type="text"
                        className="form-control"
                        id="workLocation"
                        name="workLocation"
                        value={formData.workLocation}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="startDate" className="form-label">Start Date*</label>
                      <input
                        type="date"
                        className="form-control"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="endDate" className="form-label">End Date*</label>
                      <input
                        type="date"
                        className="form-control"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="wagePerDay" className="form-label">Wage Per Day (₹)*</label>
                      <input
                        type="number"
                        className="form-control"
                        id="wagePerDay"
                        name="wagePerDay"
                        value={formData.wagePerDay}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="workingHours" className="form-label">Working Hours*</label>
                      <input
                        type="text"
                        className="form-control"
                        id="workingHours"
                        name="workingHours"
                        value={formData.workingHours}
                        onChange={handleChange}
                        placeholder="e.g. 9AM-5PM"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Verification Section */}
                <div className="mb-4">
                  <h3 className="form-section-title border-bottom pb-2 mb-4">Verification</h3>
                  <div className="row g-3">
                    <div className="col-12">
                      <label htmlFor="employerIdProof" className="form-label">Employer ID Proof*</label>
                      <input
                        type="file"
                        className="form-control"
                        id="employerIdProof"
                        name="employerIdProof"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        required
                      />
                      <div className="form-text">Upload a government-issued ID (Aadhar, PAN, etc.)</div>
                    </div>
                  </div>
                </div>
                
                {/* Consent */}
                <div className="mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="consent"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-check-label" htmlFor="consent">
                      I consent to the processing of my personal data and agree to the terms and conditions
                    </label>
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : 'Submit Job Posting'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal Component */}
      <Modal />
    </div>
  );
};

export default JobProviderForm;
