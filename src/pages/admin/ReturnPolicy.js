import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEdit, faTimes, faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';

const ReturnPolicy = () => {
  const { isAuthenticated, isAdmin, getAuthConfig } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editing, setEditing] = useState(false);
  
  const [policy, setPolicy] = useState({
    returnWindow: 3,
    returnWindowUnit: 'days',
    allowReturns: true,
    nonReturnableCategories: ['food', 'perishables', 'personal-care'],
    returnConditions: [
      'Product must be in original packaging',
      'Product must be unused and undamaged',
      'Return request must be made within return window',
      'Food items and perishables are non-returnable',
      'Personal care items are non-returnable'
    ],
    refundMethod: 'original_payment',
    returnShipping: 'customer_pays',
    restockingFee: 0,
    returnAddress: {
      name: 'Ayur4Life Returns',
      address: '123 Returns Street',
      city: 'Return City',
      state: 'RC',
      zipCode: '12345',
      country: 'India'
    }
  });

  const [newCondition, setNewCondition] = useState('');
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadReturnPolicy();
    }
  }, [isAuthenticated, isAdmin]);

  const loadReturnPolicy = async () => {
    try {
      const config = getAuthConfig();
      const response = await axios.get('/api/return-policy/admin', config);
      if (response.data.success) {
        setPolicy(response.data.policy);
      }
    } catch (error) {
      console.error('Error loading return policy:', error);
      // If no policy exists, use default values
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const config = getAuthConfig();
      const response = await axios.post('/api/return-policy/admin', policy, config);
      
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Return policy updated successfully!' });
        setEditing(false);
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'Error updating return policy: ' + error.response?.data?.message || error.message });
    } finally {
      setLoading(false);
    }
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setPolicy(prev => ({
        ...prev,
        returnConditions: [...prev.returnConditions, newCondition.trim()]
      }));
      setNewCondition('');
    }
  };

  const removeCondition = (index) => {
    setPolicy(prev => ({
      ...prev,
      returnConditions: prev.returnConditions.filter((_, i) => i !== index)
    }));
  };

  const addNonReturnableCategory = () => {
    if (newCategory.trim() && !policy.nonReturnableCategories.includes(newCategory.trim().toLowerCase())) {
      setPolicy(prev => ({
        ...prev,
        nonReturnableCategories: [...prev.nonReturnableCategories, newCategory.trim().toLowerCase()]
      }));
      setNewCategory('');
    }
  };

  const removeNonReturnableCategory = (category) => {
    setPolicy(prev => ({
      ...prev,
      nonReturnableCategories: prev.nonReturnableCategories.filter(c => c !== category)
    }));
  };

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
            <FontAwesomeIcon icon={faEdit} className="me-2" />
            Return Policy Management
          </h2>
          <p className="text-muted">
            Configure return policies, timeframes, and conditions for your e-commerce store.
          </p>
        </Col>
      </Row>

      {message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Return Policy Settings</h5>
              {!editing ? (
                <Button variant="outline-primary" size="sm" onClick={() => setEditing(true)}>
                  <FontAwesomeIcon icon={faEdit} className="me-2" />
                  Edit Policy
                </Button>
              ) : (
                <div>
                  <Button variant="success" size="sm" className="me-2" onClick={handleSave} disabled={loading}>
                    {loading ? 'Saving...' : (
                      <>
                        <FontAwesomeIcon icon={faSave} className="me-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>
                    <FontAwesomeIcon icon={faTimes} className="me-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Return Window</Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="number"
                        min="1"
                        max="30"
                        value={policy.returnWindow}
                        onChange={(e) => setPolicy(prev => ({ ...prev, returnWindow: parseInt(e.target.value) }))}
                        disabled={!editing}
                      />
                      <Form.Select
                        value={policy.returnWindowUnit}
                        onChange={(e) => setPolicy(prev => ({ ...prev, returnWindowUnit: e.target.value }))}
                        disabled={!editing}
                        style={{ width: 'auto' }}
                      >
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                      </Form.Select>
                    </div>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Restocking Fee (%)</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={policy.restockingFee}
                      onChange={(e) => setPolicy(prev => ({ ...prev, restockingFee: parseFloat(e.target.value) }))}
                      disabled={!editing}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Refund Method</Form.Label>
                    <Form.Select
                      value={policy.refundMethod}
                      onChange={(e) => setPolicy(prev => ({ ...prev, refundMethod: e.target.value }))}
                      disabled={!editing}
                    >
                      <option value="original_payment">Original Payment Method</option>
                      <option value="store_credit">Store Credit</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Return Shipping</Form.Label>
                    <Form.Select
                      value={policy.returnShipping}
                      onChange={(e) => setPolicy(prev => ({ ...prev, returnShipping: e.target.value }))}
                      disabled={!editing}
                    >
                      <option value="customer_pays">Customer Pays</option>
                      <option value="free_return">Free Return</option>
                      <option value="prepaid_label">Prepaid Label</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Check
                      type="switch"
                      id="allowReturns"
                      label="Allow Returns"
                      checked={policy.allowReturns}
                      onChange={(e) => setPolicy(prev => ({ ...prev, allowReturns: e.target.checked }))}
                      disabled={!editing}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>
              <h6 className="mb-0">Return Conditions</h6>
            </Card.Header>
            <Card.Body>
              {policy.returnConditions.map((condition, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <FontAwesomeIcon icon={faCheck} className="text-success me-2" />
                  <span className="flex-grow-1">{condition}</span>
                  {editing && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeCondition(index)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </Button>
                  )}
                </div>
              ))}
              
              {editing && (
                <div className="d-flex gap-2 mt-3">
                  <Form.Control
                    type="text"
                    placeholder="Add new condition..."
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCondition()}
                  />
                  <Button variant="outline-primary" size="sm" onClick={addCondition}>
                    Add
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header>
              <h6 className="mb-0">Non-Returnable Categories</h6>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                {policy.nonReturnableCategories.map((category, index) => (
                  <Badge
                    key={index}
                    bg="warning"
                    text="dark"
                    className="me-2 mb-2"
                    style={{ fontSize: '0.9rem' }}
                  >
                    {category}
                    {editing && (
                      <FontAwesomeIcon
                        icon={faTimes}
                        className="ms-2"
                        style={{ cursor: 'pointer' }}
                        onClick={() => removeNonReturnableCategory(category)}
                      />
                    )}
                  </Badge>
                ))}
              </div>
              
              {editing && (
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="Add category..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addNonReturnableCategory()}
                  />
                  <Button variant="outline-warning" size="sm" onClick={addNonReturnableCategory}>
                    Add
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h6 className="mb-0">Return Address</h6>
            </Card.Header>
            <Card.Body>
              <div className="mb-2">
                <strong>{policy.returnAddress.name}</strong>
              </div>
              <div className="text-muted small">
                {policy.returnAddress.address}<br />
                {policy.returnAddress.city}, {policy.returnAddress.state} {policy.returnAddress.zipCode}<br />
                {policy.returnAddress.country}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </AdminLayout>
  );
};

export default ReturnPolicy;
