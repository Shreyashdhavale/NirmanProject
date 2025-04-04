import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Container, Card, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginNGO.css";

const LoginNGO = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await fetch("http://localhost:8080/api/ngo/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
  
      onLogin(data);
  
      toast.success("Logged in successfully! 🎉", {
        style: {
          background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
          border: "none",
        },
      });
  
      setTimeout(() => {
        navigate("/ngohome", { state: { email } });
      }, 2000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  ;

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card className="login-card shadow">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="login-title">NGO Login</h2>
                  <p className="text-muted">Welcome back! Please sign in to continue</p>
                </div>

                <Form onSubmit={handleLogin}>
                  <Form.Group controlId="ngoLoginEmail" className="form-group mb-4">
                    <Form.Label>Email Address</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-envelope"></i>
                      </span>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                        className="form-input"
                        disabled={isLoading}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group controlId="ngoLoginPassword" className="form-group mb-4">
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

export default LoginNGO;
