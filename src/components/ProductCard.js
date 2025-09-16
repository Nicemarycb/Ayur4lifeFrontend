import React, { useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart, faStar, faVideo } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { formatQuantityUnit } from '../utils/quantityFormatter';
import ProductRating from './ProductRating';
import "./ProductCard.css";

const ProductCard = ({ product, onAddToCart, onWishlistToggle, isInWishlist, isAdminView = false, onImageUpdate, onImageRemove }) => {
  const [imageError, setImageError] = useState(false);
  const [editingImageIndex, setEditingImageIndex] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  const fallbackImage = '/Ayur4life_logo_round_png-01.png';

  const handleImageUpload = async (event, index) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      await onImageUpdate(product.id, index, file);
      setEditingImageIndex(null);
    } catch (error) {
      console.error('Failed to update image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (index) => {
    try {
      await onImageRemove(product.id, index);
    } catch (error) {
      console.error('Failed to remove image:', error);
    }
  };

  return (
    <Card className="h-100 product-card shadow-sm">
      <div className="position-relative product-image-container">
        <Card.Img 
          variant="top" 
          src={imageError ? fallbackImage : (product.images?.[0] || fallbackImage)} 
          alt={product.name}
          onError={handleImageError}
          className="product-image"
        />
        
        {/* Video indicator badge */}
        {product.video && (
          <Badge bg="info" className="position-absolute top-0 start-0 m-2 video-badge">
            <FontAwesomeIcon icon={faVideo} className="me-1" />
            Video
          </Badge>
        )}
        
        {/* Stock status badge */}
        {product.stock === 0 ? (
          <Badge bg="danger" className="position-absolute top-0 end-0 m-2 stock-badge">
            Out of Stock
          </Badge>
        ) : product.stock < 10 ? (
          <Badge bg="warning" className="position-absolute top-0 end-0 m-2 stock-badge">
            Low Stock
          </Badge>
        ) : null}
        
        {/* Wishlist button */}
        <Button
          variant="light"
          size="sm"
          className="position-absolute top-0 end-0 m-2 wishlist-btn"
          onClick={() => onWishlistToggle(product.id)}
        >
          <FontAwesomeIcon 
            icon={isInWishlist ? faHeart : farHeart} 
            className={isInWishlist ? 'text-danger' : 'text-muted'}
          />
        </Button>
        
        {/* Admin image management controls */}
        {isAdminView && product.images && product.images.length > 0 && (
          <div className="position-absolute bottom-0 start-0 end-0 p-2 admin-image-controls">
            <div className="d-flex justify-content-center gap-2">
              {product.images.map((img, index) => (
                <div key={index} className="position-relative">
                  <img 
                    src={img || fallbackImage} 
                    alt={`Thumb ${index + 1}`}
                    className="admin-thumbnail"
                    onClick={() => setEditingImageIndex(editingImageIndex === index ? null : index)}
                    onError={(e) => {
                      e.target.src = fallbackImage;
                    }}
                  />
                  {editingImageIndex === index && (
                    <div className="image-edit-menu">
                      <label className="btn btn-sm btn-primary mb-1 w-100">
                        {uploading ? 'Uploading...' : 'Replace'}
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="d-none"
                          onChange={(e) => handleImageUpload(e, index)}
                          disabled={uploading}
                        />
                      </label>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        className="w-100"
                        onClick={() => handleRemoveImage(index)}
                        disabled={product.images.length <= 1}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Hover overlay with quick actions */}
        <div className="product-overlay">
          <Button 
            variant="success" 
            size="sm"
            onClick={() => onAddToCart(product.id)}
            disabled={product.stock === 0}
            className="overlay-btn"
          >
            <FontAwesomeIcon icon={faShoppingCart} className="me-1" />
            Add to Cart
          </Button>
          <Button 
            as={Link} 
            to={`/product/${product.id}`} 
            variant="outline-light" 
            size="sm"
            className="overlay-btn"
          >
            View Details
          </Button>
        </div>
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold product-title">{product.name}</Card.Title>
        <Card.Text className="text-muted small mb-2 product-category">
          {product.category} • {formatQuantityUnit(product.quantityUnit)}
        </Card.Text>
        <Card.Text className="flex-grow-1 product-description">
          {product.description?.substring(0, 100)}...
        </Card.Text>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <span className="h5 text-success mb-0 product-price">₹{product.price}</span>
            <small className="text-muted d-block">+18% GST</small>
          </div>
          <div className="product-rating">
            <ProductRating 
              rating={product.rating || 0} 
              reviewCount={product.reviewCount || 0}
              size="sm"
              showCount={true}
            />
          </div>
        </div>
        <div className="d-flex gap-2 product-actions">
          <Button 
            variant="success" 
            size="sm" 
            className="flex-grow-1"
            onClick={() => onAddToCart(product.id)}
            disabled={product.stock === 0}
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