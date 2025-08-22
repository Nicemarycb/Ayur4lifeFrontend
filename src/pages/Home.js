import React, { useState, useEffect} from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { Link, useSearchParams,useNavigate } from 'react-router-dom';
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
  const [togglingWishlist, setTogglingWishlist] = useState({});
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const [testimonials, setTestimonials] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestsellingProducts, setBestsellingProducts] = useState([]);
  
  const { isAuthenticated } = useUserAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

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
      if (isInWishlist(productId)) {
        await removeFromWishlist(productId);
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
              <Button as={Link} to="/all-products" variant="warning" size="lg" className="me-3">
                Shop All Products
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

      {/* Featured Products Section */}
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 fw-bold">Featured Products</h2>
          <Button as={Link} to="/all-products" variant="outline-success">
            View All
          </Button>
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
      </Container>
      
      {/* Bestselling Products Section */}
      <div className="bg-light py-5">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h4 fw-bold">Bestselling Products</h2>
            <Button as={Link} to="/all-products" variant="outline-success">
              View All
            </Button>
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
        </Container>
      </div>


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