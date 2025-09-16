import React, { useState } from 'react';
import { Card, Badge, Button, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faEdit, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import ReviewForm from './ReviewForm';

const ReviewList = ({ reviews, productId, currentUserId, onReviewUpdate, onReviewDelete }) => {
  const [editingReview, setEditingReview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEditReview = (review) => {
    setEditingReview(review);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  const handleUpdateReview = async (reviewData) => {
    try {
      await onReviewUpdate(editingReview.id, reviewData);
      setEditingReview(null);
    } catch (error) {
      console.error('Failed to update review:', error);
    }
  };

  const handleDeleteClick = (review) => {
    setReviewToDelete(review);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;
    
    setLoading(true);
    try {
      await onReviewDelete(reviewToDelete.id);
      setShowDeleteModal(false);
      setReviewToDelete(null);
    } catch (error) {
      console.error('Failed to delete review:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={i <= rating ? faStar : farStar}
          className={i <= rating ? 'text-warning' : 'text-muted'}
          style={{ fontSize: '0.9rem' }}
        />
      );
    }
    return stars;
  };

  const formatDate = (dateInput) => {
    try {
      let date;
      
      // Handle Firestore Timestamp
      if (dateInput && dateInput.toDate) {
        date = dateInput.toDate();
      }
      // Handle regular Date object
      else if (dateInput instanceof Date) {
        date = dateInput;
      }
      // Handle string or timestamp
      else if (dateInput) {
        date = new Date(dateInput);
      }
      // If no valid date, return fallback
      else {
        return 'Recently';
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Recently';
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Recently';
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center text-muted py-4">
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="review-list">
      {editingReview && (
        <div className="mb-4">
          <ReviewForm
            productId={productId}
            existingReview={editingReview}
            onSubmit={handleUpdateReview}
            onCancel={handleCancelEdit}
          />
        </div>
      )}

      {reviews.map((review) => (
        <Card key={review.id} className="mb-3 review-card">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div className="d-flex align-items-center">
                <div className="me-2">
                  <FontAwesomeIcon icon={faUser} className="text-muted" />
                </div>
                                 <div>
                   <strong className="me-2">{review.userName || 'Customer'}</strong>
                   <small className="text-muted">
                     {formatDate(review.createdAt)}
                   </small>
                 </div>
              </div>
              
              {currentUserId === review.userId && (
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleEditReview(review)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="me-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteClick(review)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="me-1" />
                    Delete
                  </Button>
                </div>
              )}
            </div>

            <div className="mb-2">
              <div className="d-flex align-items-center">
                {renderStars(review.rating)}
                <Badge bg="secondary" className="ms-2">
                  {review.rating}/5
                </Badge>
              </div>
            </div>

            <p className="mb-0">{review.comment}</p>
          </Card.Body>
        </Card>
      ))}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete your review? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleConfirmDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Review'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReviewList;
