import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge, Form, Modal, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faEye, faFilter, faSearch, faUser, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userOrders, setUserOrders] = useState([]);

  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [filters]);
const fetchUsers = async () => {
 try {
 setLoading(true);
 setError(null);
 
 const params = new URLSearchParams();
 if (filters.search) params.append('search', filters.search);
 if (filters.role) params.append('role', filters.role);
 if (filters.status) params.append('status', filters.status);

 const response = await axios.get(`/api/admin/users?${params.toString()}`);
 
 // Corrected line: Access the 'users' property of the data object
 setUsers(response.data.users);

 } catch (err) {
 setError(err.response?.data?.message || 'Failed to fetch users');
 } finally {
 setLoading(false);
 }
};

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewUser = async (userId) => {
    try {
      const [userResponse, ordersResponse] = await Promise.all([
        axios.get(`/api/admin/users/${userId}`),
        axios.get(`/api/admin/users/${userId}/orders`)
      ]);
      
      setSelectedUser(userResponse.data);
      setUserOrders(ordersResponse.data);
      setShowUserModal(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user details');
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      role: '',
      status: ''
    });
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      'user': { variant: 'primary', text: 'User' },
      'admin': { variant: 'danger', text: 'Admin' }
    };
    
    const config = roleConfig[role] || { variant: 'secondary', text: role };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'active': { variant: 'success', text: 'Active' },
      'inactive': { variant: 'warning', text: 'Inactive' },
      'suspended': { variant: 'danger', text: 'Suspended' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status" className="text-primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading users...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="mb-4">
        <h1 className="mb-2">Manage Users</h1>
        <p className="text-muted">
          Total Users: {users.length}
        </p>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <FontAwesomeIcon icon={faFilter} className="me-2" />
            Filters
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Name, email, phone..."
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  name="role"
                  value={filters.role}
                  onChange={handleFilterChange}
                >
                  <option value="">All Roles</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button variant="outline-secondary" onClick={clearFilters} className="w-100">
                Clear Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Users Table */}
      <Card>
        <Card.Body>
          {users.length === 0 ? (
            <div className="text-center py-5">
              <FontAwesomeIcon icon={faUsers} size="4x" className="text-muted mb-3" />
              <h4>No users found</h4>
              <p className="text-muted">
                {Object.values(filters).some(f => f) 
                  ? 'Try adjusting your filters to see more users.'
                  : 'Users will appear here once they register.'
                }
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Contact</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Orders</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div>
                          <strong>{user.firstName} {user.lastName}</strong>
                          <br />
                          <small className="text-muted">
                            {user.gender && `${user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}`}
                            {user.dateOfBirth && ` • ${formatDate(user.dateOfBirth)}`}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>{user.email}</div>
                          <small className="text-muted">{user.phone}</small>
                        </div>
                      </td>
                      <td>
                        {getRoleBadge(user.role)}
                      </td>
                      <td>
                        {getStatusBadge(user.status)}
                      </td>
                      <td>
                        {formatDate(user.createdAt)}
                        <br />
                        <small className="text-muted">
                          {new Date(user.createdAt).toLocaleTimeString()}
                        </small>
                      </td>
                      <td>
                        <div className="text-center">
                          <strong className="text-primary">{user.orderCount || 0}</strong>
                          <br />
                          <small className="text-muted">orders</small>
                        </div>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleViewUser(user.id)}
                        >
                          <FontAwesomeIcon icon={faEye} className="me-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* User Detail Modal */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            User Details - {selectedUser?.firstName} {selectedUser?.lastName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              {/* User Information */}
              <Row className="mb-4">
                <Col md={6}>
                  <h6>Personal Information</h6>
                  <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Phone:</strong> {selectedUser.phone}</p>
                  <p><strong>Gender:</strong> {selectedUser.gender || 'Not specified'}</p>
                  <p><strong>Date of Birth:</strong> {selectedUser.dateOfBirth ? formatDate(selectedUser.dateOfBirth) : 'Not specified'}</p>
                </Col>
                <Col md={6}>
                  <h6>Account Information</h6>
                  <p><strong>Role:</strong> {getRoleBadge(selectedUser.role)}</p>
                  <p><strong>Status:</strong> {getStatusBadge(selectedUser.status)}</p>
                  <p><strong>Joined:</strong> {formatDate(selectedUser.createdAt)}</p>
                  <p><strong>Last Updated:</strong> {formatDate(selectedUser.updatedAt)}</p>
                </Col>
              </Row>

              {/* Address Information */}
              {selectedUser.address && (
                <div className="mb-4">
                  <h6>Address Information</h6>
                  <p className="mb-1">{selectedUser.address.street}</p>
                  <p className="mb-1">
                    {selectedUser.address.city}, {selectedUser.address.state} {selectedUser.address.zipCode}
                  </p>
                </div>
              )}

              {/* User Statistics */}
              <div className="mb-4">
                <h6>Statistics</h6>
                <Row>
                  <Col md={3}>
                    <div className="text-center">
                      <h4 className="text-primary">{userOrders.length}</h4>
                      <small className="text-muted">Total Orders</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <h4 className="text-success">
                        ₹{userOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                      </h4>
                      <small className="text-muted">Total Spent</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <h4 className="text-info">
                        {userOrders.filter(order => order.status === 'delivered').length}
                      </h4>
                      <small className="text-muted">Delivered</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <h4 className="text-warning">
                        {userOrders.filter(order => order.status === 'pending').length}
                      </h4>
                      <small className="text-muted">Pending</small>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Order History */}
              <div>
                <h6>Order History</h6>
                {userOrders.length === 0 ? (
                  <p className="text-muted">No orders found for this user.</p>
                ) : (
                  <div className="table-responsive">
                    <Table striped bordered size="sm">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Items</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userOrders.map((order) => (
                          <tr key={order.id}>
                            <td>
                              <strong>#{order.orderId}</strong>
                            </td>
                            <td>{formatDate(order.createdAt)}</td>
                            <td>
                              <strong className="text-primary">₹{order.total}</strong>
                            </td>
                            <td>
                              {getStatusBadge(order.status)}
                            </td>
                            <td>
                              <small>
                                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                              </small>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminUsers;
