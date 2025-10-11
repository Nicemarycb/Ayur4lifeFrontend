// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faCheck, faTimes, faExclamationTriangle, faSearch } from '@fortawesome/free-solid-svg-icons';
// import { useAdminAuth } from '../../contexts/AdminAuthContext';
// import AdminLayout from '../../layouts/AdminLayout';
// import axios from 'axios';

// const Cancellations = () => { 
//   const { isAuthenticated, isAdmin, getAuthConfig } = useAdminAuth();
//   const [loading, setLoading] = useState(false);
//   const [cancellations, setCancellations] = useState([]);
//   const [selectedCancellation, setSelectedCancellation] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');

//   // // Utility function to safely format dates
//   // const formatDate = (dateInput) => {
//   //   if (!dateInput) return 'N/A';
    
//   //   try {
//   //     let date;
      
//   //     // If it's already a Date object
//   //     if (dateInput instanceof Date) {
//   //       date = dateInput;
//   //     }
//   //     // If it's a Firestore timestamp with toDate method
//   //     else if (dateInput && typeof dateInput === 'object' && dateInput.toDate && typeof dateInput.toDate === 'function') {
//   //       date = dateInput.toDate();
//   //     }
//   //     // If it's a string or number
//   //     else {
//   //       date = new Date(dateInput);
//   //     }
      
//   //     // Check if the date is valid
//   //     if (isNaN(date.getTime())) {
//   //       return 'N/A';
//   //     }
      
//   //     // Format as DD/MM/YYYY
//   //     return date.toLocaleDateString('en-IN', {
//   //       day: '2-digit',
//   //       month: '2-digit',
//   //       year: 'numeric'
//   //     });
//   //   } catch (error) {
//   //     console.error('Error formatting date:', error, dateInput);
//   //     return 'N/A';
//   //   }
//   // };

//   // // Utility function to safely format time
//   // const formatTime = (dateInput) => {
//   //   if (!dateInput) return 'N/A';
    
//   //   try {
//   //     let date;
      
//   //     if (dateInput instanceof Date) {
//   //       date = dateInput;
//   //     } else if (dateInput && typeof dateInput === 'object' && dateInput.toDate && typeof dateInput.toDate === 'function') {
//   //       date = dateInput.toDate();
//   //     } else {
//   //       date = new Date(dateInput);
//   //     }
      
//   //     if (isNaN(date.getTime())) {
//   //       return 'N/A';
//   //     }
      
//   //     return date.toLocaleTimeString('en-IN', {
//   //       hour: '2-digit',
//   //       minute: '2-digit',
//   //       hour12: true
//   //     });
//   //   } catch (error) {
//   //     console.error('Error formatting time:', error, dateInput);
//   //     return 'N/A';
//   //   }
//   // };

//   // ✅ ADD THESE TWO FUNCTIONS TO YOUR EXISTING COMPONENT
// const formatDate = (dateInput) => {
//   if (!dateInput) return 'N/A';
  
//   try {
//     let date;
    
//     // 🔥 CRITICAL FIX: Handle Firestore timestamp
//     if (dateInput && typeof dateInput === 'object' && dateInput.toDate && typeof dateInput.toDate === 'function') {
//       date = dateInput.toDate();
//     } 
//     // Handle regular date string
//     else if (dateInput) {
//       date = new Date(dateInput);
//     } else {
//       return 'N/A';
//     }
    
