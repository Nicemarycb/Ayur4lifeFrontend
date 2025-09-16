import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faPhone, 
  faEnvelope, 
  faClock,
  faArrowRight,
  faArrowUp
} from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter as faTwitterBrand, faInstagram as faInstagramBrand, faLinkedinIn, faYoutube as faYoutubeBrand, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
         <footer className="py-5 mt-5">
      <Container>
        <Row className="g-4">
          {/* Company Information */}
          <Col lg={3} md={6}>
            <div className="mb-4">
                             <h5 className="company-brand mb-3">
                 <span>Ayur</span>4Life
               </h5>
               <p className="company-description mb-3">
                 Your trusted source for authentic Ayurvedic products. We bring you the finest 
                 traditional remedies and wellness solutions for a healthier lifestyle.
               </p>
                             <div className="d-flex gap-2 social-links">
                 <a href="#" title="Facebook">
                   <FontAwesomeIcon icon={faFacebookF} size="lg" />
                 </a>
                 <a href="#" title="Twitter">
                   <FontAwesomeIcon icon={faTwitterBrand} size="lg" />
                 </a>
                 <a href="#" title="Instagram">
                   <FontAwesomeIcon icon={faInstagramBrand} size="lg" />
                 </a>
                 <a href="#" title="LinkedIn">
                   <FontAwesomeIcon icon={faLinkedinIn} size="lg" />
                 </a>
                 <a href="#" title="YouTube">
                   <FontAwesomeIcon icon={faYoutubeBrand} size="lg" />
                 </a>
               </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={3} md={6}>
                             <h6 className="mb-3">Quick Links</h6>
            <ul className="list-unstyled">
                             <li className="mb-2">
                 <Link to="/">
                   <FontAwesomeIcon icon={faArrowRight} className="me-2" size="sm" />
                   Home
                 </Link>
               </li>
               <li className="mb-2">
                 <Link to="/products">
                   <FontAwesomeIcon icon={faArrowRight} className="me-2" size="sm" />
                   All Products
                 </Link>
               </li>
               <li className="mb-2">
                 <Link to="/about">
                   <FontAwesomeIcon icon={faArrowRight} className="me-2" size="sm" />
                   About Us
                 </Link>
               </li>
               <li className="mb-2">
                 <Link to="/contact">
                   <FontAwesomeIcon icon={faArrowRight} className="me-2" size="sm" />
                   Contact
                 </Link>
               </li>
               <li className="mb-2">
                 <Link to="/account">
                   <FontAwesomeIcon icon={faArrowRight} className="me-2" size="sm" />
                   My Account
                 </Link>
               </li>
            </ul>
          </Col>

          {/* Product Categories */}
          <Col lg={3} md={6}>
                           <h6 className="mb-3">Product Categories</h6>
            <ul className="list-unstyled">
                             <li className="mb-2">
                 <Link to="/products?category=herbs">
                   <FontAwesomeIcon icon={faArrowRight} className="me-2" size="sm" />
                   Herbs & Spices
                 </Link>
               </li>
               <li className="mb-2">
                 <Link to="/products?category=oils">
                   <FontAwesomeIcon icon={faArrowRight} className="me-2" size="sm" />
                   Essential Oils
                 </Link>
               </li>
               <li className="mb-2">
                 <Link to="/products?category=supplements">
                   <FontAwesomeIcon icon={faArrowRight} className="me-2" size="sm" />
                   Health Supplements
                 </Link>
               </li>
               <li className="mb-2">
                 <Link to="/products?category=skincare">
                   <FontAwesomeIcon icon={faArrowRight} className="me-2" size="sm" />
                   Natural Skincare
                 </Link>
               </li>
               <li className="mb-2">
                 <Link to="/products?category=teas">
                   <FontAwesomeIcon icon={faArrowRight} className="me-2" size="sm" />
                   Herbal Teas
                 </Link>
               </li>
            </ul>
          </Col>

          {/* Contact Information & Newsletter */}
          <Col lg={3} md={6}>
                         <h6 className="mb-3">Contact Info</h6>
            <div className="mb-3 contact-info">
                             <div className="d-flex align-items-center mb-2">
                 <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                 <span>Thekkekara Arcade Chelakottukara Thrissur 680005</span>
               </div>
               <div className="d-flex align-items-center mb-2">
                 <FontAwesomeIcon icon={faPhone} className="me-2" />
                 <span> +91 9854758962</span>
               </div>
               <div className="d-flex align-items-center mb-2">
                 <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                 <span>ayur4life@gmail.com</span>
               </div>
               <div className="d-flex align-items-center mb-3">
                 <FontAwesomeIcon icon={faClock} className="me-2" />
                 <span>Mon-Sat: 9AM-6PM</span>
               </div>
               
               {/* WhatsApp Contact Button */}
               <div className="mt-3">
                 <a 
                   href="https://wa.me/15551234567" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="btn btn-success btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                   style={{
                     background: 'linear-gradient(45deg, #25d366, #128c7e)',
                     border: 'none',
                     borderRadius: '8px',
                     padding: '10px 16px',
                     textDecoration: 'none',
                     color: 'white',
                     fontWeight: '600',
                     transition: 'all 0.3s ease'
                   }}
                 >
                   <FontAwesomeIcon icon={faWhatsapp} size="lg" />
                   Chat on WhatsApp
                 </a>
               </div>
            </div>

            {/* Newsletter Subscription */}
                         {/* <h6 className="mb-3">Newsletter</h6> */}
            {/* <Form className="mb-3 newsletter-form">
              <Form.Group className="mb-2">
                                 <Form.Control
                   type="email"
                   placeholder="Enter your email"
                   size="sm"
                 />
              </Form.Group>
                               <Button size="sm" className="w-100">
                   <span>Subscribe</span>
                 </Button>
            </Form> */}
          </Col>
        </Row>

                 {/* Bottom Footer */}
         <Row className="bottom-footer">
           <Col md={6}>
             <p className="copyright mb-0">
               © {currentYear} Ayur4Life. All rights reserved.
             </p>
           </Col>
           <Col md={6} className="text-md-end">
             <div className="legal-links">
               <Link to="/privacy">Privacy Policy</Link>
               <Link to="/terms">Terms of Service</Link>
               {/* <Link to="/shipping">Shipping Info</Link> */}
               <Link to="/return-policy">Return Policy</Link>
             </div>
           </Col>
         </Row>
        
                 {/* Back to Top Button */}
         <div className="back-to-top-section">
           <Button
             size="sm"
             onClick={scrollToTop}
             className="back-to-top-btn"
             title="Back to Top"
           >
             <FontAwesomeIcon icon={faArrowUp} />
             Back to Top
           </Button>
         </div>
      </Container>
    </footer>
  );
};

export default Footer;
