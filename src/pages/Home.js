import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import "./home.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart, faStar,faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import UserLayout from '../layouts/UserLayout';
import { useUserAuth } from '../contexts/UserAuthContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const [testimonials, setTestimonials] = useState([]);
  
  const { isAuthenticated } = useUserAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadTestimonials();
  }, [searchQuery]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const url = searchQuery 
        ? `/api/products?search=${encodeURIComponent(searchQuery)}`
        : '/api/products';
      
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

const loadTestimonials = () => {
    setTestimonials([
      { id: 1, name: 'John Doe', quote: 'Ayur4Life products changed my life! Natural and effective.', rating: 5 },
      { id: 2, name: 'Jane Smith', quote: 'Excellent quality and fast delivery. Highly recommend!', rating: 5 },
      { id: 3, name: 'Alex Johnson', quote: 'The best Ayurvedic store online. Authentic products.', rating: 4 },
    ]);
  };

  const loadCategories = async () => {
   try {
    const response = await fetch('/api/products/categories/all');
    const data = await response.json();
    setCategories(data.categories || []);
  } catch (error) {
    console.error('Error loading categories:', error);
    setCategories([]);
  }
};

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }
    
    const result = await addToCart(productId, 1);
    if (result.success) {
      alert('Product added to cart!');
    }
  };

// src/pages/Home.js, src/pages/ProductDetail.js, and src/pages/CategoryProducts.js

// src/pages/ProductDetail.js

