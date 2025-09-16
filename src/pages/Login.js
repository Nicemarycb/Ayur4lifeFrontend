import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faEye, faEyeSlash, faLeaf, faHeart } from '@fortawesome/free-solid-svg-icons';
import UserLayout from '../layouts/UserLayout';
import { useUserAuth } from '../contexts/UserAuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, clearError } = useUserAuth();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Redirect to the page they were trying to access, or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
    
    setLoading(false);
  };

  return (
    <UserLayout>
      <div className="login-container">
        <Container>
          <Row className="justify-content-center">
            <Col md={6} lg={5} xl={4}>
              <Card className="login-card shadow">
                <div className="login-header">
                  <h2>
                    <FontAwesomeIcon icon={faLeaf} className="me-2" />
                    <span className="text-warning">Ayur</span>4Life
                  </h2>
                  <p>Welcome back! Please login to your account.</p>
                </div>
                <Card.Body className="login-form">

                {error && (
                  <Alert variant="danger" dismissible onClose={clearError}>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        className="form-control"
                    />
                      <Button
                        type="button"
                        variant="link"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <FontAwesomeIcon 
                          icon={showPassword ? faEyeSlash : faEye} 
                        />
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="success"
                    size="lg"
                    className={`submit-btn ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        Logging in...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                        Login
                      </>
                    )}
                  </Button>

                  <div className="register-link">
                    <p className="mb-0">
                      Don't have an account?{' '}
                      <Link to="/register">
                        Register here
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {/* Additional Info */}
            <div className="text-center mt-4">
              <p className="text-muted small">
                By logging in, you agree to our{' '}
                <Link to="/terms" className="text-decoration-none">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-decoration-none">Privacy Policy</Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
    </UserLayout>
  );
};

export default Login;
