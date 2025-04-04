import React, { useState, useEffect } from "react";
import { Button, Row, Col, Image, Card, Form, Spinner, Alert } from 'react-bootstrap';

const WorkerHome = ({ workerData: initialWorkerData, handleLogout, handleSaveProfile }) => {
    // State management
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState(initialWorkerData || {});
    const [fileUploads, setFileUploads] = useState({
        profilePhoto: null,
        aadhaarPhoto: null,
        alternateDoc: null
    });
    const [previewImages, setPreviewImages] = useState({
        profilePhoto: null,
        aadhaarPhoto: null,
        alternateDoc: null
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Initialize form data when props change
    useEffect(() => {
        setFormData(initialWorkerData || {});
    }, [initialWorkerData]);

    const toggleEditMode = () => {
        if (isEditMode) {
            // Reset to original data when cancelling
            setFormData(initialWorkerData);
            clearImagePreviews();
            setError(null);
            setSuccess(null);
        }
        setIsEditMode(!isEditMode);
    };

    const clearImagePreviews = () => {
        // Revoke object URLs to prevent memory leaks
        Object.values(previewImages).forEach(url => {
            if (url) URL.revokeObjectURL(url);
        });
        setPreviewImages({
            profilePhoto: null,
            aadhaarPhoto: null,
            alternateDoc: null
        });
        setFileUploads({
            profilePhoto: null,
            aadhaarPhoto: null,
            alternateDoc: null
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setError(null);
        
        if (files && files[0]) {
            const file = files[0];
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            
            // Validate file type
            if (!validImageTypes.includes(file.type)) {
                setError(`Invalid file type for ${name}. Please upload JPEG, PNG, or GIF.`);
                return;
            }
            
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                setError(`File too large for ${name}. Maximum size is 5MB.`);
                return;
            }

            // Revoke previous preview URL if exists
            if (previewImages[name]) {
                URL.revokeObjectURL(previewImages[name]);
            }

            // Store the file and create preview
            setFileUploads(prev => ({
                ...prev,
                [name]: file
            }));
            
            const previewUrl = URL.createObjectURL(file);
            setPreviewImages(prev => ({
                ...prev,
                [name]: previewUrl
            }));
        }
    };

    const validateForm = () => {
        // Required fields validation
        if (!formData.fullName?.trim()) {
            setError("Full Name is required");
            return false;
        }
        
        if (!formData.contact?.trim()) {
            setError("Contact number is required");
            return false;
        }
        
        // Validate contact number format
        const contactRegex = /^[0-9]{10,15}$/;
        if (!contactRegex.test(formData.contact)) {
            setError("Please enter a valid contact number (10-15 digits)");
            return false;
        }
        
        if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
            setError("Please enter a valid email address");
            return false;
        }
        
        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) return;
    
        setIsSaving(true);
        setError(null);
        setSuccess(null);
        setDebugInfo(null);
    
        try {
            // Always use FormData to handle both regular fields and files consistently
            const submitData = new FormData();
    
            // Add all form data fields to FormData
            Object.keys(formData).forEach(key => {
                // Skip fields that are handled as files
                if (!['profilePhoto', 'aadhaarPhoto', 'alternateDoc'].includes(key)) {
                    const value = formData[key];
                    if (value !== null && value !== undefined) {
                        // Convert all values to strings for FormData
                        submitData.append(key, value.toString());
                    }
                }
            });
    
            // Add files to FormData if they exist
            Object.entries(fileUploads).forEach(([key, file]) => {
                if (file) {
                    submitData.append(key, file, file.name || `${key}.jpg`);
                } else if (formData[key]) {
                    // If no new file but existing file reference, keep the existing
                    submitData.append(key, formData[key]);
                }
            });
    
            // Debug information
            const debugData = {
                formKeys: Array.from(submitData.keys()),
                fileUploads: Object.keys(fileUploads).filter(k => fileUploads[k] !== null)
                    .map(k => ({
                        field: k,
                        type: fileUploads[k]?.type || 'unknown',
                        size: fileUploads[k]?.size || 0,
                        name: fileUploads[k]?.name || 'unnamed'
                    })),
                timestamp: new Date().toISOString()
            };
            
            console.debug("Submitting data:", debugData);
            
            const response = await handleSaveProfile(submitData);
            
            if (!response) {
                throw new Error("No response received from server");
            }
            
            // Handle different response formats
            if (response.error) {
                throw new Error(response.error);
            }
            
            if (response.message && response.status >= 400) {
                throw new Error(response.message);
            }
            
            clearImagePreviews();
            setIsEditMode(false);
            setSuccess(response.message || "Profile saved successfully!");
            
        } catch (err) {
            console.error("Save failed:", err);
            setError(err.message || "Failed to save profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const SafeImage = ({ src, alt, imageType }) => {
        const displaySrc = previewImages[imageType] || src;
        
        if (!displaySrc) {
            return (
                <div className="d-flex align-items-center justify-content-center bg-light" 
                     style={{ width: '150px', height: '150px' }}>
                    <span className="text-muted">No image</span>
                </div>
            );
        }

        let imageSrc = displaySrc;
        if (!displaySrc.startsWith('blob:') && !displaySrc.startsWith('data:image')) {
            if (displaySrc.startsWith("/")) {
                imageSrc = `http://localhost:8080${displaySrc}`;
            } else if (typeof displaySrc === "string" && displaySrc.length > 100) {
                imageSrc = `data:image/png;base64,${displaySrc}`;
            }
        }

        return (
            <Image 
                src={imageSrc} 
                alt={alt} 
                fluid 
                className="rounded shadow-sm" 
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                onError={(e) => {
                    console.error(`Error loading ${alt} image`);
                    e.target.style.display = "none";
                }}
            />
        );
    };

    const renderField = (label, fieldName, type = "text", options = null) => {
        const value = formData[fieldName] || '';
        
        if (isEditMode) {
            if (type === "select" && options) {
                return (
                    <Form.Group className="mb-3">
                        <Form.Label>{label}</Form.Label>
                        <Form.Select 
                            name={fieldName}
                            value={value}
                            onChange={handleInputChange}
                            required={fieldName === 'fullName' || fieldName === 'contact'}
                        >
                            <option value="">Select {label}</option>
                            {options.map((option, idx) => (
                                <option key={idx} value={option.value || option.toLowerCase()}>
                                    {option.label || option}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                );
            } else if (type === "checkbox") {
                return (
                    <Form.Group className="mb-3">
                        <Form.Check 
                            type="checkbox"
                            name={fieldName}
                            checked={!!value}
                            onChange={handleInputChange}
                            label={label}
                        />
                    </Form.Group>
                );
            } else {
                return (
                    <Form.Group className="mb-3">
                        <Form.Label>{label}</Form.Label>
                        <Form.Control 
                            type={type}
                            name={fieldName}
                            value={value}
                            onChange={handleInputChange}
                            required={fieldName === 'fullName' || fieldName === 'contact'}
                        />
                    </Form.Group>
                );
            }
        } else {
            // Display mode
            if (type === "checkbox") {
                return <p className="mb-3"><strong>{label}:</strong> {value ? "Yes" : "No"}</p>;
            } else {
                return <p className="mb-3"><strong>{label}:</strong> {value || 'Not provided'}</p>;
            }
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card shadow border-0 rounded-lg mb-4">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3">
                            <h3 className="m-0 font-weight-bold">Worker Profile</h3>
                            
                        </div>
                        
                        <div className="card-body">
                            {error && (
                                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                                    <Alert.Heading>Error!</Alert.Heading>
                                    <p>{error}</p>
                                </Alert>
                            )}

                            {success && (
                                <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
                                    <Alert.Heading>Success!</Alert.Heading>
                                    <p>{success}</p>
                                </Alert>
                            )}

                            {/* Documents & Photos */}
                            <h4 className="border-bottom pb-2 mb-4">Documents & Photos</h4>
                            <Row className="mb-4">
                                {['profilePhoto', 'aadhaarPhoto', 'alternateDoc'].map((docType) => (
                                    <Col md={4} className="mb-3" key={docType}>
                                        <div className="card h-100 border-0 shadow-sm">
                                            <div className="card-header bg-secondary text-white py-2 text-capitalize">
                                                {docType.replace(/([A-Z])/g, ' $1').trim()}
                                            </div>
                                            <div className="card-body d-flex flex-column align-items-center justify-content-center" 
                                                 style={{ minHeight: '200px' }}>
                                                <SafeImage 
                                                    src={formData[docType]} 
                                                    alt={docType.replace(/([A-Z])/g, ' $1').trim()} 
                                                    imageType={docType}
                                                />
                                                {isEditMode && (
                                                    <Form.Group className="mt-2 w-100">
                                                        <Form.Control 
                                                            type="file" 
                                                            name={docType} 
                                                            accept="image/*" 
                                                            onChange={handleFileChange} 
                                                            size="sm"
                                                        />
                                                        <Form.Text className="text-muted">
                                                            Max 5MB (JPEG, PNG, GIF)
                                                        </Form.Text>
                                                    </Form.Group>
                                                )}
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>

                            {/* Personal Information */}
                            <div className="card shadow-sm border-0 mb-4">
                                <div className="card-header bg-info text-white">
                                    <h4 className="m-0">Personal Information</h4>
                                </div>
                                <div className="card-body">
                                    <Row>
                                        <Col md={6}>
                                            {renderField("Full Name *", "fullName")}
                                            {renderField("Worker ID", "workerId")}
                                            {renderField("Age", "age", "number")}
                                            {renderField("Date of Birth", "dateOfBirth", "date")}
                                            {renderField("Gender", "gender", "select", [
                                                { value: "male", label: "Male" },
                                                { value: "female", label: "Female" },
                                                { value: "other", label: "Other" }
                                            ])}
                                        </Col>
                                        <Col md={6}>
                                            {renderField("Marital Status", "maritalStatus", "select", [
                                                { value: "single", label: "Single" },
                                                { value: "married", label: "Married" },
                                                { value: "divorced", label: "Divorced" },
                                                { value: "widowed", label: "Widowed" }
                                            ])}
                                            {renderField("Contact *", "contact", "tel")}
                                            {renderField("Emergency Contact", "emergencyContact", "tel")}
                                            {renderField("Email", "email", "email")}
                                        </Col>
                                    </Row>

                                    <h5 className="border-bottom pb-2 mb-3 mt-4">Address</h5>
                                    <Row>
                                        <Col md={12}>
                                            {renderField("Street Address", "streetAddress")}
                                        </Col>
                                        <Col md={4}>
                                            {renderField("District", "district")}
                                        </Col>
                                        <Col md={4}>
                                            {renderField("State", "state")}
                                        </Col>
                                        <Col md={4}>
                                            {renderField("Pincode", "pincode")}
                                        </Col>
                                    </Row>

                                    <Row className="mt-3">
                                        <Col md={6}>
                                            {renderField("Physically Challenged", "physicallyHandicapped", "checkbox")}
                                        </Col>
                                        <Col md={6}>
                                            {renderField("Critical Illness", "criticalIllness")}
                                        </Col>
                                    </Row>
                                </div>
                            </div>

                            {/* Professional Details */}
                            <div className="card shadow-sm border-0 mb-4">
                                <div className="card-header bg-success text-white">
                                    <h4 className="m-0">Professional Details</h4>
                                </div>
                                <div className="card-body">
                                    <Row>
                                        <Col md={6}>
                                            {renderField("Skill Set", "skillSet")}
                                            {renderField("Preferred Work Location", "preferredWorkLocation")}
                                        </Col>
                                        <Col md={6}>
                                            {renderField("Skill Level", "skillLevel", "select", [
                                                { value: "beginner", label: "Beginner" },
                                                { value: "intermediate", label: "Intermediate" },
                                                { value: "expert", label: "Expert" }
                                            ])}
                                            {renderField("Availability", "availability", "checkbox")}
                                        </Col>
                                    </Row>
                                    <div>
                                {isEditMode ? (
                                    <>
                                        <Button 
                                            variant="success" 
                                            onClick={handleSave} 
                                            className="me-2"
                                            disabled={isSaving}
                                        >
                                            {isSaving ? (
                                                <>
                                                    <Spinner animation="border" size="sm" className="me-2" />
                                                    Saving...
                                                </>
                                            ) : 'Save Changes'}
                                        </Button>
                                        <Button 
                                            variant="danger" 
                                            onClick={toggleEditMode}
                                            disabled={isSaving}
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <Button 
                                        variant="light" 
                                        onClick={toggleEditMode} 
                                        className="me-2"
                                    >
                                        Edit Profile
                                    </Button>
                                )}
                                
                        
                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerHome;