// src/pages/PrivacyPolicy.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import UserLayout from '../layouts/UserLayout';
import './Policy.css';

const PrivacyPolicy = () => {
  return (
    <UserLayout>
      <div className="policy-container">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <Card className="policy-card shadow">
                <Card.Body>
                  <div className="policy-header">
                    <FontAwesomeIcon icon={faShieldAlt} className="policy-icon" />
                    <h1 className="policy-title">Privacy Policy</h1>
                    <p className="policy-date">Last Updated: October 26, 2025</p>
                  </div>

                  <p className="lead text-center text-muted">Your privacy is important to us. This policy outlines how we collect, use, and protect your information.</p>
                  
                  <hr className="my-4" />

                  <div className="policy-section">
                    <h2 className="policy-subtitle">1. Information We Collect</h2>
                    <p>We collect personal information to provide and improve our services to you. This includes:</p>
                    <ul>
                      <li><span className="highlight">Personal Data:</span> Your name, email, phone number, and shipping address when you create an account or place an order.</li>
                      <li><span className="highlight">Payment Information:</span> Securely handled by our payment partners. We do not store your credit card details.</li>
                      <li><span className="highlight">Usage Data:</span> Information about your browsing behavior and interactions with our site to enhance your shopping experience.</li>
                    </ul>
                  </div>

                  <div className="policy-section">
                    <h2 className="policy-subtitle">2. How We Use Your Information</h2>
                    <p>The data we collect is used to:</p>
                    <ul>
                      <li><span className="highlight">Process Orders:</span> Fulfill and manage your purchases and returns.</li>
                      <li><span className="highlight">Personalize Experience:</span> Recommend products and services based on your interests.</li>
                      <li><span className="highlight">Communicate with You:</span> Send order updates, promotional offers, and customer support messages.</li>
                      <li><span className="highlight">Ensure Security:</span> Detect and prevent fraud and other malicious activities.</li>
                    </ul>
                  </div>
                  
                  <div className="policy-section">
                    <h2 className="policy-subtitle">3. Data Sharing and Disclosure</h2>
                    <p>We do not sell your personal information. We may share it with trusted third parties to perform services on our behalf, such as shipping companies and payment processors. These parties are bound by strict confidentiality agreements.</p>
                  </div>
                  
                  <div className="policy-section">
                    <h2 className="policy-subtitle">4. Your Rights</h2>
                    <p>You have the right to access, update, or request the deletion of your personal information. You can do this by managing your account settings or contacting our support team.</p>
                  </div>

                  <p className="mt-5 text-center text-muted fst-italic">By using our site, you consent to the terms outlined in this Privacy Policy.</p>

                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </UserLayout>
  );
};

export default PrivacyPolicy;