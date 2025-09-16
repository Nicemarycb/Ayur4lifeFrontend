import React from 'react';
import { Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';

const ProductRating = ({ rating, reviewCount, size = 'md', showCount = true }) => {
  // Handle case when rating is 0, null, or undefined
  if (!rating || rating === 0) {
    return (
      <div className="d-flex align-items-center">
        <div className="d-flex align-items-center me-2">
          {[...Array(5)].map((_, i) => (
            <FontAwesomeIcon
              key={i}
              icon={farStar}
              className="text-muted"
              style={{ fontSize: size === 'sm' ? '0.8rem' : '1rem' }}
            />
          ))}
          <span className="ms-1 text-muted small">No ratings</span>
        </div>
        {showCount && reviewCount > 0 && (
          <Badge bg="secondary" className="ms-1">{reviewCount} reviews</Badge>
        )}
      </div>
    );
  }

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={`full-${i}`}
          icon={faStar}
          className="text-warning"
          style={{ fontSize: size === 'sm' ? '0.8rem' : '1rem' }}
        />
      );
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="position-relative d-inline-block">
          <FontAwesomeIcon
            icon={faStar}
            className="text-muted"
            style={{ fontSize: size === 'sm' ? '0.8rem' : '1rem' }}
          />
          <div className="position-absolute top-0 start-0 overflow-hidden" style={{ width: '50%' }}>
            <FontAwesomeIcon
              icon={faStar}
              className="text-warning"
              style={{ fontSize: size === 'sm' ? '0.8rem' : '1rem' }}
            />
          </div>
        </div>
      );
    }
    
    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={`empty-${i}`}
          icon={farStar}
          className="text-muted"
          style={{ fontSize: size === 'sm' ? '0.8rem' : '1rem' }}
        />
      );
    }
    
    return stars;
  };

  return (
    <div className="d-flex align-items-center">
      <div className="d-flex align-items-center me-2">
        {renderStars()}
        <span className="ms-1 fw-bold text-warning">{rating}</span>
      </div>
      {showCount && reviewCount > 0 && (
        <Badge bg="secondary" className="ms-1">
          {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
        </Badge>
      )}
    </div>
  );
};

export default ProductRating;
