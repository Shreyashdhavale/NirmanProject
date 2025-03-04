import React, { useState } from "react";
import { Form, Button, Container, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginProvider.css";

const LoginProvider = ({ onLogin }) => {
  const [jobProviderId, setJobProviderId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        jobProviderId,
        password,
      });

      // Include jobProviderId in the userData object so it's available globally if needed
      const userData = { name: response.data.name, type: 'provider' , jobProviderId: jobProviderId };
      onLogin(userData);
      

      toast.success("Login successful! 🎉", {
        style: {
          background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
          border: "none",
        },
      });

      setTimeout(() => {
        // Pass jobProviderId as state while navigating to JobProviderHome
        navigate("/jobproviderhome", { state: { jobProviderId } });
      }, 2000);
    } catch (error) {
      toast.error(
        `Login failed: ${
          error.response ? error.response.data.message : error.message
        }`
      );
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
                      />
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="btn-login w-100 py-2 mb-3"
                    style={{
                      background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                      border: "none",
                    }}
                  >
                    Sign In
                  </Button>
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
