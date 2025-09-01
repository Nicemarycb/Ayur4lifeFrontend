// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Button, Alert, Spinner, Badge, Form, Modal, Table } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEdit, faFilter, faSearch, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
// import axios from 'axios';

// const AdminOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showOrderModal, setShowOrderModal] = useState(false);
//   const [updatingStatus, setUpdatingStatus] = useState(false);

//   const [filters, setFilters] = useState({
//     status: '',
//     search: '',
//     dateFrom: '',
//     dateTo: ''
//   });

//   useEffect(() => {
//     fetchOrders();
//   }, [filters]);

//   const getAuthConfig = () => {
//     const token = localStorage.getItem('adminToken');
//     return { headers: { Authorization: `Bearer ${token}` } };
//   };

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const params = new URLSearchParams();
//       if (filters.status) params.append('status', filters.status);
//       if (filters.search) params.append('search', filters.search);
//       if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
//       if (filters.dateTo) params.append('dateTo', filters.dateTo);
      
//       const response = await axios.get(`/api/admin/orders?${params.toString()}`, getAuthConfig());
//       setOrders(response.data);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to fetch orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleStatusUpdate = async (orderId, newStatus) => {
//     try {
//       setUpdatingStatus(true);
//       await axios.patch(`/api/admin/orders/${orderId}/status`, { status: newStatus }, getAuthConfig());
//       fetchOrders();
//       if (selectedOrder && selectedOrder.id === orderId) {
//         setSelectedOrder(prev => ({ ...prev, status: newStatus }));
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update order status');
//     } finally {
//       setUpdatingStatus(false);
//     }
//   };

//   const handleViewOrder = async (orderId) => {
//     try {
//       const response = await axios.get(`/api/admin/orders/${orderId}`, getAuthConfig());
//       setSelectedOrder(response.data);
//       setShowOrderModal(true);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to fetch order details');
//     }
//   };

//   const getStatusBadge = (status) => {
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

//   const getStatusOptions = (currentStatus) => {
//     const allStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
//     return allStatuses.filter(status => status !== currentStatus);
//   };

//   const clearFilters = () => {
//     setFilters({
//       status: '',
//       search: '',
//       dateFrom: '',
//       dateTo: ''
//     });
//   };

//   if (loading) {
//     return (
//       <Container className="py-5">
//         <div className="text-center">
//           <Spinner animation="border" role="status" className="text-primary">
//             <span className="visually-hidden">Loading...</span>
//           </Spinner>
//           <p className="mt-3">Loading orders...</p>
//         </div>
//       </Container>
//     );
//   }

//   return (
//     <Container className="py-5">
//       <div className="mb-4">
//         <h1 className="mb-2">Manage Orders</h1>
//         <p className="text-muted">
//           Total Orders: {orders.length}
//         </p>
//       </div>

//       {error && (
//         <Alert variant="danger" className="mb-4" dismissible onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}

//       {/* Filters */}
//       <Card className="mb-4">
//         <Card.Header>
//           <h5 className="mb-0">
//             <FontAwesomeIcon icon={faFilter} className="me-2" />
//             Filters
//           </h5>
//         </Card.Header>
//         <Card.Body>
//           <Row>
//             <Col md={3}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Status</Form.Label>
//                 <Form.Select
//                   name="status"
//                   value={filters.status}
//                   onChange={handleFilterChange}
//                 >
//                   <option value="">All Statuses</option>
//                   <option value="pending">Pending</option>
//                   <option value="confirmed">Confirmed</option>
//                   <option value="shipped">Shipped</option>
//                   <option value="delivered">Delivered</option>
//                   <option value="cancelled">Cancelled</option>
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col md={3}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Search</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="search"
//                   value={filters.search}
//                   onChange={handleFilterChange}
//                   placeholder="Order ID, customer name, email..."
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={2}>
//               <Form.Group className="mb-3">
//                 <Form.Label>From Date</Form.Label>
//                 <Form.Control
//                   type="date"
//                   name="dateFrom"
//                   value={filters.dateFrom}
//                   onChange={handleFilterChange}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={2}>
//               <Form.Group className="mb-3">
//                 <Form.Label>To Date</Form.Label>
//                 <Form.Control
//                   type="date"
//                   name="dateTo"
//                   value={filters.dateTo}
//                   onChange={handleFilterChange}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={2} className="d-flex align-items-end">
//               <Button variant="outline-secondary" onClick={clearFilters} className="w-100">
//                 Clear Filters
//               </Button>
//             </Col>
//           </Row>
//         </Card.Body>
//       </Card>

