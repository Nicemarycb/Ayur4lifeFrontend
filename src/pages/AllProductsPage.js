import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useUserAuth } from '../contexts/UserAuthContext';
import ProductCard from '../components/ProductCard';

const AllProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');
    const { isAuthenticated } = useUserAuth();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist , wishlist } = useWishlist();
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
                setError('Failed to load products.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllProducts();
    }, [searchQuery]);

    const handleAddToCart = async (productId) => {
        if (!isAuthenticated) {
            setError('Please log in to add items to cart.');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }
        try {
            await addToCart(productId, 1);
            alert('Product added to cart!');
        } catch (err) {
            setError('Failed to add to cart.');
        }
    };
const handleWishlistToggle = async (productId) => {
    if (!isAuthenticated) {
        setError('Please log in to add items to your wishlist.');
        setTimeout(() => navigate('/login'), 2000);
        return;
    }
    try {
        const existingWishlistItem = wishlist.find(item => item.product.id === productId);
      
        if (existingWishlistItem) {
            await removeFromWishlist(existingWishlistItem.id);
            alert('Removed from wishlist!');
        } else {
            await addToWishlist(productId);
            alert('Added to wishlist!');
        }
    } catch (err) {
        setError('Failed to update wishlist.');
    }
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
            <Container className="py-5">
                <h1 className="mb-4">All Products</h1>
                {error && <Alert variant="danger">{error}</Alert>}
                {products.length === 0 ? (
                    <Alert variant="info">No products found.</Alert>
                ) : (
                    <Row>
                        {products.map(product => (
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
        </UserLayout>
    );
};

export default AllProductsPage;