import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCheck, faTimes, faDownload, faExclamationTriangle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';

const ReturnRequests = () => {
  const { isAuthenticated, isAdmin, getAuthConfig } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [returnRequests, setReturnRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
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

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadReturnRequests();
    }
  }, [isAuthenticated, isAdmin]);

  const loadReturnRequests = async () => {
    try {
      setLoading(true);
      const config = getAuthConfig();
      const response = await axios.get('/api/return-requests/admin/return-requests', config);
      if (response.data.success) {
        setReturnRequests(response.data.returnRequests);
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'Error loading return requests: ' + error.response?.data?.message || error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, action, reason = '') => {
    try {
      setActionLoading(true);
      const config = getAuthConfig();
      const response = await axios.patch(`/api/return-requests/admin/return-requests/${requestId}/${action}`, { reason }, config);
      
      if (response.data.success) {
        setMessage({ type: 'success', text: `Return request ${action}ed successfully!` });
        loadReturnRequests();
        setShowModal(false);
        setSelectedRequest(null);
      }
    } catch (error) {
      setMessage({ type: 'danger', text: `Error ${action}ing return request: ` + error.response?.data?.message || error.message });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'warning', text: 'Pending' },
      approved: { variant: 'success', text: 'Approved' },
      rejected: { variant: 'danger', text: 'Rejected' },
      processing: { variant: 'info', text: 'Processing' },
      completed: { variant: 'secondary', text: 'Completed' }
    };
    
    const config = statusConfig[status] || { variant: 'light', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const filteredRequests = returnRequests.filter(request => {
    const matchesSearch = 
      request.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.productName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
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
            <FontAwesomeIcon icon={faEye} className="me-2" />
            Return Request Management
          </h2>
          <p className="text-muted">
            Manage customer return requests, approve or reject based on policy compliance.
          </p>
        </Col>
      </Row>

      {message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Search Requests</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    placeholder="Search by order number, customer name, or product..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FontAwesomeIcon 
                    icon={faSearch} 
                    className="position-absolute text-muted" 
                    style={{ right: '12px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Filter by Status</Form.Label>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading return requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <FontAwesomeIcon icon={faSearch} size="3x" className="text-muted mb-3" />
            <h5>No return requests found</h5>
            <p className="text-muted">
              {searchTerm || statusFilter !== 'all' 
                ? 'No requests match your current filters.' 
                : 'No return requests have been submitted yet.'}
            </p>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Return Requests ({filteredRequests.length})</h6>
              <Button variant="outline-primary" size="sm" onClick={loadReturnRequests}>
                Refresh
              </Button>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            <Table responsive className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Reason</th>
                  <th>Requested</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <strong>{request.orderNumber}</strong>
                    </td>
                                         <td>{request.customerName || request.customer?.firstName || request.customer?.name || request.name || 'N/A'}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img 
                          src={request.productImage || '/Ayur4life_logo_round_png-01.png'} 
                          alt={request.productName}
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                          className="me-2"
                        />
                        <div>
                          <div className="fw-semibold">{request.productName}</div>
                          <small className="text-muted">Qty: {request.quantity}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-truncate" style={{ maxWidth: '200px' }} title={request.returnReason}>
                        {request.returnReason}
                      </div>
                    </td>
                                         <td>
                       <small>{formatDate(request.createdAt)}</small>
                     </td>
                    <td>{getStatusBadge(request.status)}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowModal(true);
                          }}
                          title="View Details"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Button>
                        
                        {request.status === 'pending' && (
                          <>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleAction(request.id, 'approve')}
                              disabled={actionLoading}
                              title="Approve"
                            >
                              <FontAwesomeIcon icon={faCheck} />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowModal(true);
                              }}
                              disabled={actionLoading}
                              title="Reject"
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Return Request Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Return Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <Row>
              <Col md={6}>
                <h6>Order Information</h6>
                <p><strong>Order Number:</strong> {selectedRequest.orderNumber}</p>
                <p><strong>Order Date:</strong> {formatDate(selectedRequest.orderDate)}</p>
                 <p><strong>Customer:</strong> {selectedRequest.customerName || selectedRequest.customer?.firstName || selectedRequest.customer?.name || 'N/A'}</p>
                 <p><strong>Email:</strong> {selectedRequest.customerEmail || selectedRequest.customer?.email || selectedRequest.email || 'N/A'}</p>
                
                <h6 className="mt-4">Product Information</h6>
                <div className="d-flex align-items-center mb-3">
                  <img 
                    src={selectedRequest.productImage || '/Ayur4life_logo_round_png-01.png'} 
                    alt={selectedRequest.productName}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                    className="me-3"
                  />
                  <div>
                                         <div className="fw-semibold">{selectedRequest.productName || selectedRequest.name || 'N/A'}</div>
                     <div className="text-muted">Quantity: {selectedRequest.quantity || 'N/A'}</div>
                     <div className="text-muted">Price: ₹{selectedRequest.productPrice || selectedRequest.price || 'N/A'}</div>
                  </div>
                </div>
              </Col>
              
              <Col md={6}>
                <h6>Return Details</h6>
                <p><strong>Return Reason:</strong></p>
                <p className="text-muted">{selectedRequest.returnReason}</p>
                
                <p><strong>Requested Date:</strong> {formatDate(selectedRequest.createdAt)}</p>
                {/* <p><strong>Requested Time:</strong> {formatTime(selectedRequest.createdAt)}</p> */}
                <p><strong>Current Status:</strong> {getStatusBadge(selectedRequest.status)}</p>
                
                {selectedRequest.status === 'pending' && (
                  <div className="mt-4">
                    <h6>Admin Actions</h6>
                    <div className="d-grid gap-2">
                      <Button
                        variant="success"
                        onClick={() => handleAction(selectedRequest.id, 'approve')}
                        disabled={actionLoading}
                      >
                        <FontAwesomeIcon icon={faCheck} className="me-2" />
                        Approve Return
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleAction(selectedRequest.id, 'reject')}
                        disabled={actionLoading}
                      >
                        <FontAwesomeIcon icon={faTimes} className="me-2" />
                        Reject Return
                      </Button>
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </Container>
    </AdminLayout>
  );
};

export default ReturnRequests;
