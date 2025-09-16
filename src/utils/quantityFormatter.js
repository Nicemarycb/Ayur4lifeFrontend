// Quantity unit formatting utility

export const formatQuantityUnit = (unit, quantity = 1) => {
  if (!unit) return 'piece';
  
  const unitMap = {
    'piece': 'piece',
    'pieces': 'pieces',
    'kg': 'kg',
    'gram': 'g',
    'grams': 'g',
    'liter': 'L',
    'liters': 'L',
    'ml': 'ml',
    'pack': 'pack',
    'packs': 'packs',
    'bottle': 'bottle',
    'bottles': 'bottles',
    'box': 'box',
    'boxes': 'boxes',
    'sachet': 'sachet',
    'sachets': 'sachets',
    'tablet': 'tablet',
    'tablets': 'tablets',
    'capsule': 'capsule',
    'capsules': 'capsules',
    'drop': 'drop',
    'drops': 'drops'
  };

  const formattedUnit = unitMap[unit.toLowerCase()] || unit;
  
  // Handle plural forms
  if (quantity > 1 && !formattedUnit.endsWith('s')) {
    const pluralMap = {
      'piece': 'pieces',
      'pack': 'packs',
      'bottle': 'bottles',
      'box': 'boxes',
      'sachet': 'sachets',
      'tablet': 'tablets',
      'capsule': 'capsules',
      'drop': 'drops'
    };
    
    return pluralMap[formattedUnit] || formattedUnit;
  }
  
  return formattedUnit;
};

export const getQuantityDisplay = (quantity, unit) => {
  const formattedUnit = formatQuantityUnit(unit, quantity);
  return `${quantity} ${formattedUnit}`;
};

export const getQuantityLabel = (unit) => {
  const formattedUnit = formatQuantityUnit(unit);
  return `Quantity (${formattedUnit})`;
};
