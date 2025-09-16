import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faInfoCircle, faCheck, faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useUserAuth } from '../contexts/UserAuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ReturnRequest = () => {
  const { user, isAuthenticated } = useUserAuth();
  const navigate = useNavigate();
  const { orderId, productId } = useParams();
  
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [product, setProduct] = useState(null);
  const [returnPolicy, setReturnPolicy] = useState(null);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [returnForm, setReturnForm] = useState({
    returnReason: '',
    description: '',
    condition: 'good',
    images: [],
    // Add new tick/check options
    returnOptions: {
      originalPackaging: false,
      tagsAttached: false,
      receiptIncluded: false,
      damagedInTransit: false,
      wrongSize: false,
      qualityIssue: false
    }
  });

  const returnReasons = [
    'Defective Product',
    'Wrong Item Received',
    'Size/Color Not as Expected',
    'Quality Issues',
    'Damaged in Transit',
    'Not Satisfied',
    'Other'
  ];

  const productConditions = [
    { value: 'excellent', label: 'Excellent - Like new, unused' },
    { value: 'good', label: 'Good - Minor wear, fully functional' },
    { value: 'fair', label: 'Fair - Some wear, functional' },
    { value: 'poor', label: 'Poor - Significant wear/damage' }
  ];
  const returnOptions = [
    { key: 'originalPackaging', label: 'Product is in original packaging', icon: '��' },
    { key: 'tagsAttached', label: 'All tags and labels are still attached', icon: '🏷️' },
    { key: 'receiptIncluded', label: 'Original receipt/packing slip included', icon: '🧾' },
    { key: 'damagedInTransit', label: 'Product was damaged during shipping', icon: '📦💥' },
    { key: 'wrongSize', label: 'Received wrong size/color', icon: '👕' }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (orderId && productId) {
      loadOrderAndProduct();
      loadReturnPolicy();
    }
  }, [isAuthenticated, orderId, productId, navigate]);

//   const loadOrderAndProduct = async () => {
//     try {
//       setLoading(true);
//       console.log('Loading order with ID:', orderId);
//       console.log('Looking for product with ID:', productId);
      
//       const response = await axios.get(`/api/orders/${orderId}`);
//               console.log('Order API response:', response.data);
        
//         if (response.data.success) {
//           const orderData = response.data.order;
//           setOrder(orderData);
//           console.log('Order data:', orderData);
//           console.log('Order items:', orderData.items);
          
//           // Log each item's structure to see what fields are available
//           orderData.items.forEach((item, index) => {
//             console.log(`Item ${index}:`, {
//               item: item,
//               keys: Object.keys(item),
//               productId: item.productId,
//               _id: item._id,
//               id: item.id,
//               productName: item.productName,
//               // Log the raw values to see what's actually stored
//               rawProductId: item.productId,
//               rawId: item.id,
//               raw_id: item._id
//             });
//           });
        
//         // Find the specific product in the order
//         console.log('Searching for product with ID:', productId, 'Type:', typeof productId);
//         console.log('Order items:', orderData.items);
//         console.log('Item productId types:', orderData.items.map(item => ({ 
//           productId: item.productId, 
//           type: typeof item.productId,
//           productName: item.productName 
//         })));
        
//         // Try to find the product with different possible field names
//         let productItem = null;
        
//         // First try exact match with productId
//         productItem = orderData.items.find(item => {
//           console.log('Comparing productId:', item.productId, '===', productId, 'Result:', item.productId === productId);
//           return item.productId === productId;
//         });
        
//         // If not found, try other possible field names
//         if (!productItem) {
//           console.log('Trying _id field...');
//           productItem = orderData.items.find(item => {
//             console.log('Comparing _id:', item._id, '===', productId, 'Result:', item._id === productId);
//             return item._id === productId;
//           });
//           if (productItem) console.log('Found with _id field');
//         }
        
//         if (!productItem) {
//           console.log('Trying id field...');
//           productItem = orderData.items.find(item => {
//             console.log('Comparing id:', item.id, '===', productId, 'Result:', item.id === productId);
//             return item.id === productId;
//           });
//           if (productItem) console.log('Found with id field');
//         }
        
//         // If still not found, try string comparison for all fields
//         if (!productItem) {
//           console.log('Trying string comparison for all fields...');
//           productItem = orderData.items.find(item => {
//             const itemProductId = String(item.productId || '');
//             const itemId = String(item._id || '');
//             const itemSimpleId = String(item.id || '');
//             const searchId = String(productId);
            
//             console.log('String comparison:', {
//               itemProductId,
//               itemId,
//               itemSimpleId,
//               searchId,
//               matchProductId: itemProductId === searchId,
//               matchId: itemId === searchId,
//               matchSimpleId: itemSimpleId === searchId
//             });
            
