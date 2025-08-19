import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faShoppingBag, faBoxes, faRupeeSign, faPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../layouts/AdminLayout';

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('/api/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setStats(response.data);
    } catch (err) {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center">
          <Spinner animation="border" role="status" className="text-primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading admin panel...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchStats}>
            Try Again
          </Button>
        </Alert>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-4">
        <h1 className="mb-2">Ayur4Life Admin Panel</h1>
        <p className="text-muted">Welcome to the admin dashboard</p>
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
                <Button variant="primary" as={Link} to="/admin/products">
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Add New Product
                </Button>
                <Button variant="outline-primary" as={Link} to="/admin/orders">
                  <FontAwesomeIcon icon={faEye} className="me-2" />
                  View All Orders
                </Button>
                <Button variant="outline-info" as={Link} to="/admin/users">
                  <FontAwesomeIcon icon={faUsers} className="me-2" />
                  Manage Users
                </Button>
                <Button variant="outline-success" onClick={fetchStats}>
                  <FontAwesomeIcon icon={faEye} className="me-2" />
                  Refresh Data
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Revenue Overview */}
      {stats && (
        <Row>
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
          <Col md={6}>
            <Card>
              <Card.Header>
                <h6 className="mb-0">Order Status</h6>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Pending:</span>
                  <strong className="text-warning">{stats.orderStatusBreakdown?.pending || 0}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Confirmed:</span>
                  <strong className="text-info">{stats.orderStatusBreakdown?.confirmed || 0}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipped:</span>
                  <strong className="text-primary">{stats.orderStatusBreakdown?.shipped || 0}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Delivered:</span>
                  <strong className="text-success">{stats.orderStatusBreakdown?.delivered || 0}</strong>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </AdminLayout>
  );
};

export default Admin;
