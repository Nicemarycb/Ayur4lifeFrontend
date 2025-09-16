import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faCrown, faEdit, faSave, faTimes, faShieldAlt, faCog, faChartBar, faBox, faUsers } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../layouts/AdminLayout';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import axios from 'axios';
// import './AdminProfile.css';

const AdminProfile = () => {
  const { adminUser, isAuthenticated, getAuthConfig } = useAdminAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  useEffect(() => {
    if (adminUser) {
      setFormData({
        firstName: adminUser.firstName || '',
        lastName: adminUser.lastName || '',
        email: adminUser.email || ''
      });
    }
  }, [adminUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      console.log('Sending profile update request:', formData);
      console.log('Auth config:', getAuthConfig());
      
      const response = await axios.put('/api/admin/profile', formData, getAuthConfig());
      
      console.log('Profile update response:', response.data);
      
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
        // Refresh admin user data
        window.location.reload();
      } else {
        setMessage({ type: 'danger', text: response.data.error || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      console.error('Error response:', error.response?.data);
      setMessage({ 
        type: 'danger', 
        text: error.response?.data?.error || 'Failed to update profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: adminUser?.firstName || '',
      lastName: adminUser?.lastName || '',
      email: adminUser?.email || ''
    });
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  if (!isAuthenticated || !adminUser) {
    return (
      <AdminLayout>
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading admin profile...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-profile-header mb-4">
        <h1 className="admin-profile-title mb-2">Admin Profile</h1>
        <p className="admin-profile-subtitle">Manage your admin account and settings</p>
      </div>

      {message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })} className="admin-alert">
          {message.text}
        </Alert>
      )}

      <Row>
        <Col lg={8}>
          <Card className="admin-profile-card shadow-sm">
            <Card.Header className="admin-card-header">
              <h5 className="mb-0">
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Profile Information
              </h5>
            </Card.Header>
            <Card.Body className="admin-card-body">
              <Row>
                <Col md={6}>
                  <div className="admin-form-group mb-3">
                    <label className="admin-form-label">First Name</label>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter first name"
                        className="admin-form-control"
                      />
                    ) : (
                      <p className="admin-field-value">
                        {adminUser.firstName || 'Not provided'}
                      </p>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="admin-form-group mb-3">
                    <label className="admin-form-label">Last Name</label>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter last name"
                        className="admin-form-control"
                      />
                    ) : (
                      <p className="admin-field-value">
                        {adminUser.lastName || 'Not provided'}
                      </p>
                    )}
                  </div>
                </Col>
              </Row>
              
              <div className="admin-form-group mb-3">
                <label className="admin-form-label">
                  <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                  Email Address
                </label>
                {isEditing ? (
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className="admin-form-control"
                  />
                ) : (
                  <p className="admin-field-value">
                    {adminUser.email || 'Not provided'}
                  </p>
                )}
              </div>

              <div className="admin-form-group mb-3">
                <label className="admin-form-label">
                  <FontAwesomeIcon icon={faCrown} className="me-2" />
                  Role
                </label>
                <div>
                  <Badge bg="success" className="admin-role-badge">
                    <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
                    {adminUser.role || 'Administrator'}
                  </Badge>
                </div>
              </div>

              <div className="admin-actions mt-4">
                {isEditing ? (
                  <div className="d-flex gap-2">
                    <Button 
                      variant="success" 
                      onClick={handleSave}
                      disabled={loading}
                      className="admin-btn admin-btn-save"
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faSave} className="me-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button variant="outline-secondary" onClick={handleCancel} className="admin-btn admin-btn-cancel">
                      <FontAwesomeIcon icon={faTimes} className="me-2" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button variant="primary" onClick={() => setIsEditing(true)} className="admin-btn admin-btn-edit">
                    <FontAwesomeIcon icon={faEdit} className="me-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="admin-quick-actions-card shadow-sm">
            <Card.Header className="admin-quick-actions-header">
              <h5 className="mb-0">
                <FontAwesomeIcon icon={faCog} className="me-2" />
                Quick Actions
              </h5>
            </Card.Header>
            <Card.Body className="admin-quick-actions-body">
              <p className="admin-quick-actions-text mb-3">
                You are logged in as an <strong>Administrator</strong> with full access to manage the store.
              </p>
              <div className="d-grid gap-2">
                <Button href="/admin" variant="primary" className="admin-quick-action-btn text-start">
                  <FontAwesomeIcon icon={faChartBar} className="me-2" />
                  Go to Dashboard
                </Button>
                <Button href="/admin/products" variant="outline-primary" className="admin-quick-action-btn text-start">
                  <FontAwesomeIcon icon={faBox} className="me-2" />
                  Manage Products
                </Button>
                <Button href="/admin/orders" variant="outline-primary" className="admin-quick-action-btn text-start">
                  <FontAwesomeIcon icon={faCog} className="me-2" />
                  View Orders
                </Button>
                <Button href="/admin/users" variant="outline-primary" className="admin-quick-action-btn text-start">
                  <FontAwesomeIcon icon={faUsers} className="me-2" />
                  Manage Users
                </Button>
              </div>
            </Card.Body>
          </Card>
{/* 
          <Card className="admin-status-card shadow-sm mt-3">
            <Card.Header className="admin-status-header">
              <h6 className="mb-0">
                <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
                Account Status
              </h6>
            </Card.Header>
            <Card.Body className="admin-status-body">
              <div className="admin-status-item">
                <span>Status:</span>
                <Badge bg="success" className="admin-status-badge">Active</Badge>
              </div>
              <div className="admin-status-item">
                <span>Last Login:</span>
                <small className="admin-last-login">
                  {adminUser.lastLogin ? new Date(adminUser.lastLogin).toLocaleDateString() : 'N/A'}
                </small>
              </div>
            </Card.Body>
          </Card> */}
        </Col>
      </Row>
    </AdminLayout>
  );
};

export default AdminProfile;
