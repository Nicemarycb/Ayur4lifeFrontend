// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Badge, Nav, Tab } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUser, faShoppingBag, faHeart, faCog, faSignOutAlt, faEdit, faSave, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
// import { useUserAuth } from '../contexts/UserAuthContext';
// import axios from 'axios';
// import UserLayout from '../layouts/UserLayout';

// const Account = () => {
//   const { user, updateProfile, changePassword, logout } = useUserAuth();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [ordersLoading, setOrdersLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('profile');
//   const [editing, setEditing] = useState(false);
//   const [passwordEditing, setPasswordEditing] = useState(false);

//   const [profileData, setProfileData] = useState({
//     firstName: user?.firstName || '',
//     lastName: user?.lastName || '',
//     phone: user?.phone || '',
//     dateOfBirth: user?.dateOfBirth || '',
//     gender: user?.gender || '',
//     address: {
//       street: user?.address?.street || '',
//       city: user?.address?.city || '',
//       state: user?.address?.state || '',
//       zipCode: user?.address?.zipCode || ''
//     }
//   });

//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });

//   const [formErrors, setFormErrors] = useState({});
//   const [passwordErrors, setPasswordErrors] = useState({});

//   useEffect(() => {
//     fetchOrders();
//   }, []);

// // In the fetchOrders function, update the axios call to handle pagination
// const fetchOrders = async () => {
//   try {
//     setOrdersLoading(true);
//     const response = await axios.get('/api/orders?limit=100&page=1'); // Increased limit
//     setOrders(response.data.orders); // Access the orders array from response
//   } catch (err) {
//     console.error('Failed to fetch orders:', err);
//     setError('Failed to load orders. Please try again later.');
//   } finally {
//     setOrdersLoading(false);
//     setLoading(false);
//   }
// };
//   const handleProfileInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setProfileData(prev => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: value
//         }
//       }));
//     } else {
//       setProfileData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
    
//     if (formErrors[name]) {
//       setFormErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const handlePasswordInputChange = (e) => {
//     const { name, value } = e.target;
//     setPasswordData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     if (passwordErrors[name]) {
//       setPasswordErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateProfileForm = () => {
//     const errors = {};
    
