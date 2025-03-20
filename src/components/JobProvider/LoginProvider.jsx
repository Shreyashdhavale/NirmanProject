import React, { useState, useEffect } from "react";
import { Form, Container, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginProvider.css";

const LoginProvider = ({ onLogin }) => {
  const [jobProviderId, setJobProviderId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    // Validate inputs
    if (!jobProviderId || !password) {
      toast.error("Please enter both Job Provider ID and Password");
      return;
    }

    setIsLoading(true);

    try {
      // Set timeout for the request
      const response = await axios.post("http://localhost:8080/api/login", 
        {
          jobProviderId,
          password,
        },
        {
          timeout: 10000, // 10 seconds timeout
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Check the success status in the response
      if (response.data.success) {
        const userData = {
          name: response.data.name,
          type: 'provider',
          jobProviderId: response.data.jobProviderId,
        };

        onLogin(userData);

        toast.success(response.data.message || "Login successful! 🎉", {
          style: {
            background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
            border: "none",
          },
        });

        setTimeout(() => {
          navigate("/jobproviderhome", { state: { jobProviderId: response.data.jobProviderId } });
        }, 2000);
      } else {
        // Handle unsuccessful login
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      // Comprehensive error handling
      if (error.code === 'ECONNABORTED') {
        toast.error("Request timed out. Please check your internet connection.");
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(
          error.response.data.message || 
          `Login failed: ${error.response.status} error`
        );
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("No response from server. Please check your network connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card className="login-card shadow">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="login-title">Provider Login</h2>
                  <p className="text-muted">Welcome back! Please sign in to continue</p>
                </div>

                <Form onSubmit={handleLogin}>
                  <Form.Group controlId="formJobProviderId" className="form-group mb-4">
                    <Form.Label>Job Provider ID</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-id-badge"></i>
                      </span>
                      <Form.Control
                        type="text"
                        value={jobProviderId}
                        onChange={(e) => setJobProviderId(e.target.value)}
                        required
                        placeholder="Enter your Job Provider ID"
                        className="form-input"
                        disabled={isLoading}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group controlId="formPassword" className="form-group mb-4">
                    <Form.Label>Password</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-lock"></i>
                      </span>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                        className="form-input"
                        disabled={isLoading}
                      />
                    </div>
                  </Form.Group>

                  <button 
                    type="submit" 
                    className="btn-login w-100 py-2 mb-3" 
                    style={{
                      background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                      border: "none",
                      color: "#fff",
                      fontWeight: "bold"
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default LoginProvider;