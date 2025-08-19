// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHeart, faShoppingCart, faStar } from '@fortawesome/free-solid-svg-icons';
// import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
// import axios from 'axios';
// import { useCart } from '../contexts/CartContext';
// import { useWishlist } from '../contexts/WishlistContext';
// import UserLayout from '../layouts/UserLayout';

// const CategoryProducts = () => {
//   const { category } = useParams();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortBy, setSortBy] = useState('name');
//   const [sortOrder, setSortOrder] = useState('asc');
  
//   const { addToCart } = useCart();
//   const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

//   useEffect(() => {
//     fetchProducts();
//   }, [category]);

//   const fetchProducts = async () => {
//   try {
//     setLoading(true);
//     setError(null);
//     const response = await axios.get(`/api/products/category/${encodeURIComponent(category)}`);
//     setProducts(response.data.products); // <-- Use .products here!
//   } catch (err) {
//     setError(err.response?.data?.message || 'Failed to fetch products');
//   } finally {
//     setLoading(false);
//   }
// };

//   const handleSort = (field) => {
//     if (sortBy === field) {
//       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortBy(field);
//       setSortOrder('asc');
//     }
//   };

//   const sortedProducts = [...products].sort((a, b) => {
//     let aValue = a[sortBy];
//     let bValue = b[sortBy];

//     if (sortBy === 'price') {
//       aValue = parseFloat(a.price);
//       bValue = parseFloat(b.price);
//     } else if (sortBy === 'rating') {
//       aValue = parseFloat(a.rating || 0);
//       bValue = parseFloat(b.rating || 0);
//     } else {
//       aValue = String(aValue || '').toLowerCase();
//       bValue = String(bValue || '').toLowerCase();
//     }

//     if (sortOrder === 'asc') {
//       return aValue > bValue ? 1 : -1;
//     } else {
//       return aValue < bValue ? 1 : -1;
//     }
//   });

//   const handleAddToCart = async (product) => {
//     try {
//       await addToCart(product.id, 1);
//     } catch (err) {
//       console.error('Failed to add to cart:', err);
//     }
//   };

//   const handleWishlistToggle = async (product) => {
//     try {
//       if (isInWishlist(product.id)) {
//         await removeFromWishlist(product.id);
//       } else {
//         await addToWishlist(product.id);
//       }
//     } catch (err) {
//       console.error('Failed to toggle wishlist:', err);
//     }
//   };

//   const getCategoryDisplayName = (categoryName) => {
//     return categoryName.charAt(0).toUpperCase() + categoryName.slice(1).replace(/-/g, ' ');
//   };

//   if (loading) {
//     return (
//       <UserLayout>
//         <Container className="py-5">
//           <div className="text-center">
//             <Spinner animation="border" role="status" className="text-primary">
//               <span className="visually-hidden">Loading...</span>
//             </Spinner>
//             <p className="mt-3">Loading products...</p>
//           </div>
//         </Container>
//       </UserLayout>
//     );
//   }

//   if (error) {
//     return (
//       <UserLayout>
//         <Container className="py-5">
//           <Alert variant="danger">
//             <Alert.Heading>Error</Alert.Heading>
//             <p>{error}</p>
//             <Button variant="outline-danger" onClick={fetchProducts}>
//               Try Again
//             </Button>
//           </Alert>
//         </Container>
//       </UserLayout>
//     );
//   }

//   return (
//     <UserLayout>
//       <Container className="py-5">
//       <div className="mb-4">
//         <h1 className="text-center mb-3">
//           {getCategoryDisplayName(category)} Products
//         </h1>
//         <p className="text-center text-muted">
//           Discover our premium {getCategoryDisplayName(category).toLowerCase()} collection
//         </p>
//       </div>

//       {products.length > 0 && (
//         <div className="mb-4">
//           <Row className="align-items-center">
//             <Col md={6}>
//               <p className="mb-0">
//                 Showing {products.length} product{products.length !== 1 ? 's' : ''}
//               </p>
//             </Col>
//             <Col md={6} className="text-md-end">
//               <div className="d-flex gap-2 justify-content-md-end">
//                 <span className="text-muted">Sort by:</span>
//                 <Button
//                   variant={sortBy === 'name' ? 'primary' : 'outline-primary'}
//                   size="sm"
//                   onClick={() => handleSort('name')}
//                 >
//                   Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
//                 </Button>
//                 <Button
//                   variant={sortBy === 'price' ? 'primary' : 'outline-primary'}
//                   size="sm"
//                   onClick={() => handleSort('price')}
//                 >
//                   Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
//                 </Button>
//                 <Button
//                   variant={sortBy === 'rating' ? 'primary' : 'outline-primary'}
//                   size="sm"
//                   onClick={() => handleSort('rating')}
//                 >
//                   Rating {sortBy === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
//                 </Button>
//               </div>
//             </Col>
//           </Row>
//         </div>
//       )}

