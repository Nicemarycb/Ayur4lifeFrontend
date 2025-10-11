import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Button, Form } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useUserAuth } from '../contexts/UserAuthContext';
import ProductCard from '../components/ProductCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faBoxOpen, faExclamationTriangle, faArrowUp, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import './AllProductsPage.css';

const AllProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');
    const { isAuthenticated } = useUserAuth();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist, wishlist } = useWishlist();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true);
                const url = searchQuery 
                    ? `/api/products?search=${encodeURIComponent(searchQuery)}`
                    : '/api/products';
                
                const response = await fetch(url);
                const data = await response.json();
                setProducts(data.products || []);
            } catch (err) {
                console.error('Error fetching all products:', err);
                setError('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllProducts();
    }, [searchQuery]);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const showSuccessMessage = (message) => {
        setSuccessMessage(message);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleAddToCart = async (productId) => {
        if (!isAuthenticated) {
            setError('Please log in to add items to cart.');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }
        try {
            await addToCart(productId, 1);
            showSuccessMessage('🎉 Product added to cart successfully!');
        } catch (err) {
            setError('Failed to add to cart. Please try again.');
        }
    };

    const handleWishlistToggle = async (productId) => {
        if (!isAuthenticated) {
            setError('Please log in to manage your wishlist.');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }
        try {
            const existingWishlistItem = wishlist.find(item => item.product.id === productId);
          
            if (existingWishlistItem) {
                await removeFromWishlist(existingWishlistItem.id);
                showSuccessMessage('Removed from wishlist!');
            } else {
                await addToWishlist(productId);
                showSuccessMessage('❤️ Added to wishlist!');
            }
        } catch (err) {
            setError('Failed to update wishlist. Please try again.');
        }
    };

    const sortedProducts = [...products].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'name':
                return a.name.localeCompare(b.name);
            case 'rating':
                return (b.rating || 0) - (a.rating || 0);
            default:
                return 0;
        }
    });

    if (loading) {
        return (
            <UserLayout>
                <div className="products-page">
                    <Container>
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <div className="loading-text">Loading products...</div>
                        </div>
                    </Container>
                </div>
            </UserLayout>
        );
    }

    return (
        <UserLayout>
            <div className="products-page">
                {/* Header Section */}
                <section className="products-header fade-in-up">
                    <Container>
                        <Row className="align-items-center">
                            <Col>
                                <h1 className="page-title">
                                    <FontAwesomeIcon icon={faShoppingBag} className="me-3" />
                                    {searchQuery ? 'Search Results' : 'All Products'}
                                </h1>
                                <p className="page-subtitle">
                                    {searchQuery 
                                        ? `Found ${products.length} products matching your search`
                                        : 'Discover our complete collection of premium products'
                                    }
                                </p>
                            </Col>
                            {searchQuery && products.length > 0 && (
                                <Col xs="auto">
                                    <span className="search-results-badge">
                                        {products.length} results for "{searchQuery}"
                                    </span>
                                </Col>
                            )}
                        </Row>
                    </Container>
                </section>

                {/* Main Content */}
                <Container>
                    {/* Controls Bar */}
                    {products.length > 0 && (
                        <div className="products-controls fade-in-up">
                            <div className="controls-row">
                                <div>
                                    <p className="results-count">
                                        Showing {products.length} product{products.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                <div className="controls-right">
                                    <Form.Select 
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="sort-select"
                                    >
                                        <option value="name">Sort by Name</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="rating">Highest Rated</option>
                                    </Form.Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="danger" className="error-state fade-in-up" onClose={() => setError(null)} dismissible>
                            <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
                            <h5>Oops! Something went wrong</h5>
                            <p>{error}</p>
                        </Alert>
                    )}

                    {/* Success Notification */}
                    {showSuccess && (
                        <div className="success-notification">
                            {successMessage}
                        </div>
                    )}

                    {/* Products Grid */}
                    <section className="products-grid-section">
                        {sortedProducts.length === 0 ? (
                            <div className="empty-state fade-in-up">
                                <FontAwesomeIcon icon={faBoxOpen} className="empty-state-icon" />
                                <h3 className="empty-state-title">
                                    {searchQuery ? 'No products found' : 'No products available'}
                                </h3>
                                <p className="empty-state-text">
                                    {searchQuery 
                                        ? `We couldn't find any products matching "${searchQuery}". Try different keywords or browse all products.`
                                        : 'Check back soon for new arrivals!'
                                    }
                                </p>
                                {searchQuery && (
                                    <Button 
                                        variant="success" 
                                        onClick={() => navigate('/products')}
                                        size="lg"
                                    >
                                        Browse All Products
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="grid-header">
                                    <h2 className="grid-title">
                                        {searchQuery ? 'Search Results' : 'Featured Products'}
                                    </h2>
                                </div>
                                <Row className="products-grid">
                                    {sortedProducts.map((product, index) => (
                                        <Col 
                                            key={product.id}
                                            className="product-card-wrapper stagger-item"
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <ProductCard
                                                product={product}
                                                onAddToCart={handleAddToCart}
                                                onWishlistToggle={handleWishlistToggle}
                                                isInWishlist={isInWishlist(product.id)}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </>
                        )}
                    </section>
                </Container>

                {/* Scroll to Top Button */}
                {showScrollTop && (
                    <div className="quick-actions">
                        <Button className="scroll-to-top" onClick={scrollToTop}>
                            <FontAwesomeIcon icon={faArrowUp} />
                        </Button>
                    </div>
                )}
            </div>
        </UserLayout>
    );
};

export default AllProductsPage;