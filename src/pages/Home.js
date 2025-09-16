import React, { useState, useEffect} from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Carousel } from 'react-bootstrap';
import { Link, useSearchParams,useNavigate } from 'react-router-dom';
import "./home.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart, faStar,faQuoteLeft, faLeaf, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import UserLayout from '../layouts/UserLayout';
import { useUserAuth } from '../contexts/UserAuthContext';
import { formatQuantityUnit } from '../utils/quantityFormatter';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingWishlist, setTogglingWishlist] = useState({});
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const [testimonials, setTestimonials] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestsellingProducts, setBestsellingProducts] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  
  const { isAuthenticated } = useUserAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist ,wishlist } = useWishlist();
  const navigate = useNavigate();

  // Carousel data with the provided images
  const carouselData = [
    {
      id: 1,
      image: "/images/ayurvedic-wellness-1.jfif",
      title: "Natural Wellness",
      subtitle: "Holistic healing through centuries-old natural remedies"
    },
    {
      id: 2,
      image: "/images/ayurvedic-wellness-2.jfif", 
      title: "Team Wellness",
      subtitle: "Together we achieve optimal wellness and balance"
    },
    {
      id: 3,
      image: "/images/ayurvedic-wellness-3.jfif",
      title: "Mindful Living",
      subtitle: "Fresh ingredients for a balanced lifestyle"
    },
    {
      id: 4,
      image: "/images/ayurvedic-wellness-4.jfif",
      title: "Herbal Remedies",
      subtitle: "Natural solutions for everyday wellness"
    },
    {
      id: 5,
      image: "/images/ayurvedic-wellness-5.jfif",
      title: "Pure Ingredients",
      subtitle: "Premium Ayurvedic products for your wellbeing"
    }
  ];

  const handleCarouselSelect = (selectedIndex) => {
    setCarouselIndex(selectedIndex);
  };

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
      const allProducts = data.products || [];
      setProducts(allProducts);

      // Assuming a product has isFeatured and isBestseller properties
      // or we can just pick a few for display purposes
      setFeaturedProducts(allProducts.slice(0, 4)); 
      setBestsellingProducts(allProducts.slice(4, 8));

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
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      // Ensure categories are strings
      const validCategories = (data.categories || []).map(category => 
        typeof category === 'string' ? category : String(category?.id || category?.name || '')
      ).filter(category => category.trim() !== '');
      setCategories(validCategories);
    } catch (error) {
      setCategories([]);
      setError('Failed to load categories');
    }
  };


   const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      setError('Please log in to add items to cart');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    
    try {
      const result = await addToCart(productId, 1);
      if (result.success) {
        alert('Product added to cart!');
      } else {
        setError('Failed to add to cart');
      }
    } catch (err) {
      setError('Failed to add to cart');
    }
  };


