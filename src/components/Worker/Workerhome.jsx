// src/pages/WorkerProfile.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Button, InputGroup, Spinner, Image } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "./WorkerProfile.css";

const WorkerProfile = ({ onLogin }) => {
    const location = useLocation();
    const { workerId } = location.state || {};
    
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [workerData, setWorkerData] = useState(null);
    const [updatedData, setUpdatedData] = useState({});
    const [newImages, setNewImages] = useState({
        profilePhoto: null,
        aadhaarPhoto: null,
        alternateDoc: null
    });

    // Fetch worker data on component mount
    useEffect(() => {
        const fetchWorkerData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8080/api/workers/${workerId}`);
                const workerData = response.data;
                setWorkerData(workerData);
                setUpdatedData(workerData);
                setLoading(false);
            } catch (err) {
                toast.error("Failed to fetch worker data. Please try again later.");
                setLoading(false);
                console.error("Error fetching worker data:", err);
            }
        };

        fetchWorkerData();
    }, [workerId]);

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
            
            const response = await axios.put(
                `http://localhost:8080/api/workers/${workerId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            toast.success("Profile updated successfully!");
            setWorkerData(response.data);
            setUpdatedData(response.data);
            setNewImages({
                profilePhoto: null,
                aadhaarPhoto: null,
                alternateDoc: null
            });
            setEditMode(false);
        } catch (err) {
            toast.error("Failed to update profile. Please try again.");
            console.error("Error updating worker:", err);
        }
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleCancel = () => {
        setEditMode(false);
        setUpdatedData(workerData);
        setNewImages({
            profilePhoto: null,
            aadhaarPhoto: null,
            alternateDoc: null
        });
    };

    if (loading || !workerData) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p>Loading profile data...</p>
            </Container>
        );
    }

    return (
        <Container className="worker-profile-container">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            
            <h2 className="profile-title">Worker Profile</h2>

            {!editMode ? (
                // View Mode
                <div className="profile-view">
                    <Row>
                        <Col md={4}>
                            <div className="profile-photo-container">
                                {workerData.profilePhoto ? (
                                    <Image 
                                        src={workerData.profilePhoto} 
                                        alt="Profile" 
                                        fluid
                                        className="profile-photo"
                                    />
                                ) : (
                                    <div className="no-photo">No Profile Photo</div>
                                )}
                            </div>

                            <div className="verification-section mt-4">
                                <h5>Verification Documents</h5>
                                {workerData.aadhaarPhoto && (
                                    <div className="document-preview mb-2">
                                        <p>Aadhaar Card:</p>
                                        <Image 
                                            src={workerData.aadhaarPhoto} 
                                            alt="Aadhaar Card" 
                                            fluid
                                            className="document-image"
                                        />
                                    </div>
                                )}
                                {workerData.alternateDoc && (
                                    <div className="document-preview">
                                        <p>Alternate Document:</p>
                                        <Image 
                                            src={workerData.alternateDoc} 
                                            alt="Alternate Document" 
                                            fluid
                                            className="document-image"
                                        />
                                    </div>
                                )}
                            </div>
                        </Col>

                        <Col md={8}>
                            <div className="personal-info-section">
                                <h4>Personal Information</h4>
                                <hr />
                                <Row>
                                    <Col md={6}>
                                        <p><strong>Full Name:</strong> {workerData.fullName || "Not provided"}</p>
                                        <p><strong>Age:</strong> {workerData.age || "Not provided"}</p>
                                        <p><strong>Date of Birth:</strong> {workerData.dateOfBirth || "Not provided"}</p>
                                        <p><strong>Gender:</strong> {workerData.gender || "Not provided"}</p>
                                    </Col>
                                    <Col md={6}>
                                        <p><strong>Contact:</strong> {workerData.contact ? `+91 ${workerData.contact}` : "Not provided"}</p>
                                        <p><strong>Emergency Contact:</strong> {workerData.emergencyContact ? `+91 ${workerData.emergencyContact}` : "Not provided"}</p>
                                        <p><strong>Email:</strong> {workerData.email || "Not provided"}</p>
                                        <p><strong>Marital Status:</strong> {workerData.maritalStatus || "Not provided"}</p>
                                    </Col>
                                </Row>

                                <p className="mt-3"><strong>Address:</strong></p>
                                <p>{workerData.streetAddress || "Not provided"}</p>
                                <p>{workerData.district && `${workerData.district}, ${workerData.state} - ${workerData.pincode}`}</p>

                                <p className="mt-3"><strong>Physically Challenged:</strong> {workerData.physicallyHandicapped || "Not provided"}</p>
                                {workerData.criticalIllness && (
                                    <p><strong>Critical Illness:</strong> {workerData.criticalIllness}</p>
                                )}
                            </div>

                            <div className="professional-info-section mt-4">
                                <h4>Professional Details</h4>
                                <hr />
                                <Row>
                                    <Col md={6}>
                                        <p><strong>Skill Set:</strong> {workerData.skillSet || "Not provided"}</p>
                                        <p><strong>Skill Level:</strong> {workerData.skillLevel || "Not provided"}</p>
                                    </Col>
                                    <Col md={6}>
                                        <p><strong>Preferred Work Location:</strong> {workerData.preferredWorkLocation || "Not provided"}</p>
                                        <p><strong>Availability:</strong> {workerData.availability || "Not provided"}</p>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <div className="text-end mb-4">
                        <Button variant="primary" onClick={handleEdit}>
                            Edit Profile
                        </Button>
                    </div>
                </div>
            ) : (
                // Edit Mode
                <Form>
                    {/* Personal Information */}
                    <h3 className="section-title">Personal Information</h3>
                    <Form.Group controlId="fullName" className="mb-3">
                        <Form.Label>Full Name *</Form.Label>
                        <Form.Control
                            type="text"
                            name="fullName"
                            value={updatedData.fullName || ''}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="age">
                                <Form.Label>Age *</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="age"
                                    value={updatedData.age || ''}
                                    onChange={handleInputChange}
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
                            />
                            <Form.Check
                                inline
                                label="Female"
                                name="gender"
                                type="radio"
                                value="female"
                                checked={updatedData.gender === "female"}
                                onChange={handleInputChange}
                            />
                            <Form.Check
                                inline
                                label="Other"
                                name="gender"
                                type="radio"
                                value="other"
                                checked={updatedData.gender === "other"}
                                onChange={handleInputChange}
                            />
                        </div>
                    </Form.Group>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="contact">
                                <Form.Label>Contact Number *</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>+91</InputGroup.Text>
                                    <Form.Control
                                        type="tel"
                                        name="contact"
                                        value={updatedData.contact || ''}
                                        onChange={handleInputChange}
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
                        />
                    </Form.Group>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="district">
                                <Form.Control
                                    type="text"
                                    name="district"
                                    placeholder="District"
                                    value={updatedData.district || ''}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="state">
                                <Form.Control
                                    type="text"
                                    name="state"
                                    placeholder="State"
                                    value={updatedData.state || ''}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group controlId="pincode" className="mb-3">
                        <Form.Control
                            type="text"
                            name="pincode"
                            placeholder="Pincode"
                            value={updatedData.pincode || ''}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="maritalStatus" className="mb-3">
                        <Form.Label>Marital Status</Form.Label>
                        <Form.Select
                            name="maritalStatus"
                            value={updatedData.maritalStatus || ''}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Status</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
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
                            />
                            <Form.Check
                                inline
                                label="No"
                                name="physicallyHandicapped"
                                type="radio"
                                value="no"
                                checked={updatedData.physicallyHandicapped === "no"}
                                onChange={handleInputChange}
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
                        />
                    </Form.Group>

                    {/* Professional Details */}
                    <h3 className="section-title">Professional Details</h3>
                    <Form.Group controlId="skillSet" className="mb-3">
                        <Form.Label>Skill Set *</Form.Label>
                        <Form.Select
                            name="skillSet"
                            value={updatedData.skillSet || ''}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Skill</option>
                            <option value="Construction Work (Nirmaan Kaam)">
                                Construction Work (Nirmaan Kaam)
                            </option>
                            <option value="Brick Work (Eet Uthana aur Lagana)">
                                Brick Work (Eet Uthana aur Lagana)
                            </option>
                            <option value="Cement Mixing (Cement Milana)">
                                Cement Mixing (Cement Milana)
                            </option>
                            <option value="Digging Work (Gadda Khodna)">
                                Digging Work (Gadda Khodna)
                            </option>
                            <option value="Painting Work (Rangai Putai)">
                                Painting Work (Rangai Putai)
                            </option>
                            <option value="Loading and Unloading (Bojh Uthana aur Utarna)">
                                Loading and Unloading (Bojh Uthana aur Utarna)
                            </option>
                            <option value="Road Cleaning (Sadak Safai)">
                                Road Cleaning (Sadak Safai)
                            </option>
                            <option value="Building Cleaning (Imarat Safai)">
                                Building Cleaning (Imarat Safai)
                            </option>
                            <option value="Toilet Cleaning (Sauchalaya Safai)">
                                Toilet Cleaning (Sauchalaya Safai)
                            </option>
                            <option value="Farming Work (Kheti Ka Kaam)">
                                Farming Work (Kheti Ka Kaam)
                            </option>
                            <option value="Cutting Crops (Fasal Kaatna)">
                                Cutting Crops (Fasal Kaatna)
                            </option>
                            <option value="Planting Seeds (Beej Bona)">
                                Planting Seeds (Beej Bona)
                            </option>
                            <option value="Watering Fields (Paani Dena)">
                                Watering Fields (Paani Dena)
                            </option>
                            <option value="Removing Weeds (Ghas Phus Hatana)">
                                Removing Weeds (Ghas Phus Hatana)
                            </option>
                            <option value="Road Making (Sadak Banana)">
                                Road Making (Sadak Banana)
                            </option>
                            <option value="Tar and Concrete Work (Tar aur Cement Ka Kaam)">
                                Tar and Concrete Work (Tar aur Cement Ka Kaam)
                            </option>
                            <option value="Helper Work (Madadgaar Kaam)">
                                Helper Work (Madadgaar Kaam)
                            </option>
                            <option value="Shop Helper (Dukaan Mein Madad Karna)">
                                Shop Helper (Dukaan Mein Madad Karna)
                            </option>
                            <option value="Loading Goods in Market (Bazaar Mein Saman Ladna)">
                                Loading Goods in Market (Bazaar Mein Saman Ladna)
                            </option>
                            <option value="Transport Work (Parivahan Ka Kaam)">
                                Transport Work (Parivahan Ka Kaam)
                            </option>
                            <option value="Rickshaw or Cart Pulling (Thela Chalana)">
                                Rickshaw or Cart Pulling (Thela Chalana)
                            </option>
                            <option value="Factory Work (Factory Mein Kaam)">
                                Factory Work (Factory Mein Kaam)
                            </option>
                            <option value="Packing Work (Saman Pack Karna)">
                                Packing Work (Saman Pack Karna)
                            </option>
                            <option value="Machine Cleaning (Machine Saaf Karna)">
                                Machine Cleaning (Machine Saaf Karna)
                            </option>
                            <option value="House Cleaning (Ghar Ki Safai)">
                                House Cleaning (Ghar Ki Safai)
                            </option>
                            <option value="Washing Utensils (Bartan Dhona)">
                                Washing Utensils (Bartan Dhona)
                            </option>
                            <option value="Washing Clothes (Kapde Dhona)">
                                Washing Clothes (Kapde Dhona)
                            </option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId="skillLevel" className="mb-3">
                        <Form.Label>Skill Level *</Form.Label>
                        <Form.Select
                            name="skillLevel"
                            value={updatedData.skillLevel || ''}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Skill Level</option>
                            <option value="Expert">Level 1 (Expert)</option>
                            <option value="Moderate">Level 2 (Moderate)</option>
                            <option value="Learning">Level 3 (Learning)</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId="preferredWorkLocation" className="mb-3">
                        <Form.Label>Preferred Work Location *</Form.Label>
                        <Form.Control
                            type="text"
                            name="preferredWorkLocation"
                            value={updatedData.preferredWorkLocation || ''}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="availability" className="mb-3">
                        <Form.Label>Availability *</Form.Label>
                        <Form.Select
                            name="availability"
                            value={updatedData.availability || ''}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Availability</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Full-time">Full-time</option>
                        </Form.Select>
                    </Form.Group>

                    {/* Verification Documents */}
                    <h3 className="section-title">Verification Documents</h3>
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
                            <Form.Control
                                type="file"
                                onChange={(e) => handleImageChange(e, 'profilePhoto')}
                                accept="image/*"
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Label>Aadhaar Card</Form.Label>
                            <div className="mb-2">
                                <Image 
                                    src={newImages.aadhaarPhoto || updatedData.aadhaarPhoto} 
                                    alt="Aadhaar" 
                                    fluid 
                                    className="mb-2"
                                    style={{ maxHeight: '150px' }}
                                />
                            </div>
                            <Form.Control
                                type="file"
                                onChange={(e) => handleImageChange(e, 'aadhaarPhoto')}
                                accept="image/*"
                            />
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
                            <Form.Control
                                type="file"
                                onChange={(e) => handleImageChange(e, 'alternateDoc')}
                                accept="image/*"
                            />
                        </Col>
                    </Row>

                    <div className="text-end mb-4">
                        <Button variant="secondary" onClick={handleCancel} className="me-2">
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            Save Changes
                        </Button>
                    </div>
                </Form>
            )}
        </Container>
    );
};

export default WorkerProfile;