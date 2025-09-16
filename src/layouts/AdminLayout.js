// import React from 'react';
// import { Container, Navbar, Nav, Dropdown, Badge } from 'react-bootstrap';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { 
//   faUser, 
//   faSignOutAlt, 
//   faCog,
//   faTachometerAlt,
//   faBoxes,
//   faShoppingBag,
//   faUsers,
//   faHome
// } from '@fortawesome/free-solid-svg-icons';
// import { useAuth } from '../contexts/AuthContext';

// const AdminLayout = ({ children }) => {
//   const { user, logout, isAdmin } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogout = () => {
//     logout();
//     navigate('/admin/login');
//   };

//   // If not admin, redirect to home
//   if (!isAdmin) {
//     navigate('/');
//     return null;
//   }

//   return (
//     <div className="admin-layout">
//       {/* Admin Header */}
//       <Navbar bg="dark" variant="dark" expand="lg" className="admin-header">
//         <Container fluid>
//           <Navbar.Brand className="fw-bold fs-4">
//             <span className="text-warning">Ayur</span>4Life Admin
//           </Navbar.Brand>

//           <Navbar.Toggle aria-controls="admin-navbar-nav" />
//           <Navbar.Collapse id="admin-navbar-nav">
//             <Nav className="me-auto">
//               <Nav.Link as={Link} to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
//                 <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
//                 Dashboard
//               </Nav.Link>
//               <Nav.Link as={Link} to="/admin/products" className={location.pathname.includes('/admin/products') ? 'active' : ''}>
//                 <FontAwesomeIcon icon={faBoxes} className="me-2" />
//                 Products
//               </Nav.Link>
//               <Nav.Link as={Link} to="/admin/orders" className={location.pathname.includes('/admin/orders') ? 'active' : ''}>
//                 <FontAwesomeIcon icon={faShoppingBag} className="me-2" />
//                 Orders
//               </Nav.Link>
//               <Nav.Link as={Link} to="/admin/users" className={location.pathname.includes('/admin/users') ? 'active' : ''}>
//                 <FontAwesomeIcon icon={faUsers} className="me-2" />
//                 Users
//               </Nav.Link>
//             </Nav>

//             <Nav>
//               <Nav.Link as={Link} to="/" className="me-3">
//                 <FontAwesomeIcon icon={faHome} className="me-2" />
//                 View Store
//               </Nav.Link>
              
//               <Dropdown as={Nav.Item}>
//                 <Dropdown.Toggle as={Nav.Link} className="fw-semibold">
//                   <FontAwesomeIcon icon={faUser} className="me-1" />
//                   {user?.firstName || 'Admin'}
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu>
//                   <Dropdown.Item as={Link} to="/admin/profile">
//                     <FontAwesomeIcon icon={faCog} className="me-2" />
//                     Admin Profile
//                   </Dropdown.Item>
//                   <Dropdown.Divider />
//                   <Dropdown.Item onClick={handleLogout}>
//                     <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
//                     Logout
//                   </Dropdown.Item>
//                 </Dropdown.Menu>
//               </Dropdown>
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//       {/* Admin Content */}
//       <div className="admin-content">
//         <Container fluid className="py-4">
//           {children}
//         </Container>
//       </div>

//       <style jsx>{`
//         .admin-layout {
//           min-height: 100vh;
//           background-color: #f8f9fa;
//         }
        
//         .admin-header {
//           box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//         }
        
//         .admin-content {
//           min-height: calc(100vh - 72px);
//         }
        
//         .nav-link.active {
//           background-color: rgba(255,255,255,0.1) !important;
//           border-radius: 4px;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AdminLayout;

