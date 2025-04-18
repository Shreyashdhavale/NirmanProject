import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Image, InputGroup } from 'react-bootstrap';
import axios from 'axios';

const WorkerProfileModal = ({ show, handleClose, workerId, onUpdateSuccess }) => {
  const [workerData, setWorkerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(true);
  const [updatedData, setUpdatedData] = useState({});
  const [newImages, setNewImages] = useState({
    profilePhoto: null,
    aadhaarPhoto: null,
    alternateDoc: null
  });

  // Reset state when modal is closed
  useEffect(() => {
    if (!show) {
      setWorkerData(null);
      setLoading(true);
      setEditMode(true);
      setUpdatedData({});
      setNewImages({
        profilePhoto: null,
        aadhaarPhoto: null,
        alternateDoc: null
      });
    }
  }, [show]);

  // Fetch worker data when modal is shown and workerId is available
  useEffect(() => {
    if (show && workerId) {
      fetchWorkerData();
    }
  }, [show, workerId]);

  const fetchWorkerData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/workers/${workerId}`);
      setWorkerData(response.data);
      setUpdatedData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching worker details:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdatedData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImages(prev => ({
          ...prev,
          [type]: reader.result
        }));
        setUpdatedData(prev => ({
          ...prev,
          [type]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      Object.keys(updatedData).forEach(key => {
        formData.append(key, updatedData[key]);
      });
      
      await axios.put(`http://localhost:8080/api/workers/${workerId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      onUpdateSuccess();
      setEditMode(false);
    } catch (error) {
      console.error("Error updating worker:", error);
    }
  };

  if (loading) {
    return (
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Body>Loading...</Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{editMode ? 'Edit Worker Profile' : 'Worker Profile'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Personal Information */}
          <h3 className="section-title">Personal Information</h3>
          <Form.Group controlId="fullName" className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={updatedData.fullName || ''}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </Form.Group>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="age">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  name="age"
                  value={updatedData.age || ''}
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="dateOfBirth">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="dateOfBirth"
                  value={updatedData.dateOfBirth || ''}
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="gender" className="mb-3">
            <Form.Label>Gender</Form.Label>
            <div>
              <Form.Check
                inline
                label="Male"
                name="gender"
                type="radio"
                value="male"
                checked={updatedData.gender === "male"}
                onChange={handleInputChange}
                disabled={!editMode}
              />
              <Form.Check
                inline
                label="Female"
                name="gender"
                type="radio"
                value="female"
                checked={updatedData.gender === "female"}
                onChange={handleInputChange}
                disabled={!editMode}
              />
              <Form.Check
                inline
                label="Other"
                name="gender"
                type="radio"
                value="other"
                checked={updatedData.gender === "other"}
                onChange={handleInputChange}
                disabled={!editMode}
              />
            </div>
          </Form.Group>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="contact">
                <Form.Label>Contact Number</Form.Label>
                <InputGroup>
                  <InputGroup.Text>+91</InputGroup.Text>
                  <Form.Control
                    type="tel"
                    name="contact"
                    value={updatedData.contact || ''}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="emergencyContact">
                <Form.Label>Emergency Contact</Form.Label>
                <InputGroup>
                  <InputGroup.Text>+91</InputGroup.Text>
                  <Form.Control
                    type="tel"
                    name="emergencyContact"
                    value={updatedData.emergencyContact || ''}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={updatedData.email || ''}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </Form.Group>
          <Form.Group controlId="streetAddress" className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="streetAddress"
              placeholder="Street Address"
              value={updatedData.streetAddress || ''}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </Form.Group>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="district">
                <Form.Control
                  type="text"
                  name="district"
                  placeholder="District"
                  value={updatedData.district || ''}
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="state">
                <Form.Control
                  type="text"
                  name="state"
                  placeholder="State"
                  value={updatedData.state || ''}
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="pincode">
                <Form.Control
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={updatedData.pincode || ''}
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="maritalStatus" className="mb-3">
            <Form.Label>Marital Status</Form.Label>
            <Form.Select
              name="maritalStatus"
              value={updatedData.maritalStatus || ''}
              onChange={handleInputChange}
              disabled={!editMode}
            >
              <option value="">Select Status</option>
              <option value="single">Single</option>
              <option value="widow">Widow</option>
              <option value="divorced">Divorced</option>
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="physicallyHandicapped" className="mb-3">
            <Form.Label>Physically Challenged</Form.Label>
            <div>
              <Form.Check
                inline
                label="Yes"
                name="physicallyHandicapped"
                type="radio"
                value="yes"
                checked={updatedData.physicallyHandicapped === "yes"}
                onChange={handleInputChange}
                disabled={!editMode}
              />
              <Form.Check
                inline
                label="No"
                name="physicallyHandicapped"
                type="radio"
                value="no"
                checked={updatedData.physicallyHandicapped === "no"}
                onChange={handleInputChange}
                disabled={!editMode}
              />
            </div>
          </Form.Group>
          <Form.Group controlId="criticalIllness" className="mb-3">
            <Form.Label>Critical Illness</Form.Label>
            <Form.Control
              as="textarea"
              name="criticalIllness"
              rows={3}
              value={updatedData.criticalIllness || ''}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </Form.Group>

          {/* Professional Details */}
          <h3 className="section-title">Professional Details</h3>
          <Form.Group controlId="skillSet" className="mb-3">
            <Form.Label>Skill Set</Form.Label>
            <Form.Select
              name="skillSet"
              value={updatedData.skillSet || ''}
              onChange={handleInputChange}
              disabled={!editMode}
            >
              <option value="">Select Skill</option>
                        <option value="Construction Work (Nirmaan Kaam)">Construction Work (Nirmaan Kaam)</option>
                        <option value="Brick Work (Eet Uthana aur Lagana)">Brick Work (Eet Uthana aur Lagana)</option>
                        <option value="Cement Mixing (Cement Milana)">Cement Mixing (Cement Milana)</option>
                        <option value="Digging Work (Gadda Khodna)">Digging Work (Gadda Khodna)</option>
                        <option value="Painting Work (Rangai Putai)">Painting Work (Rangai Putai)</option>
                        <option value="Plumbing Work (Pani Kaam)">Plumbing Work (Pani Kaam)</option>
                        <option value="Electrical Work (Bijli Kaam)">Electrical Work (Bijli Kaam)</option>
                        <option value="Carpentry Work (Khatiya Kaam)">Carpentry Work (Khatiya Kaam)</option>
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
                    
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="skillLevel" className="mb-3">
            <Form.Label>Skill Level</Form.Label>
            <Form.Select
              name="skillLevel"
              value={updatedData.skillLevel || ''}
              onChange={handleInputChange}
              disabled={!editMode}
            >
              <option value="">Select Skill Level</option>
              <option value="Expert">Level 1 (Expert)</option>
              <option value="Moderate">Level 2 (Moderate)</option>
              <option value="Learning">Level 3 (Learning)</option>
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="preferredWorkLocation" className="mb-3">
            <Form.Label>Preferred Work Location</Form.Label>
            <Form.Control
              type="text"
              name="preferredWorkLocation"
              value={updatedData.preferredWorkLocation || ''}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </Form.Group>
          <Form.Group controlId="availability" className="mb-3">
            <Form.Label>Availability</Form.Label>
            <Form.Select
              name="availability"
              value={updatedData.availability || ''}
              onChange={handleInputChange}
              disabled={!editMode}
            >
              <option value="">Select Availability</option>
              <option value="Part-time">Part-time</option>
              <option value="Full-time">Full-time</option>
            </Form.Select>
          </Form.Group>

          {/* Documents */}
          <h3 className="section-title">Documents</h3>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>Profile Photo</Form.Label>
              <div className="mb-2">
                <Image 
                  src={newImages.profilePhoto || updatedData.profilePhoto} 
                  alt="Profile" 
                  fluid 
                  className="mb-2"
                  style={{ maxHeight: '150px' }}
                />
              </div>
              {editMode && (
                <Form.Control
                  type="file"
                  onChange={(e) => handleImageChange(e, 'profilePhoto')}
                  accept="image/*"
                />
              )}
            </Col>
            <Col md={4}>
              <Form.Label>Aadhaar Photo</Form.Label>
              <div className="mb-2">
                <Image 
                  src={newImages.aadhaarPhoto || updatedData.aadhaarPhoto} 
                  alt="Aadhaar" 
                  fluid 
                  className="mb-2"
                  style={{ maxHeight: '150px' }}
                />
              </div>
              {editMode && (
                <Form.Control
                  type="file"
                  onChange={(e) => handleImageChange(e, 'aadhaarPhoto')}
                  accept="image/*"
                />
              )}
            </Col>
            <Col md={4}>
              <Form.Label>Alternate Document</Form.Label>
              <div className="mb-2">
                <Image 
                  src={newImages.alternateDoc || updatedData.alternateDoc} 
                  alt="Alternate Document" 
                  fluid 
                  className="mb-2"
                  style={{ maxHeight: '150px' }}
                />
              </div>
              {editMode && (
                <Form.Control
                  type="file"
                  onChange={(e) => handleImageChange(e, 'alternateDoc')}
                  accept="image/*"
                />
              )}
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {editMode ? (
          <>
            <Button variant="primary" onClick={handleSubmit}>
              Save Changes
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => setEditMode(true)}>
            Edit Profile
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default WorkerProfileModal;