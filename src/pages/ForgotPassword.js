import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowLeft, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import UserLayout from '../layouts/UserLayout';
import { useUserAuth } from '../contexts/UserAuthContext';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { forgotPassword, error, clearError } = useUserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearError();

    const result = await forgotPassword(email);
    
    if (result.success) {
      setSuccess(true);
    }
    
    setLoading(false);
  };

  return (
    <UserLayout>
      <div className="forgot-password-container">
        <Container>
          <Row className="justify-content-center">
            <Col md={6} lg={5} xl={4}>
              <Card className="forgot-password-card shadow">
                <div className="forgot-password-header">
                  <h2>
                    <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                    Reset Password
                  </h2>
                  <p>Enter your email to receive reset instructions</p>
                </div>
                <Card.Body className="forgot-password-form">
                  {error && (
                    <Alert variant="danger" dismissible onClose={clearError}>
                      {error}
                    </Alert>
                  )}

                  {success ? (
                    <div className="success-message text-center">
                      <FontAwesomeIcon icon={faCheckCircle} size="3x" className="text-success mb-3" />
                      <h4>Check Your Email</h4>
                      <p className="text-muted">
                        We've sent password reset instructions to <strong>{email}</strong>
                      </p>
                      <p className="small text-muted">
                        If you don't see the email, check your spam folder.
                      </p>
                      <div className="mt-4">
                        <Link to="/login" className="btn btn-primary">
                          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                          Back to Login
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <Form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <Form.Control
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your registered email"
                          required
                          className="form-control"
                        />
                        <Form.Text className="text-muted">
                          We'll send a reset link to this email
                        </Form.Text>
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="submit-btn"
                        disabled={loading || !email}
                      >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                      </Button>

                      <div className="text-center mt-3">
                        <Link to="/login" className="back-to-login">
                          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                          Back to Login
                        </Link>
                      </div>
                    </Form>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </UserLayout>
  );
};

export default ForgotPassword;