// =========================================================
// File: src/layouts/AdminLayout.js
// Description: Updated AdminLayout component to use the new
// auth context functions.
// =========================================================
import React from 'react';
import { Container, Navbar, Nav, Dropdown, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faSignOutAlt, 
  faCog,
  faTachometerAlt,
  faBoxes,
  faShoppingBag,
  faUsers,
  faHome,
  faEnvelope,
  faPercent,
  faEdit,
  faEye,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const AdminLayout = ({ children }) => {
  // We now get the user and the new adminLogout function
const { admin: user, adminLogout, isAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();


 const handleLogout = () => {
    // Call the specific adminLogout function
    adminLogout();
    navigate('/admin/login');
  };

  // If not admin, redirect to home
  if (!isAdmin) {
    navigate('/');
    return null;
  }

  return (
    <div className="admin-layout">
      {/* Admin Header */}
      <Navbar bg="dark" variant="dark" expand="lg" className="admin-header">
        <Container fluid>
          <Navbar.Brand className="fw-bold fs-4">
            <span className="text-warning">Ayur</span>4Life Admin
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="admin-navbar-nav" />
          <Navbar.Collapse id="admin-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
                <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
                Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/products" className={location.pathname === '/admin/products' ? 'active' : ''}>
                <FontAwesomeIcon icon={faBoxes} className="me-2" />
                Products
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/orders" className={location.pathname === '/admin/orders' ? 'active' : ''}>
                <FontAwesomeIcon icon={faShoppingBag} className="me-2" />
                Orders <Badge bg="danger" className="ms-1"></Badge>
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/users" className={location.pathname === '/admin/users' ? 'active' : ''}>
                <FontAwesomeIcon icon={faUsers} className="me-2" />
                Users
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/contacts" className={location.pathname === '/admin/contacts' ? 'active' : ''}>
                <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                Contacts
              </Nav.Link>
                             <Nav.Link as={Link} to="/admin/coupons" className={location.pathname === '/admin/coupons' ? 'active' : ''}>
                 <FontAwesomeIcon icon={faPercent} className="me-2" />
                 Coupons
               </Nav.Link>
               <Nav.Link as={Link} to="/admin/return-policy" className={location.pathname === '/admin/return-policy' ? 'active' : ''}>
                 <FontAwesomeIcon icon={faEdit} className="me-2" />
                 Return Policy
               </Nav.Link>
               <Nav.Link as={Link} to="/admin/return-requests" className={location.pathname === '/admin/return-requests' ? 'active' : ''}>
                 <FontAwesomeIcon icon={faEye} className="me-2" />
                 Returns
               </Nav.Link>
               <Nav.Link as={Link} to="/admin/cancellations" className={location.pathname === '/admin/cancellations' ? 'active' : ''}>
                 <FontAwesomeIcon icon={faTimes} className="me-2" />
                 Cancellations
               </Nav.Link>
            </Nav>
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" target="_blank">
                <FontAwesomeIcon icon={faHome} className="me-2" />
                View Store
              </Nav.Link>
              <Dropdown align="end">
                <Dropdown.Toggle variant="dark" id="dropdown-admin-user" className="fw-semibold">
                  <FontAwesomeIcon icon={faUser} className="me-1" />
                  {user?.firstName || 'Admin'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/admin/profile">
                    <FontAwesomeIcon icon={faCog} className="me-2" />
                    Admin Profile
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Admin Content */}
      <div className="admin-content">
        <Container fluid className="py-4">
          {children}
        </Container>
      </div>
      
      {/* Admin Footer */}
      {/* <footer className="bg-dark text-light py-3 mt-5">
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-muted small">
              © {new Date().getFullYear()} Ayur4Life Admin Panel
            </span>
            <span className="text-muted small">
              Secure Admin Access
            </span>
          </div>
        </Container>
      </footer> */}

      <style>{`
        .admin-layout {
          min-height: 100vh;
          background-color: #f8f9fa;
        }
        
        .admin-header {
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .admin-content {
          min-height: calc(100vh - 72px);
        }
        
        .nav-link.active {
          color: #ffc107 !important;
          border-bottom: 2px solid #ffc107;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;