const handleWishlistToggle = async (product) => {
  if (isInWishlist(product.id)) {
    // If it's already in the wishlist, remove it
    await removeFromWishlist(product.id);
  } else {
    // If not, add it by passing the product ID
    await addToWishlist(product.id);
  }
};

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const contactData = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };

    console.log('Contact form submitted:', contactData);
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
  };

  const getProductsByCategory = (categoryId) => {
    return products.filter(product => product.category === categoryId).slice(0, 4);
  };

  const getCategoryDisplayName = (categoryId) => {
    return categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace(/-/g, ' ');
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

  const showAllProductsSection = categories.length === 0 || products.length > 0;

  return (
    <UserLayout>
      <div>
      {/* Hero Section */}
      <div className="bg-gradient bg-success text-white py-5" style={{background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)'}}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">
                Welcome to <span className="text-warning">Ayur4Life</span>
              </h1>
              <p className="lead mb-4">
                Discover the power of authentic Ayurvedic products for a healthier, more balanced life.
                Natural remedies that have been trusted for centuries.
              </p>
              <Button as={Link} to="/category/Herbs" variant="warning" size="lg" className="me-3">
                Shop Now
              </Button>
              <Button as={Link} to="/register" variant="outline-light" size="lg">
                Join Us
              </Button>
            </Col>
            <Col lg={6} className="text-center">
              <div className="bg-light rounded p-4">
                <h3 className="text-success mb-3">Featured Products</h3>
                <p className="text-muted">Explore our curated collection of premium Ayurvedic products</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <Container className="py-4">
          <h2>Search Results for "{searchQuery}"</h2>
        </Container>
      )}

      {/* All Products (fallback) */}
      {showAllProductsSection && (
        <Container className="py-5">
          <h2 className="h4 fw-bold mb-4">All Products</h2>
          {products.length === 0 ? (
            <Alert variant="info">No products available yet.</Alert>
          ) : (
            <Row>
              {products.slice(0, 8).map(product => (
                <Col key={product.id} lg={3} md={4} sm={6} className="mb-4">
                  <ProductCard 
                    product={product}
                    onAddToCart={handleAddToCart}
                    onWishlistToggle={handleWishlistToggle}
                    isInWishlist={isInWishlist(product.id)}
                  />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      )}

      {/* Categories Sections */}
      <Container className="py-5">
        {categories.map((category) => {
          const categoryProducts = getProductsByCategory(category.id);
          if (categoryProducts.length === 0) return null;
          return (
            <div key={category.id} className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 fw-bold">{getCategoryDisplayName(category.id)}</h2>
                <Button as={Link} to={`/category/${category.id}`} variant="outline-success">
                  View All
                </Button>
              </div>
              <Row>
                {categoryProducts.map(product => (
                  <Col key={product.id} lg={3} md={4} sm={6} className="mb-4">
                    <ProductCard 
                      product={product}
                      onAddToCart={handleAddToCart}
                      onWishlistToggle={handleWishlistToggle}
                      isInWishlist={isInWishlist(product.id)}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          );
        })}
      </Container>

      {/* Testimonials Section */}
        <div className="bg-light py-5">
          <Container>
            <h2 className="text-center mb-5">What Our Customers Say</h2>
            <Row>
              {testimonials.map(testimonial => (
                <Col key={testimonial.id} md={4} className="mb-4">
                  <Card className="h-100 text-center">
                    <Card.Body>
                      <FontAwesomeIcon icon={faQuoteLeft} size="2x" className="text-muted mb-3" />
                      <p className="fst-italic">{testimonial.quote}</p>
                      <div className="text-warning mb-2">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <FontAwesomeIcon key={i} icon={faStar} />
                        ))}
                      </div>
                      <strong>{testimonial.name}</strong>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </div>

      {/* Contact Form */}
      <div className="bg-light py-5">
        <Container>
          <Row>
            <Col lg={6}>
              <h2 className="mb-4">Get in Touch</h2>
              <p className="text-muted mb-4">
                Have questions about our products? Need help with your order? 
                We're here to help you on your wellness journey.
              </p>
              <div className="mb-3">
                <strong>Email:</strong> info@ayur4life.com
              </div>
              <div className="mb-3">
                <strong>Phone:</strong> +1 (555) 123-4567
              </div>
              <div className="mb-3">
                <strong>Address:</strong> 123 Wellness Street, Health City, HC 12345
              </div>
            </Col>
            <Col lg={6}>
              <Card>
                <Card.Body>
                  <h4 className="mb-4">Send us a Message</h4>
                  <Form onSubmit={handleContactSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Name</Form.Label>
                          <Form.Control type="text" name="name" required />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control type="email" name="email" required />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Label>Subject</Form.Label>
                      <Form.Control type="text" name="subject" required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Message</Form.Label>
                      <Form.Control as="textarea" rows={4} name="message" required />
                    </Form.Group>
                    <Button type="submit" variant="success" className="w-100">
                      Send Message
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
    </UserLayout>
  );
};

// Product Card Component
const ProductCard = ({ product, onAddToCart, onWishlistToggle, isInWishlist }) => {
  return (
    <Card className="h-100 product-card shadow-sm">
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={product.images?.[0] || ''} 
          alt={product.name}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <Button
          variant="light"
          size="sm"
          className="position-absolute top-0 end-0 m-2"
          onClick={() => onWishlistToggle(product.id)}
        >
          <FontAwesomeIcon 
            icon={isInWishlist ? faHeart : farHeart} 
            className={isInWishlist ? 'text-danger' : 'text-muted'}
          />
        </Button>
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold">{product.name}</Card.Title>
        <Card.Text className="text-muted small mb-2">
          {product.category}
        </Card.Text>
        <Card.Text className="flex-grow-1">
          {product.description?.substring(0, 100)}...
        </Card.Text>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <span className="h5 text-success mb-0">₹{product.price}</span>
            <small className="text-muted d-block">+18% GST</small>
          </div>
          <div className="text-warning">
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
          </div>
        </div>
        <div className="d-flex gap-2">
          <Button 
            variant="success" 
            size="sm" 
            className="flex-grow-1"
            onClick={() => onAddToCart(product.id)}
          >
            <FontAwesomeIcon icon={faShoppingCart} className="me-1" />
            Add to Cart
          </Button>
          <Button 
            as={Link} 
            to={`/product/${product.id}`} 
            variant="outline-success" 
            size="sm"
          >
            View
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Home;
