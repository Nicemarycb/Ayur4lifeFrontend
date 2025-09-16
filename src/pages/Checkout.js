// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCreditCard, faLock, faShieldAlt, faTruck } from '@fortawesome/free-solid-svg-icons';
// import { useCart } from '../contexts/CartContext';
// import axios from 'axios';
// import UserLayout from '../layouts/UserLayout';
// import { useUserAuth } from '../contexts/UserAuthContext';

// const Checkout = () => {
//   const navigate = useNavigate();
//   const { cart, calculateTotals, clearCart } = useCart();
//   const { user } = useUserAuth();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [orderPlaced, setOrderPlaced] = useState(false);
//   const [orderId, setOrderId] = useState(null);

//   const { subtotal, gst, total, totalItems } = calculateTotals();

//   const [formData, setFormData] = useState({
//     firstName: user?.firstName || '',
//     lastName: user?.lastName || '',
//     email: user?.email || '',
//     phone: user?.phone || '',
//     address: {
//       street: user?.address?.street || '',
//       city: user?.address?.city || '',
//       state: user?.address?.state || '',
//       zipCode: user?.address?.zipCode || '',
//     },
//     paymentMethod: 'cod',
//     notes: ''
//   });

//   const [formErrors, setFormErrors] = useState({});

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setFormData(prev => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: value
//         }
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
    
//     // Clear error when user starts typing
//     if (formErrors[name]) {
//       setFormErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const errors = {};
    
//     if (!formData.firstName.trim()) errors.firstName = 'First name is required';
//     if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
//     if (!formData.email.trim()) errors.email = 'Email is required';
//     if (!formData.phone.trim()) errors.phone = 'Phone number is required';
//     if (!formData.address.street.trim()) errors['address.street'] = 'Street address is required';
//     if (!formData.address.city.trim()) errors['address.city'] = 'City is required';
//     if (!formData.address.state.trim()) errors['address.state'] = 'State is required';
//     if (!formData.address.zipCode.trim()) errors['address.zipCode'] = 'ZIP code is required';

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const orderData = {
//         items: cart.map(item => ({
//           productId: item.product.id,
//           quantity: item.quantity,
//           price: item.product.price,
//           name: item.product.name
//         })),
//         shippingAddress: formData.address,
//         billingAddress: formData.address,
//         paymentMethod: formData.paymentMethod,
//         notes: formData.notes,
//         subtotal,
//         gst,
//         total
//       };

//       const response = await axios.post('/api/orders', orderData);
//       setOrderId(response.data.orderId);
//       setOrderPlaced(true);
//       await clearCart();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to place order');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (cart.length === 0 && !orderPlaced) {
//     navigate('/cart');
//     return null;
//   }

//   if (orderPlaced) {
//     return (
//       <UserLayout>
//       <Container className="py-5">
//         <div className="text-center">
//           <div className="mb-4">
//             <FontAwesomeIcon icon={faShieldAlt} size="4x" className="text-success" />
//           </div>
//           <h1 className="text-success mb-3">Order Placed Successfully!</h1>
//           <p className="lead mb-4">
//             Thank you for your order. Your order number is: <strong>{orderId}</strong>
//           </p>
//           <p className="text-muted mb-4">
//             We'll send you an email confirmation with order details and tracking information.
//           </p>
//           <div className="d-flex gap-3 justify-content-center">
//             <Button variant="primary" onClick={() => navigate('/')}>
//               Continue Shopping
//             </Button>
//             <Button variant="outline-primary" onClick={() => navigate('/account')}>
//               View Orders
//             </Button>
//           </div>
//         </div>
//       </Container>
//       </UserLayout>
//     );
//   }

//   return (
//     <UserLayout>
//     <Container className="py-5">
//       <h1 className="mb-4">Checkout</h1>
      
//       {error && (
//         <Alert variant="danger" className="mb-4">
//           {error}
//         </Alert>
//       )}

//       <Form onSubmit={handleSubmit}>
//         <Row>
//           <Col lg={8}>
//             {/* Shipping Information */}
//             <Card className="mb-4">
//               <Card.Header>
//                 <h5 className="mb-0">
//                   <FontAwesomeIcon icon={faTruck} className="me-2" />
//                   Shipping Information
//                 </h5>
//               </Card.Header>
//               <Card.Body>
//                 <Row>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>First Name *</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="firstName"
//                         value={formData.firstName}
//                         onChange={handleInputChange}
//                         isInvalid={!!formErrors.firstName}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {formErrors.firstName}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Last Name *</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="lastName"
//                         value={formData.lastName}
//                         onChange={handleInputChange}
//                         isInvalid={!!formErrors.lastName}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {formErrors.lastName}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//                 <Row>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Email *</Form.Label>
//                       <Form.Control
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         isInvalid={!!formErrors.email}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {formErrors.email}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Phone *</Form.Label>
//                       <Form.Control
//                         type="tel"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleInputChange}
//                         isInvalid={!!formErrors.phone}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {formErrors.phone}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Street Address *</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="address.street"
//                     value={formData.address.street}
//                     onChange={handleInputChange}
//                     isInvalid={!!formErrors['address.street']}
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {formErrors['address.street']}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//                 <Row>
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>City *</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="address.city"
//                         value={formData.address.city}
//                         onChange={handleInputChange}
//                         isInvalid={!!formErrors['address.city']}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {formErrors['address.city']}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>State *</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="address.state"
//                         value={formData.address.state}
//                         onChange={handleInputChange}
//                         isInvalid={!!formErrors['address.state']}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {formErrors['address.state']}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>ZIP Code *</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="address.zipCode"
//                         value={formData.address.zipCode}
//                         onChange={handleInputChange}
//                         isInvalid={!!formErrors['address.zipCode']}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {formErrors['address.zipCode']}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>

//             {/* Payment Method */}
//             <Card className="mb-4">
//               <Card.Header>
//                 <h5 className="mb-0">
//                   <FontAwesomeIcon icon={faCreditCard} className="me-2" />
//                   Payment Method
//                 </h5>
//               </Card.Header>
//               <Card.Body>
//                 <Form.Group>
//                   <Form.Check
//                     type="radio"
//                     id="cod"
//                     name="paymentMethod"
//                     value="cod"
//                     checked={formData.paymentMethod === 'cod'}
//                     onChange={handleInputChange}
//                     label="Cash on Delivery (COD)"
//                   />
//                   <Form.Check
//                     type="radio"
//                     id="online"
//                     name="paymentMethod"
//                     value="online"
//                     checked={formData.paymentMethod === 'online'}
//                     onChange={handleInputChange}
//                     label="Online Payment (Credit/Debit Card)"
//                   />
//                 </Form.Group>
//               </Card.Body>
//             </Card>

//             {/* Order Notes */}
//             <Card className="mb-4">
//               <Card.Header>
//                 <h5 className="mb-0">Order Notes</h5>
//               </Card.Header>
//               <Card.Body>
//                 <Form.Group>
//                   <Form.Control
//                     as="textarea"
//                     rows={3}
//                     name="notes"
//                     value={formData.notes}
//                     onChange={handleInputChange}
//                     placeholder="Any special instructions for delivery..."
//                   />
//                 </Form.Group>
//               </Card.Body>
//             </Card>
//           </Col>

//           <Col lg={4}>
//             {/* Order Summary */}
//             <Card className="sticky-top" style={{ top: '20px' }}>
//               <Card.Header>
//                 <h5 className="mb-0">Order Summary</h5>
//               </Card.Header>
//               <Card.Body>
//                 {cart.map((item) => (
//                   <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
//                     <div>
//                       <strong>{item.product.name}</strong>
//                       <br />
//                       <small className="text-muted">
//                         Qty: {item.quantity} × ₹{item.product.price}
//                       </small>
//                     </div>
//                     <strong>₹{(item.product.price * item.quantity).toFixed(2)}</strong>
//                   </div>
//                 ))}
                
//                 <hr />
                
//                 <div className="d-flex justify-content-between mb-2">
//                   <span>Subtotal ({totalItems} items):</span>
//                   <span>₹{subtotal.toFixed(2)}</span>
//                 </div>
//                 {gst > 0 && (
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>GST:</span>
//                     <span>₹{gst.toFixed(2)}</span>
//                   </div>
//                 )}
//                 <hr />
//                 <div className="d-flex justify-content-between mb-3">
//                   <strong>Total:</strong>
//                   <strong className="text-primary">₹{total.toFixed(2)}</strong>
//                 </div>
                
//                 <Button
//                   type="submit"
//                   variant="primary"
//                   size="lg"
//                   className="w-100"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <Spinner animation="border" size="sm" className="me-2" />
//                       Processing...
//                     </>
//                   ) : (
//                     <>
//                       <FontAwesomeIcon icon={faLock} className="me-2" />
//                       Place Order
//                     </>
//                   )}
//                 </Button>
                
//                 <div className="text-center mt-3">
//                   <small className="text-muted">
//                     <FontAwesomeIcon icon={faShieldAlt} className="me-1" />
//                     Secure checkout powered by Ayur4Life
//                   </small>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Form>
//     </Container>
//     </UserLayout>
//   );
// };

// export default Checkout;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faLock, faShieldAlt, faTruck } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';
import UserLayout from '../layouts/UserLayout';
import { useUserAuth } from '../contexts/UserAuthContext';
import CouponInput from '../components/CouponInput';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, calculateTotals, clearCart } = useCart();
  const { user } = useUserAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const { subtotal, sgst, cgst, gst, deliveryCharge, total, totalItems } = calculateTotals();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
    },
    paymentMethod: 'cod',
    notes: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Calculate final totals with coupon discount
  const calculateFinalTotals = () => {
    const baseSubtotal = subtotal;
    const baseDeliveryCharge = deliveryCharge;
    const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
    
    // Apply discount to subtotal
    const discountedSubtotal = Math.max(0, baseSubtotal - discountAmount);
    
    // Recalculate GST on the discounted subtotal (not proportionally)
    let finalSgst = 0;
    let finalCgst = 0;
    
    cart.forEach(item => {
      const itemSubtotal = item.product.price * item.quantity;
      const itemDiscountRatio = baseSubtotal > 0 ? discountedSubtotal / baseSubtotal : 0;
      const discountedItemSubtotal = itemSubtotal * itemDiscountRatio;
      
      const sgstRate = parseFloat(item.product.sgst || 0) / 100;
      const cgstRate = parseFloat(item.product.cgst || 0) / 100;
      
      finalSgst += discountedItemSubtotal * sgstRate;
      finalCgst += discountedItemSubtotal * cgstRate;
    });
    
    const finalGst = finalSgst + finalCgst;
    const finalTotal = discountedSubtotal + finalGst + baseDeliveryCharge;
    
    return {
      originalSubtotal: baseSubtotal,
      discountAmount,
      discountedSubtotal,
      sgst: finalSgst,
      cgst: finalCgst,
      gst: finalGst,
      deliveryCharge: baseDeliveryCharge,
      total: finalTotal
    };
  };

  const finalTotals = calculateFinalTotals();

  const handleCouponApplied = (couponData) => {
    setAppliedCoupon(couponData);
  };

  const handleCouponRemoved = () => {
    setAppliedCoupon(null);
  };

  useEffect(() => {
    // Navigate to cart page if the cart is empty
    if (cart.length === 0 && !orderPlaced) {
      navigate('/cart');
    }
  }, [cart, orderPlaced, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.address.street.trim()) errors['address.street'] = 'Street address is required';
    if (!formData.address.city.trim()) errors['address.city'] = 'City is required';
    if (!formData.address.state.trim()) errors['address.state'] = 'State is required';
    if (!formData.address.zipCode.trim()) errors['address.zipCode'] = 'ZIP code is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          name: item.product.name
        })),
        shippingAddress: formData.address,
        billingAddress: formData.address,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        subtotal: finalTotals.originalSubtotal,
        sgst: finalTotals.sgst,
        cgst: finalTotals.cgst,
        gst: finalTotals.gst,
        deliveryCharge: finalTotals.deliveryCharge,
        total: finalTotals.total,
        finalAmount: finalTotals.total,
        couponCode: appliedCoupon ? appliedCoupon.coupon.code : null,
        discountAmount: finalTotals.discountAmount
      };

      const response = await axios.post('/api/orders', orderData);
      setOrderId(response.data.orderId);
      setOrderPlaced(true);
      await clearCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <UserLayout>
      <Container className="py-5">
        <div className="text-center">
          <div className="mb-4">
            <FontAwesomeIcon icon={faShieldAlt} size="4x" className="text-success" />
          </div>
          <h1 className="text-success mb-3">Order Placed Successfully!</h1>
          <p className="lead mb-4">
            Thank you for your order. Your order number is: <strong>{orderId}</strong>
          </p>
          <p className="text-muted mb-4">
            We'll send you an email confirmation with order details and tracking information.
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Button variant="primary" onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
            <Button variant="primary" onClick={() => navigate('/account')}>
              View Orders
            </Button>
          </div>
        </div>
      </Container>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
    <Container className="py-5">
      <h1 className="mb-4">Checkout</h1>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={8}>
            {/* Shipping Information */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <FontAwesomeIcon icon={faTruck} className="me-2" />
                  Shipping Information
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.firstName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.firstName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
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
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.phone}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.phone}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Street Address *</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors['address.street']}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors['address.street']}
                  </Form.Control.Feedback>
                </Form.Group>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>City *</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors['address.city']}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors['address.city']}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>State *</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors['address.state']}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors['address.state']}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>ZIP Code *</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleInputChange}
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

            {/* Payment Method */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <FontAwesomeIcon icon={faCreditCard} className="me-2" />
                  Payment Method
                </h5>
              </Card.Header>
              <Card.Body>
                <Form.Group>
                  <Form.Check
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    label="Cash on Delivery (COD)"
                  />
                  <Form.Check
                    type="radio"
                    id="online"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === 'online'}
                    onChange={handleInputChange}
                    label="Online Payment (Credit/Debit Card)"
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Order Notes */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Order Notes</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any special instructions for delivery..."
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            {/* Order Summary */}
            <Card className="sticky-top" style={{ top: '20px' }}>
              <Card.Header>
                <h5 className="mb-0">Order Summary</h5>
              </Card.Header>
              <Card.Body>
                {/* Coupon Input */}
                <CouponInput
                  onCouponApplied={handleCouponApplied}
                  onCouponRemoved={handleCouponRemoved}
                  appliedCoupon={appliedCoupon}
                  orderAmount={subtotal}
                />
                
                <hr />
                {cart.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <strong>{item.product.name}</strong>
                      <br />
                      <small className="text-muted">
                        Qty: {item.quantity} × ₹{item.product.price}
                      </small>
                    </div>
                    <strong>₹{(item.product.price * item.quantity).toFixed(2)}</strong>
                  </div>
                ))}
                
                <hr />
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal ({totalItems} items):</span>
                  <span>₹{finalTotals.originalSubtotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Discount ({appliedCoupon.coupon.code}):</span>
                    <span>-₹{finalTotals.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {finalTotals.sgst > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>SGST:</span>
                    <span>₹{finalTotals.sgst.toFixed(2)}</span>
                  </div>
                )}
                {finalTotals.cgst > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>CGST:</span>
                    <span>₹{finalTotals.cgst.toFixed(2)}</span>
                  </div>
                )}
                {finalTotals.gst > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total GST:</span>
                    <span>₹{finalTotals.gst.toFixed(2)}</span>
                  </div>
                )}
                {finalTotals.deliveryCharge > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>Delivery:</span>
                    <span>₹{finalTotals.deliveryCharge.toFixed(2)}</span>
                  </div>
                )}
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total:</strong>
                  <strong className="text-primary">
                    ₹{finalTotals.total.toFixed(2)}
                  </strong>
                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faLock} className="me-2" />
                      Place Order
                    </>
                  )}
                </Button>
                
                <div className="text-center mt-3">
                  <small className="text-muted">
                    <FontAwesomeIcon icon={faShieldAlt} className="me-1" />
                    Secure checkout powered by Ayur4Life
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
    </UserLayout>
  );
};

export default Checkout;