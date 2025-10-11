// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Button, Alert, Spinner, Badge, Modal, Tabs, Tab } from 'react-bootstrap';
// import { Link, useNavigate } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { 
//   faTicketAlt, 
//   faCopy, 
//   faCheck, 
//   faTimes, 
//   faInfoCircle, 
//   faFire, 
//   faStar,
//   faClock,
//   faGift,
//   faShieldAlt,
//   faCalendarAlt,
//   faShoppingCart,
//   faTags,
//   faRocket
// } from '@fortawesome/free-solid-svg-icons';
// import UserLayout from '../layouts/UserLayout';
// import { useUserAuth } from '../contexts/UserAuthContext';
// import { useCart } from '../contexts/CartContext';
// import axios from 'axios';
// import './CouponPage.css';

// const CouponPage = () => {
//   const [coupons, setCoupons] = useState([]);
//   const [activeCoupons, setActiveCoupons] = useState([]);
//   const [expiringSoon, setExpiringSoon] = useState([]);
//   const [premiumCoupons, setPremiumCoupons] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [copiedCoupon, setCopiedCoupon] = useState(null);
//   const [selectedCoupon, setSelectedCoupon] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [activeTab, setActiveTab] = useState('all');
//   const { isAuthenticated } = useUserAuth();
//   const { calculateTotals } = useCart();
//   const navigate = useNavigate();

//   const { subtotal } = calculateTotals();

//   useEffect(() => {
//     fetchAvailableCoupons();
//   }, []);

//   const fetchAvailableCoupons = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await axios.get('/api/coupons/available?orderAmount=' + (subtotal || 0));
//       const allCoupons = response.data;
      
//       setCoupons(allCoupons);
      
//       // Filter coupons for different sections
//       const currentDate = new Date();
//       const soonDate = new Date();
//       soonDate.setDate(soonDate.getDate() + 3); // 3 days from now

//       const active = allCoupons.filter(coupon => 
//         (!coupon.validTo || new Date(coupon.validTo) > currentDate) &&
//         (!coupon.minOrderAmount || coupon.minOrderAmount <= (subtotal || 0))
//       );
      
//       const expiring = allCoupons.filter(coupon => 
//         coupon.validTo && 
//         new Date(coupon.validTo) > currentDate &&
//         new Date(coupon.validTo) <= soonDate
//       );
      
//       const premium = allCoupons.filter(coupon => 
//         coupon.discountValue >= (coupon.discountType === 'percentage' ? 20 : 200)
//       );

//       setActiveCoupons(active);
//       setExpiringSoon(expiring);
//       setPremiumCoupons(premium);
      
//     } catch (err) {
//       console.error('Failed to fetch coupons:', err);
//       setError('Failed to load available coupons');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCopyCode = (code) => {
//     navigator.clipboard.writeText(code);
//     setCopiedCoupon(code);
//     setTimeout(() => setCopiedCoupon(null), 2000);
//   };

//   const handleSelectCoupon = (coupon) => {
//     setSelectedCoupon(coupon);
//     setShowModal(true);
//   };

