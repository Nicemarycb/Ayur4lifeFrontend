// Contact.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import UserLayout from '../layouts/UserLayout';
import './Contacts.css';

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    const formData = new FormData(e.target);
    const contactData = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        e.target.reset();
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <UserLayout>
      <div className="contact-page">
        {/* Hero Section */}
        <section className="contact-hero-section py-5">
          <Container>
            <Row className="justify-content-center text-center">
              <Col lg={8}>
                <h1 className="contact-hero-title">Get in Touch</h1>
                <p className="contact-hero-subtitle">
                  We'd love to hear from you. Let us know how we can help you on your wellness journey.
                </p>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Contact Content */}
        <section className="contact-content-section py-5">
          <Container>
            <Row>
              <Col lg={6} className="mb-5 mb-lg-0">
                <div className="contact-info">
                  <h2 className="section-title mb-4">Contact Information</h2>
                  <p className="contact-description mb-4">
                    Have questions about our products? Need help with your order? 
                    We're here to help you on your wellness journey.
                  </p>
                  
                  <div className="contact-details">
                    <div className="contact-item mb-4">
                      <div className="contact-icon">
                        <FontAwesomeIcon icon={faEnvelope} className="text-success" />
                      </div>
                      <div className="contact-text">
                        <h5>Email</h5>
                        <p>ayur4life@gmail.com</p>
                      </div>
                    </div>
                    
                    <div className="contact-item mb-4">
                      <div className="contact-icon">
                        <FontAwesomeIcon icon={faPhone} className="text-success" />
                      </div>
                      <div className="contact-text">
                        <h5>Phone</h5>
                        <p>+91 9854758962</p>
                      </div>
                    </div>
                    
                    <div className="contact-item mb-4">
                      <div className="contact-icon">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-success" />
                      </div>
                      <div className="contact-text">
                        <h5>Address</h5>
                        <p>Thekkekara Arcade Chelakottukara Thrissur 680005</p>
                      </div>
                    </div>
                    
                    <div className="contact-item">
                      <div className="contact-icon">
                        <FontAwesomeIcon icon={faHeart} className="text-success" />
                      </div>
                      <div className="contact-text">
                        <h5>Business Hours</h5>
                        <p>Monday - Saturday: 9:00 AM - 6:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              
              <Col lg={6}>
                <Card className="contact-form-card shadow">
                  <Card.Body className="p-4">
                    <h3 className="mb-4">Send us a Message</h3>
                    
                    {success && (
                      <Alert variant="success" className="mb-3">
                        Thank you for your message! We will get back to you soon.
                      </Alert>
                    )}
                    
                    {error && (
                      <Alert variant="danger" className="mb-3" dismissible onClose={() => setError(null)}>
                        {error}
                      </Alert>
                    )}
                    
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Name *</Form.Label>
                            <Form.Control 
                              type="text" 
                              name="name" 
                              required 
                              placeholder="Your full name"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email *</Form.Label>
                            <Form.Control 
                              type="email" 
                              name="email" 
                              required 
                              placeholder="Your email address"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Subject *</Form.Label>
                        <Form.Control 
                          type="text" 
                          name="subject" 
                          required 
                          placeholder="What is this regarding?"
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-4">
                        <Form.Label>Message *</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={5} 
                          name="message" 
                          required 
                          placeholder="Tell us how we can help you..."
                        />
                      </Form.Group>
                      
                      <Button 
                        type="submit" 
                        variant="success" 
                        size="lg" 
                        className="btn btn-primary me-3"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Sending...
                          </>
                        ) : (
                          'Send Message'
                        )}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>

  {/* FAQ Section */}
        <section className="faq-section py-5">
          <Container>
            <Row className="justify-content-center mb-5">
              <Col lg={8} className="text-center">
                <h2 className="section-title">Frequently Asked Questions</h2>
                <p className="section-subtitle">
                  Quick answers to common questions about our products and services
                </p>
              </Col>
            </Row>
            
            <Row>
              <Col lg={6} className="mb-4">
                <div className="faq-item">
                  <h4>How long does shipping take?</h4>
                  <p>We typically process orders within 24 hours and shipping takes 3-7 business days within India, depending on your location.</p>
                </div>
              </Col>
              <Col lg={6} className="mb-4">
                <div className="faq-item">
                  <h4>Are your products authentic Ayurvedic?</h4>
                  <p>Yes, all our products are 100% authentic Ayurvedic, made with natural ingredients and traditional methods.</p>
                </div>
              </Col>
              <Col lg={6} className="mb-4">
                <div className="faq-item">
                  <h4>Do you offer international shipping?</h4>
                  <p>Currently we only ship within India, but we're working on expanding our international shipping options.</p>
                </div>
              </Col>
              <Col lg={6} className="mb-4">
                <div className="faq-item">
                  <h4>Can I return products?</h4>
                  <p>Yes, we have a 30-day return policy for unopened products. Please check our return policy page for details.</p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Map Section */}
        <section className="map-section py-5 bg-light">
          <Container>
            <Row className="justify-content-center">
              <Col lg={10}>
                <h2 className="section-title text-center mb-5">Our Location</h2>
                <div className="map-container">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3925.821377888987!2d76.3547221750734!3d10.28416648973841!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0803ce5d861f2f%3A0x8f8c9e6e3c7b3b3d!2sThekkekara%20Arcade%2C%20Chelakottukara%2C%20Thrissur%2C%20Kerala%20680005!5e0!3m2!1sen!2sin!4v1691234567890!5m2!1sen!2sin"
                    width="100%"
                    height="400"
                    style={{ border: 0, borderRadius: '10px' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ayur4Life Location"
                  ></iframe>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    </UserLayout>
  );
};

export default Contact;