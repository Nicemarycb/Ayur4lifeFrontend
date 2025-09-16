// Delivery charge calculation utility

// Base delivery charges for different distance ranges (in km)
const DELIVERY_CHARGES = {
  LOCAL: { range: 5, charge: 50 },
  NEARBY: { range: 10, charge: 80 },
  MEDIUM: { range: 25, charge: 120 },
  FAR: { range: 50, charge: 200 },
  VERY_FAR: { range: 100, charge: 300 }
};

// Calculate delivery charge based on distance and order value
export const calculateDeliveryCharge = (distance, orderValue, productDeliveryCharge = 0, freeDeliveryThreshold = 0) => {
  // If order value is above free delivery threshold, delivery is free
  if (freeDeliveryThreshold > 0 && orderValue >= freeDeliveryThreshold) {
    return 0;
  }

  // Calculate base delivery charge based on distance
  let baseCharge = 0;
  
  if (distance <= DELIVERY_CHARGES.LOCAL.range) {
    baseCharge = DELIVERY_CHARGES.LOCAL.charge;
  } else if (distance <= DELIVERY_CHARGES.NEARBY.range) {
    baseCharge = DELIVERY_CHARGES.NEARBY.charge;
  } else if (distance <= DELIVERY_CHARGES.MEDIUM.range) {
    baseCharge = DELIVERY_CHARGES.MEDIUM.charge;
  } else if (distance <= DELIVERY_CHARGES.FAR.range) {
    baseCharge = DELIVERY_CHARGES.FAR.charge;
  } else if (distance <= DELIVERY_CHARGES.VERY_FAR.range) {
    baseCharge = DELIVERY_CHARGES.VERY_FAR.charge;
  } else {
    // For distances beyond 100km, add ₹50 for every additional 25km
    const additionalDistance = distance - DELIVERY_CHARGES.VERY_FAR.range;
    const additionalCharge = Math.ceil(additionalDistance / 25) * 50;
    baseCharge = DELIVERY_CHARGES.VERY_FAR.charge + additionalCharge;
  }

  // Add product-specific delivery charge if any
  const totalCharge = baseCharge + productDeliveryCharge;

  return totalCharge;
};

// Get delivery time estimate based on distance
export const getDeliveryTime = (distance) => {
  if (distance <= DELIVERY_CHARGES.LOCAL.range) {
    return "Same day delivery";
  } else if (distance <= DELIVERY_CHARGES.NEARBY.range) {
    return "1-2 business days";
  } else if (distance <= DELIVERY_CHARGES.MEDIUM.range) {
    return "2-3 business days";
  } else if (distance <= DELIVERY_CHARGES.FAR.range) {
    return "3-5 business days";
  } else {
    return "5-7 business days";
  }
};

// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

// Get delivery charge breakdown
export const getDeliveryBreakdown = (distance, orderValue, productDeliveryCharge = 0, freeDeliveryThreshold = 0) => {
  const baseCharge = calculateDeliveryCharge(distance, 0, 0, 0); // Calculate without product charge
  const totalCharge = calculateDeliveryCharge(distance, orderValue, productDeliveryCharge, freeDeliveryThreshold);
  
  return {
    baseCharge,
    productCharge: productDeliveryCharge,
    totalCharge,
    isFree: totalCharge === 0,
    deliveryTime: getDeliveryTime(distance),
    distance: distance
  };
};
