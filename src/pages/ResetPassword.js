import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import UserLayout from '../layouts/UserLayout';
import { useUserAuth } from '../contexts/UserAuthContext';
import './ResetPassword.css';

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const navigate = useNavigate();
  const { resetUserPassword, error, clearError } = useUserAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    if (error) clearError();
  };

  const validateForm = () => {
    if (!formData.email) {
      return 'Email is required';
    }
    if (!formData.newPassword) {
      return 'New password is required';
    }
    if (formData.newPassword.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (formData.newPassword !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setLoading(true);
    clearError();

    const result = await resetUserPassword(formData.email, formData.newPassword);
    
    if (result.success) {
      setShowSuccessModal(true);
      // Reset form
      setFormData({
        email: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
    
    setLoading(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  return (
    <UserLayout>
      <div className="reset-password-page-container">
        <Container>
          <Row className="justify-content-center">
            <Col md={6} lg={5} xl={4}>
              <Card className="reset-password-page-card shadow">
                <div className="reset-password-page-header">
                  <h2>
                    <FontAwesomeIcon icon={faLock} className="me-2" />
                    Reset Password
                  </h2>
                  <p>Enter your email and new password</p>
                </div>
                <Card.Body className="reset-password-page-form">
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
                        placeholder="Enter your registered email"
                        required
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <div className="position-relative">
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          placeholder="Enter new password"
                          required
                          minLength="6"
                          className="form-control"
                        />
                        <Button
                          type="button"
                          variant="link"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </Button>
                      </div>
                      <Form.Text className="text-muted">
                        Password must be at least 6 characters long
                      </Form.Text>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Confirm New Password</label>
                      <div className="position-relative">
                        <Form.Control
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm new password"
                          required
                          minLength="6"
                          className="form-control"
                        />
                        <Button
                          type="button"
                          variant="link"
                          className="password-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="submit-btn"
                      disabled={loading || !formData.email || !formData.newPassword || !formData.confirmPassword}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Resetting Password...
                        </>
                      ) : (
                        'Reset Password'
                      )}
                    </Button>

                    <div className="text-center mt-3">
                      <Link to="/login" className="back-to-login">
                        Back to Login
                      </Link>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* Success Modal */}
        <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
          <Modal.Body className="text-center p-4">
            <FontAwesomeIcon icon={faCheckCircle} size="3x" className="text-success mb-3" />
            <h4>Password Reset Successful!</h4>
            <p className="text-muted">
              Your password has been reset successfully. You can now login with your new password.
            </p>
            <Button variant="primary" onClick={handleCloseSuccessModal}>
              Go to Login
            </Button>
          </Modal.Body>
        </Modal>
      </div>
    </UserLayout>
  );
};

export default ResetPasswordPage;