// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTimes, faArrowLeft, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useUserAuth } from '../contexts/UserAuthContext';
// import axios from 'axios';
// import UserLayout from '../layouts/UserLayout';

// const CancelOrder = () => {
//   const { orderId, productId } = useParams();
//   const navigate = useNavigate();
//   const { user } = useUserAuth();
  
//   const [order, setOrder] = useState(null);
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
  
//   const [formData, setFormData] = useState({
//     cancelReason: '',
//     description: ''
//   });


//   // ✅ ADD THIS PRICE FORMATTING FUNCTION
//   const formatPrice = (price) => {
//     if (price === undefined || price === null || price === '' || isNaN(price)) {
//       return '₹0';
//     }
    
//     const numPrice = typeof price === 'string' ? 
//       parseFloat(price.replace(/[^0-9.-]+/g, "")) : 
//       Number(price);
    
//     if (isNaN(numPrice) || numPrice <= 0) {
//       return '₹0';
//     }
    
//     return `₹${numPrice.toLocaleString('en-IN', {
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 2
//     })}`;
//   };

//   // ✅ ADD THIS PRICE EXTRACTION FUNCTION (Same as your backend)
//   const extractProductPrice = (productItem) => {
//     if (!productItem) return 0;
    
//     console.log('=== PRICE EXTRACTION DEBUG ===');
//     console.log('All available fields in product item:', Object.keys(productItem));
    
//     // Try all possible price field names with proper validation
//     const priceFields = [
//       'productPrice', 'price', 'unitPrice', 'itemPrice', 
//       'salePrice', 'originalPrice', 'totalPrice', 'amount'
//     ];
    
//     for (const field of priceFields) {
//       const value = productItem[field];
//       console.log(`Checking field '${field}':`, value);
      
//       if (value !== undefined && value !== null && value !== '') {
//         const numValue = typeof value === 'string' ? 
//           parseFloat(value.replace(/[^0-9.-]+/g, "")) : 
//           Number(value);
          
//         if (!isNaN(numValue) && numValue > 0) {
//           console.log(`✅ Found valid price in '${field}':`, numValue);
//           return numValue;
//         }
//       }
//     }
    
//     // If no valid price found, check all numeric fields
//     console.log('No standard price field found, checking all numeric fields...');
//     for (const [key, value] of Object.entries(productItem)) {
//       if (typeof value === 'number' && value > 0) {
//         console.log(`⚠️ Using numeric value from '${key}':`, value);
//         return value;
//       }
//       if (typeof value === 'string') {
//         const numValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
//         if (!isNaN(numValue) && numValue > 0) {
//           console.log(`⚠️ Using parsed string value from '${key}':`, numValue);
//           return numValue;
//         }
//       }
//     }
    
//     console.warn('❌ No valid price found, using default 0');
//     return 0;
//   };
//   // Use this function to get the product price

//   useEffect(() => {
//     if (user) {
//       loadOrderAndProduct();
//     }
//   }, [user, orderId, productId]);

//   const loadOrderAndProduct = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Fetch order details
//       const orderResponse = await axios.get(`/api/orders/${orderId}`);
      
//       if (orderResponse.data && orderResponse.data.order) {
//         const orderData = orderResponse.data.order;
//         setOrder(orderData);
        
//         // Find the specific product in the order
//         const productItem = findProductInOrder(orderData, productId);
        
//         if (productItem) {
//           setProduct(productItem);
//         } else {
//           setError('Product not found in this order. Please check the URL and try again.');
//         }
//       } else {
//         setError('Order not found. Please check the URL and try again.');
//       }
//     } catch (error) {
//       console.error('Error loading order:', error);
//       setError('Failed to load order details. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const findProductInOrder = (orderData, searchProductId) => {
//     if (!orderData.items || !Array.isArray(orderData.items)) {
//       return null;
//     }

//     // Try multiple search strategies
//     let productItem = null;
    
//     // Strategy 1: Direct field match
//     productItem = orderData.items.find(item => 
//       item.productId === searchProductId || 
//       item._id === searchProductId || 
//       item.id === searchProductId
//     );
    
