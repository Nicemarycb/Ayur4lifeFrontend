// Admin.js - Enhanced Admin Dashboard with Chart.js Integration
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faShoppingBag, 
  faBoxes, 
  faRupeeSign, 
  // faPlus, 
  // faEye,
  faChartLine,
  faRefresh,
  faArrowUp,
  faArrowDown
} from '@fortawesome/free-solid-svg-icons';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../layouts/AdminLayout';
import './Admin.css';
import logo1 from '../assets/Ayur4life_logo_round_png-01.png';

// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

  // Mock growth percentages for demo
  const growthData = {
    usersGrowth: 12.5,
    ordersGrowth: 8.3,
    revenueGrowth: 15.7,
    productsGrowth: 5.2
  };

  // Chart data for revenue trend (mock data for design enhancement)
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: 'Monthly Revenue (₹)',
        data: [12000, 19000, 15000, 22000, 18000, 25000, 21000, 28000, 30000],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#1d4ed8',
        pointHoverBorderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: 'Inter',
            weight: '600',
          },
          color: '#1a1d21',
        },
      },
      title: {
        display: true,
        text: 'Revenue Trend Over Months',
        font: {
          size: 18,
          family: 'Inter',
          weight: '700',
        },
        color: '#1a1d21',
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: '#1a1d21',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3b82f6',
        borderWidth: 1,
        callbacks: {
          label: (context) => `₹${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: 'Inter',
          },
          color: '#6c757d',
        },
      },
      y: {
        grid: {
          color: '#e5e7eb',
        },
        ticks: {
          font: {
            size: 12,
            family: 'Inter',
          },
          color: '#6c757d',
          callback: (value) => `₹${value.toLocaleString()}`,
        },
      },
    },
    elements: {
      point: {
        radius: 5,
        hoverRadius: 8,
      },
    },
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="dashboard-loading">
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
        <Alert variant="danger" className="dashboard-alert">
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
      <div className="dashboard-header">
        <div className="logo-container">
          <img src={logo1} alt="Ayur4Life Logo" />
        </div>
        <div className="dashboard-title">
          <h1 className='text-success'>Dashboard Overview Of Ayur4life Herbals</h1>
          <p className="text-muted text-success">Welcome back! Here's what's happening with your store today.Explore More</p>
        </div>
        <Button onClick={fetchStats} className="refresh-btn">
          <FontAwesomeIcon icon={faRefresh} className="me-2" />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row className="stats-row">
        <Col xl={3} lg={6} className="mb-4">
          <Card className="stat-card users-card">
            <Card.Body>
              <div className="stat-icon">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <div className="stat-content">
                <h3>{stats?.totalUsers || 0}</h3>
                <p>Total Users</p>
                <div className={`growth-badge ${growthData.usersGrowth >= 0 ? 'positive' : 'negative'}`}>
                  <FontAwesomeIcon icon={growthData.usersGrowth >= 0 ? faArrowUp : faArrowDown} className="me-1" />
                  {Math.abs(growthData.usersGrowth)}%
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6} className="mb-4">
          <Card className="stat-card orders-card">
            <Card.Body>
              <div className="stat-icon">
                <FontAwesomeIcon icon={faShoppingBag} />
              </div>
              <div className="stat-content">
                <h3>{stats?.totalOrders || 0}</h3>
                <p>Total Orders</p>
                <div className={`growth-badge ${growthData.ordersGrowth >= 0 ? 'positive' : 'negative'}`}>
                  <FontAwesomeIcon icon={growthData.ordersGrowth >= 0 ? faArrowUp : faArrowDown} className="me-1" />
                  {Math.abs(growthData.ordersGrowth)}%
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6} className="mb-4">
          <Card className="stat-card products-card">
            <Card.Body>
              <div className="stat-icon">
                <FontAwesomeIcon icon={faBoxes} />
              </div>
              <div className="stat-content">
                <h3>{stats?.totalProducts || 0}</h3>
                <p>Total Products</p>
                <div className={`growth-badge ${growthData.productsGrowth >= 0 ? 'positive' : 'negative'}`}>
                  <FontAwesomeIcon icon={growthData.productsGrowth >= 0 ? faArrowUp : faArrowDown} className="me-1" />
                  {Math.abs(growthData.productsGrowth)}%
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6} className="mb-4">
          <Card className="stat-card revenue-card">
            <Card.Body>
              <div className="stat-icon">
                <FontAwesomeIcon icon={faRupeeSign} />
              </div>
              <div className="stat-content">
                <h3>₹{stats?.totalRevenue?.toFixed(2) || '0.00'}</h3>
                <p>Total Revenue</p>
                <div className={`growth-badge ${growthData.revenueGrowth >= 0 ? 'positive' : 'negative'}`}>
                  <FontAwesomeIcon icon={growthData.revenueGrowth >= 0 ? faArrowUp : faArrowDown} className="me-1" />
                  {Math.abs(growthData.revenueGrowth)}%
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content Area */}
      <Row className="main-content-row">
        {/* Revenue Overview with Chart */}
        <Col lg={8} className="mb-4">
          <Card className="dashboard-card">
            <Card.Header className="dashboard-card-header">
              <FontAwesomeIcon icon={faChartLine} className="me-2" />
              Revenue Analytics
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} className="mb-3">
                  <div className="metric-item">
                    <label>Today's Revenue</label>
                    <h4 className="text-primary">₹{stats?.todayRevenue?.toFixed(2) || '0.00'}</h4>
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="metric-item">
                    <label>This Week</label>
                    <h4 className="text-success">₹{stats?.weekRevenue?.toFixed(2) || '0.00'}</h4>
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="metric-item">
                    <label>This Month</label>
                    <h4 className="text-info">₹{stats?.monthRevenue?.toFixed(2) || '0.00'}</h4>
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="metric-item">
                    <label>Avg Order Value</label>
                    <h4 className="text-warning">₹{stats?.averageOrderValue?.toFixed(2) || '0.00'}</h4>
                  </div>
                </Col>
              </Row>
              <div className="chart-container" style={{ height: '300px' }}>
                <Line data={chartData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Order Status */}
        <Col lg={4} className="mb-4">
          <Card className="dashboard-card">
            <Card.Header className="dashboard-card-header">
              <FontAwesomeIcon icon={faShoppingBag} className="me-2" />
              Order Status
            </Card.Header>
            <Card.Body>
              <div className="status-list">
                <div className="status-item pending text-warning">
                  <span className='text-warning'>Pending</span>
                  <strong>{stats?.orderStatusBreakdown?.pending || 0}</strong>
                </div>
                <div className="status-item confirmed text-info">
                  <span className='text-info'>Confirmed</span>
                  <strong>{stats?.orderStatusBreakdown?.confirmed || 0}</strong>
                </div>
                <div className="status-item shipped text-primary">
                  <span className='text-primary'>Shipped</span>
                  <strong>{stats?.orderStatusBreakdown?.shipped || 0}</strong>
                </div>
                <div className="status-item delivered text-success">
                  <span className='text-success'>Delivered</span>
                  <strong>{stats?.orderStatusBreakdown?.delivered || 0}</strong>
                </div>
                 <div className="status-item cancelled text-danger">
                  <span className='text-danger'>Cancelled</span>
                  <strong>{stats?.orderStatusBreakdown?.cancelled || 0}</strong>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="dashboard-card">
        {/* <Card.Header className="dashboard-card-header">
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Quick Actions
        </Card.Header> */}
        {/* <Card.Body>
          <Row className="quick-actions">
            <Col md={3} sm={6} className="mb-3">
              <Button variant="outline-primary" as={Link} to="/admin/products" className="action-btn w-100">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Product
              </Button>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Button variant="outline-success" as={Link} to="/admin/orders" className="action-btn w-100">
                <FontAwesomeIcon icon={faEye} className="me-2" />
                View Orders
              </Button>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Button variant="outline-info" as={Link} to="/admin/users" className="action-btn w-100">
                <FontAwesomeIcon icon={faUsers} className="me-2" />
                Manage Users
              </Button>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Button variant="outline-warning" onClick={fetchStats} className="action-btn w-100">
                <FontAwesomeIcon icon={faRefresh} className="me-2" />
                Refresh Data
              </Button>
            </Col>
          </Row>
        </Card.Body> */}
      </Card>
    </AdminLayout>
  );
};

export default Admin;