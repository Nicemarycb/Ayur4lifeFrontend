import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faTruck, faClock } from '@fortawesome/free-solid-svg-icons';
import { calculateDeliveryCharge, getDeliveryTime, calculateDistance } from '../utils/deliveryCalculator';

const DeliveryChargeCalculator = ({ 
  cartItems, 
  userAddress, 
  onDeliveryChargeChange,
  storeLocation = { lat: 28.6139, lng: 77.2090 } // Default to Delhi coordinates
}) => {
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [distance, setDistance] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate total order value
  const orderValue = cartItems.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  // Calculate total product delivery charges
  const totalProductDeliveryCharge = cartItems.reduce((total, item) => {
    return total + (item.product.deliveryCharge || 0);
  }, 0);

  // Get the highest free delivery threshold from all products
  const maxFreeDeliveryThreshold = Math.max(
    ...cartItems.map(item => item.product.freeDeliveryThreshold || 0)
  );

  useEffect(() => {
    if (userAddress) {
      setDeliveryAddress(userAddress);
      calculateDelivery(userAddress);
    }
  }, [userAddress]);

  const calculateDelivery = async (address) => {
    setIsCalculating(true);
    
    try {
      // In a real application, you would use a geocoding service like Google Maps API
      // For now, we'll simulate distance calculation
      const estimatedDistance = await estimateDistanceFromAddress(address);
      setDistance(estimatedDistance);
      
      const charge = calculateDeliveryCharge(
        estimatedDistance, 
        orderValue, 
        totalProductDeliveryCharge, 
        maxFreeDeliveryThreshold
      );
      
      setDeliveryCharge(charge);
      setDeliveryTime(getDeliveryTime(estimatedDistance));
      
      // Notify parent component
      onDeliveryChargeChange({
        charge,
        distance: estimatedDistance,
        deliveryTime,
        isFree: charge === 0
      });
      
    } catch (error) {
      console.error('Error calculating delivery:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const estimateDistanceFromAddress = async (address) => {
    // This is a simplified distance estimation
    // In a real application, you would use Google Maps Geocoding API
    
    // Simulate different distances based on address keywords
    const addressLower = address.toLowerCase();
    
    if (addressLower.includes('delhi') || addressLower.includes('new delhi')) {
      return Math.random() * 20 + 5; // 5-25 km
    } else if (addressLower.includes('mumbai') || addressLower.includes('bombay')) {
      return Math.random() * 50 + 100; // 100-150 km
    } else if (addressLower.includes('bangalore') || addressLower.includes('bengaluru')) {
      return Math.random() * 100 + 200; // 200-300 km
    } else if (addressLower.includes('chennai') || addressLower.includes('madras')) {
      return Math.random() * 150 + 300; // 300-450 km
    } else {
      return Math.random() * 200 + 50; // 50-250 km
    }
  };

  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setDeliveryAddress(newAddress);
    
    if (newAddress.length > 10) {
      calculateDelivery(newAddress);
    }
  };

  const getDeliveryBreakdown = () => {
    const baseCharge = calculateDeliveryCharge(distance, 0, 0, 0);
    const productCharge = totalProductDeliveryCharge;
    
    return {
      baseCharge,
      productCharge,
      totalCharge: deliveryCharge,
      isFree: deliveryCharge === 0
    };
  };

  const breakdown = getDeliveryBreakdown();

  return (
    <Card className="mb-3">
      <Card.Header>
        <h6 className="mb-0">
          <FontAwesomeIcon icon={faTruck} className="me-2" />
          Delivery Information
        </h6>
      </Card.Header>
      <Card.Body>
        <Form.Group className="mb-3">
          <Form.Label>
            <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
            Delivery Address
          </Form.Label>
          <Form.Control
            as="textarea"
            rows="3"
            value={deliveryAddress}
            onChange={handleAddressChange}
            placeholder="Enter your complete delivery address..."
          />
        </Form.Group>

        {distance > 0 && (
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span>Estimated Distance:</span>
              <Badge bg="info">{distance.toFixed(1)} km</Badge>
            </div>
            
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span>Delivery Time:</span>
              <Badge bg="warning">
                <FontAwesomeIcon icon={faClock} className="me-1" />
                {deliveryTime}
              </Badge>
            </div>
          </div>
        )}

        {isCalculating ? (
          <Alert variant="info">
            <small>Calculating delivery charge...</small>
          </Alert>
        ) : deliveryCharge > 0 ? (
          <div className="delivery-breakdown">
            <h6 className="mb-2">Delivery Charge Breakdown:</h6>
            <div className="bg-light p-3 rounded">
              <div className="d-flex justify-content-between mb-1">
                <span>Base Delivery:</span>
                <span>₹{breakdown.baseCharge}</span>
              </div>
              {breakdown.productCharge > 0 && (
                <div className="d-flex justify-content-between mb-1">
                  <span>Product Charges:</span>
                  <span>₹{breakdown.productCharge}</span>
                </div>
              )}
              <hr className="my-2" />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total Delivery:</span>
                <span className="text-success">₹{deliveryCharge}</span>
              </div>
            </div>
          </div>
        ) : deliveryCharge === 0 && distance > 0 ? (
          <Alert variant="success">
            <strong>Free Delivery!</strong> Your order qualifies for free delivery.
          </Alert>
        ) : null}

        {maxFreeDeliveryThreshold > 0 && orderValue < maxFreeDeliveryThreshold && (
          <Alert variant="info" className="mt-2">
            <small>
              Add ₹{(maxFreeDeliveryThreshold - orderValue).toFixed(2)} more to your order for free delivery!
            </small>
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default DeliveryChargeCalculator;