//     if (!profileData.firstName.trim()) errors.firstName = 'First name is required';
//     if (!profileData.lastName.trim()) errors.lastName = 'Last name is required';
//     if (!profileData.phone.trim()) errors.phone = 'Phone number is required';
//     if (!profileData.address.street.trim()) errors['address.street'] = 'Street address is required';
//     if (!profileData.address.city.trim()) errors['address.city'] = 'City is required';
//     if (!profileData.address.state.trim()) errors['address.state'] = 'State is required';
//     if (!profileData.address.zipCode.trim()) errors['address.zipCode'] = 'ZIP code is required';

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const validatePasswordForm = () => {
//     const errors = {};
    
//     if (!passwordData.currentPassword) errors.currentPassword = 'Current password is required';
//     if (!passwordData.newPassword) errors.newPassword = 'New password is required';
//     if (passwordData.newPassword.length < 6) errors.newPassword = 'Password must be at least 6 characters';
//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       errors.confirmPassword = 'Passwords do not match';
//     }

//     setPasswordErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleProfileSave = async () => {
//     if (!validateProfileForm()) return;

//     try {
//       await updateProfile(profileData);
//       setEditing(false);
//       setError(null);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update profile');
//     }
//   };

//   const handlePasswordSave = async () => {
//     if (!validatePasswordForm()) return;

//     try {
//       await changePassword(passwordData.currentPassword, passwordData.newPassword);
//       setPasswordEditing(false);
//       setPasswordData({
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//       });
//       setError(null);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to change password');
//     }
//   };

//   const handleLogout = () => {
//     logout();
//   };

//   const getOrderStatusBadge = (status) => {
//     const statusConfig = {
//       'pending': { variant: 'warning', text: 'Pending' },
//       'confirmed': { variant: 'info', text: 'Confirmed' },
//       'shipped': { variant: 'primary', text: 'Shipped' },
//       'delivered': { variant: 'success', text: 'Delivered' },
//       'cancelled': { variant: 'danger', text: 'Cancelled' }
//     };
    
//     const config = statusConfig[status] || { variant: 'secondary', text: status };
//     return <Badge bg={config.variant}>{config.text}</Badge>;
//   };

//   if (loading) {
//     return (
//       <UserLayout>
//         <Container className="py-5">
//           <div className="text-center">
//             <Spinner animation="border" role="status" className="text-primary">
//               <span className="visually-hidden">Loading...</span>
//             </Spinner>
//             <p className="mt-3">Loading your account...</p>
//           </div>
//         </Container>
//       </UserLayout>
//     );
//   }

//   return (
//     <UserLayout>
//     <Container className="py-5">
//       <div className="mb-4">
//         <h1 className="mb-2">My Account</h1>
//         <p className="text-muted">Welcome back, {user?.firstName}!</p>
//       </div>

//       {error && (
//         <Alert variant="danger" className="mb-4" dismissible onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}

//       <Row>
//         <Col lg={3}>
//           <Card className="mb-4">
//             <Card.Body className="text-center">
//               <div className="mb-3">
//                 <FontAwesomeIcon icon={faUser} size="3x" className="text-primary" />
//               </div>
//               <h5>{user?.firstName} {user?.lastName}</h5>
//               <p className="text-muted">{user?.email}</p>
//               <Button variant="outline-danger" size="sm" onClick={handleLogout}>
//                 <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
//                 Logout
//               </Button>
//             </Card.Body>
//           </Card>

//           <Nav variant="pills" className="flex-column">
//             <Nav.Item>
//               <Nav.Link
//                 active={activeTab === 'profile'}
//                 onClick={() => setActiveTab('profile')}
//               >
//                 <FontAwesomeIcon icon={faUser} className="me-2" />
//                 Profile
//               </Nav.Link>
//             </Nav.Item>
//             <Nav.Item>
//               <Nav.Link
//                 active={activeTab === 'orders'}
//                 onClick={() => setActiveTab('orders')}
//               >
//                 <FontAwesomeIcon icon={faShoppingBag} className="me-2" />
//                 Orders
//               </Nav.Link>
//             </Nav.Item>
//             <Nav.Item>
//               <Nav.Link
//                 active={activeTab === 'security'}
//                 onClick={() => setActiveTab('security')}
//               >
//                 <FontAwesomeIcon icon={faCog} className="me-2" />
//                 Security
//               </Nav.Link>
//             </Nav.Item>
//           </Nav>
//         </Col>

//         <Col lg={9}>
//           <Tab.Container activeKey={activeTab}>
//             <Tab.Content>
//               {/* Profile Tab */}
//               <Tab.Pane eventKey="profile">
//                 <Card>
//                   <Card.Header className="d-flex justify-content-between align-items-center">
//                     <h5 className="mb-0">
//                       <FontAwesomeIcon icon={faUser} className="me-2" />
//                       Profile Information
//                     </h5>
//                     {!editing ? (
//                       <Button variant="primary" size="sm" onClick={() => setEditing(true)}>
//                         <FontAwesomeIcon icon={faEdit} className="me-2" />
//                         Edit
//                       </Button>
//                     ) : (
//                       <div>
//                         <Button variant="success" size="sm" className="me-2" onClick={handleProfileSave}>
//                           <FontAwesomeIcon icon={faSave} className="me-2" />
//                           Save
//                         </Button>
//                         <Button variant="outline-secondary" size="sm" onClick={() => setEditing(false)}>
//                           <FontAwesomeIcon icon={faTimes} className="me-2" />
//                           Cancel
//                         </Button>
//                       </div>
//                     )}
//                   </Card.Header>
//                   <Card.Body>
//                     <Row>
//                       <Col md={6}>
//                         <Form.Group className="mb-3">
//                           <Form.Label>First Name</Form.Label>
//                           <Form.Control
//                             type="text"
//                             name="firstName"
//                             value={profileData.firstName}
//                             onChange={handleProfileInputChange}
//                             disabled={!editing}
//                             isInvalid={!!formErrors.firstName}
//                           />
//                           <Form.Control.Feedback type="invalid">
//                             {formErrors.firstName}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>
//                       <Col md={6}>
//                         <Form.Group className="mb-3">
//                           <Form.Label>Last Name</Form.Label>
//                           <Form.Control
//                             type="text"
//                             name="lastName"
//                             value={profileData.lastName}
//                             onChange={handleProfileInputChange}
//                             disabled={!editing}
//                             isInvalid={!!formErrors.lastName}
//                           />
//                           <Form.Control.Feedback type="invalid">
//                             {formErrors.lastName}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>
//                     </Row>
//                     <Row>
//                       <Col md={6}>
//                         <Form.Group className="mb-3">
//                           <Form.Label>Email</Form.Label>
//                           <Form.Control
//                             type="email"
//                             value={user?.email}
//                             disabled
//                             className="bg-light"
//                           />
//                           <Form.Text className="text-muted">
//                             Email cannot be changed
//                           </Form.Text>
//                         </Form.Group>
//                       </Col>
//                       <Col md={6}>
//                         <Form.Group className="mb-3">
//                           <Form.Label>Phone</Form.Label>
//                           <Form.Control
//                             type="tel"
//                             name="phone"
//                             value={profileData.phone}
//                             onChange={handleProfileInputChange}
//                             disabled={!editing}
//                             isInvalid={!!formErrors.phone}
//                           />
//                           <Form.Control.Feedback type="invalid">
//                             {formErrors.phone}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>
//                     </Row>
//                     <Row>
//                       <Col md={6}>
//                         <Form.Group className="mb-3">
//                           <Form.Label>Date of Birth</Form.Label>
//                           <Form.Control
//                             type="date"
//                             name="dateOfBirth"
//                             value={profileData.dateOfBirth}
//                             onChange={handleProfileInputChange}
//                             disabled={!editing}
//                           />
//                         </Form.Group>
//                       </Col>
//                       <Col md={6}>
//                         <Form.Group className="mb-3">
//                           <Form.Label>Gender</Form.Label>
//                           <Form.Select
//                             name="gender"
//                             value={profileData.gender}
//                             onChange={handleProfileInputChange}
//                             disabled={!editing}
//                           >
//                             <option value="">Select Gender</option>
//                             <option value="male">Male</option>
//                             <option value="female">Female</option>
//                             <option value="other">Other</option>
//                           </Form.Select>
//                         </Form.Group>
//                       </Col>
//                     </Row>
//                     <hr />
//                     <h6>Address Information</h6>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Street Address</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="address.street"
//                         value={profileData.address.street}
//                         onChange={handleProfileInputChange}
//                         disabled={!editing}
//                         isInvalid={!!formErrors['address.street']}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {formErrors['address.street']}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                     <Row>
//                       <Col md={4}>
//                         <Form.Group className="mb-3">
//                           <Form.Label>City</Form.Label>
//                           <Form.Control
//                             type="text"
//                             name="address.city"
//                             value={profileData.address.city}
//                             onChange={handleProfileInputChange}
//                             disabled={!editing}
//                             isInvalid={!!formErrors['address.city']}
//                           />
//                           <Form.Control.Feedback type="invalid">
//                             {formErrors['address.city']}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>
//                       <Col md={4}>
//                         <Form.Group className="mb-3">
//                           <Form.Label>State</Form.Label>
//                           <Form.Control
//                             type="text"
//                             name="address.state"
//                             value={profileData.address.state}
//                             onChange={handleProfileInputChange}
//                             disabled={!editing}
//                             isInvalid={!!formErrors['address.state']}
//                           />
//                           <Form.Control.Feedback type="invalid">
//                             {formErrors['address.state']}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>
//                       <Col md={4}>
//                         <Form.Group className="mb-3">
//                           <Form.Label>ZIP Code</Form.Label>
//                           <Form.Control
//                             type="text"
//                             name="address.zipCode"
//                             value={profileData.address.zipCode}
//                             onChange={handleProfileInputChange}
//                             disabled={!editing}
//                             isInvalid={!!formErrors['address.zipCode']}
//                           />
//                           <Form.Control.Feedback type="invalid">
//                             {formErrors['address.zipCode']}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>
//                     </Row>
//                   </Card.Body>
//                 </Card>
//               </Tab.Pane>

//               {/* Orders Tab */}
//               {/* <Tab.Pane eventKey="orders"> */}
//                 <Card>
//                   <Card.Header>
//                     <h5 className="mb-0">
//                       <FontAwesomeIcon icon={faShoppingBag} className="me-2" />
//                       Order History
//                     </h5>
//                   </Card.Header>
//                   <Card.Body>
//                     {ordersLoading ? (
//                       <div className="text-center py-4">
//                         <Spinner animation="border" role="status" className="text-primary">
//                           <span className="visually-hidden">Loading...</span>
//                         </Spinner>
//                         <p className="mt-3">Loading orders...</p>
//                       </div>
//                     ) : orders.length === 0 ? (
//                       <div className="text-center py-4">
//                         <FontAwesomeIcon icon={faShoppingBag} size="3x" className="text-muted mb-3" />
//                         <h5>No orders yet</h5>
//                         <p className="text-muted">Start shopping to see your order history here.</p>
//                       </div>
//                     ) : (
//                       <div>
//                         {orders.map((order) => (
//                            <Card key={order.id} className="mb-3">
//     <Card.Header className="d-flex justify-content-between align-items-center">
//       <div>
//         <strong>Order #{order.orderNumber || order.id}</strong> // Use orderNumber if available
//         <br />
//         <small className="text-muted">
//           {new Date(order.createdAt).toLocaleDateString()}
//         </small>
//       </div>
//       <div className="text-end">
//         {getOrderStatusBadge(order.status)}
//         <br />
//         <strong className="text-primary">₹{order.finalAmount || order.total}</strong>
//       </div>
//     </Card.Header>
//     <Card.Body>
//       <div className="mb-3">
//         <strong>Items:</strong>
//         {order.items && order.items.map((item, index) => (
//           <div key={index} className="d-flex justify-content-between mt-2">
//             <span>{item.productName} × {item.quantity}</span>
//             <span>₹{(item.unitPrice * item.quantity).toFixed(2)}</span>
//           </div>
//         ))}
//       </div>
//       {order.shippingAddress && (
//         <div className="mb-2">
//           <strong>Shipping Address:</strong>
//           <p className="mb-1">
//             {order.shippingAddress.street}<br />
//             {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
//           </p>
//         </div>
//       )}
//       <div>
//         <strong>Payment Method:</strong> {order.paymentMethod}
//       </div>
//     </Card.Body>
//   </Card>
//                         ))}
//                       </div>
//                     )}
//                   </Card.Body>
//                 </Card>
//               {/* </Tab.Pane> */}

//               {/* Security Tab */}
//               <Tab.Pane eventKey="security">
//                 <Card>
//                   <Card.Header className="d-flex justify-content-between align-items-center">
//                     <h5 className="mb-0">
//                       <FontAwesomeIcon icon={faCog} className="me-2" />
//                       Security Settings
//                     </h5>
//                     {!passwordEditing ? (
//                       <Button variant="primary" size="sm" onClick={() => setPasswordEditing(true)}>
//                         <FontAwesomeIcon icon={faEdit} className="me-2" />
//                         Change Password
//                       </Button>
//                     ) : (
//                       <div>
//                         <Button variant="success" size="sm" className="me-2" onClick={handlePasswordSave}>
//                           <FontAwesomeIcon icon={faSave} className="me-2" />
//                           Save
//                         </Button>
//                         <Button variant="outline-secondary" size="sm" onClick={() => setPasswordEditing(false)}>
//                           <FontAwesomeIcon icon={faTimes} className="me-2" />
//                           Cancel
//                         </Button>
//                       </div>
//                     )}
//                   </Card.Header>
//                   <Card.Body>
//                     {passwordEditing ? (
//                       <Row>
//                         <Col md={6}>
//                           <Form.Group className="mb-3">
//                             <Form.Label>Current Password</Form.Label>
//                             <Form.Control
//                               type="password"
//                               name="currentPassword"
//                               value={passwordData.currentPassword}
//                               onChange={handlePasswordInputChange}
//                               isInvalid={!!passwordErrors.currentPassword}
//                             />
//                             <Form.Control.Feedback type="invalid">
//                               {passwordErrors.currentPassword}
//                             </Form.Control.Feedback>
//                           </Form.Group>
//                         </Col>
//                       </Row>
//                     ) : null}
//                     {passwordEditing ? (
//                       <Row>
//                         <Col md={6}>
//                           <Form.Group className="mb-3">
//                             <Form.Label>New Password</Form.Label>
//                             <Form.Control
//                               type="password"
//                               name="newPassword"
//                               value={passwordData.newPassword}
//                               onChange={handlePasswordInputChange}
//                               isInvalid={!!passwordErrors.newPassword}
//                             />
//                             <Form.Control.Feedback type="invalid">
//                               {passwordErrors.newPassword}
//                             </Form.Control.Feedback>
//                           </Form.Group>
//                         </Col>
//                         <Col md={6}>
//                           <Form.Group className="mb-3">
//                             <Form.Label>Confirm New Password</Form.Label>
//                             <Form.Control
//                               type="password"
//                               name="confirmPassword"
//                               value={passwordData.confirmPassword}
//                               onChange={handlePasswordInputChange}
//                               isInvalid={!!passwordErrors.confirmPassword}
//                             />
//                             <Form.Control.Feedback type="invalid">
//                               {passwordErrors.confirmPassword}
//                             </Form.Control.Feedback>
//                           </Form.Group>
//                         </Col>
//                       </Row>
//                     ) : (
//                       <p className="text-muted">
//                         Click "Change Password" to update your password.
//                       </p>
//                     )}
//                   </Card.Body>
//                 </Card>
//               </Tab.Pane>
//             </Tab.Content>
//           </Tab.Container>
//         </Col>
//       </Row>
//     </Container>
//     </UserLayout>
//   );
// };

// export default Account;


import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Badge, Nav, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingBag, faHeart, faSearch, faCog, faSignOutAlt, faEdit, faSave, faTimes, faUndo } from '@fortawesome/free-solid-svg-icons';
import { useUserAuth } from '../contexts/UserAuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserLayout from '../layouts/UserLayout';
import InvoiceButton from '../components/InvoiceButton';