//   const handleApplyCoupon = () => {
//     if (selectedCoupon) {
//       localStorage.setItem('selectedCoupon', JSON.stringify(selectedCoupon));
//       setShowModal(false);
//       navigate('/checkout');
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'No expiry date';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const getTimeLeft = (dateString) => {
//     if (!dateString) return null;
//     const now = new Date();
//     const expiry = new Date(dateString);
//     const diffTime = expiry - now;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//     if (diffDays <= 0) return 'Expired';
//     if (diffDays === 1) return 'Expires today';
//     if (diffDays <= 3) return `Expires in ${diffDays} days`;
//     return null;
//   };

//   const getCouponBadge = (coupon) => {
//     if (coupon.discountType === 'percentage') {
//       return <Badge bg="success" className="coupon-discount-badge">{coupon.discountValue}% OFF</Badge>;
//     }
//     return <Badge bg="primary" className="coupon-discount-badge">₹{coupon.discountValue} OFF</Badge>;
//   };

//   const getCouponIcon = (coupon) => {
//     if (coupon.discountValue >= (coupon.discountType === 'percentage' ? 25 : 300)) {
//       return faRocket;
//     }
//     if (coupon.discountValue >= (coupon.discountType === 'percentage' ? 15 : 150)) {
//       return faFire;
//     }
//     return faGift;
//   };

//   const renderCouponCard = (coupon, index) => {
//     const timeLeft = getTimeLeft(coupon.validTo);
//     const isExpiringSoon = timeLeft && timeLeft.includes('Expires in');
    
//     return (
//       <Col key={coupon.id} lg={6} xl={4} className="mb-4">
//         <Card className={`h-100 coupon-card ${isExpiringSoon ? 'coupon-card-expiring' : ''}`}>
//           <Card.Body className="d-flex flex-column">
//             Coupon Header
//             <div className="coupon-header">
//               <div className="coupon-icon">
//                 <FontAwesomeIcon icon={getCouponIcon(coupon)} />
//               </div>
//               <div className="coupon-code-section">
//                 <h3 className="coupon-code">{coupon.code}</h3>
//                 {getCouponBadge(coupon)}
//               </div>
//             </div>

//             {/* Coupon Description */}
//             <div className="coupon-description">
//               <p>{coupon.description || 'Special discount offer'}</p>
//             </div>

//             {/* Coupon Details */}
//             <div className="coupon-details">
//               <div className="coupon-detail-item">
//                 <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
//                 <span>Min. order: ₹{coupon.minOrderAmount || 0}</span>
//               </div>
//               <div className="coupon-detail-item">
//                 <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
//                 <span>Valid until: {formatDate(coupon.validTo)}</span>
//               </div>
//               {coupon.potentialDiscount > 0 && (
//                 <div className="coupon-detail-item text-success">
//                   <FontAwesomeIcon icon={faGift} className="me-2" />
//                   <span>Save up to ₹{coupon.potentialDiscount}</span>
//                 </div>
//               )}
//             </div>

//             {/* Time Left Warning */}
//             {timeLeft && (
//               <div className={`time-left ${isExpiringSoon ? 'time-left-warning' : 'time-left-info'}`}>
//                 <FontAwesomeIcon icon={faClock} className="me-1" />
//                 {timeLeft}
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="coupon-actions mt-auto">
//               <div className="d-flex gap-2">
//                 <Button 
//                   variant="success" 
//                   className="flex-grow-1 apply-btn"
//                   onClick={() => handleSelectCoupon(coupon)}
//                 >
//                   Apply Coupon
//                 </Button>
//                 <Button 
//                   variant={copiedCoupon === coupon.code ? "outline-success" : "outline-primary"}
//                   className="copy-btn"
//                   onClick={() => handleCopyCode(coupon.code)}
//                 >
//                   <FontAwesomeIcon 
//                     icon={copiedCoupon === coupon.code ? faCheck : faCopy} 
//                   />
//                 </Button>
//               </div>
//             </div>
//           </Card.Body>
//         </Card>
//       </Col>
//     );
//   };

//   if (!isAuthenticated) {
//     return (
//       <UserLayout>
//         <Container className="py-5">
//           <div className="text-center">
//             <div className="auth-required-section">
//               <FontAwesomeIcon icon={faShieldAlt} size="4x" className="text-warning mb-3" />
//               <h3>Authentication Required</h3>
//               <p className="text-muted mb-4">Please log in to view and use available coupons</p>
//               <Button as={Link} to="/login" variant="warning" size="lg" className="me-3">
//                 Log In
//               </Button>
//               <Button as={Link} to="/register" variant="outline-warning" size="lg">
//                 Sign Up
//               </Button>
//             </div>
//           </div>
//         </Container>
//       </UserLayout>
//     );
//   }

//   if (loading) {
//     return (
//       <UserLayout>
//         <Container className="py-5">
//           <div className="text-center">
//             <Spinner animation="border" variant="success" size="lg" />
//             <p className="mt-3">Loading amazing deals for you...</p>
//           </div>
//         </Container>
//       </UserLayout>
//     );
//   }

//   return (
//     <UserLayout>
//       <div className="coupon-page">
//         {/* Hero Section */}
//         {/* <section className="coupon-hero">
//           <Container>
//             <div className="text-center text-white">
//               <FontAwesomeIcon icon={faTags} size="4x" className="mb-4 hero-icon" />
//               <h1 className="display-4 fw-bold mb-3">Exclusive Coupons & Deals</h1>
//               <p className="lead mb-4">Save big on your favorite Ayurvedic products with these special offers</p>
              
//               <div className="hero-stats">
//                 <div className="stat-item">
//                   <span className="stat-number">{coupons.length}</span>
//                   <span className="stat-label">Active Coupons</span>
//                 </div>
//                 <div className="stat-item">
//                   <span className="stat-number">₹{Math.max(...coupons.map(c => c.potentialDiscount))}</span>
//                   <span className="stat-label">Maximum Savings</span>
//                 </div>
//                 <div className="stat-item">
//                   <span className="stat-number">{expiringSoon.length}</span>
//                   <span className="stat-label">Expiring Soon</span>
//                 </div>
//               </div>

//               <div className="hero-actions">
//                 <Button as={Link} to="/checkout" variant="light" size="lg" className="me-3">
//                   <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
//                   Proceed to Checkout
//                 </Button>
//                 <Button as={Link} to="/all-products" variant="outline-light" size="lg">
//                   Continue Shopping
//                 </Button>
//               </div>
//             </div>
//           </Container>
//         </section> */}
//          <div className="text-center mb-5">
//           <FontAwesomeIcon icon={faTicketAlt} size="3x" className="text-success mb-3" />
//           <h1>Available Coupons</h1>
//           <p className="lead">Save more on your purchases with these exclusive coupons</p>
//           <Button as={Link} to="/checkout" variant="success" className="me-2">
//             Proceed to Checkout
//           </Button>
//           <Button as={Link} to="/all-products" variant="outline-success">
//             Continue Shopping
//           </Button>
//         </div>

//         {/* Main Content */}
//         <Container className="py-5">
//           {error && (
//             <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-4">
//               {error}
//             </Alert>
//           )}

//           {/* Tabs Navigation */}
//           <div className="coupon-tabs mb-5">
//             <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="custom-tabs">
//               <Tab eventKey="all" title={
//                 <span>
//                   <FontAwesomeIcon icon={faTags} className="me-2" />
//                   All Coupons ({coupons.length})
//                 </span>
//               }>
//                 {coupons.length === 0 ? (
//                   <EmptyState message="No coupons available at the moment. Check back later for new offers!" />
//                 ) : (
//                   <Row>
//                     {coupons.map(renderCouponCard)}
//                   </Row>
//                 )}
//               </Tab>

//               <Tab eventKey="active" title={
//                 <span>
//                   <FontAwesomeIcon icon={faCheck} className="me-2" />
//                   Active ({activeCoupons.length})
//                 </span>
//               }>
//                 {activeCoupons.length === 0 ? (
//                   <EmptyState message="No active coupons available for your current cart value." />
//                 ) : (
//                   <Row>
//                     {activeCoupons.map(renderCouponCard)}
//                   </Row>
//                 )}
//               </Tab>

//               <Tab eventKey="premium" title={
//                 <span>
//                   <FontAwesomeIcon icon={faStar} className="me-2" />
//                   Premium ({premiumCoupons.length})
//                 </span>
//               }>
//                 {premiumCoupons.length === 0 ? (
//                   <EmptyState message="No premium coupons available at the moment." />
//                 ) : (
//                   <Row>
//                     {premiumCoupons.map(renderCouponCard)}
//                   </Row>
//                 )}
//               </Tab>

//               <Tab eventKey="expiring" title={
//                 <span>
//                   <FontAwesomeIcon icon={faClock} className="me-2" />
//                   Expiring Soon ({expiringSoon.length})
//                 </span>
//               }>
//                 {expiringSoon.length === 0 ? (
//                   <EmptyState message="No coupons expiring soon. All offers are valid for a while!" />
//                 ) : (
//                   <Row>
//                     {expiringSoon.map(renderCouponCard)}
//                   </Row>
//                 )}
//               </Tab>
//             </Tabs>
//           </div>

//           {/* How to Use Section */}
//           <section className="how-to-use mb-5">
//             <Card className="border-0 shadow-sm">
//               <Card.Body className="p-4">
//                 <h3 className="text-center mb-4">How to Use Coupons</h3>
//                 <Row>
//                   <Col md={3} className="text-center">
//                     <div className="step-icon">
//                       <span>1</span>
//                       <FontAwesomeIcon icon={faCopy} />
//                     </div>
//                     <h5>Copy Code</h5>
//                     <p>Click the copy button to save the coupon code</p>
//                   </Col>
//                   <Col md={3} className="text-center">
//                     <div className="step-icon">
//                       <span>2</span>
//                       <FontAwesomeIcon icon={faShoppingCart} />
//                     </div>
//                     <h5>Add Products</h5>
//                     <p>Add products to your cart that meet the minimum order value</p>
//                   </Col>
//                   <Col md={3} className="text-center">
//                     <div className="step-icon">
//                       <span>3</span>
//                       <FontAwesomeIcon icon={faTicketAlt} />
//                     </div>
//                     <h5>Apply Coupon</h5>
//                     <p>Apply the code during checkout or use the Apply button</p>
//                   </Col>
//                   <Col md={3} className="text-center">
//                     <div className="step-icon">
//                       <span>4</span>
//                       <FontAwesomeIcon icon={faCheck} />
//                     </div>
//                     <h5>Save Money</h5>
//                     <p>Enjoy your discount on the order total</p>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>
//           </section>
//         </Container>

//         {/* Coupon Details Modal */}
//         <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg" className="coupon-modal">
//           <Modal.Header closeButton className="modal-header-custom">
//             <Modal.Title>
//               <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
//               Coupon Details
//             </Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             {selectedCoupon && (
//               <div className="coupon-modal-content">
//                 <div className="text-center mb-4">
//                   <div className="modal-coupon-badge">
//                     {getCouponBadge(selectedCoupon)}
//                   </div>
//                   <h2 className="text-primary">{selectedCoupon.code}</h2>
//                   <p className="lead">{selectedCoupon.description}</p>
//                 </div>
                
//                 <Row className="coupon-modal-details">
//                   <Col md={6}>
//                     <div className="detail-item">
//                       <strong>Discount Value:</strong>
//                       <span className="text-success">
//                         {selectedCoupon.discountType === 'percentage' 
//                           ? `${selectedCoupon.discountValue}% off` 
//                           : `₹${selectedCoupon.discountValue} off`
//                         }
//                       </span>
//                     </div>
//                   </Col>
//                   <Col md={6}>
//                     <div className="detail-item">
//                       <strong>Minimum Order:</strong>
//                       <span>₹{selectedCoupon.minOrderAmount || 'No minimum'}</span>
//                     </div>
//                   </Col>
//                   <Col md={6}>
//                     <div className="detail-item">
//                       <strong>Valid Until:</strong>
//                       <span>{formatDate(selectedCoupon.validTo)}</span>
//                     </div>
//                   </Col>
//                   <Col md={6}>
//                     <div className="detail-item">
//                       <strong>Potential Savings:</strong>
//                       <span className="text-success">₹{selectedCoupon.potentialDiscount}</span>
//                     </div>
//                   </Col>
//                 </Row>

//                 {selectedCoupon.minOrderAmount > (subtotal || 0) && (
//                   <Alert variant="warning" className="mt-3">
//                     <strong>Note:</strong> Add products worth ₹{selectedCoupon.minOrderAmount - (subtotal || 0)} more to use this coupon.
//                   </Alert>
//                 )}

//                 <div className="text-center mt-4">
//                   <Button variant="success" size="lg" onClick={handleApplyCoupon}>
//                     <FontAwesomeIcon icon={faCheck} className="me-2" />
//                     Apply This Coupon
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </Modal.Body>
//         </Modal>
//       </div>
//     </UserLayout>
//   );
// };

// // Empty State Component
// const EmptyState = ({ message }) => (
//   <div className="text-center py-5">
//     <FontAwesomeIcon icon={faTicketAlt} size="4x" className="text-muted mb-3" />
//     <h4>No coupons found</h4>
//     <p className="text-muted">{message}</p>
//   </div>
// );

// export default CouponPage;

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge, Modal, Tabs, Tab } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTicketAlt, 
  faCopy, 
  faCheck, 
  faTimes, 
  faInfoCircle, 
  faFire, 
  faStar,
  faClock,
  faGift,
  faShieldAlt,
  faCalendarAlt,
  faShoppingCart,
  faTags,
  faRocket,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import UserLayout from '../layouts/UserLayout';
