import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Badge, Nav, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingBag, faHeart, faCog, faSignOutAlt, faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useUserAuth } from '../contexts/UserAuthContext';
import axios from 'axios';
import UserLayout from '../layouts/UserLayout';

const Account = () => {
  const { user, updateProfile, changePassword, logout } = useUserAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [passwordEditing, setPasswordEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || ''
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await axios.get('/api/orders');
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setOrdersLoading(false);
      setLoading(false);
    }
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateProfileForm = () => {
    const errors = {};
    
    if (!profileData.firstName.trim()) errors.firstName = 'First name is required';
    if (!profileData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!profileData.phone.trim()) errors.phone = 'Phone number is required';
    if (!profileData.address.street.trim()) errors['address.street'] = 'Street address is required';
    if (!profileData.address.city.trim()) errors['address.city'] = 'City is required';
    if (!profileData.address.state.trim()) errors['address.state'] = 'State is required';
    if (!profileData.address.zipCode.trim()) errors['address.zipCode'] = 'ZIP code is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) errors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) errors.newPassword = 'New password is required';
    if (passwordData.newPassword.length < 6) errors.newPassword = 'Password must be at least 6 characters';
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSave = async () => {
    if (!validateProfileForm()) return;

    try {
      await updateProfile(profileData);
      setEditing(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordSave = async () => {
    if (!validatePasswordForm()) return;

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordEditing(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const getOrderStatusBadge = (status) => {
    const statusConfig = {
      'pending': { variant: 'warning', text: 'Pending' },
      'confirmed': { variant: 'info', text: 'Confirmed' },
      'shipped': { variant: 'primary', text: 'Shipped' },
      'delivered': { variant: 'success', text: 'Delivered' },
      'cancelled': { variant: 'danger', text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  if (loading) {
    return (
      <UserLayout>
        <Container className="py-5">
          <div className="text-center">
            <Spinner animation="border" role="status" className="text-primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Loading your account...</p>
          </div>
        </Container>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
    <Container className="py-5">
      <div className="mb-4">
        <h1 className="mb-2">My Account</h1>
        <p className="text-muted">Welcome back, {user?.firstName}!</p>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Row>
        <Col lg={3}>
          <Card className="mb-4">
            <Card.Body className="text-center">
              <div className="mb-3">
                <FontAwesomeIcon icon={faUser} size="3x" className="text-primary" />
              </div>
              <h5>{user?.firstName} {user?.lastName}</h5>
              <p className="text-muted">{user?.email}</p>
              <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                Logout
              </Button>
            </Card.Body>
          </Card>

          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'profile'}
                onClick={() => setActiveTab('profile')}
              >
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Profile
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'orders'}
                onClick={() => setActiveTab('orders')}
              >
                <FontAwesomeIcon icon={faShoppingBag} className="me-2" />
                Orders
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'security'}
                onClick={() => setActiveTab('security')}
              >
                <FontAwesomeIcon icon={faCog} className="me-2" />
                Security
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>

        <Col lg={9}>
          <Tab.Container activeKey={activeTab}>
            <Tab.Content>
              {/* Profile Tab */}
              <Tab.Pane eventKey="profile">
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      Profile Information
                    </h5>
                    {!editing ? (
                      <Button variant="outline-primary" size="sm" onClick={() => setEditing(true)}>
                        <FontAwesomeIcon icon={faEdit} className="me-2" />
                        Edit
                      </Button>
                    ) : (
                      <div>
                        <Button variant="success" size="sm" className="me-2" onClick={handleProfileSave}>
                          <FontAwesomeIcon icon={faSave} className="me-2" />
                          Save
                        </Button>
                        <Button variant="outline-secondary" size="sm" onClick={() => setEditing(false)}>
                          <FontAwesomeIcon icon={faTimes} className="me-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>First Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleProfileInputChange}
                            disabled={!editing}
                            isInvalid={!!formErrors.firstName}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors.firstName}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="lastName"
                            value={profileData.lastName}
                            onChange={handleProfileInputChange}
                            disabled={!editing}
                            isInvalid={!!formErrors.lastName}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors.lastName}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            value={user?.email}
                            disabled
                            className="bg-light"
                          />
                          <Form.Text className="text-muted">
                            Email cannot be changed
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleProfileInputChange}
                            disabled={!editing}
                            isInvalid={!!formErrors.phone}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors.phone}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Date of Birth</Form.Label>
                          <Form.Control
                            type="date"
                            name="dateOfBirth"
                            value={profileData.dateOfBirth}
                            onChange={handleProfileInputChange}
                            disabled={!editing}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Gender</Form.Label>
                          <Form.Select
                            name="gender"
                            value={profileData.gender}
                            onChange={handleProfileInputChange}
                            disabled={!editing}
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <hr />
                    <h6>Address Information</h6>
                    <Form.Group className="mb-3">
                      <Form.Label>Street Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.street"
                        value={profileData.address.street}
                        onChange={handleProfileInputChange}
                        disabled={!editing}
                        isInvalid={!!formErrors['address.street']}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors['address.street']}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            name="address.city"
                            value={profileData.address.city}
                            onChange={handleProfileInputChange}
                            disabled={!editing}
                            isInvalid={!!formErrors['address.city']}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors['address.city']}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>State</Form.Label>
                          <Form.Control
                            type="text"
                            name="address.state"
                            value={profileData.address.state}
                            onChange={handleProfileInputChange}
                            disabled={!editing}
                            isInvalid={!!formErrors['address.state']}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors['address.state']}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>ZIP Code</Form.Label>
                          <Form.Control
                            type="text"
                            name="address.zipCode"
                            value={profileData.address.zipCode}
                            onChange={handleProfileInputChange}
                            disabled={!editing}
                            isInvalid={!!formErrors['address.zipCode']}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors['address.zipCode']}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              {/* Orders Tab */}
              <Tab.Pane eventKey="orders">
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">
                      <FontAwesomeIcon icon={faShoppingBag} className="me-2" />
                      Order History
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    {ordersLoading ? (
                      <div className="text-center py-4">
                        <Spinner animation="border" role="status" className="text-primary">
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <p className="mt-3">Loading orders...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-4">
                        <FontAwesomeIcon icon={faShoppingBag} size="3x" className="text-muted mb-3" />
                        <h5>No orders yet</h5>
                        <p className="text-muted">Start shopping to see your order history here.</p>
                      </div>
                    ) : (
                      <div>
                        {orders.map((order) => (
                          <Card key={order.id} className="mb-3">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                              <div>
                                <strong>Order #{order.orderId}</strong>
                                <br />
                                <small className="text-muted">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </small>
                              </div>
                              <div className="text-end">
                                {getOrderStatusBadge(order.status)}
                                <br />
                                <strong className="text-primary">₹{order.total}</strong>
                              </div>
                            </Card.Header>
                            <Card.Body>
                              <div className="mb-3">
                                <strong>Items:</strong>
                                {order.items.map((item, index) => (
                                  <div key={index} className="d-flex justify-content-between mt-2">
                                    <span>{item.name} × {item.quantity}</span>
                                    <span>₹{item.price}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="mb-2">
                                <strong>Shipping Address:</strong>
                                <p className="mb-1">
                                  {order.shippingAddress.street}<br />
                                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                </p>
                              </div>
                              <div>
                                <strong>Payment Method:</strong> {order.paymentMethod}
                              </div>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Tab.Pane>

              {/* Security Tab */}
              <Tab.Pane eventKey="security">
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <FontAwesomeIcon icon={faCog} className="me-2" />
                      Security Settings
                    </h5>
                    {!passwordEditing ? (
                      <Button variant="outline-primary" size="sm" onClick={() => setPasswordEditing(true)}>
                        <FontAwesomeIcon icon={faEdit} className="me-2" />
                        Change Password
                      </Button>
                    ) : (
                      <div>
                        <Button variant="success" size="sm" className="me-2" onClick={handlePasswordSave}>
                          <FontAwesomeIcon icon={faSave} className="me-2" />
                          Save
                        </Button>
                        <Button variant="outline-secondary" size="sm" onClick={() => setPasswordEditing(false)}>
                          <FontAwesomeIcon icon={faTimes} className="me-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </Card.Header>
                  <Card.Body>
                    {passwordEditing ? (
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control
                              type="password"
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordInputChange}
                              isInvalid={!!passwordErrors.currentPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                              {passwordErrors.currentPassword}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                    ) : null}
                    {passwordEditing ? (
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                              type="password"
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordInputChange}
                              isInvalid={!!passwordErrors.newPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                              {passwordErrors.newPassword}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Confirm New Password</Form.Label>
                            <Form.Control
                              type="password"
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordInputChange}
                              isInvalid={!!passwordErrors.confirmPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                              {passwordErrors.confirmPassword}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                    ) : (
                      <p className="text-muted">
                        Click "Change Password" to update your password.
                      </p>
                    )}
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
    </UserLayout>
  );
};

export default Account;
