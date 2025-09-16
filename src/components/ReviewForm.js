import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import './ReviewForm.css';

const ReviewForm = ({ productId, onSubmit, onCancel, existingReview = null }) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Review comment must be at least 10 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit({ rating, comment });
      // Reset form if not editing
      if (!existingReview) {
        setRating(0);
        setComment('');
      }
    } catch (error) {
      setError(error.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const renderStars = () => {
    const stars = [];
    const displayRating = hoveredRating || rating;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={i <= displayRating ? faStar : farStar}
          className={`star-rating ${i <= displayRating ? 'text-warning' : 'text-muted'}`}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={handleStarLeave}
          style={{ cursor: 'pointer', fontSize: '1.5rem', marginRight: '0.25rem' }}
        />
      );
    }
    return stars;
  };

  return (
    <div className="review-form-container p-3 border rounded">
      <h5 className="mb-3">
        {existingReview ? 'Edit Your Review' : 'Write a Review'}
      </h5>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Rating *</Form.Label>
          <div className="d-flex align-items-center">
            {renderStars()}
            <span className="ms-2 text-muted">
              {rating > 0 && `(${rating} out of 5)`}
            </span>
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Review Comment *</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product (minimum 10 characters)..."
            required
          />
          <Form.Text className="text-muted">
            {comment.length}/500 characters
          </Form.Text>
        </Form.Group>

        <Row className="g-2">
          <Col xs="auto">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="px-4"
            >
              {loading ? 'Submitting...' : (existingReview ? 'Update Review' : 'Submit Review')}
            </Button>
          </Col>
          {onCancel && (
            <Col xs="auto">
              <Button
                type="button"
                variant="outline-secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            </Col>
          )}
        </Row>
      </Form>
    </div>
  );
};

export default ReviewForm;
