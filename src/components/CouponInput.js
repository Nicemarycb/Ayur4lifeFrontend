import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Dropdown, Badge } from 'react-bootstrap';
import axios from 'axios';

const CouponInput = ({ onCouponApplied, onCouponRemoved, appliedCoupon, orderAmount }) => {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  // Fetch available coupons when component mounts or orderAmount changes
  useEffect(() => {
    if (orderAmount > 0) {
      fetchAvailableCoupons();
    }
  }, [orderAmount]);

  const fetchAvailableCoupons = async () => {
    try {
      setLoadingCoupons(true);
      const response = await axios.get(`/api/coupons/available?orderAmount=${orderAmount}`);
      setAvailableCoupons(response.data);
    } catch (err) {
      console.error('Failed to fetch available coupons:', err);
      // Don't show error to user for this, just log it
    } finally {
      setLoadingCoupons(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('/api/coupons/validate', {
        code: couponCode.trim(),
        orderAmount: orderAmount
      });

      if (response.data.valid) {
        // Create a properly formatted coupon object
        const couponData = {
          valid: true,
          coupon: response.data.coupon,
          discountAmount: response.data.discountAmount,
          finalAmount: response.data.finalAmount
        };
        onCouponApplied(couponData);
        setCouponCode('');
        setError(null);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to apply coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    onCouponRemoved();
    setError(null);
  };

  const handleSelectCoupon = (coupon) => {
    setCouponCode(coupon.code);
    // Auto-apply the selected coupon
    setTimeout(() => {
      handleApplyCoupon();
    }, 100);
  };

  if (appliedCoupon) {
    return (
      <div className="mb-3">
        <Alert variant="success" className="mb-2">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Coupon Applied: {appliedCoupon.coupon.code}</strong>
              <div className="small text-muted">
                {appliedCoupon.coupon.discountType === 'percentage' 
                  ? `${appliedCoupon.coupon.discountValue}% off`
                  : `₹${appliedCoupon.coupon.discountValue} off`
                }
              </div>
              <div className="small">
                Discount: ₹{appliedCoupon.discountAmount}
              </div>
            </div>
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={handleRemoveCoupon}
            >
              Remove
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mb-3">
      {/* Available Coupons Section */}
      {availableCoupons.length > 0 && (
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted">Available Coupons:</small>
            {loadingCoupons && <Spinner animation="border" size="sm" />}
          </div>
          <div className="d-flex flex-wrap gap-2">
            {availableCoupons.map((coupon) => (
              <Button
                key={coupon.id}
                variant="outline-success"
                size="sm"
                className="text-nowrap"
                onClick={() => handleSelectCoupon(coupon)}
                disabled={loading}
              >
                <div className="d-flex flex-column align-items-center">
                  <strong>{coupon.code}</strong>
                  <small>
                    {coupon.discountType === 'percentage' 
                      ? `${coupon.discountValue}% off`
                      : `₹${coupon.discountValue} off`
                    }
                  </small>
                  {coupon.potentialDiscount > 0 && (
                    <Badge bg="success" className="mt-1">
                      Save ₹{coupon.potentialDiscount}
                    </Badge>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Manual Coupon Input */}
      <div className="d-flex gap-2">
        <Form.Control
          type="text"
          placeholder="Enter coupon code manually"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          disabled={loading}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleApplyCoupon();
            }
          }}
        />
        <Button 
          type="button" 
          variant="outline-primary" 
          disabled={loading || !couponCode.trim()}
          onClick={handleApplyCoupon}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Applying...
            </>
          ) : (
            'Apply'
          )}
        </Button>
      </div>
      
      {error && (
        <Alert variant="danger" className="mt-2 mb-0" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
    </div>
  );
};

export default CouponInput;