//       {sortedProducts.length === 0 ? (
//         <div className="text-center py-5">
//           <h3 className="text-muted">No products found</h3>
//           <p className="text-muted">
//             No products available in the {getCategoryDisplayName(category).toLowerCase()} category.
//           </p>
//           <Link to="/" className="btn btn-primary">
//             Browse All Products
//           </Link>
//         </div>
//       ) : (
//         <Row>
//           {sortedProducts.map((product) => (
//             <Col key={product.id} lg={4} md={6} className="mb-4">
//               <Card className="h-100 product-card">
//                 <div className="product-image-container">
//                   <Card.Img
//                     variant="top"
//                     src={product.images?.[0] || '/placeholder-product.jpg'}
//                     alt={product.name}
//                     className="product-image"
//                   />
//                   <div className="product-overlay">
//                     <Button
//                       variant="outline-light"
//                       size="sm"
//                       className="overlay-btn"
//                       onClick={() => handleWishlistToggle(product)}
//                     >
//                       <FontAwesomeIcon
//                         icon={isInWishlist(product.id) ? faHeart : farHeart}
//                         className={isInWishlist(product.id) ? 'text-danger' : ''}
//                       />
//                     </Button>
//                     <Button
//                       variant="outline-light"
//                       size="sm"
//                       className="overlay-btn"
//                       onClick={() => handleAddToCart(product)}
//                     >
//                       <FontAwesomeIcon icon={faShoppingCart} />
//                     </Button>
//                   </div>
//                   {product.stock < 10 && product.stock > 0 && (
//                     <Badge bg="warning" className="position-absolute top-0 end-0 m-2">
//                       Low Stock
//                     </Badge>
//                   )}
//                   {product.stock === 0 && (
//                     <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
//                       Out of Stock
//                     </Badge>
//                   )}
//                 </div>
//                 <Card.Body className="d-flex flex-column">
//                   <div className="mb-2">
//                     <Badge bg="secondary" className="mb-2">
//                       {product.category}
//                     </Badge>
//                   </div>
//                   <Card.Title className="product-title">
//                     <Link to={`/product/${product.id}`} className="text-decoration-none">
//                       {product.name}
//                     </Link>
//                   </Card.Title>
//                   <div className="mb-2">
//                     <div className="d-flex align-items-center">
//                       {[...Array(5)].map((_, i) => (
//                         <FontAwesomeIcon
//                           key={i}
//                           icon={faStar}
//                           className={i < Math.floor(product.rating || 0) ? 'text-warning' : 'text-muted'}
//                           size="sm"
//                         />
//                       ))}
//                       <span className="ms-2 text-muted small">
//                         ({product.rating || 0})
//                       </span>
//                     </div>
//                   </div>
//                   <div className="mb-3">
//                     <span className="h5 text-primary mb-0">₹{product.price}</span>
//                     {product.gst && (
//                       <span className="text-muted small ms-2">+ {product.gst}% GST</span>
//                     )}
//                   </div>
//                   <Card.Text className="flex-grow-1">
//                     {product.description?.substring(0, 100)}
//                     {product.description?.length > 100 && '...'}
//                   </Card.Text>
//                   <div className="mt-auto">
//                     <div className="d-grid gap-2">
//                       <Button
//                         variant="primary"
//                         onClick={() => handleAddToCart(product)}
//                         disabled={product.stock === 0}
//                       >
//                         <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
//                         Add to Cart
//                       </Button>
//                       <Button
//                         variant={isInWishlist(product.id) ? 'danger' : 'outline-danger'}
//                         onClick={() => handleWishlistToggle(product)}
//                       >
//                         <FontAwesomeIcon
//                           icon={isInWishlist(product.id) ? faHeart : farHeart}
//                           className="me-2"
//                         />
//                         {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
//                       </Button>
//                     </div>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       )}
//     </Container>
//     </UserLayout>
//   );
// };

// export default CategoryProducts;
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart, faStar } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import UserLayout from '../layouts/UserLayout';