//       {/* Orders Table */}
//       <Card>
//         <Card.Body>
//           {orders.length === 0 ? (
//             <div className="text-center py-5">
//               <FontAwesomeIcon icon={faShoppingBag} size="4x" className="text-muted mb-3" />
//               <h4>No orders found</h4>
//               <p className="text-muted">
//                 {Object.values(filters).some(f => f) 
//                   ? 'Try adjusting your filters to see more orders.'
//                   : 'Orders will appear here once customers start placing them.'
//                 }
//               </p>
//             </div>
//           ) : (
//             <div className="table-responsive">
//               <Table hover>
//                 <thead>
//                   <tr>
//                     <th>Order ID</th>
//                     <th>Customer</th>
//                     <th>Items</th>
//                     <th>Amount</th>
//                     <th>Status</th>
//                     <th>Date</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orders.map((order) => (
//                     <tr key={order.id}>
//                       <td>
//                         <strong>{order.orderId || `#${order.id}`}</strong>
//                       </td>
//                       <td>
//                         <div>
//                           <strong>{order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}` : 'Unknown Customer'}</strong>
//                           <br />
//                           <small className="text-muted">{order.user?.email || 'No email'}</small>
//                           <br />
//                           <small className="text-muted">{order.user?.phone || 'No phone'}</small>
//                         </div>
//                       </td>
//                       <td>
//                         <div>
//                           {(order.itemCount || (order.items ? order.items.reduce((sum, i) => sum + (i.quantity || 0), 0) : 0))} item{(order.itemCount || 0) !== 1 ? 's' : ''}
//                           <br />
//                           <small className="text-muted">
//                             {order.items && order.items.slice(0, 2).map(item => item.productName).join(', ')}
//                             {order.items && order.items.length > 2 && '...'}
//                           </small>
//                         </div>
//                       </td>
//                       <td>
//                         <strong className="text-primary">₹{(order.total || 0).toFixed(2)}</strong>
//                         <br />
//                         <small className="text-muted">
//                           Subtotal: ₹{(order.subtotal || 0).toFixed(2)}
//                         </small>
//                       </td>
//                       <td>
//                         <div className="mb-2">
//                           {getStatusBadge(order.status)}
//                         </div>
//                         <Form.Select
//                           size="sm"
//                           value=""
//                           onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
//                           disabled={updatingStatus}
//                         >
//                           <option value="">Change Status</option>
//                           {getStatusOptions(order.status).map(status => (
//                             <option key={status} value={status}>
//                               {status.charAt(0).toUpperCase() + status.slice(1)}
//                             </option>
//                           ))}
//                         </Form.Select>
//                       </td>
//                       <td>
//                         {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Invalid Date'}
//                         <br />
//                         <small className="text-muted">
//                           {order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : ''}
//                         </small>
//                       </td>
//                       <td>
//                         <Button
//                           variant="outline-primary"
//                           size="sm"
//                           onClick={() => handleViewOrder(order.id)}
//                         >
//                           <FontAwesomeIcon icon={faEye} className="me-1" />
//                           View
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </div>
//           )}
//         </Card.Body>
//       </Card>

