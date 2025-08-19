import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faShoppingBag, faBoxes, faRupeeSign, faChartLine, faPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsResponse, ordersResponse] = await Promise.all([
        axios.get('/api/admin/dashboard'),
        axios.get('/api/admin/orders?limit=5')
      ]);
      
      setStats(statsResponse.data);
      setRecentOrders(ordersResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
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
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status" className="text-primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchDashboardData}>
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="mb-4">
        <h1 className="mb-2">Admin Dashboard</h1>
        <p className="text-muted">Welcome to Ayur4Life Admin Panel</p>
      </div>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <div className="mb-3">
                <FontAwesomeIcon icon={faUsers} size="2x" className="text-primary" />
              </div>
              <h3 className="text-primary">{stats?.totalUsers || 0}</h3>
              <p className="text-muted mb-0">Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <div className="mb-3">
                <FontAwesomeIcon icon={faShoppingBag} size="2x" className="text-success" />
              </div>
              <h3 className="text-success">{stats?.totalOrders || 0}</h3>
              <p className="text-muted mb-0">Total Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <div className="mb-3">
                <FontAwesomeIcon icon={faBoxes} size="2x" className="text-info" />
              </div>
              <h3 className="text-info">{stats?.totalProducts || 0}</h3>
              <p className="text-muted mb-0">Total Products</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <div className="mb-3">
                <FontAwesomeIcon icon={faRupeeSign} size="2x" className="text-warning" />
              </div>
              <h3 className="text-warning">₹{stats?.totalRevenue?.toFixed(2) || '0.00'}</h3>
              <p className="text-muted mb-0">Total Revenue</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Quick Actions
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/admin/products" className="btn btn-primary">
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Add New Product
                </Link>
                <Link to="/admin/orders" className="btn btn-outline-primary">
                  <FontAwesomeIcon icon={faEye} className="me-2" />
                  View All Orders
                </Link>
                <Link to="/admin/users" className="btn btn-outline-info">
                  <FontAwesomeIcon icon={faUsers} className="me-2" />
                  Manage Users
                </Link>
                <Button variant="outline-success" onClick={fetchDashboardData}>
                  <FontAwesomeIcon icon={faChartLine} className="me-2" />
                  Refresh Data
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders */}
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FontAwesomeIcon icon={faShoppingBag} className="me-2" />
                Recent Orders
              </h5>
              <Link to="/admin/orders" className="btn btn-outline-primary btn-sm">
                View All
              </Link>
            </Card.Header>
            <Card.Body>
              {recentOrders.length === 0 ? (
                <div className="text-center py-4">
                  <FontAwesomeIcon icon={faShoppingBag} size="3x" className="text-muted mb-3" />
                  <h5>No orders yet</h5>
                  <p className="text-muted">Orders will appear here once customers start placing them.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td>
                            <strong>#{order.orderId}</strong>
                          </td>
                          <td>
                            {order.user?.firstName} {order.user?.lastName}
                            <br />
                            <small className="text-muted">{order.user?.email}</small>
                          </td>
                          <td>
                            <strong className="text-primary">₹{order.total}</strong>
                          </td>
                          <td>
                            {getStatusBadge(order.status)}
                          </td>
                          <td>
                            {new Date(order.createdAt).toLocaleDateString()}
                            <br />
                            <small className="text-muted">
                              {new Date(order.createdAt).toLocaleTimeString()}
                            </small>
                          </td>
                          <td>
                            <Link 
                              to={`/admin/orders/${order.id}`} 
                              className="btn btn-outline-primary btn-sm"
                            >
                              <FontAwesomeIcon icon={faEye} className="me-1" />
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Additional Stats */}
      {stats && (
        <Row className="mt-4">
          <Col md={6}>
            <Card>
              <Card.Header>
                <h6 className="mb-0">Order Status Breakdown</h6>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Pending:</span>
                  <Badge bg="warning">{stats.orderStatusBreakdown?.pending || 0}</Badge>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Confirmed:</span>
                  <Badge bg="info">{stats.orderStatusBreakdown?.confirmed || 0}</Badge>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipped:</span>
                  <Badge bg="primary">{stats.orderStatusBreakdown?.shipped || 0}</Badge>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Delivered:</span>
                  <Badge bg="success">{stats.orderStatusBreakdown?.delivered || 0}</Badge>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Cancelled:</span>
                  <Badge bg="danger">{stats.orderStatusBreakdown?.cancelled || 0}</Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Header>
                <h6 className="mb-0">Revenue Overview</h6>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Today:</span>
                  <strong className="text-primary">₹{stats.todayRevenue?.toFixed(2) || '0.00'}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>This Week:</span>
                  <strong className="text-primary">₹{stats.weekRevenue?.toFixed(2) || '0.00'}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>This Month:</span>
                  <strong className="text-primary">₹{stats.monthRevenue?.toFixed(2) || '0.00'}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Average Order Value:</span>
                  <strong className="text-primary">₹{stats.averageOrderValue?.toFixed(2) || '0.00'}</strong>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default AdminDashboard;