const Account = () => {
  const { user, updateProfile, changePassword, logout } = useUserAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [passwordEditing, setPasswordEditing] = useState(false);
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [returnRequests, setReturnRequests] = useState([]);
  const [returnRequestsLoading, setReturnRequestsLoading] = useState(false);
  const [cancellations, setCancellations] = useState([]);
  const [cancellationsLoading, setCancellationsLoading] = useState(false);

  // Filter orders based on search term
  const filteredOrders = orders.filter(order => {
    if (!orderSearchTerm.trim()) return true;
    
    const searchTerm = orderSearchTerm.toLowerCase().trim();
    
    // Search by order ID
    if (order.id && order.id.toLowerCase().includes(searchTerm)) return true;
    
    // Search by order number
    if (order.orderNumber && order.orderNumber.toLowerCase().includes(searchTerm)) return true;
    
    // Search by product names in order items
    if (order.items && order.items.some(item => 
      item.productName && item.productName.toLowerCase().includes(searchTerm)
    )) return true;
    
    return false;
  });

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
    address: user?.address || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        address: user.address || ''
      });
    }
    fetchOrders();
    fetchReturnRequests();
    fetchCancellations();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await axios.get('/api/orders?limit=100&page=1');
      setOrders(response.data.orders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again later.');
    } finally {
      setOrdersLoading(false);
      setLoading(false);
    }
  };

  const fetchReturnRequests = async () => {
    try {
      setReturnRequestsLoading(true);
      const response = await axios.get('/api/return-requests/user');
      if (response.data.success) {
        setReturnRequests(response.data.returnRequests);
      }
    } catch (err) {
      console.error('Failed to fetch return requests:', err);
      // Don't set error for return requests as it's not critical
    } finally {
      setReturnRequestsLoading(false);
    }
  };

  const fetchCancellations = async () => {
    try {
      setCancellationsLoading(true);
      const response = await axios.get('/api/return-requests/user-cancellations');
      if (response.data.success) {
        setCancellations(response.data.cancellations);
      }
    } catch (err) {
      console.error('Failed to fetch cancellations:', err);
      // Don't set error for cancellations as it's not critical
    } finally {
      setCancellationsLoading(false);
    }
  };

  // Get return status for a specific product in an order
  const getReturnStatus = (orderId, productId) => {
    const returnRequest = returnRequests.find(req => 
      req.orderId === orderId && req.productId === productId
    );
    
    if (!returnRequest) return null;
    
    return {
      status: returnRequest.status,
      reason: returnRequest.returnReason,
      createdAt: returnRequest.createdAt,
      adminAction: returnRequest.adminAction,
      adminReason: returnRequest.adminReason
    };
  };

  // Render return status badge
  const getReturnStatusBadge = (status) => {
    const statusConfig = {
      'pending': { variant: 'warning', text: 'Pending Review' },
      'approved': { variant: 'success', text: 'Approved' },
      'rejected': { variant: 'danger', text: 'Rejected' },
      'processing': { variant: 'info', text: 'Processing' },
      'completed': { variant: 'success', text: 'Completed' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: status };
    
    return (
      <Badge bg={config.variant} className="me-2">
        {config.text}
      </Badge>
    );
  };

  // Get cancellation status for a specific product in an order
  const getCancellationStatus = (orderId, productId) => {
    const cancellation = cancellations.find(req => 
      req.orderId === orderId && req.productId === productId
    );
    
    if (!cancellation) return null;
    
    return {
      status: cancellation.status,
      reason: cancellation.cancelReason,
      createdAt: cancellation.createdAt,
      adminAction: cancellation.adminAction,
      adminReason: cancellation.adminReason
    };
  };

  // Render cancellation status badge
  const getCancellationStatusBadge = (status) => {
    const statusConfig = {
      'pending': { variant: 'warning', text: 'Pending Review' },
      'approved': { variant: 'success', text: 'Approved' },
      'rejected': { variant: 'danger', text: 'Rejected' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: status };
    
    return (
      <Badge bg={config.variant} className="me-2">
        {config.text}
      </Badge>
    );
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
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
    if (!profileData.address?.street?.trim()) errors['address.street'] = 'Street address is required';
    if (!profileData.address?.city?.trim()) errors['address.city'] = 'City is required';
    if (!profileData.address?.state?.trim()) errors['address.state'] = 'State is required';
    if (!profileData.address?.zipCode?.trim()) errors['address.zipCode'] = 'ZIP code is required';

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
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    }
  };

  // const handlePasswordSave = async () => {
  //   if (!validatePasswordForm()) return;

  //   try {
  //     await changePassword(passwordData.currentPassword, passwordData.newPassword);
  //     setPasswordEditing(false);
  //     setPasswordData({
  //       currentPassword: '',
  //       newPassword: '',
  //       confirmPassword: ''
  //     });
  //     setError(null);
  //     setSuccess('Password changed successfully!');
  //     setTimeout(() => setSuccess(null), 3000);
  //   } catch (err) {
  //     setError(err.response?.data?.error || 'Failed to change password');
  //   }
  // };

const handlePasswordSave = async () => {
  const newErrors = {};
  if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required.';
  if (!passwordData.newPassword) newErrors.newPassword = 'New password is required.';
  if (passwordData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters long.';
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match.';
  }

  setPasswordErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    return;
  }

  const result = await changePassword({
    currentPassword: passwordData.currentPassword,
    newPassword: passwordData.newPassword
  });

  if (result.success) {
    alert(result.message);
    setPasswordEditing(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  } else {
    alert(result.error);
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

      {success && (
        <Alert variant="success" className="mb-4" dismissible onClose={() => setSuccess(null)}>
          {success}
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
                <FontAwesomeIcon icon={faUser} className="me-2"  />
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
                active={activeTab === 'returns'}
                onClick={() => setActiveTab('returns')}
              >
                <FontAwesomeIcon icon={faUndo} className="me-2" />
                Return Requests
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'cancellations'}
                onClick={() => setActiveTab('cancellations')}
              >
                <FontAwesomeIcon icon={faTimes} className="me-2" />
                Order Cancellations
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
                      <Button variant="primary" size="sm" onClick={() => setEditing(true)}>
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
                        value={profileData.address?.street || ''}
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
                            value={profileData.address?.city || ''}
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
                            value={profileData.address?.state || ''}
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
                            value={profileData.address?.zipCode || ''}
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
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <FontAwesomeIcon icon={faShoppingBag} className="me-2" />
                      Order History
                    </h5>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => {
                        fetchOrders();
                        fetchReturnRequests();
                      }}
                      disabled={ordersLoading}
                    >
                      <FontAwesomeIcon icon={faSearch} className="me-2" />
                      Refresh
                    </Button>
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
                        {/* Search Filter */}
                        <div className="mb-3">
                          <Form.Group>
                            <Form.Label>Search Orders</Form.Label>
                            <div className="d-flex gap-2">
                              <div className="position-relative flex-grow-1">
                                <Form.Control
                                  type="text"
                                  // placeholder="Enter order ID, order number, or product name..."
                                  value={orderSearchTerm}
                                  onChange={(e) => setOrderSearchTerm(e.target.value)}
                                  className="ps-4"
                                />
                                <FontAwesomeIcon 
                                  icon={faSearch} 
                                  className="position-absolute text-muted" 
                                  style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                                />
                              </div>
                              {orderSearchTerm && (
                                <Button 
                                  variant="outline-secondary" 
                                  size="sm"
                                  onClick={() => setOrderSearchTerm('')}
                                >
                                  Clear
                                </Button>
                              )}
                            </div>
                            <small className="text-muted">
                              Search by order ID, order number, or product name. Found {filteredOrders.length} of {orders.length} orders.
                            </small>
                          </Form.Group>
                        </div>
                        
                        {/* Filtered Orders */}
                        {filteredOrders.length === 0 ? (
                          <div className="text-center py-4">
                            <FontAwesomeIcon icon={faSearch} size="3x" className="text-muted mb-3" />
                            <h5>No orders found</h5>
                            <p className="text-muted">
                              {orderSearchTerm ? `No orders match "${orderSearchTerm}"` : 'No orders available'}
                            </p>
                            {orderSearchTerm && (
                              <Button 
                                variant="primary" 
                                onClick={() => setOrderSearchTerm('')}
                                className="mt-2"
                              >
                                Clear Search
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div>
                            {filteredOrders.map((order) => (
                          <Card key={order.id} className="mb-3">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                              <div>
                                <strong>Order #{order.orderNumber || order.id}</strong>
                                <br />
                                <small className="text-muted">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </small>
                              </div>
                              <div className="text-end">
                                {getOrderStatusBadge(order.status)}
                                <br />
                                <strong className="text-primary">₹{order.finalAmount || order.total}</strong>
                              </div>
                            </Card.Header>
                            <Card.Body>
                              <div className="mb-3">
                                <strong>Items:</strong>
                                {order.items && order.items.map((item, index) => {
                                  const productIdentifier = item.productId || item._id || item.id || index;
                                  const returnStatus = getReturnStatus(order.id, productIdentifier);
                                  const cancellationStatus = getCancellationStatus(order.id, productIdentifier);
                                  
                                  return (
                                    <div key={index} className="d-flex justify-content-between align-items-center mt-2">
                                      <div className="d-flex align-items-center">
                                        <img 
                                          src={item.productImage || '/Ayur4life_logo_round_png-01.png'} 
                                          alt={item.productName}
                                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                          className="me-2"
                                        />
                                        <div>
                                          <div className="fw-semibold">{item.productName}</div>
                                          <small className="text-muted">Qty: {item.quantity}</small>
                                          
                                          {/* Return Status */}
                                          {returnStatus && (
                                            <div className="mt-1">
                                              {getReturnStatusBadge(returnStatus.status)}
                                              <small className="text-muted d-block">
                                                {returnStatus.reason}
                                              </small>
                                              {returnStatus.adminAction && (
                                                <small className="text-info d-block">
                                                  Admin: {returnStatus.adminAction} 
                                                  {returnStatus.adminReason && ` - ${returnStatus.adminReason}`}
                                                </small>
                                              )}
                                            </div>
                                          )}
                                          
                                          {/* Cancellation Status */}
                                          {cancellationStatus && (
                                            <div className="mt-1">
                                              {getCancellationStatusBadge(cancellationStatus.status)}
                                              <small className="text-muted d-block">
                                                {cancellationStatus.reason}
                                              </small>
                                              {cancellationStatus.adminAction && (
                                                <small className="text-info d-block">
                                                  Admin: {cancellationStatus.adminAction} 
                                                  {cancellationStatus.adminReason && ` - ${cancellationStatus.adminReason}`}
                                                </small>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="text-end">
                                        <div className="mb-1">₹{(item.unitPrice * item.quantity).toFixed(2)}</div>
                                        
                                        {/* Action Buttons */}
                                        <div className="d-flex flex-column gap-1">
                                          {/* Return Button - Only show if delivered and no return request */}
                                          {order.status === 'delivered' && !returnStatus && !cancellationStatus && (
                                            <Button
                                              variant="outline-warning"
                                              size="sm"
                                              onClick={() => {
                                                console.log('Return button clicked:', {
                                                  orderId: order.id,
                                                  productIdentifier,
                                                  item: item,
                                                  availableFields: {
                                                    productId: item.productId,
                                                    _id: item._id,
                                                    id: item.id
                                                  }
                                                });
                                                navigate(`/return-request/${order.id}/${productIdentifier}`);
                                              }}
                                              className="btn-sm"
                                            >
                                              <FontAwesomeIcon icon={faUndo} className="me-1" />
                                              Return
                                            </Button>
                                          )}
                                          
                                          {/* Cancel Button - Only show if not delivered and no cancellation request */}
                                          {order.status !== 'delivered' && order.status !== 'cancelled' && !cancellationStatus && !returnStatus && (
                                            <Button
                                              variant="outline-danger"
                                              size="sm"
                                              onClick={() => {
                                                console.log('Cancel button clicked:', {
                                                  orderId: order.id,
                                                  productIdentifier,
                                                  item: item
                                                });
                                                navigate(`/cancel-order/${order.id}/${productIdentifier}`);
                                              }}
                                              className="btn-sm"
                                            >
                                              <FontAwesomeIcon icon={faTimes} className="me-1" />
                                              Cancel
                                            </Button>
                                          )}
                                          
                                          {/* Status Display */}
                                          {returnStatus && (
                                            <small className="text-muted">
                                              Return {returnStatus.status}
                                            </small>
                                          )}
                                          {cancellationStatus && (
                                            <small className="text-muted">
                                              Cancellation {cancellationStatus.status}
                                            </small>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <hr />
                              <div className="d-flex justify-content-between mb-1">
                                <span>Subtotal:</span>
                                <span>₹{(order.subtotal || 0).toFixed(2)}</span>
                              </div>
                              {(order.sgstAmount || 0) > 0 && (
                                <div className="d-flex justify-content-between mb-1">
                                  <span>SGST:</span>
                                  <span>₹{(order.sgstAmount || 0).toFixed(2)}</span>
                                </div>
                              )}
                              {(order.cgstAmount || 0) > 0 && (
                                <div className="d-flex justify-content-between mb-1">
                                  <span>CGST:</span>
                                  <span>₹{(order.cgstAmount || 0).toFixed(2)}</span>
                                </div>
                              )}
                              {(order.gstAmount || 0) > 0 && (
                                <div className="d-flex justify-content-between mb-1">
                                  <span>Total GST:</span>
                                  <span>₹{(order.gstAmount || 0).toFixed(2)}</span>
                                </div>
                              )}
                              {(order.deliveryCharge || 0) > 0 && (
                                <div className="d-flex justify-content-between mb-1">
                                  <span>Delivery:</span>
                                  <span>₹{(order.deliveryCharge || 0).toFixed(2)}</span>
                                </div>
                              )}
                              {(order.discountAmount || 0) > 0 && (
                                <div className="d-flex justify-content-between mb-1 text-success">
                                  <span>Discount ({order.couponCode || 'Coupon'}):</span>
                                  <span>-₹{(order.discountAmount || 0).toFixed(2)}</span>
                                </div>
                              )}
                              <div className="d-flex justify-content-between mt-2">
                                <strong>Total:</strong>
                                <strong>₹{(order.finalAmount || order.total || 0).toFixed(2)}</strong>
                              </div>
                              {order.shippingAddress && (
                                <div className="mb-2">
                                  <strong>Shipping Address:</strong>
                                  <p className="mb-1">
                                    {order.shippingAddress.street}<br />
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                  </p>
                                </div>
                              )}
                              <div>
                                <strong>Payment Method:</strong> {order.paymentMethod}
                              </div>
                              
                              {/* Invoice Button */}
                              <div className="mt-3 text-center">
                                <InvoiceButton 
                                  orderId={order.id} 
                                  orderNumber={order.orderNumber || order.id}
                                  variant="outline-success"
                                  size="sm"
                                />
                              </div>
                            </Card.Body>
                          </Card>
                        ))}
                          </div>
                        )}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Tab.Pane>

              {/* Return Requests Tab */}
              <Tab.Pane eventKey="returns">
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <FontAwesomeIcon icon={faUndo} className="me-2" />
                      Return Requests
                    </h5>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={fetchReturnRequests}
                      disabled={returnRequestsLoading}
                    >
                      <FontAwesomeIcon icon={faSearch} className="me-2" />
                      Refresh
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    {returnRequestsLoading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Loading return requests...</p>
                      </div>
                    ) : returnRequests.length === 0 ? (
                      <div className="text-center py-4">
                        <FontAwesomeIcon icon={faUndo} size="3x" className="text-muted mb-3" />
                        <h5>No Return Requests</h5>
                        <p className="text-muted">
                          You haven't submitted any return requests yet.
                        </p>
                        <Button 
                          variant="primary" 
                          onClick={() => window.location.href = '/return-policy'}
                        >
                          View Return Policy
                        </Button>
                      </div>
                    ) : (
                      <div>
                        {returnRequests.map((returnReq) => (
                          <Card key={returnReq.id} className="mb-3">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                              <div>
                                <strong>Return Request #{returnReq.id.slice(-8)}</strong>
                                <br />
                                <small className="text-muted">
                                  {new Date(returnReq.createdAt?.toDate?.() || returnReq.createdAt).toLocaleDateString()}
                                </small>
                              </div>
                              <div className="text-end">
                                {getReturnStatusBadge(returnReq.status)}
                              </div>
                            </Card.Header>
                            <Card.Body>
                              <div className="row">
                                <div className="col-md-4">
                                  <img 
                                    src={returnReq.productImage || '/Ayur4life_logo_round_png-01.png'} 
                                    alt={returnReq.productName}
                                    className="img-fluid rounded"
                                    style={{ maxHeight: '100px' }}
                                  />
                                </div>
                                <div className="col-md-8">
                                  <h6>{returnReq.productName}</h6>
                                  <p className="text-muted mb-1">Order: #{returnReq.orderNumber}</p>
                                  <p className="text-muted mb-1">Quantity: {returnReq.quantity}</p>
                                  <p className="text-muted mb-2">Price: ₹{returnReq.productPrice}</p>
                                  
                                  <div className="mb-2">
                                    <strong>Return Reason:</strong>
                                    <p className="mb-1">{returnReq.returnReason}</p>
                                  </div>
                                  
                                  {returnReq.description && (
                                    <div className="mb-2">
                                      <strong>Description:</strong>
                                      <p className="mb-1">{returnReq.description}</p>
                                    </div>
                                  )}
                                  
                                  <div className="mb-2">
                                    <strong>Condition:</strong>
                                    <span className="ms-2 text-capitalize">{returnReq.condition}</span>
                                  </div>
                                  
                                  {returnReq.adminAction && (
                                    <div className="mb-2">
                                      <strong>Admin Action:</strong>
                                      <p className="mb-1 text-info">
                                        {returnReq.adminAction.charAt(0).toUpperCase() + returnReq.adminAction.slice(1)}
                                        {returnReq.adminReason && ` - ${returnReq.adminReason}`}
                                      </p>
                                    </div>
                                  )}
                                  
                                  {returnReq.updatedAt && (
                                    <small className="text-muted">
                                      Last updated: {new Date(returnReq.updatedAt?.toDate?.() || returnReq.updatedAt).toLocaleDateString()}
                                    </small>
                                  )}
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Tab.Pane>

              {/* Cancellations Tab */}
              <Tab.Pane eventKey="cancellations">
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <FontAwesomeIcon icon={faTimes} className="me-2" />
                      Order Cancellations
                    </h5>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={fetchCancellations}
                      disabled={cancellationsLoading}
                    >
                      <FontAwesomeIcon icon={faSearch} className="me-2" />
                      Refresh
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    {cancellationsLoading ? (
                      <div className="text-center py-4">
                        <Spinner animation="border" role="status" className="text-primary">
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <p className="mt-3">Loading cancellation requests...</p>
                      </div>
                    ) : cancellations.length === 0 ? (
                      <div className="text-center py-4">
                        <h5>No Cancellation Requests</h5>
                        <p className="text-muted">
                          You haven't submitted any cancellation requests yet.
                        </p>
                        <p className="text-muted">
                          You can only cancel orders before they are delivered.
                        </p>
                      </div>
                    ) : (
                      <div>
                        {cancellations.map((cancellation) => (
                          <Card key={cancellation.id} className="mb-3">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                              <div>
                                <strong>Cancellation Request #{cancellation.id.slice(-8)}</strong>
                                <br />
                                <small className="text-muted">
                                  {new Date(cancellation.createdAt?.toDate?.() || cancellation.createdAt).toLocaleDateString()}
                                </small>
                              </div>
                              <div className="text-end">
                                {getCancellationStatusBadge(cancellation.status)}
                              </div>
                            </Card.Header>
                            <Card.Body>
                              <div className="row">
                                <div className="col-md-4">
                                  <img 
                                    src={cancellation.productImage || '/Ayur4life_logo_round_png-01.png'} 
                                    alt={cancellation.productName}
                                    className="img-fluid rounded"
                                    style={{ maxHeight: '100px' }}
                                  />
                                </div>
                                <div className="col-md-8">
                                  <h6>{cancellation.productName}</h6>
                                  <p className="text-muted mb-1">Order: #{cancellation.orderNumber}</p>
                                  <p className="text-muted mb-1">Quantity: {cancellation.quantity}</p>
                                  <p className="text-muted mb-2">Price: ₹{cancellation.productPrice}</p>
                                  
                                  <div className="mb-2">
                                    <strong>Cancellation Reason:</strong>
                                    <p className="mb-1">{cancellation.cancelReason}</p>
                                  </div>
                                  
                                  {cancellation.description && (
                                    <div className="mb-2">
                                      <strong>Description:</strong>
                                      <p className="mb-1">{cancellation.description}</p>
                                    </div>
                                  )}
                                  
                                  <div className="mb-2">
                                    <strong>Order Status:</strong>
                                    <span className="ms-2 text-capitalize">{cancellation.orderStatus}</span>
                                  </div>
                                  
                                  <div className="mb-2">
                                    <strong>Delivery Status:</strong>
                                    <span className="ms-2 text-capitalize">{cancellation.deliveryStatus}</span>
                                  </div>
                                  
                                  {cancellation.adminAction && (
                                    <div className="mb-2">
                                      <strong>Admin Action:</strong>
                                      <p className="mb-1 text-info">
                                        {cancellation.adminAction.charAt(0).toUpperCase() + cancellation.adminAction.slice(1)}
                                        {cancellation.adminReason && ` - ${cancellation.adminReason}`}
                                      </p>
                                    </div>
                                  )}
                                  
                                  {cancellation.updatedAt && (
                                    <small className="text-muted">
                                      Last updated: {new Date(cancellation.updatedAt?.toDate?.() || cancellation.updatedAt).toLocaleDateString()}
                                    </small>
                                  )}
                                </div>
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
                      <Button variant="primary" size="sm" onClick={() => setPasswordEditing(true)}>
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
                      <>
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
                      </>
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