import { useUserAuth } from '../contexts/UserAuthContext';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';
import './CouponPage.css';

const CouponPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [activeCoupons, setActiveCoupons] = useState([]);
  const [expiringSoon, setExpiringSoon] = useState([]);
  const [premiumCoupons, setPremiumCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedCoupon, setCopiedCoupon] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { isAuthenticated } = useUserAuth();
  const { calculateTotals } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const { subtotal } = calculateTotals();
  const fromCheckout = location.state?.fromCheckout;

  useEffect(() => {
    if (isAuthenticated) {
      fetchAvailableCoupons();
    }
  }, [isAuthenticated, subtotal]);

  const fetchAvailableCoupons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/coupons/available?orderAmount=' + (subtotal || 0));
      const allCoupons = response.data;
      
      setCoupons(allCoupons);
      
      // Filter coupons for different sections
      const currentDate = new Date();
      const soonDate = new Date();
      soonDate.setDate(soonDate.getDate() + 3); // 3 days from now

      const active = allCoupons.filter(coupon => coupon.isApplicable);
      
      const expiring = allCoupons.filter(coupon => 
        coupon.validTo && 
        new Date(coupon.validTo) > currentDate &&
        new Date(coupon.validTo) <= soonDate
      );
      
      const premium = allCoupons.filter(coupon => 
        coupon.discountValue >= (coupon.discountType === 'percentage' ? 20 : 200)
      );

      setActiveCoupons(active);
      setExpiringSoon(expiring);
      setPremiumCoupons(premium);
      
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
      setError('Failed to load available coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  const handleSelectCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    setShowModal(true);
  };

  const handleApplyCoupon = () => {
    if (selectedCoupon) {
      // Store coupon in localStorage for checkout page
      const couponData = {
        valid: true,
        coupon: selectedCoupon,
        discountAmount: selectedCoupon.potentialDiscount,
        finalAmount: subtotal - selectedCoupon.potentialDiscount
      };
      
      localStorage.setItem('selectedCoupon', JSON.stringify(couponData));
      setShowModal(false);
      
      if (fromCheckout) {
        navigate('/checkout');
      } else {
        navigate('/checkout', { state: { couponApplied: true } });
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No expiry date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeLeft = (dateString) => {
    if (!dateString) return null;
    const now = new Date();
    const expiry = new Date(dateString);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Expired';
    if (diffDays === 1) return 'Expires today';
    if (diffDays <= 3) return `Expires in ${diffDays} days`;
    return null;
  };

  const getCouponBadge = (coupon) => {
    if (coupon.discountType === 'percentage') {
      return <Badge bg="success" className="coupon-discount-badge">{coupon.discountValue}% OFF</Badge>;
    }
    return <Badge bg="primary" className="coupon-discount-badge">₹{coupon.discountValue} OFF</Badge>;
  };

  const getCouponIcon = (coupon) => {
    if (coupon.discountValue >= (coupon.discountType === 'percentage' ? 25 : 300)) {
      return faRocket;
    }
    if (coupon.discountValue >= (coupon.discountType === 'percentage' ? 15 : 150)) {
      return faFire;
    }
    return faGift;
  };

  const renderCouponCard = (coupon, index) => {
    const timeLeft = getTimeLeft(coupon.validTo);
    const isExpiringSoon = timeLeft && timeLeft.includes('Expires in');
    
    return (
      <Col key={coupon.id} lg={6} xl={4} className="mb-4">
        <Card className={`h-100 coupon-card ${isExpiringSoon ? 'coupon-card-expiring' : ''} ${!coupon.isApplicable ? 'coupon-card-inapplicable' : ''}`}>
          <Card.Body className="d-flex flex-column">
            {/* Coupon Header */}
            <div className="coupon-header">
              <div className="coupon-icon">
                <FontAwesomeIcon icon={getCouponIcon(coupon)} />
              </div>
              <div className="coupon-code-section">
                <h3 className="coupon-code">{coupon.code}</h3>
                {getCouponBadge(coupon)}
              </div>
            </div>

            {/* Coupon Description */}
            <div className="coupon-description">
              <p>{coupon.description || 'Special discount offer'}</p>
            </div>

            {/* Coupon Details */}
            <div className="coupon-details">
              <div className="coupon-detail-item">
                <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                <span>Min. order: ₹{coupon.minOrderAmount || 0}</span>
              </div>
              <div className="coupon-detail-item">
                <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                <span>Valid until: {formatDate(coupon.validTo)}</span>
              </div>
              {coupon.potentialDiscount > 0 && (
                <div className="coupon-detail-item text-success">
                  <FontAwesomeIcon icon={faGift} className="me-2" />
                  <span>Save up to ₹{coupon.potentialDiscount}</span>
                </div>
              )}
            </div>

            {/* Applicability Message */}
            {!coupon.isApplicable && coupon.additionalAmountNeeded > 0 && (
              <div className="applicability-message text-warning">
                <small>Add ₹{coupon.additionalAmountNeeded} more to use this coupon</small>
              </div>
            )}

            {/* Time Left Warning */}
            {timeLeft && (
              <div className={`time-left ${isExpiringSoon ? 'time-left-warning' : 'time-left-info'}`}>
                <FontAwesomeIcon icon={faClock} className="me-1" />
                {timeLeft}
              </div>
            )}

            {/* Action Buttons */}
            <div className="coupon-actions mt-auto">
              <div className="d-flex gap-2">
                <Button 
                  variant={coupon.isApplicable ? "success" : "outline-secondary"}
                  className="flex-grow-1 apply-btn"
                  onClick={() => coupon.isApplicable && handleSelectCoupon(coupon)}
                  disabled={!coupon.isApplicable}
                >
                  {coupon.isApplicable ? 'Apply Coupon' : 'Not Applicable'}
                </Button>
                <Button 
                  variant={copiedCoupon === coupon.code ? "outline-success" : "outline-primary"}
                  className="copy-btn"
                  onClick={() => handleCopyCode(coupon.code)}
                  disabled={!coupon.isApplicable}
                >
                  <FontAwesomeIcon 
                    icon={copiedCoupon === coupon.code ? faCheck : faCopy} 
                  />
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    );
  };

  if (!isAuthenticated) {
    return (
      <UserLayout>
        <Container className="py-5">
          <div className="text-center">
            <div className="auth-required-section">
              <FontAwesomeIcon icon={faShieldAlt} size="4x" className="text-warning mb-3" />
              <h3>Authentication Required</h3>
              <p className="text-muted mb-4">Please log in to view and use available coupons</p>
              <Button as={Link} to="/login" variant="warning" size="lg" className="me-3">
                Log In
              </Button>
              <Button as={Link} to="/register" variant="outline-warning" size="lg">
                Sign Up
              </Button>
            </div>
          </div>
        </Container>
      </UserLayout>
    );
  }

  if (loading) {
    return (
      <UserLayout>
        <Container className="py-5">
          <div className="text-center">
            <Spinner animation="border" variant="success" size="lg" />
            <p className="mt-3">Loading amazing deals for you...</p>
          </div>
        </Container>
      </UserLayout>
    );
  }

return (
  <UserLayout>
    <div className="coupon-page">
      {/* Enhanced Header Section */}
      <section className="coupon-header-section">
        <Container>
          <div className="coupon-header-content text-center">
            <div className="d-flex align-items-center justify-content-center mb-4">
              {fromCheckout && (
                <Button 
                  variant="outline-success" 
                  className="me-3" 
                  onClick={() => navigate('/checkout')}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  Back to Checkout
                </Button>
              )}
            </div>
            <h1 className="coupon-main-title" >
              <FontAwesomeIcon icon={faTicketAlt} className="me-3" />
              Exclusive Coupons & Deals
            </h1>
            <p className="coupon-subtitle">
              Save big on your favorite Ayurvedic products with amazing discounts
            </p>
          </div>
        </Container>
      </section>

      <Container>
        {/* Enhanced Stats Section */}
        <div className="stats-grid">
          <div className="stat-card fade-in">
            <h3>{coupons.length}</h3>
            <p className="text-muted">Total Coupons</p>
          </div>
          <div className="stat-card fade-in">
            <h3 className="text-success">{activeCoupons.length}</h3>
            <p className="text-muted">Applicable Now</p>
          </div>
          <div className="stat-card fade-in">
            <h3 className="text-warning">{expiringSoon.length}</h3>
            <p className="text-muted">Expiring Soon</p>
          </div>
          <div className="stat-card fade-in">
            <h3 className="text-info">{premiumCoupons.length}</h3>
            <p className="text-muted">Premium Offers</p>
          </div>
        </div>

          {/* Stats Summary */}
          {/* <Row className="mb-4">
            <Col md={3} className="text-center">
              <div className="stat-card">
                <h3 className="text-primary">{coupons.length}</h3>
                <p className="text-muted">Total Coupons</p>
              </div>
            </Col>
            <Col md={3} className="text-center">
              <div className="stat-card">
                <h3 className="text-success">{activeCoupons.length}</h3>
                <p className="text-muted">Applicable Now</p>
              </div>
            </Col>
            <Col md={3} className="text-center">
              <div className="stat-card">
                <h3 className="text-warning">{expiringSoon.length}</h3>
                <p className="text-muted">Expiring Soon</p>
              </div>
            </Col>
            <Col md={3} className="text-center">
              <div className="stat-card">
                <h3 className="text-info">{premiumCoupons.length}</h3>
                <p className="text-muted">Premium Offers</p>
              </div>
            </Col>
          </Row> */}

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-4">
              {error}
            </Alert>
          )}

          {/* Tabs Navigation */}
          <div className="coupon-tabs mb-5">
            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="custom-tabs">
              <Tab eventKey="all" title={
                <span>
                  <FontAwesomeIcon icon={faTags} className="me-2" />
                  All Coupons ({coupons.length})
                </span>
              }>
                {coupons.length === 0 ? (
                  <EmptyState message="No coupons available at the moment. Check back later for new offers!" />
                ) : (
                  <Row>
                    {coupons.map(renderCouponCard)}
                  </Row>
                )}
              </Tab>

              <Tab eventKey="active" title={
                <span>
                  <FontAwesomeIcon icon={faCheck} className="me-2" />
                  Applicable ({activeCoupons.length})
                </span>
              }>
                {activeCoupons.length === 0 ? (
                  <EmptyState message="No active coupons available for your current cart value." />
                ) : (
                  <Row>
                    {activeCoupons.map(renderCouponCard)}
                  </Row>
                )}
              </Tab>

              <Tab eventKey="premium" title={
                <span>
                  <FontAwesomeIcon icon={faStar} className="me-2" />
                  Premium ({premiumCoupons.length})
                </span>
              }>
                {premiumCoupons.length === 0 ? (
                  <EmptyState message="No premium coupons available at the moment." />
                ) : (
                  <Row>
                    {premiumCoupons.map(renderCouponCard)}
                  </Row>
                )}
              </Tab>

              <Tab eventKey="expiring" title={
                <span>
                  <FontAwesomeIcon icon={faClock} className="me-2" />
                  Expiring Soon ({expiringSoon.length})
                </span>
              }>
                {expiringSoon.length === 0 ? (
                  <EmptyState message="No coupons expiring soon. All offers are valid for a while!" />
                ) : (
                  <Row>
                    {expiringSoon.map(renderCouponCard)}
                  </Row>
                )}
              </Tab>
            </Tabs>
          </div>

            {/* How to Use Section */}
          <section className="how-to-use mb-5">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h3 className="text-center mb-4">How to Use Coupons</h3>
                <Row>
                  <Col md={3} className="text-center">
                    <div className="step-icon">
                      <span>1</span>
                      <FontAwesomeIcon icon={faCopy} />
                    </div>
                    <h5>Copy Code</h5>
                    <p>Click the copy button to save the coupon code</p>
                  </Col>
                  <Col md={3} className="text-center">
                    <div className="step-icon">
                      <span>2</span>
                      <FontAwesomeIcon icon={faShoppingCart} />
                    </div>
                    <h5>Add Products</h5>
                    <p>Add products to your cart that meet the minimum order value</p>
                  </Col>
                  <Col md={3} className="text-center">
                    <div className="step-icon">
                      <span>3</span>
                      <FontAwesomeIcon icon={faTicketAlt} />
                    </div>
                    <h5>Apply Coupon</h5>
                    <p>Apply the code during checkout or use the Apply button</p>
                  </Col>
                  <Col md={3} className="text-center">
                    <div className="step-icon">
                      <span>4</span>
                      <FontAwesomeIcon icon={faCheck} />
                    </div>
                    <h5>Save Money</h5>
                    <p>Enjoy your discount on the order total</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </section>

          {/* Call to Action */}
          <Card className="bg-light border-0 text-center mb-5">
            <Card.Body className="p-5">
              <h3>Ready to Save?</h3>
              <p className="lead mb-4">Apply your favorite coupon and proceed to checkout</p>
              <Button as={Link} to="/checkout" variant="success" size="lg" className="me-3">
                <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                Proceed to Checkout
              </Button>
              <Button as={Link} to="/all-products" variant="outline-success" size="lg">
                Continue Shopping
              </Button>
            </Card.Body>
          </Card>
        </Container>

        {/* Coupon Details Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg" className="coupon-modal">
          <Modal.Header closeButton className="modal-header-custom">
            <Modal.Title>
              <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
              Coupon Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedCoupon && (
              <div className="coupon-modal-content">
                <div className="text-center mb-4">
                  <div className="modal-coupon-badge">
                    {getCouponBadge(selectedCoupon)}
                  </div>
                  <h2 className="text-primary">{selectedCoupon.code}</h2>
                  <p className="lead">{selectedCoupon.description}</p>
                </div>
                
                <Row className="coupon-modal-details">
                  <Col md={6}>
                    <div className="detail-item">
                      <strong>Discount Value:</strong>
                      <span className="text-success">
                        {selectedCoupon.discountType === 'percentage' 
                          ? `${selectedCoupon.discountValue}% off` 
                          : `₹${selectedCoupon.discountValue} off`
                        }
                      </span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <strong>Minimum Order:</strong>
                      <span>₹{selectedCoupon.minOrderAmount || 'No minimum'}</span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <strong>Valid Until:</strong>
                      <span>{formatDate(selectedCoupon.validTo)}</span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <strong>Potential Savings:</strong>
                      <span className="text-success">₹{selectedCoupon.potentialDiscount}</span>
                    </div>
                  </Col>
                </Row>

                <div className="text-center mt-4">
                  <Button variant="success" size="lg" onClick={handleApplyCoupon}>
                    <FontAwesomeIcon icon={faCheck} className="me-2" />
                    Apply This Coupon & Continue to Checkout
                  </Button>
                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </UserLayout>
  );
};

// Empty State Component
const EmptyState = ({ message }) => (
  <div className="text-center py-5">
    <FontAwesomeIcon icon={faTicketAlt} size="4x" className="text-muted mb-3" />
    <h4>No coupons found</h4>
    <p className="text-muted">{message}</p>
  </div>
);

export default CouponPage;