const CategoryProducts = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/products/category/${encodeURIComponent(category)}`);
      console.log('API Response for CategoryProducts:', response.data); // Debug log
      setProducts(response.data.products || []);
    } catch (err) {
      console.error('Fetch error in CategoryProducts:', err);
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'price') {
      aValue = parseFloat(a.price);
      bValue = parseFloat(b.price);
    } else if (sortBy === 'rating') {
      aValue = parseFloat(a.rating || 0);
      bValue = parseFloat(b.rating || 0);
    } else {
      aValue = String(aValue || '').toLowerCase();
      bValue = String(bValue || '').toLowerCase();
    }

    return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
  });

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product.id, 1);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

// src/pages/CategoryProducts.js

// src/pages/ProductDetail.js

const handleWishlistToggle = async (product) => {
if (isInWishlist(product.id)) {
  const item = wishlist.find(w => w.product.id === product.id);
  if (item) {
    await removeFromWishlist(item.id);
  }
} else {
  await addToWishlist(product.id);
}
};

  const getCategoryDisplayName = (categoryName) => {
    return categoryName.charAt(0).toUpperCase() + categoryName.slice(1).replace(/-/, ' ');
  };

  if (loading) {
    return (
      <UserLayout>
        <Container className="py-5">
          <div className="text-center">
            <Spinner animation="border" role="status" className="text-primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Loading products...</p>
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
            <Button variant="outline-danger" onClick={fetchProducts}>
              Try Again
            </Button>
          </Alert>
        </Container>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <Container className="py-5">
        <div className="mb-4">
          <h1 className="text-center mb-3">
            {getCategoryDisplayName(category)} Products
          </h1>
          <p className="text-center text-muted">
            Discover our premium {getCategoryDisplayName(category).toLowerCase()} collection
          </p>
        </div>

        {products.length > 0 && (
          <div className="mb-4">
            <Row className="align-items-center">
              <Col md={6}>
                <p className="mb-0">
                  Showing {products.length} product{products.length !== 1 ? 's' : ''}
                </p>
              </Col>
              <Col md={6} className="text-md-end">
                <div className="d-flex gap-2 justify-content-md-end">
                  <span className="text-muted">Sort by:</span>
                  <Button
                    variant={sortBy === 'name' ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => handleSort('name')}
                  >
                    Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </Button>
                  <Button
                    variant={sortBy === 'price' ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => handleSort('price')}
                  >
                    Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </Button>
                  <Button
                    variant={sortBy === 'rating' ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => handleSort('rating')}
                  >
                    Rating {sortBy === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        )}

        {sortedProducts.length === 0 ? (
          <div className="text-center py-5">
            <h3 className="text-muted">No products found</h3>
            <p className="text-muted">
              No products available in the {getCategoryDisplayName(category).toLowerCase()} category.
            </p>
            <Link to="/" className="btn btn-primary">
              Browse All Products
            </Link>
          </div>
        ) : (
          <Row>
            {sortedProducts.map((product) => (
              <Col key={product.id} lg={4} md={6} className="mb-4">
                <Card className="h-100 product-card">
                  <div className="product-image-container">
                    <Card.Img
                      variant="top"
                      src={product.images?.[0] || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="product-image"
                    />
                    <div className="product-overlay">
                      <Button
                        variant="outline-light"
                        size="sm"
                        className="overlay-btn"
                        onClick={() => handleWishlistToggle(product)}
                      >
                        <FontAwesomeIcon
                          icon={isInWishlist(product.id) ? faHeart : farHeart}
                          className={isInWishlist(product.id) ? 'text-danger' : ''}
                        />
                      </Button>
                      <Button
                        variant="outline-light"
                        size="sm"
                        className="overlay-btn"
                        onClick={() => handleAddToCart(product)}
                      >
                        <FontAwesomeIcon icon={faShoppingCart} />
                      </Button>
                    </div>
                    {product.stock < 10 && product.stock > 0 && (
                      <Badge bg="warning" className="position-absolute top-0 end-0 m-2">
                        Low Stock
                      </Badge>
                    )}
                    {product.stock === 0 && (
                      <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <div className="mb-2">
                      <Badge bg="secondary" className="mb-2">
                        {product.category}
                      </Badge>
                    </div>
                    <Card.Title className="product-title">
                      <Link to={`/product/${product.id}`} className="text-decoration-none">
                        {product.name}
                      </Link>
                    </Card.Title>
                    <div className="mb-2">
                      <div className="d-flex align-items-center">
                        {[...Array(5)].map((_, i) => (
                          <FontAwesomeIcon
                            key={i}
                            icon={faStar}
                            className={i < Math.floor(product.rating || 0) ? 'text-warning' : 'text-muted'}
                            size="sm"
                          />
                        ))}
                        <span className="ms-2 text-muted small">
                          ({product.rating || 0})
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <span className="h5 text-primary mb-0">₹{product.price}</span>
                      {product.gst && (
                        <span className="text-muted small ms-2">+ {product.gst}% GST</span>
                      )}
                    </div>
                    <Card.Text className="flex-grow-1">
                      {product.description?.substring(0, 100)}
                      {product.description?.length > 100 && '...'}
                    </Card.Text>
                    <div className="mt-auto">
                      <div className="d-grid gap-2">
                        <Button
                          variant="primary"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                        >
                          <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                          Add to Cart
                        </Button>
                        <Button
                          variant={isInWishlist(product.id) ? 'danger' : 'outline-danger'}
                          onClick={() => handleWishlistToggle(product)}
                        >
                          <FontAwesomeIcon
                            icon={isInWishlist(product.id) ? faHeart : farHeart}
                            className="me-2"
                          />
                          {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </UserLayout>
  );
};

export default CategoryProducts;