//       {/* Order Detail Modal */}
//       <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>
//             Order Details - {selectedOrder?.orderId || 'Unknown'}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedOrder && (
//             <div>
//               {/* Order Summary */}
//               <Row className="mb-4">
//                 <Col md={6}>
//                   <h6>Order Information</h6>
//                   <p><strong>Order ID:</strong> {selectedOrder.orderId || 'Unknown'}</p>
//                   <p><strong>Date:</strong> {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'Invalid Date'}</p>
//                   <p><strong>Status:</strong> {getStatusBadge(selectedOrder.status)}</p>
//                   <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod || 'Unknown'}</p>
//                 </Col>
//                 <Col md={6}>
//                   <h6>Customer Information</h6>
//                   <p><strong>Name:</strong> {selectedOrder.user ? `${selectedOrder.user.firstName || ''} ${selectedOrder.user.lastName || ''}` : 'Unknown'}</p>
//                   <p><strong>Email:</strong> {selectedOrder.user?.email || 'No email'}</p>
//                   <p><strong>Phone:</strong> {selectedOrder.user?.phone || 'No phone'}</p>
//                 </Col>
//               </Row>

//               {/* Shipping Address */}
//               {selectedOrder.shippingAddress && (
//                 <div className="mb-4">
//                   <h6>Shipping Address</h6>
//                   <p className="mb-1">{selectedOrder.shippingAddress.street || 'No street address'}</p>
//                   <p className="mb-1">
//                     {selectedOrder.shippingAddress.city || ''}, {selectedOrder.shippingAddress.state || ''} {selectedOrder.shippingAddress.zipCode || ''}
//                   </p>
//                 </div>
//               )}

//               {/* Order Items */}
//               <div className="mb-4">
//                 <h6>Order Items</h6>
//                 <Table striped bordered>
//                   <thead>
//                     <tr>
//                       <th>Product</th>
//                       <th>Quantity</th>
//                       <th>Price</th>
//                       <th>Total</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {selectedOrder.items && selectedOrder.items.map((item, index) => (
//                       <tr key={index}>
//                         <td>{item.productName || 'Unknown Product'}</td>
//                         <td>{item.quantity || 0}</td>
//                         <td>₹{(item.unitPrice || 0).toFixed(2)}</td>
//                         <td>₹{((item.unitPrice || 0) * (item.quantity || 0)).toFixed(2)}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </div>

//               {/* Order Summary */}
//               <div className="mb-4">
//                 <h6>Order Summary</h6>
//                 <div className="d-flex justify-content-between">
//                   <span>Subtotal:</span>
//                   <span>₹{(selectedOrder.subtotal || 0).toFixed(2)}</span>
//                 </div>
//                 {(selectedOrder.gstAmount || 0) > 0 && (
//                   <div className="d-flex justify-content-between">
//                     <span>GST:</span>
//                     <span>₹{(selectedOrder.gstAmount || 0).toFixed(2)}</span>
//                   </div>
//                 )}
//                 <hr />
//                 <div className="d-flex justify-content-between">
//                   <strong>Total:</strong>
//                   <strong className="text-primary">₹{(selectedOrder.total || selectedOrder.finalAmount || 0).toFixed(2)}</strong>
//                 </div>
//               </div>

