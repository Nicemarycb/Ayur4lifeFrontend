// src/pages/TermsOfService.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileContract } from '@fortawesome/free-solid-svg-icons';
import UserLayout from '../layouts/UserLayout';
import './Policy.css';

const TermsOfService = () => {
  return (
    <UserLayout>
      <div className="policy-container">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <Card className="policy-card shadow">
                <Card.Body>
                  <div className="policy-header">
                    <FontAwesomeIcon icon={faFileContract} className="policy-icon" />
                    <h1 className="policy-title">Terms of Service</h1>
                    <p className="policy-date">Last Updated: October 26, 2025</p>
                  </div>

                  <p className="lead text-center text-muted">Welcome! These terms govern your use of our website and services. Please read them carefully.</p>
                  
                  <hr className="my-4" />

                  <div className="policy-section">
                    <h2 className="policy-subtitle">1. Acceptance of Terms</h2>
                    <p>By accessing or using our service, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, you must not use our service.</p>
                  </div>

                  <div className="policy-section">
                    <h2 className="policy-subtitle">2. User Accounts</h2>
                    <p>When you create an account, you must provide us with accurate and complete information. You are responsible for maintaining the confidentiality of your password and for all activities under your account. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>
                  </div>

                  <div className="policy-section">
                    <h2 className="policy-subtitle">3. Orders and Pricing</h2>
                    <p>We reserve the right to refuse or cancel any order. All prices are subject to change without notice. In the event of a pricing error, we will contact you to confirm or cancel your order.</p>
                  </div>
                  
                  <div className="policy-section">
                    <h2 className="policy-subtitle">4. Intellectual Property</h2>
                    <p>The content, features, and functionality of the Service are and will remain the exclusive property of **Ayur4Life**. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.</p>
                  </div>
                  
                  <div className="policy-section">
                    <h2 className="policy-subtitle">5. Limitation of Liability</h2>
                    <p>In no event shall **Ayur4Life**, nor its directors, employees, partners, agents, or affiliates, be liable for any indirect, incidental, special, or consequential damages arising out of your use of the Service.</p>
                  </div>

                  <p className="mt-5 text-center text-muted fst-italic">Your use of this website is at your sole risk.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </UserLayout>
  );
};

export default TermsOfService;