//     if (isNaN(date.getTime())) {
//       return 'N/A';
//     }
    
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   } catch (error) {
//     console.error('Error formatting date:', error);
//     return 'N/A';
//   }
// };

// const formatTime = (dateInput) => {
//   if (!dateInput) return 'N/A';
  
//   try {
//     let date;
    
//     // 🔥 CRITICAL FIX: Handle Firestore timestamp
//     if (dateInput && typeof dateInput === 'object' && dateInput.toDate && typeof dateInput.toDate === 'function') {
//       date = dateInput.toDate();
//     } 
//     // Handle regular date string
//     else if (dateInput) {
//       date = new Date(dateInput);
//     } else {
//       return 'N/A';
//     }
    
//     if (isNaN(date.getTime())) {
//       return 'N/A';
//     }
    
//     return date.toLocaleTimeString('en-IN', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     });
//   } catch (error) {
//     console.error('Error formatting time:', error);
//     return 'N/A';
//   }
// };

//  const formatPrice = (price) => {
//   // Handle undefined, null, empty string, or invalid numbers
//   if (price === undefined || price === null || price === '' || isNaN(price)) {
//     return '₹0';
//   }
  
//   // Ensure it's a number
//   const numPrice = typeof price === 'string' ? 
//     parseFloat(price.replace(/[^0-9.-]+/g, "")) : 
//     Number(price);
  
//   // Check if it's a valid number after conversion
//   if (isNaN(numPrice) || numPrice <= 0) {
//     return '₹0';
//   }
  
//   // Format with Indian rupee symbol and proper formatting
//   return `₹${numPrice.toLocaleString('en-IN', {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 2
//   })}`;
// };

//   // Safe data extraction functions
//   const getCustomerName = (data) => {
//     if (!data) return 'N/A';
//     return data.customerName || 
//            (data.customer && (data.customer.firstName || data.customer.name)) || 
//            'N/A';
//   };

//   const getCustomerEmail = (data) => {
//     if (!data) return 'N/A';
//     return data.customerEmail || 
//            (data.customer && data.customer.email) || 
//            'N/A';
//   };


//    // Temporary fix in Cancellations.js - add this function
// const getProductPrice = (cancellation) => {
//   // Try multiple price fields
//   const priceFields = ['productPrice', 'price', 'unitPrice', 'itemPrice', 'salePrice', 'originalPrice'];
  
//   for (const field of priceFields) {
//     const value = cancellation[field];
//     if (value !== undefined && value !== null && value !== '' && value !== 0) {
//       const numValue = typeof value === 'string' ? 
//         parseFloat(value.replace(/[^0-9.-]+/g, "")) : 
//         Number(value);
      
//       if (!isNaN(numValue) && numValue > 0) {
//         return numValue;
//       }
//     }
//   }
  
//   return 0;
// };

//   useEffect(() => {
//     if (isAuthenticated && isAdmin) {
//       loadCancellations();
//     }
//   }, [isAuthenticated, isAdmin]);

//   const loadCancellations = async () => {
//     try {
//       setLoading(true);
//       const config = getAuthConfig();
//       const response = await axios.get('/api/return-requests/admin/cancellations', config);
      
//       console.log('API Response received:', response.data);
      
//       if (response.data.success) {
//         const cancellationsData = response.data.cancellations || [];
//         console.log('Processed cancellations:', cancellationsData);
        
//         if (cancellationsData.length > 0) {
//           console.log('Sample cancellation data:', cancellationsData[0]);
//         }
        
//         setCancellations(cancellationsData);
//       } else {
//         setMessage({ type: 'danger', text: 'Failed to load cancellations: ' + response.data.message });
//       }
//     } catch (error) {
//       console.error('Error loading cancellations:', error);
//       setMessage({ 
//         type: 'danger', 
//         text: 'Error loading cancellation requests: ' + (error.response?.data?.message || error.message) 
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAction = async (cancellationId, action, reason = '') => {
//     try {
//       setActionLoading(true);
//       const config = getAuthConfig();
//       const response = await axios.patch(
//         `/api/return-requests/admin/cancellations/${cancellationId}/${action}`, 
//         { reason }, 
//         config
//       );
      
//       if (response.data.success) {
//         setMessage({ type: 'success', text: `Cancellation request ${action}ed successfully!` });
//         loadCancellations();
//         setShowModal(false);
//         setSelectedCancellation(null);
//       }
//     } catch (error) {
//       setMessage({ 
//         type: 'danger', 
//         text: `Error ${action}ing cancellation request: ` + (error.response?.data?.message || error.message) 
//       });
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       pending: { variant: 'warning', text: 'Pending' },
//       approved: { variant: 'success', text: 'Approved' },
//       rejected: { variant: 'danger', text: 'Rejected' }
//     };
    
//     const config = statusConfig[status] || { variant: 'secondary', text: status || 'Unknown' };
//     return <Badge bg={config.variant}>{config.text}</Badge>;
//   };

//   const filteredCancellations = cancellations.filter(cancellation => {
//     const searchTermLower = searchTerm.toLowerCase();
//     const matchesSearch = 
//       (cancellation.orderNumber || '').toLowerCase().includes(searchTermLower) ||
//       (getCustomerName(cancellation) || '').toLowerCase().includes(searchTermLower) ||
//       (cancellation.productName || '').toLowerCase().includes(searchTermLower);
    
//     const matchesStatus = statusFilter === 'all' || (cancellation.status || 'pending') === statusFilter;
    
//     return matchesSearch && matchesStatus;
//   });

//   if (!isAuthenticated || !isAdmin) {
//     return (
//       <Container className="py-4">
//         <Alert variant="warning">
//           <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
//           You must be logged in as an admin to access this page.
//         </Alert>
//       </Container>
//     );
//   }

//   return (
//     <AdminLayout>
//       <Container className="py-4">
//         <Row className="mb-4">
//           <Col>
//             <h2 className="mb-3">
//               <FontAwesomeIcon icon={faTimes} className="me-2" />
//               Order Cancellation Management
//             </h2>
//             <p className="text-muted">
//               Review and manage customer cancellation requests for orders before delivery.
//             </p>
//           </Col>
//         </Row>

//         {message.text && (
//           <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
//             {message.text}
//           </Alert>
//         )}

//         <Row className="mb-4">
//           <Col md={6}>
//             <Form.Group>
//               <Form.Label>Search</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Search by order number, customer name, or product name..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </Form.Group>
//           </Col>
//           <Col md={3}>
//             <Form.Group>
//               <Form.Label>Status Filter</Form.Label>
//               <Form.Select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option value="all">All Statuses</option>
//                 <option value="pending">Pending</option>
//                 <option value="approved">Approved</option>
//                 <option value="rejected">Rejected</option>
//               </Form.Select>
//             </Form.Group>
//           </Col>
//           <Col md={3} className="d-flex align-items-end">
//             <Button 
//               variant="outline-primary" 
//               onClick={loadCancellations}
//               disabled={loading}
//               className="w-100"
//             >
//               <FontAwesomeIcon icon={faSearch} className="me-2" />
//               Refresh
//             </Button>
//           </Col>
//         </Row>

//         <Card>
//           <Card.Body>
//             {loading ? (
//               <div className="text-center py-4">
//                 <Spinner animation="border" role="status" className="text-primary">
//                   <span className="visually-hidden">Loading...</span>
//                 </Spinner>
//                 <p className="mt-3">Loading cancellation requests...</p>
//               </div>
//             ) : filteredCancellations.length === 0 ? (
//               <div className="text-center py-4">
//                 <h5>No Cancellation Requests Found</h5>
//                 <p className="text-muted">
//                   {searchTerm || statusFilter !== 'all' 
//                     ? 'Try adjusting your search criteria or filters.'
//                     : 'There are no cancellation requests at the moment.'
//                   }
//                 </p>
//               </div>
//             ) : (
//               <Table responsive striped hover>
//                 <thead>
//                   <tr>
//                     <th>Order Info</th>
//                     <th>Product Details</th>
//                     <th>Customer</th>
//                     <th>Reason</th>
//                     <th>Status</th>
//                     <th>Date</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredCancellations.map((cancellation) => (
//                     <tr key={cancellation.id}>
//                       <td>
//                         <div>
//                           <strong>#{cancellation.orderNumber || 'N/A'}</strong>
//                           <br />
//                           <small className="text-muted">
//                             Order: {cancellation.orderStatus || 'N/A'}
//                           </small>
//                           <br />
//                           <small className="text-muted">
//                             Delivery: {cancellation.deliveryStatus || 'N/A'}
//                           </small>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="d-flex align-items-center">
//                           <img
//                             src={cancellation.productImage || '/Ayur4life_logo_round_png-01.png'}
//                             alt={cancellation.productName}
//                             style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
//                             className="me-2"
//                             onError={(e) => {
//                               e.target.src = '/Ayur4life_logo_round_png-01.png';
//                             }}
//                           />
//                           <div>
//                             <div className="fw-semibold">{cancellation.productName || 'N/A'}</div>
//                             {/* // Then use it in your JSX instead of direct cancellation.productPrice */}
// <small className="text-muted">
//   Qty: {cancellation.quantity || 1} | {formatPrice(getProductPrice(cancellation))}
// </small>
//                           </div>
//                         </div>
//                       </td>
//                       <td>
//                         <div>
//                           <div className="fw-semibold">{getCustomerName(cancellation)}</div>
//                           <small className="text-muted">{getCustomerEmail(cancellation)}</small>
//                         </div>
//                       </td>
//                       <td>
//                         <div>
//                           <strong>{cancellation.cancelReason || 'N/A'}</strong>
//                           {cancellation.description && (
//                             <div className="text-muted mt-1">
//                               <small>{cancellation.description}</small>
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         {getStatusBadge(cancellation.status)}
//                       </td>
//                       <td>
//                         <div>
//                           <div>{formatDate(cancellation.createdAt)}</div>
//   <small className="text-muted">{formatTime(cancellation.createdAt)}</small>
//                         </div>
//                       </td>
//                       <td>
//                         {cancellation.status === 'pending' ? (
//                           <div className="d-flex gap-1">
//                             <Button
//                               variant="success"
//                               size="sm"
//                               onClick={() => {
//                                 console.log('Selected cancellation:', cancellation);
//                                 setSelectedCancellation(cancellation);
//                                 setShowModal(true);
//                               }}
//                               disabled={actionLoading}
//                             >
//                               <FontAwesomeIcon icon={faCheck} className="me-1" />
//                               Approve
//                             </Button>
//                             <Button
//                               variant="danger"
//                               size="sm"
//                               onClick={() => {
//                                 console.log('Selected cancellation:', cancellation);
//                                 setSelectedCancellation(cancellation);
//                                 setShowModal(true);
//                               }}
//                               disabled={actionLoading}
//                             >
//                               <FontAwesomeIcon icon={faTimes} className="me-1" />
//                               Reject
//                             </Button>
//                           </div>
//                         ) : (
//                           <div>
//                             <small className="text-muted">
//                               {cancellation.adminAction ? 
//                                 `${cancellation.adminAction.charAt(0).toUpperCase() + cancellation.adminAction.slice(1)}ed` 
//                                 : 'Processed'
//                               }
//                             </small>
//                             {cancellation.adminReason && (
//                               <div className="text-muted">
//                                 <small>Reason: {cancellation.adminReason}</small>
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             )}
//           </Card.Body>
//         </Card>

