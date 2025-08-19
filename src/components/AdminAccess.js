// // // Disabled to keep admin entry points entirely out of the user UI
// // export default function AdminAccess() { return null; }

// import React from 'react';
// import { Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCog, faLock } from '@fortawesome/free-solid-svg-icons';
// import { useAuth } from '../contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';

// const AdminAccess = () => {
//   const [show, setShow] = React.useState(false);
//   const [email, setEmail] = React.useState('');
//   const [password, setPassword] = React.useState('');
//   const [loading, setLoading] = React.useState(false);
//   const [error, setError] = React.useState('');
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleClose = () => {
//     setShow(false);
//     setEmail('');
//     setPassword('');
//     setError('');
//   };

//   const handleShow = () => setShow(true);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const result = await login(email, password);
      
//       if (result.success) {
//         if (result.user?.role === 'admin') {
//           handleClose();
//           navigate('/admin');
//         } else {
//           setError('Access denied. Admin privileges required.');
//           localStorage.removeItem('token');
//         }
//       } else {
//         setError(result.error || 'Login failed');
//       }
//     } catch (err) {
//       setError('Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Button 
//         variant="outline-secondary" 
//         size="sm" 
//         onClick={handleShow}
//         className="position-fixed"
//         style={{ 
//           bottom: '20px', 
//           right: '20px', 
//           zIndex: 1000,
//           borderRadius: '50px',
//           padding: '8px 16px'
//         }}
//       >
//         <FontAwesomeIcon icon={faCog} className="me-1" />
//         Admin
//       </Button>

//       <Modal show={show} onHide={handleClose} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>
//             <FontAwesomeIcon icon={faLock} className="me-2" />
//             Admin Access
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3">
//               <Form.Label>Email Address</Form.Label>
//               <Form.Control
//                 type="email"
//                 placeholder="Enter admin email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 placeholder="Enter password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </Form.Group>

//             {error && (
//               <Alert variant="danger" className="mb-3">
//                 {error}
//               </Alert>
//             )}

//             <div className="d-grid">
//               <Button 
//                 type="submit" 
//                 variant="primary" 
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <>
//                     <Spinner
//                       as="span"
//                       animation="border"
//                       size="sm"
//                       role="status"
//                       aria-hidden="true"
//                       className="me-2"
//                     />
//                     Signing In...
//                   </>
//                 ) : (
//                   'Access Admin Panel'
//                 )}
//               </Button>
//             </div>
//           </Form>

//           <div className="text-center mt-3">
//             <small className="text-muted">
//               <strong>Admin Credentials:</strong><br />
//               Email: test@example.com<br />
//               Password: password123
//             </small>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// };

// export default AdminAccess;