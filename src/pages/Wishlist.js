import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart, faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import UserLayout from '../layouts/UserLayout';
// import axios from 'axios';
// axios.defaults.baseURL = 'http://localhost:5000';

const Wishlist = () => {
  const { wishlist, loading, error, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState({});

  const handleAddToCart = async (product) => {
    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    try {
      await addToCart(product.id, 1);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

const handleRemoveFromWishlist = async (productId) => {
  try {
    const item = wishlist.find(w => w.product.id === productId);
    if (item) {
      await removeFromWishlist(item.id); // Use wishlistItemId
    } else {
      await removeFromWishlist(productId); // Fallback to productId removal
    }
  } catch (err) {
    console.error('Failed to remove from wishlist:', err);
  }
};
  const handleMoveAllToCart = async () => {
    for (const item of wishlist) {
      try {
        await addToCart(item.product.id, 1);
        await removeFromWishlist(item.id); // Use wishlistItemId
      } catch (err) {
        console.error('Failed to move item to cart:', err);
      }
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <Container className="py-5">
          <div className="text-center">
            <Spinner animation="border" role="status" className="text-primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Loading your wishlist...</p>
          </div>
        </Container>
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
          </Alert>
        </Container>
      </UserLayout>
    );
  }

  if (wishlist.length === 0) {
    return (
      <UserLayout>
        <Container className="py-5">
          <div className="text-center">
            <div className="mb-4">
              <FontAwesomeIcon icon={farHeart} size="4x" className="text-muted" />
            </div>
            <h2 className="mb-3">Your wishlist is empty</h2>
            <p className="text-muted mb-4">
              Start adding products to your wishlist to save them for later.
            </p>
            <Link to="/" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        </Container>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
    <Container className="py-5">
      <div className="mb-4">
        <Row className="align-items-center">
          <Col>
            <h1 className="mb-2">My Wishlist</h1>
            <p className="text-muted mb-0">
              You have {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} in your wishlist
            </p>
          </Col>
          <Col xs="auto">
            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                onClick={handleMoveAllToCart}
                disabled={wishlist.length === 0}
              >
                <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                Move All to Cart
              </Button>
              <Button
                variant="outline-danger"
                onClick={clearWishlist}
                disabled={wishlist.length === 0}
              >
                <FontAwesomeIcon icon={faTrash} className="me-2" />
                Clear Wishlist
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      <Row>
        {wishlist.map((item) => (
          <Col key={item.id} lg={4} md={6} className="mb-4">
            <Card className="h-100 product-card">
              <div className="product-image-container">
                <Card.Img
                  variant="top"
                  src={item.product.images?.[0] || '/placeholder-product.jpg'}
                  alt={item.product.name}
                  className="product-image"
                />
                <div className="product-overlay">
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="overlay-btn"
                    onClick={() => handleAddToCart(item.product)}
                    disabled={item.product.stock === 0 || addingToCart[item.product.id]}
                  >
                    {addingToCart[item.product.id] ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <FontAwesomeIcon icon={faShoppingCart} />
                    )}
                  </Button>
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="overlay-btn"
                    onClick={() => handleRemoveFromWishlist(item.product.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
                {item.product.stock < 10 && item.product.stock > 0 && (
                  <Badge bg="warning" className="position-absolute top-0 end-0 m-2">
                    Low Stock
                  </Badge>
                )}
                {item.product.stock === 0 && (
                  <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
                    Out of Stock
                  </Badge>
                )}
              </div>
              <Card.Body className="d-flex flex-column">
                <div className="mb-2">
                  <Badge bg="secondary" className="mb-2">
                    {item.product.category}
                  </Badge>
                </div>
                <Card.Title className="product-title">
                  <Link to={`/product/${item.product.id}`} className="text-decoration-none">
                    {item.product.name}
                  </Link>
                </Card.Title>
                <div className="mb-2">
                  <div className="d-flex align-items-center">
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon
                        key={i}
                        icon={faStar}
                        className={i < Math.floor(item.product.rating || 0) ? 'text-warning' : 'text-muted'}
                        size="sm"
                      />
                    ))}
                    <span className="ms-2 text-muted small">
                      ({item.product.rating || 0})
                    </span>
                  </div>
                </div>
                <div className="mb-3">
                  <span className="h5 text-primary mb-0">₹{item.product.price}</span>
                  {item.product.gst && (
                    <span className="text-muted small ms-2">+ {item.product.gst}% GST</span>
                  )}
                </div>
                <Card.Text className="flex-grow-1">
                  {item.product.description?.substring(0, 100)}
                  {item.product.description?.length > 100 && '...'}
                </Card.Text>
                <div className="mt-auto">
                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      onClick={() => handleAddToCart(item.product)}
                      disabled={item.product.stock === 0 || addingToCart[item.product.id]}
                    >
                      {addingToCart[item.product.id] ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => handleRemoveFromWishlist(item.product.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} className="me-2" />
                      Remove from Wishlist
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {wishlist.length > 0 && (
        <div className="text-center mt-4">
          <Link to="/" className="btn btn-outline-primary">
            Continue Shopping
          </Link>
        </div>
      )}
    </Container>
    </UserLayout>
  );
};

export default Wishlist;