//         {/* Action Modal */}
//         <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
//           <Modal.Header closeButton>
//             <Modal.Title>
//               {selectedCancellation?.status === 'pending' ? 'Process Cancellation Request' : 'Cancellation Details'}
//             </Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             {selectedCancellation && (
//               <div>
//                 {/* Debug information */}
//                 <div style={{ display: 'none' }}>
//                   <pre>{JSON.stringify(selectedCancellation, null, 2)}</pre>
//                 </div>

//                 {/* Order Information Section */}
//                 <div className="mb-4">
//                   <h6 className="border-bottom pb-2 mb-3">
//                     <FontAwesomeIcon icon={faEye} className="me-2" />
//                     Order Information
//                   </h6>
//                   <Row>
//                     <Col md={6}>
//                       <p><strong>Order Number:</strong> {selectedCancellation.orderNumber || 'N/A'}</p>
//                       <p><strong>Order ID:</strong> {selectedCancellation.orderId || 'N/A'}</p>
//                       <p><strong>Order Date:</strong> {formatDate(selectedCancellation.orderDate)}</p>
//                       <p><strong>Order Status:</strong> 
//                         <Badge bg="info" className="ms-2">
//                           {selectedCancellation.orderStatus || 'N/A'}
//                         </Badge>
//                       </p>
//                     </Col>
//                     <Col md={6}>
//                       <p><strong>Customer Name:</strong> {getCustomerName(selectedCancellation)}</p>
//                       <p><strong>Customer Email:</strong> {getCustomerEmail(selectedCancellation)}</p>
//                       <p><strong>User ID:</strong> {selectedCancellation.userId || 'N/A'}</p>
//                       <p><strong>Delivery Status:</strong> 
//                         <Badge bg={selectedCancellation.deliveryStatus === 'delivered' ? 'success' : 'warning'} className="ms-2">
//                           {selectedCancellation.deliveryStatus || 'N/A'}
//                         </Badge>
//                       </p>
//                     </Col>
//                   </Row>
//                 </div>

