import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCheck, faTimes, faDownload, faExclamationTriangle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';

const Cancellations = () => { 
  const { isAuthenticated, isAdmin, getAuthConfig } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [cancellations, setCancellations] = useState([]);
  const [selectedCancellation, setSelectedCancellation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Utility function to format dates properly
  const formatDate = (dateField) => {
    if (!dateField) return 'N/A';
    
    try {
      if (dateField.toDate && typeof dateField.toDate === 'function') {
        // Firestore Timestamp
        return dateField.toDate().toLocaleDateString();
      } else if (dateField instanceof Date) {
        // Date object
        return dateField.toLocaleDateString();
      } else if (typeof dateField === 'string' || typeof dateField === 'number') {
        // String or timestamp
        return new Date(dateField).toLocaleDateString();
      } else {
        return 'N/A';
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  // Utility function to format time properly
  const formatTime = (dateField) => {
    if (!dateField) return 'N/A';
    
    try {
      if (dateField.toDate && typeof dateField.toDate === 'function') {
        // Firestore Timestamp
        return dateField.toDate().toLocaleTimeString();
      } else if (dateField instanceof Date) {
        // Date object
        return dateField.toLocaleTimeString();
      } else if (typeof dateField === 'string' || typeof dateField === 'number') {
        // String or timestamp
        return new Date(dateField).toLocaleTimeString();
      } else {
        return 'N/A';
      }
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'N/A';
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadCancellations();
    }
  }, [isAuthenticated, isAdmin]);

  const loadCancellations = async () => {
    try {
      setLoading(true);
      const config = getAuthConfig();
      const response = await axios.get('/api/return-requests/admin/cancellations', config);
      if (response.data.success) {
        setCancellations(response.data.cancellations);
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'Error loading cancellation requests: ' + error.response?.data?.message || error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (cancellationId, action, reason = '') => {
    try {
      setActionLoading(true);
      const config = getAuthConfig();
      const response = await axios.patch(`/api/return-requests/admin/cancellations/${cancellationId}/${action}`, { reason }, config);
      
      if (response.data.success) {
        setMessage({ type: 'success', text: `Cancellation request ${action}ed successfully!` });
        loadCancellations();
        setShowModal(false);
        setSelectedCancellation(null);
      }
    } catch (error) {
      setMessage({ type: 'danger', text: `Error ${action}ing cancellation request: ` + error.response?.data?.message || error.message });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'warning', text: 'Pending' },
      approved: { variant: 'success', text: 'Approved' },
      rejected: { variant: 'danger', text: 'Rejected' }
    };
    
    const config = statusConfig[status] || { variant: 'light', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const filteredCancellations = cancellations.filter(cancellation => {
    const matchesSearch = 
      cancellation.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cancellation.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cancellation.productName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || cancellation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (!isAuthenticated || !isAdmin) {
    return (
      <Container className="py-4">
        <Alert variant="warning">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          You must be logged in as an admin to access this page.
        </Alert>
      </Container>
    );
  }

  return (
    <AdminLayout>
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-3">
            <FontAwesomeIcon icon={faTimes} className="me-2" />
            Order Cancellation Management
          </h2>
          <p className="text-muted">
            Review and manage customer cancellation requests for orders before delivery.
          </p>
        </Col>
      </Row>

      {message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search by order number, customer name, or product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Status Filter</Form.Label>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3} className="d-flex align-items-end">
          <Button 
            variant="outline-primary" 
            onClick={loadCancellations}
            disabled={loading}
            className="w-100"
          >
            <FontAwesomeIcon icon={faSearch} className="me-2" />
            Refresh
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status" className="text-primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-3">Loading cancellation requests...</p>
            </div>
          ) : filteredCancellations.length === 0 ? (
            <div className="text-center py-4">
              <h5>No Cancellation Requests Found</h5>
              <p className="text-muted">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search criteria or filters.'
                  : 'There are no cancellation requests at the moment.'
                }
              </p>
            </div>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Order Info</th>
                  <th>Product Details</th>
                  <th>Customer</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCancellations.map((cancellation) => (
                  <tr key={cancellation.id}>
                    <td>
                      <div>
                        <strong>#{cancellation.orderNumber || cancellation.orderId?.slice(-8)}</strong>
                        <br />
                        <small className="text-muted">
                          Order: {cancellation.orderStatus}
                        </small>
                        <br />
                        <small className="text-muted">
                          Delivery: {cancellation.deliveryStatus}
                        </small>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={cancellation.productImage || '/Ayur4life_logo_round_png-01.png'}
                          alt={cancellation.productName}
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                          className="me-2"
                        />
                        <div>
                          <div className="fw-semibold">{cancellation.productName}</div>
                          <small className="text-muted">
                            Qty: {cancellation.quantity} | ₹{cancellation.productPrice}
                          </small>
                        </div>
                      </div>
                    </td>
                                         <td>
                       <div>
                         <div className="fw-semibold">{cancellation.customerName || cancellation.customer?.firstName || cancellation.customer?.name || cancellation.name || 'N/A'}</div>
                         <small className="text-muted">{cancellation.customerEmail || cancellation.customer?.email || cancellation.email || 'N/A'}</small>
                       </div>
                     </td>
                    <td>
                      <div>
                        <strong>{cancellation.cancelReason}</strong>
                        {cancellation.description && (
                          <div className="text-muted mt-1">
                            <small>{cancellation.description}</small>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      {getStatusBadge(cancellation.status)}
                    </td>
                                         <td>
                       <div>
                         <div>{formatDate(cancellation.createdAt)}</div>
                         <small className="text-muted">{formatTime(cancellation.createdAt)}</small>
                       </div>
                     </td>
                    <td>
                      {cancellation.status === 'pending' && (
                        <div className="d-flex gap-1">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => {
                              setSelectedCancellation(cancellation);
                              setShowModal(true);
                            }}
                            disabled={actionLoading}
                          >
                            <FontAwesomeIcon icon={faCheck} className="me-1" />
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setSelectedCancellation(cancellation);
                              setShowModal(true);
                            }}
                            disabled={actionLoading}
                          >
                            <FontAwesomeIcon icon={faTimes} className="me-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                      {cancellation.status !== 'pending' && (
                        <div>
                          <small className="text-muted">
                            {cancellation.adminAction?.charAt(0).toUpperCase() + cancellation.adminAction?.slice(1)}ed
                          </small>
                          {cancellation.adminReason && (
                            <div className="text-muted">
                              <small>Reason: {cancellation.adminReason}</small>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Action Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCancellation?.status === 'pending' ? 'Process Cancellation Request' : 'Cancellation Details'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCancellation && (
            <div>
              {/* Order Information Section */}
              <div className="mb-4">
                <h6 className="border-bottom pb-2 mb-3">
                  <FontAwesomeIcon icon={faEye} className="me-2" />
                  Order Information
                </h6>
                <Row>
                  <Col md={6}>
                    <p><strong>Order Number:</strong> {selectedCancellation.orderNumber || 'N/A'}</p>
                    <p><strong>Order ID:</strong> {selectedCancellation.orderId || 'N/A'}</p>
                                                              <p><strong>Order Date:</strong> {formatDate(selectedCancellation.orderDate)}</p>
                    <p><strong>Order Status:</strong> 
                      <Badge bg="info" className="ms-2">
                        {selectedCancellation.orderStatus || 'N/A'}
                      </Badge>
                    </p>
                  </Col>
                  <Col md={6}>
                                         <p><strong>Customer Name:</strong> {selectedCancellation.customerName || selectedCancellation.customer?.firstName || selectedCancellation.customer?.name || 'N/A'}</p>
                     <p><strong>Customer Email:</strong> {selectedCancellation.customerEmail || selectedCancellation.customer?.email || 'N/A'}</p>
                    <p><strong>User ID:</strong> {selectedCancellation.userId || 'N/A'}</p>
                    <p><strong>Delivery Status:</strong> 
                      <Badge bg={selectedCancellation.deliveryStatus === 'delivered' ? 'success' : 'warning'} className="ms-2">
                        {selectedCancellation.deliveryStatus || 'N/A'}
                      </Badge>
                    </p>
                  </Col>
                </Row>
              </div>

              {/* Product Information Section */}
              <div className="mb-4">
                <h6 className="border-bottom pb-2 mb-3">
                  <FontAwesomeIcon icon={faEye} className="me-2" />
                  Product Information
                </h6>
                <Row>
                  <Col md={4}>
                    <div className="text-center mb-3">
                      <img
                        src={selectedCancellation.productImage || '/Ayur4life_logo_round_png-01.png'}
                        alt={selectedCancellation.productName}
                        style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                        className="img-fluid"
                      />
                    </div>
                  </Col>
                  <Col md={8}>
                    <p><strong>Product Name:</strong> {selectedCancellation.productName || 'N/A'}</p>
                    <p><strong>Product ID:</strong> {selectedCancellation.productId || 'N/A'}</p>
                    <p><strong>Category:</strong> {selectedCancellation.category || 'N/A'}</p>
                    <p><strong>Quantity:</strong> {selectedCancellation.quantity || 'N/A'}</p>
                    <p><strong>Price:</strong> ₹{selectedCancellation.productPrice || 'N/A'}</p>
                  </Col>
                </Row>
              </div>

              {/* Cancellation Details Section */}
              <div className="mb-4">
                <h6 className="border-bottom pb-2 mb-3">
                  <FontAwesomeIcon icon={faEye} className="me-2" />
                  Cancellation Details
                </h6>
                <Row>
                  <Col md={6}>
                    <p><strong>Cancellation Reason:</strong></p>
                    <div className="bg-light p-3 rounded">
                      {selectedCancellation.cancelReason || 'N/A'}
                    </div>
                    
                    {selectedCancellation.description && (
                      <>
                        <p className="mt-3"><strong>Description:</strong></p>
                        <div className="bg-light p-3 rounded">
                          {selectedCancellation.description}
                        </div>
                      </>
                    )}
                  </Col>
                  <Col md={6}>
                                                              <p><strong>Requested Date:</strong> {formatDate(selectedCancellation.createdAt)}</p>
                     <p><strong>Requested Time:</strong> {formatTime(selectedCancellation.createdAt)}</p>
                     <p><strong>Last Updated:</strong> {formatDate(selectedCancellation.updatedAt)}</p>
                    <p><strong>Current Status:</strong> {getStatusBadge(selectedCancellation.status)}</p>
                  </Col>
                </Row>
              </div>

              {/* Admin Actions Section */}
              {selectedCancellation.status === 'pending' && (
                <div className="mb-4">
                  <h6 className="border-bottom pb-2 mb-3">
                    <FontAwesomeIcon icon={faEye} className="me-2" />
                    Admin Actions
                  </h6>
                  <Form.Group className="mb-3">
                    <Form.Label>Admin Reason (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Provide a reason for your decision..."
                      id="adminReason"
                    />
                  </Form.Group>
                  <div className="d-grid gap-2">
                    <Button
                      variant="success"
                      onClick={() => {
                        const reason = document.getElementById('adminReason')?.value || '';
                        handleAction(selectedCancellation.id, 'approve', reason);
                      }}
                      disabled={actionLoading}
                    >
                      <FontAwesomeIcon icon={faCheck} className="me-2" />
                      Approve Cancellation
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        const reason = document.getElementById('adminReason')?.value || '';
                        handleAction(selectedCancellation.id, 'reject', reason);
                      }}
                      disabled={actionLoading}
                    >
                      <FontAwesomeIcon icon={faTimes} className="me-2" />
                      Reject Cancellation
                    </Button>
                  </div>
                </div>
              )}

              {/* Admin Action History */}
              {selectedCancellation.adminAction && (
                <div className="mb-4">
                  <h6 className="border-bottom pb-2 mb-3">
                    <FontAwesomeIcon icon={faEye} className="me-2" />
                    Admin Action History
                  </h6>
                  <Row>
                    <Col md={6}>
                      <p><strong>Action Taken:</strong> 
                        <Badge bg={selectedCancellation.adminAction === 'approve' ? 'success' : 'danger'} className="ms-2">
                          {selectedCancellation.adminAction === 'approve' ? 'Approved' : 'Rejected'}
                        </Badge>
                      </p>
                      <p><strong>Admin ID:</strong> {selectedCancellation.adminId || 'N/A'}</p>
                    </Col>
                    <Col md={6}>
                      {selectedCancellation.adminReason && (
                        <>
                          <p><strong>Admin Reason:</strong></p>
                          <div className="bg-light p-3 rounded">
                            {selectedCancellation.adminReason}
                          </div>
                        </>
                      )}
                    </Col>
                  </Row>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
    
    </AdminLayout> 
  );
};

export default Cancellations;
