// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { Navbar, Nav, Container, Form, Button, Dropdown, Badge } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import logo1 from '../assets/Ayur4life_logo_round_png-01.png'; // Adjust the path as necessary
// import { 
//   faSearch, 
//   faShoppingCart, 
//   faHeart, 
//   faUser, 
//   faSignOutAlt,
//   faCog,
//   faList
// } from '@fortawesome/free-solid-svg-icons';
// import { useUserAuth } from '../contexts/UserAuthContext';
// import { useCart } from '../contexts/CartContext';
// import { useWishlist } from '../contexts/WishlistContext';

// const NavigationBar = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [categories, setCategories] = useState([]);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, logout, isAuthenticated } = useUserAuth();
//   const { cartItemCount } = useCart();
//   const { wishlistCount } = useWishlist();

//   useEffect(() => {
//     // Load categories
//     const loadCategories = async () => {
//        try {
//       const response = await fetch('http://localhost:5000/api/products/categories/all');
//       const data = await response.json();
//       setCategories(data || []); // <-- fix here
//     } catch (error) {
//       console.error('Error loading categories:', error);
//     }
//   };
//   loadCategories();
// }, []);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   return (
//     <Navbar bg="success" variant="dark" expand="lg" fixed="top" className="py-3 shadow-sm">
//       <Container>
//         {/* Brand */}
//        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 d-flex align-items-center">
//   <img
//     src={logo1} // 🔹 Replace with your actual logo path or import
//     alt="Ayur4Life Logo"
//     style={{
//       height: "70px",
//       width: "70px",
//       marginRight: "10px",
//     }}
//   />
//   <span>
//     <span className="text-warning">Ayur</span>4Life
//   </span>
// </Navbar.Brand>

//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
          
//           {/* Navigation Links */}
//           <Nav className="me-auto">
//             <Nav.Link as={Link} to="/" className="fw-semibold">
//               Home
//             </Nav.Link>
            
//              {/* Categories Dropdown */}
//             <Dropdown as={Nav.Item}>
//               <Dropdown.Toggle as={Nav.Link} className="fw-semibold">
//                 Categories
//               </Dropdown.Toggle>
//               <Dropdown.Menu>
//                 {categories.map((category) => (
//                   <Dropdown.Item 
//                     key={category} 
//                     as={Link} 
//                     to={`/category/${category}`}
//                   >
//                     {category}
//                   </Dropdown.Item>
//                 ))}
//               </Dropdown.Menu>
//             </Dropdown>

//             {isAuthenticated && (
//               <>
//                 <Nav.Link as={Link} to="/wishlist" className="fw-semibold">
//                   Wishlist
//                 </Nav.Link>
//                 <Nav.Link as={Link} to="/cart" className="fw-semibold">
//                   Cart
//                 </Nav.Link>
//               </>
//             )}
//           </Nav>

//           {/* Search Form */}
//           <Form className="d-flex me-3" onSubmit={handleSearch}>
//             <Form.Control
//               type="search"
//               placeholder="Search products..."
//               className="me-2"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               style={{ minWidth: '250px' }}
//             />
//             <Button variant="outline-light" type="submit">
//               <FontAwesomeIcon icon={faSearch} />
//             </Button>
//           </Form>

//           {/* Right Side Navigation */}
//           <Nav>
//             {isAuthenticated ? (
//               <>
//                 {/* Cart Icon */}
//                 <Nav.Link as={Link} to="/cart" className="position-relative me-3">
//                   <FontAwesomeIcon icon={faShoppingCart} size="lg" />
//                   {cartItemCount > 0 && (
//                     <Badge 
//                       bg="danger" 
//                       className="position-absolute top-0 start-100 translate-middle"
//                       style={{ fontSize: '0.7rem' }}
//                     >
//                       {cartItemCount}
//                     </Badge>
//                   )}
//                 </Nav.Link>

//                 {/* Wishlist Icon */}
//                 <Nav.Link as={Link} to="/wishlist" className="position-relative me-3">
//                   <FontAwesomeIcon icon={faHeart} size="lg" />
//                   {wishlistCount > 0 && (
//                     <Badge 
//                       bg="danger" 
//                       className="position-absolute top-0 start-100 translate-middle"
//                       style={{ fontSize: '0.7rem' }}
//                     >
//                       {wishlistCount}
//                     </Badge>
//                   )}
//                 </Nav.Link>

