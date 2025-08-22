import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart, faStar } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import "../pages/home.css"; // Ensure you import the styles

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

export default ProductCard;