//     if (productItem) return productItem;
    
//     // Strategy 2: String comparison
//     productItem = orderData.items.find(item => {
//       const itemFields = [
//         String(item.productId || ''),
//         String(item._id || ''),
//         String(item.id || '')
//       ];
//       const searchId = String(searchProductId);
//       return itemFields.some(field => field === searchId);
//     });
    
//     if (productItem) return productItem;
    
//     // Strategy 3: Case-insensitive comparison
//     productItem = orderData.items.find(item => {
//       const itemFields = [
//         String(item.productId || '').toLowerCase(),
//         String(item._id || '').toLowerCase(),
//         String(item.id || '').toLowerCase()
//       ];
//       const searchId = String(searchProductId).toLowerCase();
//       return itemFields.some(field => field === searchId);
//     });
    
//     if (productItem) return productItem;
    
//     // Strategy 4: Partial match
//     productItem = orderData.items.find(item => {
//       const itemFields = [
//         String(item.productId || ''),
//         String(item._id || ''),
//         String(item.id || '')
//       ];
//       const searchId = String(searchProductId);
//       return itemFields.some(field => field.includes(searchId) || searchId.includes(field));
//     });
    
//     return productItem;
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.cancelReason.trim()) {
//       setError('Please provide a cancellation reason.');
//       return;
//     }

//     try {
//       setSubmitting(true);
//       setError(null);
      
//       const response = await axios.post('/api/return-requests/cancel-order', {
//         orderId,
//         productId,
//         cancelReason: formData.cancelReason,
//         description: formData.description
//       });

//       if (response.data.success) {
//         setSuccess('Order cancellation request submitted successfully!');
//         setTimeout(() => {
//           navigate('/account');
//         }, 2000);
//       } else {
//         setError(response.data.message || 'Failed to submit cancellation request.');
//       }
//     } catch (error) {
//       console.error('Error submitting cancellation request:', error);
//       setError(error.response?.data?.message || 'Error submitting cancellation request');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const canCancelOrder = () => {
//     if (!order || !product) return false;
    
//     // Check if order is already delivered
//     if (order.status === 'delivered' || order.deliveryStatus === 'delivered') {
//       return false;
//     }
    
//     // Check if order is already cancelled
//     if (order.status === 'cancelled') {
//       return false;
//     }
    
//     return true;
//   };

//   if (loading) {
//     return (
//       <UserLayout>
//         <Container className="py-5">
//           <div className="text-center">
//             <Spinner animation="border" role="status" className="text-primary">
//               <span className="visually-hidden">Loading...</span>
//             </Spinner>
//             <p className="mt-3">Loading order details...</p>
//           </div>
//         </Container>
//       </UserLayout>
//     );
//   }

//   if (error && (!order || !product)) {
//     return (
//       <UserLayout>
//         <Container className="py-5">
//           <Card className="border-danger">
//             <Card.Header className="bg-danger text-white">
//               <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
//               Error Loading Order
//             </Card.Header>
//             <Card.Body>
//               <Alert variant="danger">
//                 <strong>Error:</strong> {error}
//               </Alert>
              
//               <div className="mt-3">
//                 <h6>Debug Information:</h6>
//                 <ul className="list-unstyled">
//                   <li><strong>Order ID from URL:</strong> {orderId}</li>
//                   <li><strong>Product ID from URL:</strong> {productId}</li>
//                   <li><strong>Order Found:</strong> {order ? 'Yes' : 'No'}</li>
//                   <li><strong>Product Found:</strong> {product ? 'Yes' : 'No'}</li>
//                   {order && (
//                     <>
//                       <li><strong>Order Items Count:</strong> {order.items?.length || 0}</li>
//                       <li><strong>Available Product IDs:</strong> {order.items?.map(item => item.productId || item._id || item.id).join(', ') || 'None'}</li>
//                     </>
//                   )}
//                 </ul>
//               </div>
              
//               <div className="mt-4">
//                 <Button variant="outline-primary" className="me-2" onClick={() => window.location.reload()}>
//                   Try Again
//                 </Button>
//                 <Button variant="outline-secondary" className="me-2" onClick={() => navigate('/account')}>
//                   Back to My Account
//                 </Button>
//                 <Button variant="outline-info" onClick={() => navigate('/')}>
//                   Go to Home
//                 </Button>
//               </div>
//             </Card.Body>
//           </Card>
//         </Container>
//       </UserLayout>
//     );
//   }

//   if (!canCancelOrder()) {
//     return (
//       <UserLayout>
//         <Container className="py-5">
//           <Card className="border-warning">
//             <Card.Header className="bg-warning text-dark">
//               <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
//               Order Cannot Be Cancelled
//             </Card.Header>
//             <Card.Body>
//               <Alert variant="warning">
//                 <strong>This order cannot be cancelled.</strong>
//                 {order?.status === 'delivered' || order?.deliveryStatus === 'delivered' ? (
//                   <p className="mb-0 mt-2">This order has already been delivered. If you need to return the product, please use the return request feature instead.</p>
//                 ) : order?.status === 'cancelled' ? (
//                   <p className="mb-0 mt-2">This order has already been cancelled.</p>
//                 ) : (
//                   <p className="mb-0 mt-2">This order is not eligible for cancellation.</p>
//                 )}
//               </Alert>
              
//               <div className="mt-4">
//                 <Button variant="outline-secondary" className="me-2" onClick={() => navigate('/account')}>
//                   Back to My Account
//                 </Button>
//                 <Button variant="outline-info" onClick={() => navigate('/')}>
//                   Go to Home
//                 </Button>
//               </div>
//             </Card.Body>
//           </Card>
//         </Container>
//       </UserLayout>
//     );
//   }

//   return (
//     <UserLayout>
//       <Container className="py-5">
//         <div className="mb-4">
//           <Button 
//             variant="outline-secondary" 
//             onClick={() => navigate('/account')}
//             className="mb-3"
//           >
//             <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
//             Back to My Account
//           </Button>
          
//           <h1 className="mb-3">Cancel Order</h1>
//           <p className="text-muted">
//             You can only cancel orders before they are delivered. Once delivered, you'll need to use the return request feature.
//           </p>
//         </div>

//         {error && (
//           <Alert variant="danger" dismissible onClose={() => setError(null)}>
//             {error}
//           </Alert>
//         )}

//         {success && (
//           <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
//             {success}
//           </Alert>
//         )}

//         <Row>
//           <Col lg={8}>
//             <Card>
//               <Card.Header>
//                 <h5 className="mb-0">Cancellation Request Form</h5>
//               </Card.Header>
//               <Card.Body>
//                 <Form onSubmit={handleSubmit}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       Cancellation Reason <span className="text-danger">*</span>
//                     </Form.Label>
//                     <Form.Select
//                       name="cancelReason"
//                       value={formData.cancelReason}
//                       onChange={handleInputChange}
//                       required
//                     >
//                       <option value="">Select a reason</option>
//                       <option value="Changed my mind">Changed my mind</option>
//                       <option value="Found better price elsewhere">Found better price elsewhere</option>
//                       <option value="Ordered by mistake">Ordered by mistake</option>
//                       <option value="Product no longer needed">Product no longer needed</option>
//                       <option value="Shipping too slow">Shipping too slow</option>
//                       <option value="Other">Other</option>
//                     </Form.Select>
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Additional Description (Optional)</Form.Label>
//                     <Form.Control
//                       as="textarea"
//                       rows={3}
//                       name="description"
//                       value={formData.description}
//                       onChange={handleInputChange}
//                       placeholder="Please provide any additional details about your cancellation request..."
//                     />
//                   </Form.Group>

//                   <div className="d-grid">
//                     <Button
//                       type="submit"
//                       variant="danger"
//                       disabled={submitting}
//                       className="btn-lg"
//                     >
//                       {submitting ? (
//                         <>
//                           <Spinner animation="border" size="sm" className="me-2" />
//                           Submitting...
//                         </>
//                       ) : (
//                         <>
//                           <FontAwesomeIcon icon={faTimes} className="me-2" />
//                           Submit Cancellation Request
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                 </Form>
//               </Card.Body>
//             </Card>
//           </Col>

//           <Col lg={4}>
//             <Card>
//               <Card.Header>
//                 <h6 className="mb-0">Order Summary</h6>
//               </Card.Header>
//               <Card.Body>
//                 {order && (
//                   <div className="mb-3">
//                     <strong>Order ID:</strong> {order.orderNumber || order.id}
//                     <br />
//                     <strong>Order Date:</strong> {new Date(order.createdAt?.toDate?.() || order.createdAt).toLocaleDateString()}
//                     <br />
//                     <strong>Order Status:</strong> <span className="text-capitalize">{order.status}</span>
//                     <br />
//                     <strong>Delivery Status:</strong> <span className="text-capitalize">{order.deliveryStatus || 'Pending'}</span>
//                   </div>
//                 )}

//                 {product && (
//                   <div className="mb-3">
//                     <strong>Product:</strong> {product.productName}
//                     <br />
//                     <strong>Quantity:</strong> {product.quantity}
//                     <br />
//  <strong>Price:</strong> {formatPrice(extractProductPrice(product))}                  </div>
//                 )}

//                 <Alert variant="info" className="mb-0">
//                   <small>
//                     <strong>Note:</strong> Cancellation requests are reviewed by our team. 
//                     You'll be notified of the decision within 24-48 hours.
//                   </small>
//                 </Alert>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </UserLayout>
//   );
// };

// export default CancelOrder;

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faArrowLeft, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../contexts/UserAuthContext';
import axios from 'axios';
import UserLayout from '../layouts/UserLayout';

const CancelOrder = () => {
  const { orderId } = useParams(); // REMOVED productId - now whole order
  const navigate = useNavigate();
  const { user } = useUserAuth();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    cancelReason: '',
    description: ''
  });

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

  // UPDATED: Extract price for individual items
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
    if (user) {
      loadOrder();
    }
  }, [user, orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch order details
      const orderResponse = await axios.get(`/api/orders/${orderId}`);
      
      if (orderResponse.data && orderResponse.data.order) {
        const orderData = orderResponse.data.order;
        setOrder(orderData);
      } else {
        setError('Order not found. Please check the URL and try again.');
      }
    } catch (error) {
      console.error('Error loading order:', error);
      setError('Failed to load order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.cancelReason.trim()) {
      setError('Please provide a cancellation reason.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const response = await axios.post('/api/return-requests/cancel-order', {
        orderId, // REMOVED productId
        cancelReason: formData.cancelReason,
        description: formData.description
      });

      if (response.data.success) {
        setSuccess('Order cancellation request submitted successfully!');
        setTimeout(() => {
          navigate('/account');
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to submit cancellation request.');
      }
    } catch (error) {
      console.error('Error submitting cancellation request:', error);
      setError(error.response?.data?.message || 'Error submitting cancellation request');
    } finally {
      setSubmitting(false);
    }
  };

  const canCancelOrder = () => {
    if (!order) return false;
    
    // Check if order is already delivered or cancelled
    if (order.status === 'delivered' || order.deliveryStatus === 'delivered' || order.status === 'cancelled') {
      return false;
    }
    
    return true;
  };

  if (loading) {
    return (
      <UserLayout>
        <Container className="py-5">
          <div className="text-center">
            <Spinner animation="border" role="status" className="text-primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Loading order details...</p>
          </div>
        </Container>
      </UserLayout>
    );
  }

  if (error && !order) {
    return (
      <UserLayout>
        <Container className="py-5">
          <Card className="border-danger">
            <Card.Header className="bg-danger text-white">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
              Error Loading Order
            </Card.Header>
            <Card.Body>
              <Alert variant="danger">
                <strong>Error:</strong> {error}
              </Alert>
              
              <div className="mt-4">
                <Button variant="outline-primary" className="me-2" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
                <Button variant="outline-secondary" className="me-2" onClick={() => navigate('/account')}>
                  Back to My Account
                </Button>
                <Button variant="outline-info" onClick={() => navigate('/')}>
                  Go to Home
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </UserLayout>
    );
  }

  if (!canCancelOrder()) {
    return (
      <UserLayout>
        <Container className="py-5">
          <Card className="border-warning">
            <Card.Header className="bg-warning text-dark">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
              Order Cannot Be Cancelled
            </Card.Header>
            <Card.Body>
              <Alert variant="warning">
                <strong>This order cannot be cancelled.</strong>
                {order?.status === 'delivered' || order?.deliveryStatus === 'delivered' ? (
                  <p className="mb-0 mt-2">This order has already been delivered. If you need to return products, please use the return request feature instead.</p>
                ) : order?.status === 'cancelled' ? (
                  <p className="mb-0 mt-2">This order has already been cancelled.</p>
                ) : (
                  <p className="mb-0 mt-2">This order is not eligible for cancellation.</p>
                )}
              </Alert>
              
              <div className="mt-4">
                <Button variant="outline-secondary" className="me-2" onClick={() => navigate('/account')}>
                  Back to My Account
                </Button>
                <Button variant="outline-info" onClick={() => navigate('/')}>
                  Go to Home
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <Container className="py-5">
        <div className="mb-4">
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate('/account')}
            className="mb-3"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Back to My Account
          </Button>
          
          <h1 className="mb-3">Cancel Order</h1>
          <p className="text-muted">
            You can only cancel orders before they are delivered. This will cancel all items in the order.
          </p>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <Row>
          <Col lg={8}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Cancellation Request Form</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Cancellation Reason <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      name="cancelReason"
                      value={formData.cancelReason}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a reason</option>
                      <option value="Changed my mind">Changed my mind</option>
                      <option value="Found better price elsewhere">Found better price elsewhere</option>
                      <option value="Ordered by mistake">Ordered by mistake</option>
                      <option value="No longer needed">No longer needed</option>
                      <option value="Shipping too slow">Shipping too slow</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Additional Description (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Please provide any additional details about your cancellation request..."
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="danger"
                      disabled={submitting}
                      className="btn-lg"
                    >
                      {submitting ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faTimes} className="me-2" />
                          Submit Cancellation Request for Entire Order
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card>
              <Card.Header>
                <h6 className="mb-0">Order Summary</h6>
              </Card.Header>
              <Card.Body>
                {order && (
                  <div className="mb-3">
                    <strong>Order ID:</strong> {order.orderNumber || order.id}
                    <br />
                    <strong>Order Date:</strong> {new Date(order.createdAt?.toDate?.() || order.createdAt).toLocaleDateString()}
                    <br />
                    <strong>Order Status:</strong> <span className="text-capitalize">{order.status}</span>
                    <br />
                    <strong>Delivery Status:</strong> <span className="text-capitalize">{order.deliveryStatus || 'Pending'}</span>
                    <br />
                    <strong>Total Items:</strong> {order.totalItems || order.items?.length || 0}
                    <br />
                    <strong>Total Amount:</strong> {formatPrice(order.finalAmount)}
                  </div>
                )}

                {/* UPDATED: Show all products in the order */}
                {order && order.items && order.items.length > 0 && (
                  <div className="mb-3">
                    <strong>Items in Order:</strong>
                    <ul className="list-unstyled small">
                      {order.items.map((item, index) => (
                        <li key={index} className="border-bottom pb-1 mb-1">
                          <div className="d-flex justify-content-between">
                            <span>{item.productName} (x{item.quantity})</span>
                            <span>{formatPrice(extractItemTotal(item))}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Alert variant="info" className="mb-0">
                  <small>
                    <strong>Note:</strong> This will cancel the entire order ({order?.items?.length || 0} items). 
                    Cancellation requests are reviewed by our team. 
                    You'll be notified of the decision within 24-48 hours.
                  </small>
                </Alert>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </UserLayout>
  );
};

export default CancelOrder;