//                 {/* Product Information Section */}
//                 <div className="mb-4">
//                   <h6 className="border-bottom pb-2 mb-3">
//                     <FontAwesomeIcon icon={faEye} className="me-2" />
//                     Product Information
//                   </h6>
//                   <Row>
//                     <Col md={4}>
//                       <div className="text-center mb-3">
//                         <img
//                           src={selectedCancellation.productImage || '/Ayur4life_logo_round_png-01.png'}
//                           alt={selectedCancellation.productName}
//                           style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
//                           className="img-fluid"
//                           onError={(e) => {
//                             e.target.src = '/Ayur4life_logo_round_png-01.png';
//                           }}
//                         />
//                       </div>
//                     </Col>
//                     <Col md={8}>
//                       <p><strong>Product Name:</strong> {selectedCancellation.productName || 'N/A'}</p>
//                       <p><strong>Product ID:</strong> {selectedCancellation.productId || 'N/A'}</p>
//                       {/* <p><strong>Category:</strong> {selectedCancellation.category || 'N/A'}</p> */}
//                       <p><strong>Quantity:</strong> {selectedCancellation.quantity || 'N/A'}</p>
//                       <p><strong>Price:</strong> {formatPrice(selectedCancellation.productPrice)}</p>
//                     </Col>
//                   </Row>
//                 </div>
//                 {/* Cancellation Details Section */}
//                 <div className="mb-4">
//                   <h6 className="border-bottom pb-2 mb-3">
//                     <FontAwesomeIcon icon={faEye} className="me-2" />
//                     Cancellation Details
//                   </h6>
//                   <Row>
//                     <Col md={6}>
//                       <p><strong>Cancellation Reason:</strong></p>
//                       <div className="bg-light p-3 rounded">
//                         {selectedCancellation.cancelReason || 'N/A'}
//                       </div>
                      