const handleWishlistToggle = async (productId) => {
    if (!isAuthenticated) {
      setError('Please log in to add items to your wishlist');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    try {
      setTogglingWishlist(prev => ({ ...prev, [productId]: true }));
      
      const existingWishlistItem = wishlist.find(item => item.product.id === productId);

      if (existingWishlistItem) {
        await removeFromWishlist(existingWishlistItem.id);
        alert('Removed from wishlist!');
      } else {
        await addToWishlist(productId);
        alert('Added to wishlist!');
      }
    } catch (err) {
      setError('Failed to update wishlist');
    } finally {
      setTogglingWishlist(prev => ({ ...prev, [productId]: false }));
    }
  };

  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState(null);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactError(null);
    
    const formData = new FormData(e.target);
    const contactData = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData)
      });

      const data = await response.json();

      if (response.ok) {
        setContactSuccess(true);
        e.target.reset(); // Clear form
        setTimeout(() => setContactSuccess(false), 5000); // Hide success message after 5 seconds
      } else {
        setContactError(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setContactError('Failed to send message. Please try again.');
    } finally {
      setContactSubmitting(false);
    }
  };

  const getProductsByCategory = (categoryId) => {
    return products.filter(product => product.category === categoryId).slice(0, 4);
  };

  const getCategoryDisplayName = (categoryId) => {
    if (!categoryId || typeof categoryId !== 'string') {
      return 'Unknown Category';
    }
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

  return (
    <UserLayout>
      <div>
      {/* Hero Section */}
      <div className="hero-section position-relative">
        {/* Full-width carousel */}
        <Carousel 
          activeIndex={carouselIndex} 
          onSelect={handleCarouselSelect}
          interval={4000}
          pause="hover"
          className="hero-carousel"
          controls={false}
          indicators={false}
        >
          {carouselData.map((slide) => (
            <Carousel.Item key={slide.id}>
              <div className="hero-carousel-item">
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="hero-carousel-image"
                />
                <div className="hero-overlay">
                  <div className="hero-content">
                    <h1 className="hero-title">
                      Welcome to <span className="hero-brand">Ayur4Life</span>
                    </h1>
                    <p className="hero-subtitle">
                      Discover the power of authentic Ayurvedic products for a healthier, more balanced life.
                      Natural remedies that have been trusted for centuries.
                    </p>
                    <div className="hero-buttons">
                      <Button as={Link} to="/all-products" variant="warning" size="lg" className="me-3 hero-btn">
                        Shop Now
                      </Button>
                      <Button as={Link} to="/about" variant="outline-light" size="lg" className="hero-btn">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
        
        {/* Carousel navigation dots */}
        <div className="hero-dots">
          {carouselData.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === carouselIndex ? 'active' : ''}`}
              onClick={() => setCarouselIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Container className="py-4">
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        </Container>
      )}

      {/* Search Results */}
      {searchQuery && (
        <Container className="py-4">
          <h2>Search Results for "{searchQuery}"</h2>
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <Row>
              {products.map(product => (
                <Col key={product.id} lg={3} md={6} className="mb-4">
                  <ProductCard 
                    product={product}
                    onAddToCart={handleAddToCart}
                    onWishlistToggle={handleWishlistToggle}
                    isInWishlist={isInWishlist(product.id)}
                    togglingWishlist={togglingWishlist}
                  />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      )}

      {/* Quick Features Section */}
      <section className="quick-features-section py-5 bg-light">
        <Container>
          <Row className="g-4">
            <Col lg={3} md={6}>
              <div className="feature-card">
                <div className="feature-icon">
                  <FontAwesomeIcon icon={faLeaf} />
                </div>
                <h5>100% Natural</h5>
                <p>Pure Ayurvedic ingredients</p>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="feature-card">
                <div className="feature-icon">
                  <FontAwesomeIcon icon={faShieldAlt} />
                </div>
                <h5>Quality Assured</h5>
                <p>Certified authentic products</p>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="feature-card">
                <div className="feature-icon">
                  <FontAwesomeIcon icon={faShoppingCart} />
                </div>
                <h5>Fast Delivery</h5>
                <p>Quick & secure shipping</p>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="feature-card">
                <div className="feature-icon">
                  <FontAwesomeIcon icon={faHeart} />
                </div>
                <h5>Expert Support</h5>
                <p>24/7 customer care</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Special Offers & Deals Section */}
      <section className="deals-section py-5">
        <Container>
          <div className="section-header text-center mb-5">
            <h2 className="section-title">Special Offers & Deals</h2>
            <p className="section-subtitle">Limited time offers on premium Ayurvedic products</p>
          </div>
          <Row className="g-4">
            <Col lg={6}>
              <div className="deal-banner">
                <div className="deal-content">
                  <h3>New Customer Special</h3>
                  <p className="deal-description">Get 20% off on your first order</p>
                  <div className="deal-code">
                    <span>Use Code: </span>
                    <strong>NEW20</strong>
                  </div>
                  <Button as={Link} to="/all-products" variant="warning" size="lg" className="mt-3">
                    Shop Now
                  </Button>
                </div>
                <div className="deal-image">
                  <img src="/images/ayurvedic-wellness-3.jfif" alt="Special Offer" />
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="deal-banner">
                <div className="deal-content">
                  <h3>Wellness Bundle</h3>
                  <p className="deal-description">Buy 3 products, get 1 free</p>
                  <div className="deal-code">
                    <span>Bundle Offer</span>
                  </div>
                  <Button as={Link} to="/all-products" variant="outline-success" size="lg" className="mt-3">
                    Explore Bundles
                  </Button>
                </div>
                <div className="deal-image">
                  <img src="/images/ayurvedic-wellness-4.jfif" alt="Bundle Offer" />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products-section py-5">
        <Container>
          <div className="section-header text-center mb-5">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Discover our most popular and trusted Ayurvedic solutions</p>
          </div>
          <Row>
            {featuredProducts.map(product => (
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
          <div className="text-center mt-4">
            <Button as={Link} to="/all-products" variant="success" size="lg">
              View All Products
            </Button>
          </div>
        </Container>
      </section>

      {/* Trending Products Section */}
      <section className="trending-section py-5 bg-light">
        <Container>
          <div className="section-header text-center mb-5">
            <h2 className="section-title">Trending Now</h2>
            <p className="section-subtitle">Products that are flying off the shelves</p>
          </div>
          <Row>
            {bestsellingProducts.slice(0, 4).map(product => (
              <Col key={product.id} lg={3} md={6} className="mb-4">
                <div className="trending-product-card">
                  <div className="trending-badge">🔥 Hot</div>
                  <ProductCard 
                    product={product}
                    onAddToCart={handleAddToCart}
                    onWishlistToggle={handleWishlistToggle}
                    isInWishlist={isInWishlist(product.id)}
                  />
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      
      {/* Bestselling Products Section */}
      <section className="bestselling-section py-5">
        <Container>
          <div className="section-header text-center mb-5">
            <h2 className="section-title">Bestselling Products</h2>
            <p className="section-subtitle">Customer favorites that have transformed lives</p>
          </div>
          <Row>
            {bestsellingProducts.map(product => (
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
          <div className="text-center mt-4">
            <Button as={Link} to="/all-products" variant="outline-success" size="lg">
              Explore More
            </Button>
          </div>
        </Container>
      </section>

      {/* Categories Section */}
      {/* <section className="categories-section py-5 bg-light">
        <Container>
          <div className="section-header text-center mb-5">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find exactly what you need for your wellness journey</p>
          </div>
          <Row>
            {categories.slice(0, 6).map((category) => {
              const categoryProducts = getProductsByCategory(category.id);
              if (categoryProducts.length === 0) return null;
              return (
                <Col key={category.id} lg={4} md={6} className="mb-4">
                  <div className="category-card">
                    <div className="category-header">
                      <h4 className="category-title">{getCategoryDisplayName(category.id)}</h4>
                      <p className="category-count">{categoryProducts.length} Products</p>
                    </div>
                    <div className="category-preview">
                      <Row>
                        {categoryProducts.slice(0, 2).map(product => (
                          <Col key={product.id} xs={6}>
                            <div className="category-product-preview">
                              <img 
                                src={product.images?.[0] || ''} 
                                alt={product.name}
                                className="category-product-image"
                              />
                              <p className="category-product-name">{product.name}</p>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                    <Button as={Link} to={`/category/${category.id}`} variant="outline-success" className="w-100">
                      View Category
                    </Button>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section> */}

      {/* Customer Reviews Section */}
      <section className="reviews-section py-5">
        <Container>
          <div className="section-header text-center mb-5">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Real experiences from people who trust Ayur4Life</p>
          </div>
          <Row>
            {testimonials.map(testimonial => (
              <Col key={testimonial.id} md={4} className="mb-4">
                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <FontAwesomeIcon icon={faQuoteLeft} size="2x" className="quote-icon" />
                    <p className="testimonial-text">{testimonial.quote}</p>
                    <div className="testimonial-rating">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <FontAwesomeIcon key={i} icon={faStar} className="star-icon" />
                      ))}
                    </div>
                  </div>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      <FontAwesomeIcon icon={faHeart} />
                    </div>
                    <div className="author-info">
                      <h6 className="author-name">{testimonial.name}</h6>
                      <p className="author-title">Verified Customer</p>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Trust Indicators Section */}
      <section className="trust-section py-5 bg-light">
        <Container>
          <Row className="text-center">
            <Col lg={3} md={6} className="mb-4">
              <div className="trust-item">
                <div className="trust-icon">
                  <FontAwesomeIcon icon={faShieldAlt} />
                </div>
                <h5>Secure Shopping</h5>
                <p>100% secure payment</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="trust-item">
                <div className="trust-icon">
                  <FontAwesomeIcon icon={faLeaf} />
                </div>
                <h5>Authentic Products</h5>
                <p>Genuine Ayurvedic</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="trust-item">
                <div className="trust-icon">
                  <FontAwesomeIcon icon={faShoppingCart} />
                </div>
                <h5>Free Shipping</h5>
                <p>On orders above ₹999</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="trust-item">
                <div className="trust-icon">
                  <FontAwesomeIcon icon={faHeart} />
                </div>
                <h5>30-Day Returns</h5>
                <p>Easy return policy</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Newsletter Section */}
      {/* <section className="newsletter-section py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <div className="newsletter-content">
                <h3 className="newsletter-title">Stay Updated with Wellness Tips</h3>
                <p className="newsletter-text">
                  Get the latest Ayurvedic wellness advice, product updates, and exclusive offers delivered to your inbox.
                </p>
                <div className="newsletter-form">
                  <div className="input-group mb-3">
                    <input type="email" className="form-control" placeholder="Enter your email address" />
                    <Button variant="success" type="button">
                      Subscribe
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section> */}

      {/* Contact Section */}
      <section className="contact-section py-5 bg-light">
        <Container>
          <Row>
            <Col lg={6} className="mb-4 mb-lg-0">
              <div className="contact-info">
                <h2 className="section-title mb-4">Get in Touch</h2>
                <p className="contact-description mb-4">
                  Have questions about our products? Need help with your order? 
                  We're here to help you on your wellness journey.
                </p>
                <div className="contact-details">
                  <div className="contact-item mb-3">
                    <div className="contact-icon">
                      <FontAwesomeIcon icon={faHeart} className="text-success" />
                    </div>
                    <div className="contact-text">
                      <strong>Email:</strong> ayur4life@gmail.com
                    </div>
                  </div>
                  <div className="contact-item mb-3">
                    <div className="contact-icon">
                      <FontAwesomeIcon icon={faHeart} className="text-success" />
                    </div>
                    <div className="contact-text">
                      <strong>Phone:</strong>  +91 9854758962
                    </div>
                  </div>
                  <div className="contact-item mb-3">
                    <div className="contact-icon">
                      <FontAwesomeIcon icon={faHeart} className="text-success" />
                    </div>
                    <div className="contact-text">
                      <strong>Address:</strong> Thekkekara Arcade Chelakottukara Thrissur 680005
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="contact-form-container">
                <Card className="contact-form-card">
                  <Card.Body>
                    <h4 className="mb-4">Send us a Message</h4>
                    
                    {contactSuccess && (
                      <Alert variant="success" className="mb-3">
                        Thank you for your message! We will get back to you soon.
                      </Alert>
                    )}
                    
                    {contactError && (
                      <Alert variant="danger" className="mb-3" dismissible onClose={() => setContactError(null)}>
                        {contactError}
                      </Alert>
                    )}
                    
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
                      <Button type="submit" variant="success" className="w-100" disabled={contactSubmitting}>
                        {contactSubmitting ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Sending...
                          </>
                        ) : (
                          'Send Message'
                        )}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
    </UserLayout>
  );
};

// Product Card Component (remains the same)
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
          {product.category} • {formatQuantityUnit(product.quantityUnit)}
        </Card.Text>
        <Card.Text className="flex-grow-1">
          {product.description?.substring(0, 100)}...
        </Card.Text>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <span className="h5 text-success mb-0">₹{product.price}</span>
            {/* <small className="text-muted d-block"> +{product.gst}% GST</small> */}
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