//               {/* Status Update */}
//               <div>
//                 <h6>Update Status</h6>
//                 <div className="d-flex gap-2">
//                   <Form.Select
//                     value=""
//                     onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
//                     disabled={updatingStatus}
//                     style={{ maxWidth: '200px' }}
//                   >
//                     <option value="">Select New Status</option>
//                     {getStatusOptions(selectedOrder.status).map(status => (
//                       <option key={status} value={status}>
//                         {status.charAt(0).toUpperCase() + status.slice(1)}
//                       </option>
//                     ))}
//                   </Form.Select>
//                   {updatingStatus && (
//                     <Spinner animation="border" size="sm" />
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default AdminOrders;
// Orders.js - Fixed version with search filter fix
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge, Form, Modal, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faFilter, faSearch, faShoppingBag, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [filters, setFilters] = useState({
    status: '',
    search: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, filters]);

  const getAuthConfig = () => {
    const token = localStorage.getItem('adminToken');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/admin/orders', getAuthConfig());
      setOrders(response.data);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let result = [...orders];
    
    // Apply status filter
    if (filters.status) {
      result = result.filter(order => order.status === filters.status);
    }
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(order => 
        (order.orderId && order.orderId.toLowerCase().includes(searchTerm)) ||
        (order.user && (
          (order.user.firstName && order.user.firstName.toLowerCase().includes(searchTerm)) ||
          (order.user.lastName && order.user.lastName.toLowerCase().includes(searchTerm)) ||
          (order.user.email && order.user.email.toLowerCase().includes(searchTerm))
        ))
      );
    }
    
    // Apply date filters
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(order => new Date(order.createdAt) >= fromDate);
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter(order => new Date(order.createdAt) <= toDate);
    }
    
    setFilteredOrders(result);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      await axios.patch(`/api/admin/orders/${orderId}/status`, { status: newStatus }, getAuthConfig());
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      const response = await axios.get(`/api/admin/orders/${orderId}`, getAuthConfig());
      setSelectedOrder(response.data);
      setShowOrderModal(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order details');
    }
  };
  const handleDeleteOrder = async (orderId) => {
  if (!window.confirm("Are you sure you want to delete this order?")) return;

  try {
    await axios.delete(`/api/admin/orders/${orderId}`, getAuthConfig());
    setOrders(orders.filter(order => order.id !== orderId));
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to delete order');
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

  const getStatusOptions = (currentStatus) => {
    const allStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    return allStatuses.filter(status => status !== currentStatus);
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      search: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status" className="text-primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading orders...</p>
        </div>
      </Container>
    );
  }

  return (
    <AdminLayout>
    <Container className="py-5">
      <div className="mb-4">
        <h1 className="mb-2">Manage Orders</h1>
        <p className="text-muted">
          Total Orders: {filteredOrders.length}
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
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Order ID, customer name, email..."
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>From Date</Form.Label>
                <Form.Control
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>To Date</Form.Label>
                <Form.Control
                  type="date"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
           <Col md={3}>
  <Form.Group className="mb-3">
    <Form.Label>&nbsp;</Form.Label>
    <Button
      variant="outline-secondary"
      onClick={clearFilters}
      className="w-100"
    >
      Clear Filters
    </Button>
  </Form.Group>
</Col>

          </Row>
        </Card.Body>
      </Card>

      {/* Orders Table */}
      <Card>
        <Card.Body>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-5">
              <FontAwesomeIcon icon={faShoppingBag} size="4x" className="text-muted mb-3" />
              <h4>No orders found</h4>
              <p className="text-muted">
                {Object.values(filters).some(f => f) 
                  ? 'Try adjusting your filters to see more orders.'
                  : 'Orders will appear here once customers start placing them.'
                }
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <strong>{order.orderId || `#${order.id}`}</strong>
                      </td>
                      <td>
                        <div>
                          <strong>{order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}` : 'Unknown Customer'}</strong>
                          <br />
                          <small className="text-muted">{order.user?.email || 'No email'}</small>
                          <br />
                          <small className="text-muted">{order.user?.phone || 'No phone'}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          {(order.itemCount || (order.items ? order.items.reduce((sum, i) => sum + (i.quantity || 0), 0) : 0))} item{(order.itemCount || 0) !== 1 ? 's' : ''}
                          <br />
                          <small className="text-muted">
                            {order.items && order.items.slice(0, 2).map(item => item.productName).join(', ')}
                            {order.items && order.items.length > 2 && '...'}
                          </small>
                        </div>
                      </td>
                      <td>
                        <strong className="text-primary">₹{(order.finalAmount || order.total || 0).toFixed(2)}</strong>
                        <br />
                        <small className="text-muted">
                          Subtotal: ₹{(order.subtotal || 0).toFixed(2)}
                        </small>
                      </td>
                      <td>
                        <div className="mb-2">
                          {getStatusBadge(order.status)}
                        </div>
                        <Form.Select
                          size="sm"
                          value=""
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          disabled={updatingStatus}
                        >
                          <option value="">Change Status</option>
                          {getStatusOptions(order.status).map(status => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                      <td>
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Invalid Date'}
                        <br />
                        <small className="text-muted">
                          {order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : ''}
                        </small>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleViewOrder(order.id)}
                        >
                          <FontAwesomeIcon icon={faEye} className="me-1" />
                          View
                        </Button>
                        
                        <Button
                          variant="outline-danger"
                          size="sm"
                       onClick={() => handleDeleteOrder(order.id)}
                      >
                         <FontAwesomeIcon icon={faTrash} className="me-2" />
                      Delete
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

      {/* Order Detail Modal */}
      <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Order Details - {selectedOrder?.orderId || 'Unknown'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              {/* Order Summary */}
              <Row className="mb-4">
                <Col md={6}>
                  <h6>Order Information</h6>
                  <p><strong>Order ID:</strong> {selectedOrder.orderId || 'Unknown'}</p>
                  <p><strong>Date:</strong> {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'Invalid Date'}</p>
                  <p><strong>Status:</strong> {getStatusBadge(selectedOrder.status)}</p>
                  <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod || 'Unknown'}</p>
                </Col>
                <Col md={6}>
                  <h6>Customer Information</h6>
                  <p><strong>Name:</strong> {selectedOrder.user ? `${selectedOrder.user.firstName || ''} ${selectedOrder.user.lastName || ''}` : 'Unknown'}</p>
                  <p><strong>Email:</strong> {selectedOrder.user?.email || 'No email'}</p>
                  <p><strong>Phone:</strong> {selectedOrder.user?.phone || 'No phone'}</p>
                </Col>
              </Row>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div className="mb-4">
                  <h6>Shipping Address</h6>
                  <p className="mb-1">{selectedOrder.shippingAddress.street || 'No street address'}</p>
                  <p className="mb-1">
                    {selectedOrder.shippingAddress.city || ''}, {selectedOrder.shippingAddress.state || ''} {selectedOrder.shippingAddress.zipCode || ''}
                  </p>
                </div>
              )}

              {/* Order Items */}
              <div className="mb-4">
                <h6>Order Items</h6>
                <Table striped bordered>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items && selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.productName || 'Unknown Product'}</td>
                        <td>{item.quantity || 0}</td>
                        <td>₹{(item.unitPrice || 0).toFixed(2)}</td>
                        <td>₹{((item.unitPrice || 0) * (item.quantity || 0)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Order Summary */}
              <div className="mb-4">
                <h6>Order Summary</h6>
                <div className="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <span>₹{(selectedOrder.subtotal || 0).toFixed(2)}</span>
                </div>
                {(selectedOrder.gstAmount || 0) > 0 && (
                  <div className="d-flex justify-content-between">
                    <span>GST:</span>
                    <span>₹{(selectedOrder.gstAmount || 0).toFixed(2)}</span>
                  </div>
                )}
                {(selectedOrder.discountAmount || 0) > 0 && (
                  <div className="d-flex justify-content-between text-danger">
                    <span>Discount:</span>
                    <span>-₹{(selectedOrder.discountAmount || 0).toFixed(2)}</span>
                  </div>
                )}
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <strong className="text-primary">₹{(selectedOrder.finalAmount || selectedOrder.total || 0).toFixed(2)}</strong>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h6>Update Status</h6>
                <div className="d-flex gap-2">
                  <Form.Select
                    value=""
                    onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                    disabled={updatingStatus}
                    style={{ maxWidth: '200px' }}
                  >
                    <option value="">Select New Status</option>
                    {getStatusOptions(selectedOrder.status).map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </Form.Select>
                  {updatingStatus && (
                    <Spinner animation="border" size="sm" />
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
    </AdminLayout>
  );
};

export default AdminOrders;
