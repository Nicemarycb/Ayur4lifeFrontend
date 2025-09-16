import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeart, 
  faShoppingCart, 
  faStar, 
  faArrowLeft,
  faMinus,
  faPlus,
  faVideo,
  faPlayCircle
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import UserLayout from '../layouts/UserLayout';
import { useUserAuth } from '../contexts/UserAuthContext';
import { getQuantityDisplay, getQuantityLabel, formatQuantityUnit } from '../utils/quantityFormatter';
import ProductRating from '../components/ProductRating';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import './ProductDetail.css'; // We'll create this CSS file

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [mediaItems, setMediaItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  
  const { isAuthenticated, user } = useUserAuth();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    loadProduct();
    loadReviews();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      console.log('API Response for ProductDetail:', data);
      if (response.ok) {
        setProduct(data.product);
        
        // Prepare media items (images + video)
        const media = [];
        if (data.product.images && Array.isArray(data.product.images) && data.product.images.length > 0) {
          data.product.images.forEach(img => {
            media.push({ type: 'image', url: img });
          });
        } else {
          // Fallback if no images
          media.push({ type: 'image', url: '/Ayur4life_logo_round_png-01.png' });
          
        }
        
        // Add video if available
        if (data.product.video) {
  media.push({ type: 'video', url: data.product.video });
}
        
        setMediaItems(media);
      } else {
        setError(data.message || 'Product not found');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }
    
    const result = await addToCart(product.id, quantity);
    if (result.success) {
      alert('Product added to cart!');
    }
  };

  const handleWishlistToggle = async () => {
    if (!product) return;

    if (isInWishlist(product.id)) {
      const item = wishlist.find(w => w.product.id === product.id);
      if (item) {
        await removeFromWishlist(item.id);
      }
    } else {
      await addToWishlist(product.id);
    }
  };

  const calculateGST = (price, qty) => {
    const subtotal = price * qty;
    const sgstRate = parseFloat(product?.sgst || 0) / 100;
    const cgstRate = parseFloat(product?.cgst || 0) / 100;
    
    const sgst = subtotal * sgstRate;
    const cgst = subtotal * cgstRate;
    const totalGst = sgst + cgst;
    
    return { sgst, cgst, totalGst };
  };

  const calculateTotalPrice = (price, qty) => {
    const subtotal = price * qty;
    const { totalGst } = calculateGST(price, qty);
    return subtotal + totalGst;
  };

  // Review functions
  const loadReviews = async () => {
    try {
      setLoadingReviews(true);
      const response = await fetch(`/api/reviews/product/${id}`);
      const data = await response.json();
      if (response.ok) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify({
          productId: id,
          ...reviewData
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert('Review submitted successfully!');
        setShowReviewForm(false);
        loadReviews(); // Reload reviews
        loadProduct(); // Reload product to update rating
      } else {
        throw new Error(data.error || 'Failed to submit review');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateReview = async (reviewId, reviewData) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify(reviewData)
      });

      const data = await response.json();
      if (response.ok) {
        alert('Review updated successfully!');
        loadReviews(); // Reload reviews
        loadProduct(); // Reload product to update rating
      } else {
        throw new Error(data.error || 'Failed to update review');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        alert('Review deleted successfully!');
        loadReviews(); // Reload reviews
        loadProduct(); // Reload product to update rating
      } else {
        throw new Error(data.error || 'Failed to delete review');
      }
    } catch (error) {
      throw error;
    }
  };

  const canReview = () => {
    if (!isAuthenticated) return false;
    
    // Check if user has already reviewed this product
    const hasReviewed = reviews.some(review => review.userId === user?.uid);
    if (hasReviewed) return false;
    
    // Check if user has purchased this product (simplified check)
    // In a real app, you'd check the orders collection
    return true; // For now, allow all authenticated users to review
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <Spinner animation="border" variant="success" />
        </div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <Container className="py-5">
          <Alert variant="danger">
            <Alert.Heading>Error</Alert.Heading>
            <p>{error}</p>
            <Button variant="outline-danger" onClick={() => navigate('/')}>
              Go Back Home
            </Button>
          </Alert>
        </Container>
      </UserLayout>
    );
  }

  if (!product) {
    return (
      <UserLayout>
        <Container className="py-5">
          <Alert variant="info">
            <Alert.Heading>Product Not Found</Alert.Heading>
            <p>The product you're looking for doesn't exist.</p>
            <Button variant="outline-info" onClick={() => navigate('/')}>
              Go Back Home
            </Button>
          </Alert>
        </Container>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <Container className="py-5">
        <div className="mb-4">
          <Button 
            variant="link" 
            className="text-decoration-none p-0 mb-2"
            onClick={() => navigate(-1)}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Back
          </Button>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Button variant="link" className="text-decoration-none p-0" onClick={() => navigate('/')}>
                  Home
                </Button>
              </li>
              <li className="breadcrumb-item">
                <Button 
                  variant="link" 
                  className="text-decoration-none p-0"
                  onClick={() => navigate(`/category/${product.category}`)}
                >
                  {product.category}
                </Button>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>
        </div>

        <Row>
          <Col lg={6} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
                <div className="position-relative product-media-container">
  {mediaItems[selectedMedia]?.type === 'video' ? (
  <video
    controls
    className="img-fluid w-100 main-product-media"
         poster={product.images?.[0] || '/Ayur4life_logo_round_png-01.png'}
  >
    <source src={mediaItems[selectedMedia]?.url} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
) : (
  <img
    src={mediaItems[selectedMedia]?.url}
    alt={product.name}
    className="img-fluid w-100 main-product-media"
    onError={(e) => {
      e.target.src = '/Ayur4life_logo_round_png-01.png';
    }}
  />
)}

                  
                  <Button
                    variant="light"
                    size="sm"
                    className="position-absolute top-0 end-0 m-3 wishlist-btn"
                    onClick={handleWishlistToggle}
                  >
                    <FontAwesomeIcon 
                      icon={isInWishlist(product.id) ? faHeart : farHeart} 
                      className={isInWishlist(product.id) ? 'text-danger' : 'text-muted'}
                      size="lg"
                    />
                  </Button>
                </div>
                
                {mediaItems.length > 1 && (
                  <div className="media-thumbnails-container">
                    <div className="d-flex gap-2 p-3 overflow-auto">
                      {mediaItems.map((media, index) => (
                        <div
                          key={index}
                          className={`media-thumbnail ${selectedMedia === index ? 'selected' : ''}`}
                          onClick={() => setSelectedMedia(index)}
                        >
                          {media.type === 'image' ? (
                            <img
                              src={media.url}
                              alt={`${product.name} ${index + 1}`}
                              className="img-thumbnail"
                              onError={(e) => {
                                e.target.src = '/Ayur4life_logo_round_png-01.png';
                              }}
                            />
                          ) : (
                            <div className="video-thumbnail">
                              <FontAwesomeIcon icon={faVideo} className="me-1" />
                              <span>Video</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6}>
            <div className="ps-lg-4">
              <div className="mb-3">
                <Badge bg="success" className="mb-2">{product.category}</Badge>
                <h1 className="h2 fw-bold mb-2">{product.name}</h1>
                <div className="mb-3">
                  <ProductRating 
                    rating={product.rating || 0} 
                    reviewCount={product.reviewCount || 0}
                    size="md"
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-baseline mb-2">
                  <span className="h3 text-success fw-bold me-3">₹{product.price}</span>
                  {/* <span className="text-muted text-decoration-line-through">₹{Math.round(product.price * 1.2)}</span>
                  <Badge bg="danger" className="ms-2">20% OFF</Badge> */}
                </div>
                <p className="text-muted mb-0"><small></small></p>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-semibold">Availability:</span>
                  <Badge bg={product.stock > 0 ? 'success' : 'danger'}>
                    {product.stock > 0 ? `${getQuantityDisplay(product.stock, product.quantityUnit)} in stock` : 'Out of stock'}
                  </Badge>
                </div>
                {product.stock > 0 && product.stock <= 10 && (
                  <Alert variant="warning" className="mt-2 mb-0">
                    <small>Only {getQuantityDisplay(product.stock, product.quantityUnit)} left in stock!</small>
                  </Alert>
                )}
              </div>

              {/* Delivery Information */}
              <div className="mb-4">
                <h6 className="fw-semibold mb-2">Delivery Information</h6>
                <div className="bg-light p-3 rounded">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Standard Delivery:</span>
                    <span className="text-success fw-bold">
                      ₹{product.deliveryCharge || 0}
                    </span>
                  </div>
                  {product.freeDeliveryThreshold > 0 && (
                    <div className="d-flex justify-content-between">
                      <span>Free Delivery Above:</span>
                      <span className="text-success fw-bold">
                        ₹{product.freeDeliveryThreshold}
                      </span>
                    </div>
                  )}
                  <small className="text-muted">
                    Delivery charges may vary based on location and order value
                  </small>
                </div>
              </div>

              {product.stock > 0 && (
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    {getQuantityLabel(product.quantityUnit)}:
                  </label>
                  <div className="d-flex align-items-center">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </Button>
                    <Form.Control
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      min="1"
                      max={product.stock}
                      className="mx-2 text-center"
                      style={{ width: '80px' }}
                    />
                    <span className="text-muted ms-2">
                      {formatQuantityUnit(product.quantityUnit)}
                    </span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                  </div>
                  <small className="text-muted">
                    Available: {getQuantityDisplay(product.stock, product.quantityUnit)}
                  </small>
                </div>
              )}

              <Card className="mb-4 bg-light">
                <Card.Body>
                  <h6 className="fw-semibold mb-3">Price Breakdown</h6>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Price per unit:</span>
                    <span>₹{product.price}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Quantity:</span>
                    <span>{getQuantityDisplay(quantity, product.quantityUnit)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>₹{product.price * quantity}</span>
                  </div>
                  {(() => {
                    const { sgst, cgst, totalGst } = calculateGST(product.price, quantity);
                    return (
                      <>
                        {sgst > 0 && (
                          <div className="d-flex justify-content-between mb-2">
                            <span>SGST:</span>
                            <span>₹{sgst.toFixed(2)}</span>
                          </div>
                        )}
                        {cgst > 0 && (
                          <div className="d-flex justify-content-between mb-2">
                            <span>CGST:</span>
                            <span>₹{cgst.toFixed(2)}</span>
                          </div>
                        )}
                        {totalGst > 0 && (
                          <div className="d-flex justify-content-between mb-2">
                            <span>Total GST:</span>
                            <span>₹{totalGst.toFixed(2)}</span>
                          </div>
                        )}
                      </>
                    );
                  })()}
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total:</span>
                    <span className="text-success">₹{calculateTotalPrice(product.price, quantity).toFixed(2)}</span>
                  </div>
                </Card.Body>
              </Card>

              <div className="d-grid gap-2 mb-4">
                <Button
                  variant="success"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline-success"
                  size="lg"
                  onClick={handleWishlistToggle}
                >
                  <FontAwesomeIcon icon={isInWishlist(product.id) ? faHeart : farHeart} className="me-2" />
                  {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>

              <div className="mb-4">
                <h5 className="fw-semibold mb-3">Description</h5>
                <p className="text-muted">{product.description}</p>
              </div>

              <div className="mb-4">
                <h5 className="fw-semibold mb-3">Key Features</h5>
                <ul className="text-muted">
                  {product.features && Array.isArray(product.features) && product.features.length > 0 ? (
                    product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))
                  ) : (
                    <>
                      <li>100% Natural and Organic</li>
                      <li>Authentic Ayurvedic formulation</li>
                      <li>No artificial preservatives</li>
                      <li>Certified by Ayurvedic authorities</li>
                      <li>Made in India</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="border-top pt-4">
                <div className="row text-center">
                  <div className="col-4">
                    <div className="text-success">
                      <FontAwesomeIcon icon={faStar} size="lg" />
                    </div>
                    <small className="text-muted">Premium Quality</small>
                  </div>
                  <div className="col-4">
                    <div className="text-success">
                      <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                    </div>
                    <small className="text-muted">Fast Delivery</small>
                  </div>
                  <div className="col-4">
                    <div className="text-success">
                      <FontAwesomeIcon icon={faHeart} size="lg" />
                    </div>
                    <small className="text-muted">Easy Returns</small>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Reviews Section */}
        <Row className="mt-5">
          <Col>
            <div className="border-top pt-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Customer Reviews</h4>
                {canReview() && (
                  <Button
                    variant="outline-primary"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                  >
                    {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                  </Button>
                )}
              </div>

              {showReviewForm && canReview() && (
                <div className="mb-4">
                  <ReviewForm
                    productId={id}
                    onSubmit={handleSubmitReview}
                    onCancel={() => setShowReviewForm(false)}
                  />
                </div>
              )}

              {loadingReviews ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading reviews...</span>
                  </div>
                </div>
              ) : (
                <ReviewList
                  reviews={reviews}
                  productId={id}
                  currentUserId={user?.uid}
                  onReviewUpdate={handleUpdateReview}
                  onReviewDelete={handleDeleteReview}
                />
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </UserLayout>
  );
};

export default ProductDetail;