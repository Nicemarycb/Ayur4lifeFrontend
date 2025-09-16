import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faInfoCircle, faCheck, faTimes, faExclamationTriangle, faShieldAlt, faTruck, faCreditCard, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import UserLayout from '../layouts/UserLayout';
import './ReturnPolicy.css';

const ReturnPolicy = () => {
  const [loading, setLoading] = useState(true);
  const [policy, setPolicy] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReturnPolicy();
  }, []);

  const loadReturnPolicy = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/return-policy');
      if (response.data.success) {
        setPolicy(response.data.policy);
      }
    } catch (error) {
      setError('Error loading return policy. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getReturnWindowText = () => {
    if (!policy) return '';
    const unit = policy.returnWindowUnit === 'days' ? 'day(s)' : 'week(s)';
    return `${policy.returnWindow} ${unit}`;
  };

  if (loading) {
    return (
      <UserLayout>
        <Container className="py-5">
          <div className="text-center">
            <Spinner animation="border" className="text-success" />
            <p className="mt-3 text-success">Loading return policy...</p>
          </div>
        </Container>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <Container className="py-5">
          <Alert variant="danger">
            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
            {error}
          </Alert>
        </Container>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="return-policy-hero">
        <Container className="py-5">
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <div className="hero-content">
                <div className="hero-icon mb-4">
                  <FontAwesomeIcon icon={faUndo} />
                </div>
                <h1 className="hero-title mb-3">Return Policy</h1>
                <p className="hero-subtitle">
                  We want you to be completely satisfied with your purchase. 
                  Our customer-friendly return policy ensures a hassle-free experience.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            {/* Return Window & Refund Method */}
            <Row className="g-4 mb-5">
              <Col md={6}>
                <Card className="return-card return-window-card h-100">
                  <Card.Body className="text-center p-4">
                    <div className="card-icon mb-3">
                      <FontAwesomeIcon icon={faShieldAlt} />
                    </div>
                    <h4 className="card-title mb-3">Return Window</h4>
                    <div className="return-window-display mb-3">
                      <span className="return-window-number">{policy?.returnWindow}</span>
                      <span className="return-window-unit">{policy?.returnWindowUnit}</span>
                    </div>
                    <p className="card-text">
                      You have <strong>{getReturnWindowText()}</strong> from the date of delivery to request a return.
                    </p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="return-card refund-method-card h-100">
                  <Card.Body className="text-center p-4">
                    <div className="card-icon mb-3">
                      <FontAwesomeIcon icon={faCreditCard} />
                    </div>
                    <h4 className="card-title mb-3">Refund Method</h4>
                    <div className="refund-method-display mb-3">
                      {policy?.refundMethod?.replace('_', ' ').toUpperCase()}
                    </div>
                    <p className="card-text">
                      Refunds will be processed using your original payment method for your convenience.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Return Conditions */}
            <Card className="return-card conditions-card mb-5">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div className="card-icon mb-3">
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                  <h3 className="card-title">Return Conditions</h3>
                  <p className="card-subtitle">Please ensure your return meets these requirements</p>
                </div>
                <Row>
                  {policy?.returnConditions?.map((condition, index) => (
                    <Col md={6} key={index}>
                      <div className="condition-item">
                        <div className="condition-icon">
                          <FontAwesomeIcon icon={faCheck} />
                        </div>
                        <span className="condition-text">{condition}</span>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>

            {/* Non-Returnable Items */}
            <Card className="return-card non-returnable-card mb-5">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div className="card-icon warning-icon mb-3">
                    <FontAwesomeIcon icon={faTimes} />
                  </div>
                  <h3 className="card-title">Non-Returnable Items</h3>
                  <p className="card-subtitle">These product categories cannot be returned for safety reasons</p>
                </div>
                <div className="non-returnable-categories mb-4">
                  {policy?.nonReturnableCategories?.map((category, index) => (
                    <Badge
                      key={index}
                      className="non-returnable-badge me-2 mb-2"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
                <div className="warning-note">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                  <strong>Important:</strong> Food items, perishables, and personal care products 
                  cannot be returned for hygiene and safety reasons.
                </div>
              </Card.Body>
            </Card>

            {/* Return Shipping & Restocking Fee */}
            <Row className="g-4 mb-5">
              <Col md={6}>
                <Card className="return-card shipping-card h-100">
                  <Card.Body className="text-center p-4">
                    <div className="card-icon mb-3">
                      <FontAwesomeIcon icon={faTruck} />
                    </div>
                    <h4 className="card-title mb-3">Return Shipping</h4>
                    <div className="shipping-info mb-3">
                      {policy?.returnShipping === 'customer_pays' && (
                        <span className="shipping-status customer-pays">Customer Pays</span>
                      )}
                      {policy?.returnShipping === 'free_return' && (
                        <span className="shipping-status free-return">Free Return</span>
                      )}
                      {policy?.returnShipping === 'prepaid_label' && (
                        <span className="shipping-status prepaid">Prepaid Label</span>
                      )}
                    </div>
                    <p className="card-text">
                      {policy?.returnShipping === 'customer_pays' && 
                        'Customer is responsible for return shipping costs.'}
                      {policy?.returnShipping === 'free_return' && 
                        'We provide free return shipping labels for your convenience.'}
                      {policy?.returnShipping === 'prepaid_label' && 
                        'We will send you a prepaid shipping label.'}
                    </p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="return-card restocking-card h-100">
                  <Card.Body className="text-center p-4">
                    <div className="card-icon mb-3">
                      <FontAwesomeIcon icon={faInfoCircle} />
                    </div>
                    <h4 className="card-title mb-3">Restocking Fee</h4>
                    <div className="restocking-fee-display mb-3">
                      {policy?.restockingFee > 0 ? `${policy.restockingFee}%` : 'No Fee'}
                    </div>
                    <p className="card-text">
                      {policy?.restockingFee > 0 
                        ? `A ${policy.restockingFee}% restocking fee may apply to certain returns.`
                        : 'No restocking fee will be charged for eligible returns.'}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Return Address */}
            <Card className="return-card address-card mb-5">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div className="card-icon mb-3">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </div>
                  <h3 className="card-title">Return Address</h3>
                  <p className="card-subtitle">Send your returns to our dedicated returns center</p>
                </div>
                <Row>
                  <Col md={6}>
                    <div className="return-address">
                      <h6 className="address-label">Return to:</h6>
                      <div className="address-details">
                        <p className="company-name">{policy?.returnAddress?.name}</p>
                        <p className="address-line">{policy?.returnAddress?.address}</p>
                        <p className="address-line">
                          {policy?.returnAddress?.city}, {policy?.returnAddress?.state} {policy?.returnAddress?.zipCode}
                        </p>
                        <p className="address-line">{policy?.returnAddress?.country}</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="return-notes">
                      <h6 className="notes-label">Important Notes:</h6>
                      <ul className="notes-list">
                        <li>Please include your order number with the return</li>
                        <li>Package items securely to prevent damage</li>
                        <li>Use a trackable shipping method</li>
                        <li>Returns are processed within 5-7 business days</li>
                      </ul>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* How to Return */}
            <Card className="return-card how-to-return-card">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div className="card-icon mb-3">
                    <FontAwesomeIcon icon={faUndo} />
                  </div>
                  <h3 className="card-title">How to Request a Return</h3>
                  <p className="card-subtitle">Follow these simple steps to initiate your return</p>
                </div>
                <Row>
                  <Col md={4}>
                    <div className="step-item text-center">
                      <div className="step-number">1</div>
                      <h5 className="step-title">Go to Your Account</h5>
                      <p className="step-description">
                        Navigate to your order history in your account dashboard.
                      </p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="step-item text-center">
                      <div className="step-number">2</div>
                      <h5 className="step-title">Click Return Button</h5>
                      <p className="step-description">
                        Click the "Return" button next to the item you want to return.
                      </p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="step-item text-center">
                      <div className="step-number">3</div>
                      <h5 className="step-title">Submit Request</h5>
                      <p className="step-description">
                        Fill out the return form and submit your request for review.
                      </p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </UserLayout>
  );
};

export default ReturnPolicy;
