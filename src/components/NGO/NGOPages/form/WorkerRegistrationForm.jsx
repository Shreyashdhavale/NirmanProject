// src/pages/WorkerRegistrationForm.jsx
import React, { useState } from "react";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import axios from "axios";
import "./WorkerRegistrationForm.css";

const WorkerRegistrationForm = () => {
  const initialFormState = {
    // Personal Information
    fullName: "",
    age: "",
    dateOfBirth: "",
    gender: "",
    contact: "",
    emergencyContact: "",
    email: "",
    streetAddress: "",
    district: "",
    state: "",
    pincode: "",
    maritalStatus: "",
    physicallyHandicapped: "",
    criticalIllness: "",
    // Professional Details
    skillSet: "",
    skillLevel: "",
    preferredWorkLocation: "",
    availability: "",
    // Verification
    profilePhoto: null,
    aadhaarPhoto: null,
    alternateDoc: null,
    // Consent
    consent: false,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  // Handle text, radio, and select changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // handle file change event to encode file to base64
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevState) => ({
          ...prevState,
          [name]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle checkbox change (for consent)
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  // Validate all fields in the form
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Personal Information Validations
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Name is required";
      isValid = false;
    }
    if (!formData.age) {
      newErrors.age = "Age is required";
      isValid = false;
    }
    if (!formData.contact) {
      newErrors.contact = "Contact number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = "Enter a valid 10-digit number";
      isValid = false;
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
      isValid = false;
    }

    // Professional Details Validations
    if (!formData.skillSet) {
      newErrors.skillSet = "Select a skill";
      isValid = false;
    }
    if (!formData.skillLevel) {
      newErrors.skillLevel = "Skill level is required";
      isValid = false;
    }
    if (!formData.preferredWorkLocation.trim()) {
      newErrors.preferredWorkLocation = "Preferred work location is required";
      isValid = false;
    }
    if (!formData.availability) {
      newErrors.availability = "Availability is required";
      isValid = false;
    }

    // Verification Validations
    if (!formData.profilePhoto) {
      newErrors.profilePhoto = "Profile photo is required";
      isValid = false;
    }
    if (!formData.aadhaarPhoto) {
      newErrors.aadhaarPhoto = "Aadhaar photo is required";
      isValid = false;
    }

    // Consent Validation
    if (!formData.consent) {
      newErrors.consent = "You must provide your consent";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission and send data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit button clicked!");

    if (!validateForm()) {
      console.log("Validation failed", errors);
      return;
    }

    // Create a FormData object for multipart/form-data
    const data = new FormData();
    // Append text fields
    data.append("fullName", formData.fullName);
    data.append("age", formData.age);
    data.append("dateOfBirth", formData.dateOfBirth);
    data.append("gender", formData.gender);
    data.append("contact", formData.contact);
    data.append("emergencyContact", formData.emergencyContact);
    data.append("email", formData.email);
    data.append("streetAddress", formData.streetAddress);
    data.append("district", formData.district);
    data.append("state", formData.state);
    data.append("pincode", formData.pincode);
    data.append("maritalStatus", formData.maritalStatus);
    data.append("physicallyHandicapped", formData.physicallyHandicapped);
    data.append("criticalIllness", formData.criticalIllness);
    data.append("skillSet", formData.skillSet);
    data.append("skillLevel", formData.skillLevel);
    data.append("preferredWorkLocation", formData.preferredWorkLocation);
    data.append("availability", formData.availability);
    data.append("consent", formData.consent);

    // Append files if available
    if (formData.profilePhoto) {
      data.append("profilePhoto", formData.profilePhoto);
    }
    if (formData.aadhaarPhoto) {
      data.append("aadhaarPhoto", formData.aadhaarPhoto);
    }
    if (formData.alternateDoc) {
      data.append("alternateDoc", formData.alternateDoc);
    }

    console.log("Form data built, sending request...");
    try {
      console.log("Aadhaar file:", formData.aadhaarPhoto);

      const response = await axios.post(
        "http://localhost:8080/api/workers",
        data
      );
      console.log("Response from backend:", response.data);
      alert("Worker registered successfully!");
      // Reset the form after successful submission
      setFormData(initialFormState);
      setErrors({});
    } catch (error) {
      console.error("Error registering worker:", error);
      alert("Error registering worker. Please try again.");
    }
  };

  return (
    <Container className="custom-form-container">
      <Form onSubmit={handleSubmit}>
        <h2 className="form-title">Worker Registration Form</h2>

        {/* Personal Information */}
        <h3 className="section-title">Personal Information</h3>
        <Form.Group controlId="fullName" className="mb-3">
          <Form.Label>Full Name *</Form.Label>
          <Form.Control
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            isInvalid={!!errors.fullName}
          />
          <Form.Control.Feedback type="invalid">
            {errors.fullName}
          </Form.Control.Feedback>
        </Form.Group>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="age">
              <Form.Label>Age *</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                isInvalid={!!errors.age}
              />
              <Form.Control.Feedback type="invalid">
                {errors.age}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="dateOfBirth">
              <Form.Label>Date of Birth *</Form.Label>
              <Form.Control
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="gender" className="mb-3">
          <Form.Label>Gender *</Form.Label>
          <div>
            <Form.Check
              inline
              label="Male"
              name="gender"
              type="radio"
              value="male"
              checked={formData.gender === "male"}
              onChange={handleChange}
            />
            <Form.Check
              inline
              label="Female"
              name="gender"
              type="radio"
              value="female"
              checked={formData.gender === "female"}
              onChange={handleChange}
            />
            <Form.Check
              inline
              label="Other"
              name="gender"
              type="radio"
              value="other"
              checked={formData.gender === "other"}
              onChange={handleChange}
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
                  value={formData.contact}
                  onChange={handleChange}
                  isInvalid={!!errors.contact}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.contact}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="emergencyContact">
              <Form.Label>Emergency Contact *</Form.Label>
              <InputGroup>
                <InputGroup.Text>+91</InputGroup.Text>
                <Form.Control
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                />
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email Address (Optional)</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="streetAddress" className="mb-3">
          <Form.Label>Address *</Form.Label>
          <Form.Control
            type="text"
            name="streetAddress"
            placeholder="Street Address"
            value={formData.streetAddress}
            onChange={handleChange}
          />
        </Form.Group>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="district">
              <Form.Control
                type="text"
                name="district"
                placeholder="District"
                value={formData.district}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="state">
              <Form.Control
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="pincode" className="mb-3">
          <Form.Control
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="maritalStatus" className="mb-3">
          <Form.Label>Marital Status *</Form.Label>
          <Form.Select
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleChange}
          >
            <option value="">Select Status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="widow">Widow</option>
            <option value="divorced">Divorced</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="physicallyHandicapped" className="mb-3">
          <Form.Label>Physically Challenged *</Form.Label>
          <div>
            <Form.Check
              inline
              label="Yes"
              name="physicallyHandicapped"
              type="radio"
              value="yes"
              checked={formData.physicallyHandicapped === "yes"}
              onChange={handleChange}
            />
            <Form.Check
              inline
              label="No"
              name="physicallyHandicapped"
              type="radio"
              value="no"
              checked={formData.physicallyHandicapped === "no"}
              onChange={handleChange}
            />
          </div>
        </Form.Group>

        <Form.Group controlId="criticalIllness" className="mb-3">
          <Form.Label>Critical Illness (Optional)</Form.Label>
          <Form.Control
            as="textarea"
            name="criticalIllness"
            rows={3}
            value={formData.criticalIllness}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Professional Details */}
        <h3 className="section-title">Professional Details</h3>
        <Form.Group controlId="skillSet" className="mb-3">
          <Form.Label>Skill Set *</Form.Label>
          <Form.Select
            name="skillSet"
            value={formData.skillSet}
            onChange={handleChange}
            isInvalid={!!errors.skillSet}
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
          <Form.Control.Feedback type="invalid">
            {errors.skillSet}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="skillLevel" className="mb-3">
          <Form.Label>Skill Level *</Form.Label>
          <Form.Select
            name="skillLevel"
            value={formData.skillLevel}
            onChange={handleChange}
            isInvalid={!!errors.skillLevel}
          >
            <option value="">Select Skill Level</option>
            <option value="Expert">Level 1 (Expert)</option>
            <option value="Moderate">Level 2 (Moderate)</option>
            <option value="Learning">Level 3 (Learning)</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.skillLevel}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="preferredWorkLocation" className="mb-3">
          <Form.Label>Preferred Work Location *</Form.Label>
          <Form.Control
            type="text"
            name="preferredWorkLocation"
            value={formData.preferredWorkLocation}
            onChange={handleChange}
            isInvalid={!!errors.preferredWorkLocation}
          />
          <Form.Control.Feedback type="invalid">
            {errors.preferredWorkLocation}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="availability" className="mb-3">
          <Form.Label>Availability *</Form.Label>
          <Form.Select
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            isInvalid={!!errors.availability}
          >
            <option value="">Select Availability</option>
            <option value="Part-time">Part-time</option>
            <option value="Full-time">Full-time</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.availability}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Verification */}
        <h3 className="section-title">Verification</h3>
        <Form.Group controlId="profilePhoto" className="mb-3">
          <Form.Label>Profile Photo *</Form.Label>
          <Form.Control
            type="file"
            name="profilePhoto"
            onChange={handleFileChange}
            isInvalid={!!errors.profilePhoto}
          />
          <Form.Control.Feedback type="invalid">
            {errors.profilePhoto}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="aadhaarPhoto" className="mb-3">
          <Form.Label>Aadhaar Card Photo Upload *</Form.Label>
          <Form.Control
            type="file"
            name="aadhaarPhoto"
            onChange={handleFileChange}
            isInvalid={!!errors.aadhaarPhoto}
          />
          <Form.Control.Feedback type="invalid">
            {errors.aadhaarPhoto}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="alternateDoc" className="mb-3">
          <Form.Label>
            Alternate Verification or Identification Documents
          </Form.Label>
          <Form.Control
            type="file"
            name="alternateDoc"
            onChange={handleFileChange}
          />
        </Form.Group>

        {/* Consent */}
        <h3 className="section-title">Consent</h3>
        <Form.Group controlId="consent" className="mb-3">
          <Form.Check
            type="checkbox"
            name="consent"
            label="I confirm that the information provided in this form is valid and accurate."
            checked={formData.consent}
            onChange={handleCheckboxChange}
            isInvalid={!!errors.consent}
          />
          {errors.consent && (
            <div className="text-danger">{errors.consent}</div>
          )}
        </Form.Group>

        <Button className="submit-button" variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default WorkerRegistrationForm;
