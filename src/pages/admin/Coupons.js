import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Badge, Table,Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../layouts/AdminLayout';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import axios from 'axios';

const Coupons = () => {
  const { isAuthenticated, isAdmin, loading: authLoading } = useAdminAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    validTo: '',
    description: ''
  });

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchCoupons();
    }
  }, [isAuthenticated, isAdmin]);

  const getAuthConfig = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('No admin token found. Please log in again.');
    }
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/coupons', getAuthConfig());
      setCoupons(response.data);
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
      setError(err.response?.data?.error || 'Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      
      await axios.post('/api/coupons', formData, getAuthConfig());
      setSuccess('Coupon created successfully');
      
      fetchCoupons();
      handleCloseModal();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create coupon');
    }
  };

  const handleDelete = async (couponId) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      await axios.delete(`/api/coupons/${couponId}`, getAuthConfig());
      setSuccess('Coupon deleted successfully');
      fetchCoupons();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete coupon');
    }
  };

  const handleToggleStatus = async (couponId) => {
    try {
      await axios.patch(`/api/coupons/${couponId}/toggle`, {}, getAuthConfig());
      setSuccess('Coupon status updated successfully');
      fetchCoupons();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update coupon status');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: '',
      validTo: '',
      description: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusBadge = (coupon) => {
    if (!coupon.isActive) {
      return <Badge bg="secondary">Inactive</Badge>;
    }
    
    if (coupon.validTo && new Date() > new Date(coupon.validTo)) {
      return <Badge bg="danger">Expired</Badge>;
    }
    
    return <Badge bg="success">Active</Badge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No expiry';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDiscount = (coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}%`;
    }
    return `₹${coupon.discountValue}`;
  };

  if (authLoading) {
    return (
      <AdminLayout>
        <Container className="py-4">
          <div className="text-center">
            <Spinner animation="border" role="status" className="text-primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Checking admin authentication...</p>
          </div>
        </Container>
      </AdminLayout>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <AdminLayout>
        <Container className="py-4">
          <Alert variant="warning">
            <h4>Authentication Required</h4>
            <p>You need to be logged in as an admin to access the coupons page.</p>
            <p>Please log in at <a href="/admin/login">Admin Login</a> first.</p>
          </Alert>
        </Container>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <Container className="py-4">
          <div className="text-center">
            <Spinner animation="border" role="status" className="text-primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Loading coupons...</p>
          </div>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Coupon Management</h1>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add New Coupon
          </Button>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="mb-4" dismissible onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {/* Coupons Table */}
        <Card>
          <Card.Body>
            {coupons.length === 0 ? (
              <div className="text-center py-4">
                <h5>No coupons found</h5>
                <p className="text-muted">Create your first coupon to get started.</p>
              </div>
            ) : (
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Discount</th>
                    <th>Min Order</th>
                    <th>Valid Until</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon.id}>
                      <td>
                        <strong>{coupon.code}</strong>
                        {coupon.description && (
                          <div className="text-muted small">{coupon.description}</div>
                        )}
                      </td>
                      <td>
                        <span className="fw-bold">{formatDiscount(coupon)}</span>
                      </td>
                      <td>
                        {coupon.minOrderAmount > 0 ? `₹${coupon.minOrderAmount}` : 'No minimum'}
                      </td>
                      <td>{formatDate(coupon.validTo)}</td>
                      <td>{getStatusBadge(coupon)}</td>
                      <td>
                        <Button
                          variant={coupon.isActive ? "outline-warning" : "outline-success"}
                          size="sm"
                          className="me-2"
                          onClick={() => handleToggleStatus(coupon.id)}
                        >
                          <FontAwesomeIcon icon={coupon.isActive ? faToggleOff : faToggleOn} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(coupon.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Add Coupon Modal */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Coupon</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Coupon Code *</Form.Label>
                    <Form.Control
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="SAVE20"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Discount Type *</Form.Label>
                    <Form.Select
                      name="discountType"
                      value={formData.discountType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Discount Value *</Form.Label>
                    <Form.Control
                      type="number"
                      name="discountValue"
                      value={formData.discountValue}
                      onChange={handleInputChange}
                      placeholder={formData.discountType === 'percentage' ? '20' : '100'}
                      min={formData.discountType === 'percentage' ? '1' : '0.01'}
                      max={formData.discountType === 'percentage' ? '100' : ''}
                      step={formData.discountType === 'percentage' ? '1' : '0.01'}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Minimum Order Amount (₹)</Form.Label>
                    <Form.Control
                      type="number"
                      name="minOrderAmount"
                      value={formData.minOrderAmount}
                      onChange={handleInputChange}
                      placeholder="1000"
                      min="0"
                      step="0.01"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Valid Until</Form.Label>
                    <Form.Control
                      type="date"
                      name="validTo"
                      value={formData.validTo}
                      onChange={handleInputChange}
                    />
                    <Form.Text className="text-muted">
                      Leave empty for no expiry
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter coupon description..."
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Create Coupon
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </AdminLayout>
  );
};

export default Coupons;