//                 {/* User Dropdown */}
//                 <Dropdown as={Nav.Item}>
//                   <Dropdown.Toggle as={Nav.Link} className="fw-semibold">
//                     <FontAwesomeIcon icon={faUser} className="me-1" />
//                     {user?.firstName || 'Account'}
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu>
//                     <Dropdown.Item as={Link} to="/account">
//                       <FontAwesomeIcon icon={faCog} className="me-2" />
//                       My Account
//                     </Dropdown.Item>
                    

                    
//                     <Dropdown.Divider />
//                     <Dropdown.Item onClick={handleLogout}>
//                       <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
//                       Logout
//                     </Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               </>
//             ) : (
//               <>
//                 <Nav.Link as={Link} to="/login" className="fw-semibold me-2">
//                   Login
//                 </Nav.Link>
//                 <Nav.Link as={Link} to="/register" className="fw-semibold">
//                   Register
//                 </Nav.Link>
//               </>
//             )}
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// };

// export default NavigationBar;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Form, Button, Dropdown, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo1 from '../assets/Ayur4life_logo_round_png-01.png';
import { 
  faSearch, 
  faShoppingCart, 
  faHeart, 
  faUser, 
  faSignOutAlt,
  faCog,
  faList
} from '@fortawesome/free-solid-svg-icons';
import { useUserAuth } from '../contexts/UserAuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

const NavigationBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useUserAuth();
  const { cartItemCount } = useCart();
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/products/categories/all');
        const data = await response.json();
        
        // Ensure categories is an array
        if (data && Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          setCategories([]);
          setError('Invalid categories data received');
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        setError('Failed to load categories');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="success" variant="dark" expand="lg" fixed="top" className="py-3 shadow-sm">
      <Container>
        {/* Brand */}
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 d-flex align-items-center">
          <img
            src={logo1}
            alt="Ayur4Life Logo"
            style={{
              height: "70px",
              width: "70px",
              marginRight: "10px",
            }}
          />
          <span>
            <span className="text-warning">Ayur</span>4Life
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Navigation Links */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="fw-semibold">
              Home
            </Nav.Link>
            
            <Nav.Link as={Link} to="/about" className="fw-semibold">
              About
            </Nav.Link>
            
            {/* Categories Dropdown */}
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} className="fw-semibold">
                Categories
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {loading ? (
                  <Dropdown.Item disabled>Loading...</Dropdown.Item>
                ) : error ? (
                  <Dropdown.Item disabled>Error: {error}</Dropdown.Item>
                ) : categories.length === 0 ? (
                  <Dropdown.Item disabled>No categories available</Dropdown.Item>
                ) : (
                  categories.map((category) => (
                    <Dropdown.Item 
                      key={category.id} 
                      as={Link} 
                      to={`/category/${category.id}`}
                    >
                      {category.name || category.id}
                    </Dropdown.Item>
                  ))
                )}
              </Dropdown.Menu>
            </Dropdown>

            {/* {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/wishlist" className="fw-semibold">
                  Wishlist
                </Nav.Link>
                <Nav.Link as={Link} to="/cart" className="fw-semibold">
                  Cart
                </Nav.Link>
              </>
            )} */}
          </Nav>

          {/* Search Form */}
          <Form className="d-flex me-3" onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="Search products..."
              className="me-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ minWidth: '250px' }}
            />
            <Button variant="outline-light" type="submit">
              <FontAwesomeIcon icon={faSearch} />
            </Button>
          </Form>

          {/* Right Side Navigation */}
          <Nav>
            {isAuthenticated ? (
              <>
                {/* Cart Icon */}
                <Nav.Link as={Link} to="/cart" className="position-relative me-3">
                  <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                  {cartItemCount > 0 && (
                    <Badge 
                      bg="danger" 
                      className="position-absolute top-0 start-100 translate-middle"
                      style={{ fontSize: '0.7rem' }}
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                </Nav.Link>

                {/* Wishlist Icon */}
                <Nav.Link as={Link} to="/wishlist" className="position-relative me-3">
                  <FontAwesomeIcon icon={faHeart} size="lg" />
                  {wishlistCount > 0 && (
                    <Badge 
                      bg="danger" 
                      className="position-absolute top-0 start-100 translate-middle"
                      style={{ fontSize: '0.7rem' }}
                    >
                      {wishlistCount}
                    </Badge>
                  )}
                </Nav.Link>

                {/* User Dropdown */}
                <Dropdown as={Nav.Item}>
                  <Dropdown.Toggle as={Nav.Link} className="fw-semibold">
                    <FontAwesomeIcon icon={faUser} className="me-1" />
                    {user?.firstName || 'Account'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/account">
                      <FontAwesomeIcon icon={faCog} className="me-2" />
                      My Account
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="fw-semibold me-2">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="fw-semibold">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