//                       {selectedCancellation.description && (
//                         <>
//                           <p className="mt-3"><strong>Description:</strong></p>
//                           <div className="bg-light p-3 rounded">
//                             {selectedCancellation.description}
//                           </div>
//                         </>
//                       )}
//                     </Col>
//                     <Col md={6}>
//                       <p><strong>Requested Date:</strong> {formatDate(selectedCancellation.createdAt)}</p>
//                       <p><strong>Requested Time:</strong> {formatTime(selectedCancellation.createdAt)}</p>
//                       <p><strong>Last Updated:</strong> {formatDate(selectedCancellation.updatedAt)}</p>
//                       <p><strong>Current Status:</strong> {getStatusBadge(selectedCancellation.status)}</p>
//                     </Col>
//                   </Row>
//                 </div>

//                 {/* Admin Actions Section */}
//                 {selectedCancellation.status === 'pending' && (
//                   <div className="mb-4">
//                     <h6 className="border-bottom pb-2 mb-3">
//                       <FontAwesomeIcon icon={faEye} className="me-2" />
//                       Admin Actions
//                     </h6>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Admin Reason (Optional)</Form.Label>
//                       <Form.Control
//                         as="textarea"
//                         rows={3}
//                         placeholder="Provide a reason for your decision..."
//                         id="adminReason"
//                       />
//                     </Form.Group>
//                     <div className="d-grid gap-2 d-md-flex">
//                       <Button
//                         variant="success"
//                         onClick={() => {
//                           const reason = document.getElementById('adminReason')?.value || '';
//                           handleAction(selectedCancellation.id, 'approve', reason);
//                         }}
//                         disabled={actionLoading}
//                         className="me-md-2"
//                       >
//                         <FontAwesomeIcon icon={faCheck} className="me-2" />
//                         Approve Cancellation
//                       </Button>
//                       <Button
//                         variant="danger"
//                         onClick={() => {
//                           const reason = document.getElementById('adminReason')?.value || '';
//                           handleAction(selectedCancellation.id, 'reject', reason);
//                         }}
//                         disabled={actionLoading}
//                       >
//                         <FontAwesomeIcon icon={faTimes} className="me-2" />
//                         Reject Cancellation
//                       </Button>
//                     </div>
//                   </div>
//                 )}

//                 {/* Admin Action History */}
//                 {selectedCancellation.adminAction && (
//                   <div className="mb-4">
//                     <h6 className="border-bottom pb-2 mb-3">
//                       <FontAwesomeIcon icon={faEye} className="me-2" />
//                       Admin Action History
//                     </h6>
//                     <Row>
//                       <Col md={6}>
//                         <p><strong>Action Taken:</strong> 
//                           <Badge bg={selectedCancellation.adminAction === 'approve' ? 'success' : 'danger'} className="ms-2">
//                             {selectedCancellation.adminAction === 'approve' ? 'Approved' : 'Rejected'}
//                           </Badge>
//                         </p>
//                         <p><strong>Admin ID:</strong> {selectedCancellation.adminId || 'N/A'}</p>
//                       </Col>
//                       <Col md={6}>
//                         {selectedCancellation.adminReason && (
//                           <>
//                             <p><strong>Admin Reason:</strong></p>
//                             <div className="bg-light p-3 rounded">
//                               {selectedCancellation.adminReason}
//                             </div>
//                           </>
//                         )}
//                       </Col>
//                     </Row>
//                   </div>
//                 )}
//               </div>
//             )}
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowModal(false)}>
//               Close
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       </Container>
//     </AdminLayout>
//   );
// };

// export default Cancellations;
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCheck, faTimes, faExclamationTriangle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';

