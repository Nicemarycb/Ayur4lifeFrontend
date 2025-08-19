import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faHeart,
  faShoppingCart,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import UserLayout from "../layouts/UserLayout";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
// import axios from 'axios';
// axios.defaults.baseURL = 'http://localhost:5000';

const Cart = () => {
  const navigate = useNavigate();
  const {
    cart,
    loading,
    error,
    updateCartItem,
    removeFromCart,
    clearCart,
    calculateTotals,
  } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [updating, setUpdating] = useState({});

  const { subtotal, gst, total, totalItems } = calculateTotals();

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdating((prev) => ({ ...prev, [itemId]: true }));
    try {
      await updateCartItem(itemId, newQuantity); // Use itemId instead of productId
    } catch (err) {
      console.error("Failed to update quantity:", err);
    } finally {
      setUpdating((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const handleMoveToWishlist = async (product) => {
    try {
      await removeFromCart(product.id);
      await addToWishlist(product.id);
    } catch (err) {
      console.error("Failed to move to wishlist:", err);
    }
  };

  const handleWishlistToggle = async (product) => {
    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product.id);
      }
    } catch (err) {
      console.error("Failed to toggle wishlist:", err);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) {
    return (
      <UserLayout>
        <Container className="py-5">
          <div className="text-center">
            <Spinner animation="border" role="status" className="text-primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Loading your cart...</p>
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

  if (cart.length === 0) {
    return (
      <UserLayout>
        <Container className="py-5">
          <div className="text-center">
            <div className="mb-4">
              <FontAwesomeIcon
                icon={faShoppingCart}
                size="4x"
                className="text-muted"
              />
            </div>
            <h2 className="mb-3">Your cart is empty</h2>
            <p className="text-muted mb-4">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link to="/" className="btn btn-primary me-3">
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Continue Shopping
            </Link>
            <Link to="/wishlist" className="btn btn-outline-primary">
              <FontAwesomeIcon icon={faHeart} className="me-2" />
              View Wishlist
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
          <h1 className="mb-3">Shopping Cart</h1>
          <p className="text-muted">
            You have {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        <Row>
          <Col lg={8}>
            {cart.map((item) => (
              <Card key={item.id} className="mb-3 cart-item">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={3} className="mb-3 mb-md-0">
                      <img
                        src={
                          item.product.images?.[0] || "/placeholder-product.jpg"
                        }
                        alt={item.product.name}
                        className="img-fluid rounded"
                        style={{ maxHeight: "120px", objectFit: "cover" }}
                      />
                    </Col>
                    <Col md={9}>
                      <Row className="align-items-center">
                        <Col md={6}>
                          <h5 className="mb-2">
                            <Link
                              to={`/product/${item.product.id}`}
                              className="text-decoration-none"
                            >
                              {item.product.name}
                            </Link>
                          </h5>
                          <p className="text-muted mb-2">
                            Category:{" "}
                            <Badge bg="secondary">
                              {item.product.category}
                            </Badge>
                          </p>
                          <div className="mb-2">
                            <span className="h6 text-primary">
                              ₹{item.product.price}
                            </span>
                            {item.product.gst && (
                              <span className="text-muted small ms-2">
                                + {item.product.gst}% GST
                              </span>
                            )}
                          </div>
                          <p className="text-muted small mb-0">
                            Stock: {item.product.stock} available
                          </p>
                        </Col>
                        <Col md={3}>
                          <div className="d-flex align-items-center">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1 || updating[item.id]}
                            >
                              <FontAwesomeIcon icon={faMinus} />
                            </Button>
                            <Form.Control
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.id,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              disabled={updating[item.id]}
                              style={{ width: "60px", display: "inline-block" }}
                            />
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              disabled={
                                item.quantity >= item.product.stock ||
                                updating[item.id]
                              }
                            >
                              <FontAwesomeIcon icon={faPlus} />
                            </Button>
                          </div>
                          {updating[item.product.id] && (
                            <Spinner
                              animation="border"
                              size="sm"
                              className="mt-2"
                            />
                          )}
                        </Col>
                        <Col md={3} className="text-md-end">
                          <div className="mb-2">
                            <strong>
                              ₹{(item.product.price * item.quantity).toFixed(2)}
                            </strong>
                          </div>
                          <div className="d-flex gap-1 justify-content-md-end">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleWishlistToggle(item.product)}
                              title={
                                isInWishlist(item.product.id)
                                  ? "Remove from wishlist"
                                  : "Add to wishlist"
                              }
                            >
                              <FontAwesomeIcon
                                icon={
                                  isInWishlist(item.product.id)
                                    ? faHeart
                                    : farHeart
                                }
                                className={
                                  isInWishlist(item.product.id)
                                    ? "text-danger"
                                    : ""
                                }
                              />
                            </Button>
                            <Button
                              variant="outline-warning"
                              size="sm"
                              onClick={() => handleMoveToWishlist(item.product)}
                              title="Move to wishlist"
                            >
                              <FontAwesomeIcon icon={faHeart} />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleRemoveItem(item.product.id)}
                              title="Remove from cart"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}

            <div className="d-flex justify-content-between align-items-center">
              <Button variant="outline-secondary" onClick={() => navigate("/")}>
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Continue Shopping
              </Button>
              <Button variant="outline-danger" onClick={clearCart}>
                <FontAwesomeIcon icon={faTrash} className="me-2" />
                Clear Cart
              </Button>
            </div>
          </Col>

          <Col lg={4}>
            <Card className="sticky-top" style={{ top: "20px" }}>
              <Card.Header>
                <h5 className="mb-0">Order Summary</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal ({totalItems} items):</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {gst > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>GST:</span>
                    <span>₹{gst.toFixed(2)}</span>
                  </div>
                )}
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total:</strong>
                  <strong className="text-primary">₹{total.toFixed(2)}</strong>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-100"
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </UserLayout>
  );
};

export default Cart;
