import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStar, faShoppingCart, faLeaf, faUsers, faAward, faGlobe, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import UserLayout from '../layouts/UserLayout';
import './About.css';

const About = () => {
  return (
    <UserLayout>
      {/* Hero Section */}
      <div className="about-hero">
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col lg={6} className="text-center text-lg-start">
              <h1 className="about-hero-title">
                About <span className="text-success">Ayur4Life</span>
              </h1>
              <p className="about-hero-subtitle">
                We are passionate about bringing authentic Ayurvedic wellness to your doorstep. 
                Our journey began with a simple mission: to make traditional healing accessible to modern life.
              </p>
              <Button as={Link} to="/all-products" variant="success" size="lg" className="me-3">
                Shop Now
              </Button>
              <Button as={Link} to="/contact" variant="outline-success" size="lg">
                Contact Us
              </Button>
            </Col>
            <Col lg={6} className="text-center">
              <div className="about-hero-image">
                <img 
                  src="/images/ayurvedic-wellness-1.jfif" 
                  alt="Ayurvedic Wellness" 
                  className="hero-main-image"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Mission & Vision Section */}
      <section className="mission-vision-section py-5">
        <Container>
          <Row className="g-4">
            <Col lg={6}>
              <Card className="mission-card h-100">
                <Card.Body className="text-center p-4">
                  <div className="mission-icon">
                    <FontAwesomeIcon icon={faHeart} />
                  </div>
                  <h3 className="mission-title">Our Mission</h3>
                  <p className="mission-text">
                    To provide authentic, high-quality Ayurvedic products that promote natural healing 
                    and wellness, making traditional wisdom accessible to everyone in the modern world.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="vision-card h-100">
                <Card.Body className="text-center p-4">
                  <div className="vision-icon">
                    <FontAwesomeIcon icon={faGlobe} />
                  </div>
                  <h3 className="vision-title">Our Vision</h3>
                  <p className="vision-text">
                    To become the most trusted source of authentic Ayurvedic wellness products, 
                    helping millions achieve holistic health through nature's ancient wisdom.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Company Story Section */}
      <section className="company-story-section py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <div className="story-content">
                <h2 className="section-title">Our Story</h2>
                <p className="story-text">
                  Founded in 2019, Ayur4Life began as a small family business with a deep passion 
                  for Ayurvedic medicine. Our founder, Dr. Rajesh Kumar, spent over 20 years studying 
                  traditional Ayurvedic practices and wanted to share this ancient wisdom with the world.
                </p>
                <p className="story-text">
                  What started as a local wellness shop has grown into a trusted online destination 
                  for authentic Ayurvedic products. We've maintained our commitment to quality, 
                  authenticity, and customer care throughout our journey.
                </p>
                <div className="story-highlights">
                  <div className="highlight-item">
                    <FontAwesomeIcon icon={faLeaf} className="highlight-icon" />
                    <span>100% Natural Ingredients</span>
                  </div>
                  <div className="highlight-item">
                    <FontAwesomeIcon icon={faShieldAlt} className="highlight-icon" />
                    <span>Quality Assured</span>
                  </div>
                  <div className="highlight-item">
                    <FontAwesomeIcon icon={faUsers} className="highlight-icon" />
                    <span>Expert Guidance</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="story-image-container">
                <img 
                  src="/images/ayurvedic-wellness-2.jfif" 
                  alt="Our Journey" 
                  className="story-image"
                />
                <div className="story-overlay">
                  <h4>Trusted by Thousands</h4>
                  <p>Join our growing community of wellness seekers</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Values Section */}
      <section className="values-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">Our Core Values</h2>
            <p className="section-subtitle">The principles that guide everything we do</p>
          </div>
          <Row className="g-4">
            <Col lg={3} md={6}>
              <div className="value-card">
                <div className="value-icon">
                  <FontAwesomeIcon icon={faStar} />
                </div>
                <h4>Authenticity</h4>
                <p>We source only genuine Ayurvedic products from trusted manufacturers and traditional practitioners.</p>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="value-card">
                <div className="value-icon">
                  <FontAwesomeIcon icon={faLeaf} />
                </div>
                <h4>Natural Wellness</h4>
                <p>We believe in the power of nature to heal and promote overall well-being naturally.</p>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="value-card">
                <div className="value-icon">
                  <FontAwesomeIcon icon={faHeart} />
                </div>
                <h4>Customer Care</h4>
                <p>Your health and satisfaction are our top priorities. We're here to support your wellness journey.</p>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="value-card">
                <div className="value-icon">
                  <FontAwesomeIcon icon={faAward} />
                </div>
                <h4>Quality Excellence</h4>
                <p>We maintain the highest standards of quality in every product and service we offer.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5 bg-success text-white">
        <Container>
          <Row className="text-center">
            <Col lg={3} md={6} className="mb-4">
              <div className="stat-item">
                <h2 className="stat-number">500+</h2>
                <p className="stat-label">Happy Customers</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="stat-item">
                <h2 className="stat-number">100+</h2>
                <p className="stat-label">Products</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="stat-item">
                <h2 className="stat-number">5+</h2>
                <p className="stat-label">Years Experience</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="stat-item">
                <h2 className="stat-number">98%</h2>
                <p className="stat-label">Satisfaction Rate</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Team Section */}
      <section className="team-section py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-subtitle">Dedicated professionals committed to your wellness</p>
          </div>
          <Row className="g-4">
            <Col lg={4} md={6}>
              <Card className="team-card">
                <Card.Body className="text-center">
                  <div className="team-avatar">
                    <FontAwesomeIcon icon={faUsers} />
                  </div>
                  <h4 className="team-name">Dr. Rajesh Kumar</h4>
                  <p className="team-role">Founder & Ayurvedic Expert</p>
                  <p className="team-description">
                    With over 20 years of experience in Ayurvedic medicine, Dr. Kumar leads our 
                    mission to bring authentic wellness to everyone.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6}>
              <Card className="team-card">
                <Card.Body className="text-center">
                  <div className="team-avatar">
                    <FontAwesomeIcon icon={faUsers} />
                  </div>
                  <h4 className="team-name">Priya Sharma</h4>
                  <p className="team-role">Wellness Consultant</p>
                  <p className="team-description">
                    Our certified wellness consultant helps customers find the perfect products 
                    for their specific health needs and lifestyle.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6}>
              <Card className="team-card">
                <Card.Body className="text-center">
                  <div className="team-avatar">
                    <FontAwesomeIcon icon={faUsers} />
                  </div>
                  <h4 className="team-name">Amit Patel</h4>
                  <p className="team-role">Customer Care Manager</p>
                  <p className="team-description">
                    Dedicated to ensuring every customer receives exceptional service and support 
                    throughout their wellness journey.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section
      <section className="cta-section py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h2 className="cta-title">Ready to Start Your Wellness Journey?</h2>
              <p className="cta-text">
                Discover the power of authentic Ayurvedic products and transform your health naturally.
              </p>
              <div className="cta-buttons">
                <Button as={Link} to="/all-products" variant="success" size="lg" className="me-3">
                  Shop Now
                </Button>
                <Button as={Link} to="/contact" variant="outline-success" size="lg">
                  Get in Touch
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section> */}
    </UserLayout>
  );
};

export default About;
