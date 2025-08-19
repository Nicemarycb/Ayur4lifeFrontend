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
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import UserLayout from '../layouts/UserLayout';
import { useUserAuth } from '../contexts/UserAuthContext';


const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const { isAuthenticated } = useUserAuth();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      console.log('API Response for ProductDetail:', data); // Debug log
      if (response.ok) {
        setProduct(data.product);
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

 // src/pages/ProductDetail.js

// src/pages/ProductDetail.js

const handleWishlistToggle = async () => {
  if (!product) return; // Guard clause if product is not loaded

  if (isInWishlist(product.id)) {
    const item = wishlist.find(w => w.product.id === product.id);
    if (item) {
      await removeFromWishlist(item.id); // Use wishlistItemId
    }
  } else {
    await addToWishlist(product.id);
  }
};
  const calculateGST = (price) => {
    return price * 0.18;
  };

  const calculateTotalPrice = (price, qty) => {
    const subtotal = price * qty;
    const gst = calculateGST(subtotal);
    return subtotal + gst;
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

  const fallbackUrl = 'https://placehold.co/500x500?text=Product+Image';
  const productImages = [
    product.images?.[0] || fallbackUrl,
    fallbackUrl,
    fallbackUrl,
    fallbackUrl
  ];

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
                <div className="position-relative">
                  <img
                    src={productImages[selectedImage]}
                    alt={product.name}
                    className="img-fluid w-100"
                    style={{ height: '500px', objectFit: 'cover' }}
                  />
                  <Button
                    variant="light"
                    size="sm"
                    className="position-absolute top-0 end-0 m-3"
                    onClick={handleWishlistToggle}
                  >
                    <FontAwesomeIcon 
                      icon={isInWishlist(product.id) ? faHeart : farHeart} 
                      className={isInWishlist(product.id) ? 'text-danger' : 'text-muted'}
                      size="lg"
                    />
                  </Button>
                </div>
                <div className="d-flex gap-2 p-3">
                  {productImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className={`img-thumbnail cursor-pointer ${selectedImage === index ? 'border-success' : ''}`}
                      style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6}>
            <div className="ps-lg-4">
              <div className="mb-3">
                <Badge bg="success" className="mb-2">{product.category}</Badge>
                <h1 className="h2 fw-bold mb-2">{product.name}</h1>
                <div className="d-flex align-items-center mb-3">
                  <div className="text-warning me-2">
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} className="text-warning" size="sm" />
                    ))}
                  </div>
                  <span className="text-muted">(4.8/5) - 128 reviews</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-baseline mb-2">
                  <span className="h3 text-success fw-bold me-3">₹{product.price}</span>
                  <span className="text-muted text-decoration-line-through">₹{Math.round(product.price * 1.2)}</span>
                  <Badge bg="danger" className="ms-2">20% OFF</Badge>
                </div>
                <p className="text-muted mb-0"><small>+18% GST applicable</small></p>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-semibold">Availability:</span>
                  <Badge bg={product.stock > 0 ? 'success' : 'danger'}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </Badge>
                </div>
                {product.stock > 0 && product.stock <= 10 && (
                  <Alert variant="warning" className="mt-2 mb-0">
                    <small>Only {product.stock} left in stock!</small>
                  </Alert>
                )}
              </div>

              {product.stock > 0 && (
                <div className="mb-4">
                  <label className="form-label fw-semibold">Quantity:</label>
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
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                  </div>
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
                    <span>{quantity}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>₹{product.price * quantity}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>GST (18%):</span>
                    <span>₹{calculateGST(product.price * quantity).toFixed(2)}</span>
                  </div>
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
                  {product.features && product.features.length > 0 ? (
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
      </Container>
    </UserLayout>
  );
};

export default ProductDetail;