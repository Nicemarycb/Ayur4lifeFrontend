import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faCrown } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../layouts/AdminLayout';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const AdminProfile = () => {
  const { user } = useAdminAuth();

  return (
    <AdminLayout>
      <div className="mb-4">
        <h1 className="mb-2">Admin Profile</h1>
        <p className="text-muted">Manage your admin account</p>
      </div>

      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Profile Information
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">First Name</label>
                    <p className="text-muted">{user?.firstName || 'N/A'}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Last Name</label>
                    <p className="text-muted">{user?.lastName || 'N/A'}</p>
                  </div>
                </Col>
              </Row>
              
              <div className="mb-3">
                <label className="form-label fw-bold">
                  <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                  Email Address
                </label>
                <p className="text-muted">{user?.email || 'N/A'}</p>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">
                  <FontAwesomeIcon icon={faCrown} className="me-2" />
                  Role
                </label>
                <div>
                  <Badge bg="success" className="fs-6">
                    {user?.role || 'user'}
                  </Badge>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <p className="text-muted">
                You are logged in as an administrator with full access to manage the store.
              </p>
              <div className="d-grid gap-2">
                <a href="/admin" className="btn btn-primary">
                  Go to Dashboard
                </a>
                <a href="/admin/products" className="btn btn-outline-primary">
                  Manage Products
                </a>
                <a href="/admin/orders" className="btn btn-outline-primary">
                  View Orders
                </a>
                <a href="/admin/users" className="btn btn-outline-primary">
                  Manage Users
                </a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
};

export default AdminProfile;