const Cancellations = () => { 
  const { isAuthenticated, isAdmin, getAuthConfig } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [cancellations, setCancellations] = useState([]);
  const [selectedCancellation, setSelectedCancellation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const formatDate = (dateInput) => {
    if (!dateInput) return 'N/A';
    
    try {
      let date;
      
      if (dateInput && typeof dateInput === 'object' && dateInput.toDate && typeof dateInput.toDate === 'function') {
        date = dateInput.toDate();
      } 
      else if (dateInput) {
        date = new Date(dateInput);
      } else {
        return 'N/A';
      }
      
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  const formatTime = (dateInput) => {
    if (!dateInput) return 'N/A';
    
    try {
      let date;
      
      if (dateInput && typeof dateInput === 'object' && dateInput.toDate && typeof dateInput.toDate === 'function') {
        date = dateInput.toDate();
      } 
      else if (dateInput) {
        date = new Date(dateInput);
      } else {
        return 'N/A';
      }
      
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      
      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'N/A';
    }
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null || price === '' || isNaN(price)) {
      return '₹0';
    }
    
    const numPrice = typeof price === 'string' ? 
      parseFloat(price.replace(/[^0-9.-]+/g, "")) : 
      Number(price);
    
    if (isNaN(numPrice) || numPrice <= 0) {
      return '₹0';
    }
    
    return `₹${numPrice.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
  };

  // UPDATED: Safe data extraction for customer info
  const getCustomerName = (data) => {
    if (!data) return 'N/A';
    return data.customerName || 
           (data.customer && (data.customer.firstName || data.customer.name)) || 
           'N/A';
  };

  const getCustomerEmail = (data) => {
    if (!data) return 'N/A';
    return data.customerEmail || 
           (data.customer && data.customer.email) || 
           'N/A';
  };

  // FIXED: Add extractItemTotal function
  const extractItemTotal = (item) => {
    if (!item) return 0;
    
    // Prefer itemTotal, fallback to unitPrice * quantity
    if (item.itemTotal) {
      return extractPrice(item.itemTotal);
    }
    if (item.unitPrice && item.quantity) {
      return extractPrice(item.unitPrice) * item.quantity;
    }
    return 0;
  };

  // FIXED: Add extractPrice helper function
  const extractPrice = (priceData) => {
    if (priceData === undefined || priceData === null) return 0;
    
    if (typeof priceData === 'number') {
      return priceData;
    }
    
    if (typeof priceData === 'string') {
      const cleaned = priceData.replace(/[₹,]/g, '').trim();
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    
    return 0;
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadCancellations();
    }
  }, [isAuthenticated, isAdmin]);

  const loadCancellations = async () => {
    try {
      setLoading(true);
      const config = getAuthConfig();
      const response = await axios.get('/api/return-requests/admin/cancellations', config);
      
      console.log('API Response received:', response.data);
      
      if (response.data.success) {
        const cancellationsData = response.data.cancellations || [];
        console.log('Processed cancellations:', cancellationsData);
        
        if (cancellationsData.length > 0) {
          console.log('Sample cancellation data:', cancellationsData[0]);
        }
        
        setCancellations(cancellationsData);
      } else {
        setMessage({ type: 'danger', text: 'Failed to load cancellations: ' + response.data.message });
      }
    } catch (error) {
      console.error('Error loading cancellations:', error);
      setMessage({ 
        type: 'danger', 
        text: 'Error loading cancellation requests: ' + (error.response?.data?.message || error.message) 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (cancellationId, action, reason = '') => {
    try {
      setActionLoading(true);
      const config = getAuthConfig();
      const response = await axios.patch(
        `/api/return-requests/admin/cancellations/${cancellationId}/${action}`, 
        { reason }, 
        config
      );
      
      if (response.data.success) {
        setMessage({ type: 'success', text: `Cancellation request ${action}ed successfully!` });
        loadCancellations();
        setShowModal(false);
        setSelectedCancellation(null);
      }
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: `Error ${action}ing cancellation request: ` + (error.response?.data?.message || error.message) 
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'warning', text: 'Pending' },
      approved: { variant: 'success', text: 'Approved' },
      rejected: { variant: 'danger', text: 'Rejected' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: status || 'Unknown' };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const filteredCancellations = cancellations.filter(cancellation => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (cancellation.orderNumber || '').toLowerCase().includes(searchTermLower) ||
      (getCustomerName(cancellation) || '').toLowerCase().includes(searchTermLower) ||
      (cancellation.items?.some(item => (item.productName || '').toLowerCase().includes(searchTermLower)) || false);
    
    const matchesStatus = statusFilter === 'all' || (cancellation.status || 'pending') === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
            <h2 className="mb-3">Order Cancellations</h2>
            <p className="text-muted">Manage customer cancellation requests for entire orders.</p>
          </Col>
          <Col className="text-end">
            <div className="d-flex justify-content-end">
              <input
                type="text"
                className="form-control me-2"
                style={{ maxWidth: '200px' }}
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="form-select me-2"
                style={{ maxWidth: '150px' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <Button variant="outline-secondary" onClick={loadCancellations}>
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </div>
          </Col>
        </Row>

        {message.type && (
          <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
            {message.text}
          </Alert>
        )}

        <Card>
          <Card.Body>
            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" className="text-primary" />
                <p className="mt-2">Loading cancellations...</p>
              </div>
            ) : filteredCancellations.length === 0 ? (
              <div className="text-center py-5">
                <FontAwesomeIcon icon={faTimes} size="3x" className="text-muted mb-3" />
                <h5>No Cancellation Requests</h5>
                <p className="text-muted">No cancellation requests found.</p>
              </div>
            ) : (
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Order Number</th>
                    <th>Customer</th>
                    <th>Total Items</th>
                    <th>Amount</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCancellations.map((cancellation) => (
                    <tr key={cancellation.id}>
                      <td>
                        <strong>{cancellation.orderNumber}</strong>
                        <br />
                        <small className="text-muted">Order ID: {cancellation.orderId}</small>
                      </td>
                      <td>
                        <div>
                          <strong>{getCustomerName(cancellation)}</strong>
                          <br />
                          <small className="text-muted">{getCustomerEmail(cancellation)}</small>
                        </div>
                      </td>
                      <td>
                        {cancellation.totalItems}
                        <br />
                        <small className="text-muted">
                          {cancellation.items?.length || 0} products
                        </small>
                      </td>
                      <td>
                        {formatPrice(cancellation.finalAmount)}
                        <br />
                        <small className="text-muted">
                          Subtotal: {formatPrice(cancellation.subtotal)}
                          {cancellation.gstAmount > 0 ? ` • GST: ${formatPrice(cancellation.gstAmount)}` : ''}
                          {cancellation.deliveryCharge > 0 ? ` • Delivery: ${formatPrice(cancellation.deliveryCharge)}` : ''}
                          {cancellation.discountAmount > 0 ? ` • Discount: -${formatPrice(cancellation.discountAmount)}` : ''}
                        </small>
                      </td>
                      <td>
                        <div>{cancellation.cancelReason}</div>
                        {cancellation.description && (
                          <small className="text-muted mt-1 d-block">
                            {cancellation.description.substring(0, 50)}...
                          </small>
                        )}
                      </td>
                      <td>
                        {getStatusBadge(cancellation.status)}
                        {cancellation.adminAction && (
                          <div className="mt-1">
                            <small className="text-muted">
                              {cancellation.adminAction === 'approve' ? 'Approved' : 'Rejected'}
                            </small>
                            {cancellation.adminReason && (
                              <div className="text-muted">
                                <small>Reason: {cancellation.adminReason}</small>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td>
                        {formatDate(cancellation.createdAt)}
                        <br />
                        <small className="text-muted">{formatTime(cancellation.createdAt)}</small>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            setSelectedCancellation(cancellation);
                            setShowModal(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* UPDATED: Action Modal - Now shows all items */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedCancellation?.status === 'pending' ? 'Process Cancellation Request' : 'Cancellation Details'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedCancellation && (
              <div>
                {/* Debug information */}
                <div style={{ display: 'none' }}>
                  <pre>{JSON.stringify(selectedCancellation, null, 2)}</pre>
                </div>

                {/* Order Information Section */}
                <div className="mb-4">
                  <h6 className="border-bottom pb-2 mb-3">
                    <FontAwesomeIcon icon={faEye} className="me-2" />
                    Order Information
                  </h6>
                  <Row>
                    <Col md={6}>
                      <p><strong>Order Number:</strong> {selectedCancellation.orderNumber || 'N/A'}</p>
                      <p><strong>Order ID:</strong> {selectedCancellation.orderId || 'N/A'}</p>
                      <p><strong>Order Date:</strong> {formatDate(selectedCancellation.orderDate)}</p>
                      <p><strong>Order Status:</strong> 
                        <Badge bg="info" className="ms-2">
                          {selectedCancellation.orderStatus || 'N/A'}
                        </Badge>
                      </p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Customer Name:</strong> {getCustomerName(selectedCancellation)}</p>
                      <p><strong>Customer Email:</strong> {getCustomerEmail(selectedCancellation)}</p>
                      <p><strong>User ID:</strong> {selectedCancellation.userId || 'N/A'}</p>
                      <p><strong>Delivery Status:</strong> 
                        <Badge bg={selectedCancellation.deliveryStatus === 'delivered' ? 'success' : 'warning'} className="ms-2">
                          {selectedCancellation.deliveryStatus || 'N/A'}
                        </Badge>
                      </p>
                    </Col>
                  </Row>
                </div>

                {/* UPDATED: Product Information Section - Now shows all items */}
                <div className="mb-4">
                  <h6 className="border-bottom pb-2 mb-3">
                    <FontAwesomeIcon icon={faEye} className="me-2" />
                    Order Items ({selectedCancellation.items?.length || 0})
                  </h6>
                  {selectedCancellation.items && selectedCancellation.items.length > 0 ? (
                    <Table striped bordered size="sm">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Image</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCancellation.items.map((item, index) => (
                          <tr key={index}>
                            <td>{item.productName || 'N/A'}</td>
                            <td>
                              {item.productImage ? (
                                <img
                                  src={item.productImage}
                                  alt={item.productName}
                                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                  onError={(e) => {
                                    e.target.src = '/Ayur4life_logo_round_png-01.png';
                                  }}
                                />
                              ) : (
                                <img
                                  src="/Ayur4life_logo_round_png-01.png"
                                  alt="No Image"
                                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                              )}
                            </td>
                            <td>{item.quantity || 'N/A'}</td>
                            <td>{formatPrice(item.unitPrice)}</td>
                            <td>{formatPrice(extractItemTotal(item))}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th colSpan="4" className="text-end">Subtotal:</th>
                          <th>{formatPrice(selectedCancellation.subtotal)}</th>
                        </tr>
                        {selectedCancellation.gstAmount > 0 && (
                          <tr>
                            <th colSpan="4" className="text-end">GST:</th>
                            <th>{formatPrice(selectedCancellation.gstAmount)}</th>
                          </tr>
                        )}
                        {selectedCancellation.deliveryCharge > 0 && (
                          <tr>
                            <th colSpan="4" className="text-end">Delivery:</th>
                            <th>{formatPrice(selectedCancellation.deliveryCharge)}</th>
                          </tr>
                        )}
                        {selectedCancellation.discountAmount > 0 && (
                          <tr>
                            <th colSpan="4" className="text-end">Discount:</th>
                            <th className="text-danger">-{formatPrice(selectedCancellation.discountAmount)}</th>
                          </tr>
                        )}
                        <tr className="fw-bold">
                          <th colSpan="4" className="text-end">Total:</th>
                          <th>{formatPrice(selectedCancellation.finalAmount)}</th>
                        </tr>
                      </tfoot>
                    </Table>
                  ) : (
                    <p>No items found in this order.</p>
                  )}
                </div>

                {/* Cancellation Details Section */}
                <div className="mb-4">
                  <h6 className="border-bottom pb-2 mb-3">
                    <FontAwesomeIcon icon={faEye} className="me-2" />
                    Cancellation Details
                  </h6>
                  <Row>
                    <Col md={6}>
                      <p><strong>Cancellation Reason:</strong></p>
                      <div className="bg-light p-3 rounded">
                        {selectedCancellation.cancelReason || 'N/A'}
                      </div>
                      
                      {selectedCancellation.description && (
                        <>
                          <p className="mt-3"><strong>Description:</strong></p>
                          <div className="bg-light p-3 rounded">
                            {selectedCancellation.description}
                          </div>
                        </>
                      )}
                    </Col>
                    <Col md={6}>
                      <p><strong>Requested Date:</strong> {formatDate(selectedCancellation.createdAt)}</p>
                      <p><strong>Requested Time:</strong> {formatTime(selectedCancellation.createdAt)}</p>
                      <p><strong>Last Updated:</strong> {formatDate(selectedCancellation.updatedAt)}</p>
                      <p><strong>Current Status:</strong> {getStatusBadge(selectedCancellation.status)}</p>
                    </Col>
                  </Row>
                </div>

                {/* Admin Actions Section */}
                {selectedCancellation.status === 'pending' && (
                  <div className="mb-4">
                    <h6 className="border-bottom pb-2 mb-3">
                      <FontAwesomeIcon icon={faEye} className="me-2" />
                      Admin Actions
                    </h6>
                    <Form.Group className="mb-3">
                      <Form.Label>Admin Reason (Optional)</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Provide a reason for your decision..."
                        id="adminReason"
                      />
                    </Form.Group>
                    <div className="d-grid gap-2 d-md-flex">
                      <Button
                        variant="success"
                        onClick={() => {
                          const reason = document.getElementById('adminReason')?.value || '';
                          handleAction(selectedCancellation.id, 'approve', reason);
                        }}
                        disabled={actionLoading}
                        className="me-md-2"
                      >
                        <FontAwesomeIcon icon={faCheck} className="me-2" />
                        Approve Entire Order Cancellation
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => {
                          const reason = document.getElementById('adminReason')?.value || '';
                          handleAction(selectedCancellation.id, 'reject', reason);
                        }}
                        disabled={actionLoading}
                      >
                        <FontAwesomeIcon icon={faTimes} className="me-2" />
                        Reject Cancellation
                      </Button>
                    </div>
                  </div>
                )}

                {/* Admin Action History */}
                {selectedCancellation.adminAction && (
                  <div className="mb-4">
                    <h6 className="border-bottom pb-2 mb-3">
                      <FontAwesomeIcon icon={faEye} className="me-2" />
                      Admin Action History
                    </h6>
                    <Row>
                      <Col md={6}>
                        <p><strong>Action Taken:</strong> 
                          <Badge bg={selectedCancellation.adminAction === 'approve' ? 'success' : 'danger'} className="ms-2">
                            {selectedCancellation.adminAction === 'approve' ? 'Approved' : 'Rejected'}
                          </Badge>
                        </p>
                        <p><strong>Admin ID:</strong> {selectedCancellation.adminId || 'N/A'}</p>
                      </Col>
                      <Col md={6}>
                        {selectedCancellation.adminReason && (
                          <>
                            <p><strong>Admin Reason:</strong></p>
                            <div className="bg-light p-3 rounded">
                              {selectedCancellation.adminReason}
                            </div>
                          </>
                        )}
                      </Col>
                    </Row>
                  </div>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </AdminLayout>
  );
};

export default Cancellations;