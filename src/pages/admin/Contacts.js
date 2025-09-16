import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Badge, Modal, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEnvelopeOpen, faReply, faCheck, faTrash, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../layouts/AdminLayout';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import axios from 'axios';

const Contacts = () => {
  const { isAuthenticated, isAdmin, loading: authLoading } = useAdminAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchContacts();
    }
  }, [filters, isAuthenticated, isAdmin]);

  const getAuthConfig = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('No admin token found. Please log in again.');
    }
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);

      const response = await axios.get(`/api/contacts?${params.toString()}`, getAuthConfig());
      setContacts(response.data);
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
      if (err.response?.status === 403) {
        setError('Access denied. Please log in as an admin.');
      } else if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError(err.response?.data?.error || 'Failed to load contacts. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (contactId, newStatus) => {
    try {
      await axios.patch(`/api/contacts/${contactId}/status`, { status: newStatus }, getAuthConfig());
      setSuccess(`Contact status updated to ${newStatus}`);
      fetchContacts(); // Refresh the list
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to update contact status:', err);
      setError('Failed to update contact status');
    }
  };

  const handleDelete = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      await axios.delete(`/api/contacts/${contactId}`, getAuthConfig());
      setSuccess('Contact deleted successfully');
      fetchContacts(); // Refresh the list
      setShowModal(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to delete contact:', err);
      setError('Failed to delete contact');
    }
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
    
    // Mark as read if it's unread
    if (contact.status === 'unread') {
      handleStatusChange(contact.id, 'read');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'unread': { variant: 'warning', text: 'Unread', icon: faEnvelope },
      'read': { variant: 'info', text: 'Read', icon: faEnvelopeOpen },
      'replied': { variant: 'primary', text: 'Replied', icon: faReply },
      'resolved': { variant: 'success', text: 'Resolved', icon: faCheck }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: status, icon: faEnvelope };
    return (
      <Badge bg={config.variant}>
        <FontAwesomeIcon icon={config.icon} className="me-1" />
        {config.text}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
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
            <p>You need to be logged in as an admin to access the contacts page.</p>
            <p>Current status:</p>
            <ul>
              <li>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</li>
              <li>Admin Role: {isAdmin ? 'Yes' : 'No'}</li>
              <li>Admin Token: {localStorage.getItem('adminToken') ? 'Present' : 'Missing'}</li>
            </ul>
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
            <p className="mt-3">Loading contacts...</p>
          </div>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Contact Messages</h1>
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

        {/* Filters */}
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="resolved">Resolved</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Search</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Search by name, email, subject..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>From Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>To Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Contacts Table */}
        <Card>
          <Card.Body>
            {contacts.length === 0 ? (
              <div className="text-center py-4">
                <FontAwesomeIcon icon={faEnvelope} size="3x" className="text-muted mb-3" />
                <h5>No contacts found</h5>
                <p className="text-muted">No contact messages match your current filters.</p>
              </div>
            ) : (
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.id}>
                      <td>
                        <strong>{contact.name}</strong>
                      </td>
                      <td>{contact.email}</td>
                      <td>
                        <span className="text-truncate" style={{ maxWidth: '200px', display: 'inline-block' }}>
                          {contact.subject}
                        </span>
                      </td>
                      <td>{getStatusBadge(contact.status)}</td>
                      <td>
                        <small className="text-muted">
                          {formatDate(contact.createdAt)}
                        </small>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleViewContact(contact)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(contact.id)}
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

        {/* Contact Detail Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Contact Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedContact && (
              <div>
                <Row className="mb-3">
                  <Col md={6}>
                    <strong>Name:</strong> {selectedContact.name}
                  </Col>
                  <Col md={6}>
                    <strong>Email:</strong> {selectedContact.email}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <strong>Subject:</strong> {selectedContact.subject}
                  </Col>
                  <Col md={6}>
                    <strong>Status:</strong> {getStatusBadge(selectedContact.status)}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <strong>Received:</strong> {formatDate(selectedContact.createdAt)}
                  </Col>
                  <Col md={6}>
                    <strong>Last Updated:</strong> {formatDate(selectedContact.updatedAt)}
                  </Col>
                </Row>
                <div className="mb-3">
                  <strong>Message:</strong>
                  <div className="mt-2 p-3 bg-light border rounded">
                    {selectedContact.message}
                  </div>
                </div>
                
                <div className="mb-3">
                  <strong>Update Status:</strong>
                  <div className="mt-2">
                    <Button
                      variant="outline-info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleStatusChange(selectedContact.id, 'read')}
                      disabled={selectedContact.status === 'read'}
                    >
                      Mark as Read
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleStatusChange(selectedContact.id, 'replied')}
                      disabled={selectedContact.status === 'replied'}
                    >
                      Mark as Replied
                    </Button>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => handleStatusChange(selectedContact.id, 'resolved')}
                      disabled={selectedContact.status === 'resolved'}
                    >
                      Mark as Resolved
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-danger" onClick={() => handleDelete(selectedContact?.id)}>
              <FontAwesomeIcon icon={faTrash} className="me-2" />
              Delete Contact
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </AdminLayout>
  );
};

export default Contacts;