//             return itemProductId === searchId || itemId === searchId || itemSimpleId === searchId;
//           });
//           if (productItem) console.log('Found with string comparison');
//         }
        
//         console.log('Found product item:', productItem);
        
//         if (productItem) {
//           setProduct(productItem);
//         } else {
//           console.error('Product not found in order items');
//           console.error('Available product IDs:', orderData.items.map(item => item.productId));
          
//           // Fallback: if no specific product found, use the first item
//           if (orderData.items && orderData.items.length > 0) {
//             console.log('Using fallback: first available product');
//             setProduct(orderData.items[0]);
//             setMessage({ 
//               type: 'warning', 
//               text: 'Specific product not found, but showing return form for the first item in your order.' 
//             });
//           } else {
//             setMessage({ type: 'danger', text: 'No products found in the specified order.' });
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error loading order:', error);
//       setMessage({ type: 'danger', text: 'Error loading order details: ' + error.response?.data?.message || error.message });
//     } finally {
//       setLoading(false);
//     }
//   };

  const findProductInOrder = (orderItems, searchProductId) => {
    if (!orderItems || !Array.isArray(orderItems)) {
      console.error('Order items is not an array:', orderItems);
      return null;
    }
  
    console.log('Searching for product ID:', searchProductId);
    console.log('Available order items:', orderItems);
  
    // Try multiple search strategies
    let productItem = null;
  
    // Strategy 1: Direct field match (exact)
    productItem = orderItems.find(item => 
      item.productId === searchProductId || 
      item._id === searchProductId || 
      item.id === searchProductId
    );
  
    if (productItem) {
      console.log('Found product with direct match:', productItem);
      return productItem;
    }
  
    // Strategy 2: String comparison (exact)
    productItem = orderItems.find(item => {
      const itemFields = [
        String(item.productId || ''),
        String(item._id || ''),
        String(item.id || '')
      ];
      const searchId = String(searchProductId);
      
      return itemFields.some(field => field === searchId);
    });
  
    if (productItem) {
      console.log('Found product with string comparison:', productItem);
      return productItem;
    }
  
    // Strategy 3: Case-insensitive comparison
    productItem = orderItems.find(item => {
      const itemFields = [
        String(item.productId || '').toLowerCase(),
        String(item._id || '').toLowerCase(),
        String(item.id || '').toLowerCase()
      ];
      const searchId = String(searchProductId).toLowerCase();
      
      return itemFields.some(field => field === searchId);
    });
  
    if (productItem) {
      console.log('Found product with case-insensitive comparison:', productItem);
      return productItem;
    }
  
    // Strategy 4: Partial match (fallback)
    productItem = orderItems.find(item => {
      const itemFields = [
        String(item.productId || ''),
        String(item._id || ''),
        String(item.id || '')
      ];
      const searchId = String(searchProductId);
      
      return itemFields.some(field => 
        field.includes(searchId) || 
        searchId.includes(field) ||
        field.startsWith(searchId) ||
        searchId.startsWith(field)
      );
    });
  
    if (productItem) {
      console.log('Found product with partial match:', productItem);
      return productItem;
    }
  
    // Strategy 5: Check if any item has a similar structure
    console.log('No product found with any search strategy');
    console.log('Available product structures:', orderItems.map(item => ({
      productId: item.productId,
      _id: item._id,
      id: item.id,
      productName: item.productName
    })));
    
    return null;
  };
  
  // Update the loadOrderAndProduct function to use this
  const loadOrderAndProduct = async () => {
    try {
      setLoading(true);
      console.log('Loading order with ID:', orderId);
      console.log('Looking for product with ID:', productId);
      
      const response = await axios.get(`/api/orders/${orderId}`);
      console.log('Order API response:', response.data);
      
      // Check if order data exists in response
      if (response.data && response.data.order) {
        const orderData = response.data.order;
        setOrder(orderData);
        console.log('Order data loaded successfully:', orderData);
        
        // Check if order has items
        if (!orderData.items || orderData.items.length === 0) {
          console.error('Order has no items');
          setMessage({ type: 'danger', text: 'Order has no items to return.' });
          setLoading(false);
          return;
        }
        
        console.log('Order items found:', orderData.items);
        
        // Use the improved product search
        const foundProduct = findProductInOrder(orderData.items, productId);
        
        if (foundProduct) {
          setProduct(foundProduct);
          console.log('Product found and set:', foundProduct);
        } else {
          // Fallback to first item with warning
          console.log('Using fallback: first available product');
          setProduct(orderData.items[0]);
          setMessage({ 
            type: 'warning', 
            text: 'Specific product not found, but showing return form for the first item in your order.' 
          });
        }
      } else {
        console.error('Order data not found in response:', response.data);
        setMessage({ type: 'danger', text: 'Order data not found in response.' });
      }
    } catch (error) {
      console.error('Error loading order:', error);
      if (error.response?.status === 404) {
        setMessage({ type: 'danger', text: 'Order not found. Please check the order ID and try again.' });
      } else {
        setMessage({ type: 'danger', text: 'Error loading order details: ' + (error.response?.data?.message || error.message) });
      }
    } finally {
      setLoading(false);
    }
  };
  
  const loadReturnPolicy = async () => {
    try {
      console.log('Loading return policy...');
      const response = await axios.get('/api/return-policy');
      console.log('Return policy response:', response.data);
      if (response.data.success) {
        setReturnPolicy(response.data.policy);
      }
    } catch (error) {
      console.error('Error loading return policy:', error);
      // Don't fail the entire form if return policy fails to load
      setMessage({ 
        type: 'warning', 
        text: 'Return policy could not be loaded, but you can still submit your return request.' 
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!returnForm.returnReason.trim()) {
      setMessage({ type: 'warning', text: 'Please select a return reason.' });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/return-requests', {
        orderId,
        productId,
        returnReason: returnForm.returnReason,
        description: returnForm.description,
        condition: returnForm.condition,
        images: returnForm.images
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Return request submitted successfully! We will review and get back to you soon.' });
        // Redirect to orders page after a delay
        setTimeout(() => navigate('/account'), 3000);
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'Error submitting return request: ' + error.response?.data?.message || error.message });
    } finally {
      setLoading(false);
    }
  };

  const isProductReturnable = () => {
    if (!returnPolicy || !product) return false;
    
    // Check if product category is non-returnable
    if (returnPolicy.nonReturnableCategories.includes(product.category?.toLowerCase())) {
      return false;
    }

    // Check if return window has passed
    const orderDate = new Date(order?.createdAt);
    const currentDate = new Date();
    const daysDiff = Math.floor((currentDate - orderDate) / (1000 * 60 * 60 * 24));
    
    return daysDiff <= returnPolicy.returnWindow;
  };

  const getReturnWindowText = () => {
    if (!returnPolicy) return '';
    
    const unit = returnPolicy.returnWindowUnit === 'days' ? 'day(s)' : 'week(s)';
    return `${returnPolicy.returnWindow} ${unit}`;
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading return request form...</p>
        </div>
      </Container>
    );
  }

  if (!order || !product) {
    return (
      <Container className="py-5">
        <Card>
          <Card.Body className="text-center py-5">
            <FontAwesomeIcon icon={faExclamationTriangle} size="3x" className="text-danger mb-3" />
            <h4>Order or Product Not Found</h4>
            <p className="text-muted mb-4">
              We couldn't find the order or product you're looking for. This could be due to:
            </p>
            <ul className="text-start text-muted mb-4">
              <li>The order ID in the URL is incorrect</li>
              <li>The product ID in the URL is incorrect</li>
              <li>The order has been deleted or expired</li>
              <li>You don't have permission to access this order</li>
            </ul>
            
            {/* Debug Information */}
            <div className="text-start bg-light p-3 rounded mb-4">
              <h6 className="text-muted">Debug Information:</h6>
              <p className="mb-1"><strong>Order ID from URL:</strong> {orderId}</p>
              <p className="mb-1"><strong>Product ID from URL:</strong> {productId}</p>
              {order && (
                <p className="mb-1"><strong>Order Found:</strong> Yes (Order #{order.orderNumber})</p>
              )}
              {order && order.items && (
                <div>
                  <p className="mb-1"><strong>Order Items:</strong> {order.items.length} items</p>
                  <p className="mb-1"><strong>Available Product IDs:</strong></p>
                  <ul className="small text-muted">
                    {order.items.map((item, index) => (
                      <li key={index}>
                        Item {index + 1}: {item.productName || 'Unknown'} 
                        (ID: {item.productId || item._id || item.id || 'No ID'})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="d-flex gap-3 justify-content-center">
              <Button variant="primary" onClick={() => window.location.reload()}>
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                Try Again
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate('/account')}>
                Back to My Account
              </Button>
              <Button variant="outline-primary" onClick={() => navigate('/')}>
                Go to Home
              </Button>
            </div>
            {message.text && (
              <Alert variant={message.type} className="mt-4">
                {message.text}
              </Alert>
            )}
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (!isProductReturnable()) {
    return (
      <Container className="py-5">
        <Card>
          <Card.Body className="text-center py-5">
            <FontAwesomeIcon icon={faTimes} size="3x" className="text-danger mb-3" />
            <h4>Product Not Eligible for Return</h4>
            <p className="text-muted mb-4">
              This product cannot be returned due to one of the following reasons:
            </p>
            <ul className="text-start text-muted">
              {product.category && returnPolicy?.nonReturnableCategories.includes(product.category.toLowerCase()) && (
                <li>Product category ({product.category}) is non-returnable</li>
              )}
              {returnPolicy && (
                <li>Return window of {getReturnWindowText()} has expired</li>
              )}
            </ul>
            <Button variant="primary" onClick={() => navigate('/account')}>
              Back to My Account
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">
                <FontAwesomeIcon icon={faUndo} className="me-2" />
                Return Request
              </h4>
            </Card.Header>
            <Card.Body>
              {message.text && (
                <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
                  {message.text}
                </Alert>
              )}

              {/* Order and Product Summary */}
              <Card className="mb-4 border-light">
                <Card.Body>
                  <h6 className="mb-3">Order & Product Details</h6>
                  <Row>
                    <Col md={4}>
                      <img 
                        src={product.productImage || '/Ayur4life_logo_round_png-01.png'} 
                        alt={product.productName}
                        className="img-fluid rounded"
                        style={{ maxHeight: '120px' }}
                      />
                    </Col>
                    <Col md={8}>
                      <h6>{product.productName}</h6>
                      <p className="text-muted mb-1">Order: #{order.orderNumber}</p>
                      <p className="text-muted mb-1">Ordered: {
                        order.createdAt ? 
                          (order.createdAt.toDate ? 
                            order.createdAt.toDate().toLocaleDateString() : 
                            new Date(order.createdAt).toLocaleDateString()) : 
                          'N/A'
                      }</p>
                      <p className="text-muted mb-1">Quantity: {product.quantity}</p>
                      <p className="text-muted mb-0">Price: ₹{product.productPrice}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Return Policy Info */}
              <Card className="mb-4 border-info">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0 text-info">
                      <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                      Return Policy
                    </h6>
                    <Button 
                      variant="outline-info" 
                      size="sm"
                      onClick={() => setShowPolicyModal(true)}
                    >
                      View Full Policy
                    </Button>
                  </div>
                  <div className="row text-muted small">
                    <div className="col-md-6">
                      <p className="mb-1"><strong>Return Window:</strong> {getReturnWindowText()}</p>
                      <p className="mb-1"><strong>Refund Method:</strong> {returnPolicy?.refundMethod?.replace('_', ' ').toUpperCase()}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1"><strong>Return Shipping:</strong> {returnPolicy?.returnShipping?.replace('_', ' ').toUpperCase()}</p>
                      {returnPolicy?.restockingFee > 0 && (
                        <p className="mb-1"><strong>Restocking Fee:</strong> {returnPolicy.restockingFee}%</p>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Return Request Form */}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Return Reason <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={returnForm.returnReason}
                    onChange={(e) => setReturnForm(prev => ({ ...prev, returnReason: e.target.value }))}
                    required
                  >
                    <option value="">Select a reason</option>
                    {returnReasons.map((reason) => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Detailed Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Please provide detailed information about why you want to return this product..."
                    value={returnForm.description}
                    onChange={(e) => setReturnForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <Form.Text className="text-muted">
                    The more details you provide, the faster we can process your return.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Product Condition</Form.Label>
                  <Form.Select
                    value={returnForm.condition}
                    onChange={(e) => setReturnForm(prev => ({ ...prev, condition: e.target.value }))}
                  >
                    {productConditions.map((condition) => (
                      <option key={condition.value} value={condition.value}>
                        {condition.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>


                <div className="d-grid gap-2">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Return Request'}
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate('/account')}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Return Policy Modal */}
      <Modal show={showPolicyModal} onHide={() => setShowPolicyModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Return Policy Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {returnPolicy ? (
            <div>
              <h6>Return Window</h6>
              <p>You can return products within {getReturnWindowText()} of receiving your order.</p>
              
              <h6>Return Conditions</h6>
              <ul>
                {returnPolicy.returnConditions.map((condition, index) => (
                  <li key={index}>{condition}</li>
                ))}
              </ul>
              
              <h6>Non-Returnable Items</h6>
              <p>The following categories are not eligible for returns:</p>
              <div className="mb-3">
                {returnPolicy.nonReturnableCategories.map((category, index) => (
                  <Badge key={index} bg="warning" text="dark" className="me-2">
                    {category}
                  </Badge>
                ))}
              </div>
              
              <h6>Refund Process</h6>
              <p>Refunds will be processed using the {returnPolicy.refundMethod.replace('_', ' ')} method.</p>
              
              <h6>Return Shipping</h6>
              <p>Return shipping is {returnPolicy.returnShipping.replace('_', ' ')}.</p>
              
              {returnPolicy.restockingFee > 0 && (
                <>
                  <h6>Restocking Fee</h6>
                  <p>A {returnPolicy.restockingFee}% restocking fee may apply to certain returns.</p>
                </>
              )}
            </div>
          ) : (
            <p>Loading return policy...</p>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ReturnRequest;