// src/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Card, Row, Col } from 'react-bootstrap';
import { FaPlus, FaCalendarDay, FaCalendarAlt, FaCity } from 'react-icons/fa';
import './HomePage.css'; // Create a custom CSS file for more specific styles

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container className="homepage-container">
      <div className="hero-section text-center py-5">
        <h1 className="hero-title">Animal Ambulance App</h1>
        <p className="hero-subtitle">Your reliable partner in emergency animal care</p>
      </div>

      <Row className="justify-content-center mt-4">
        <Col md={6}>
          <Card className="p-4 modern-card shadow-sm">
            <Card.Body>
              <h3 className="text-center card-title mb-4">Quick Actions</h3>
              <div className="d-grid gap-4">
                <Button
                  variant="primary"
                  onClick={() => navigate('/add-record')}
                  className="d-flex align-items-center justify-content-center modern-button"
                  size="lg"
                >
                  <FaPlus className="me-2" /> Add Record
                </Button>
                <Button
                  variant="success"
                  onClick={() => navigate('/daily-report')}
                  className="d-flex align-items-center justify-content-center modern-button"
                  size="lg"
                >
                  <FaCalendarDay className="me-2" /> Daily Report
                </Button>
                <Button
                  variant="info"
                  onClick={() => navigate('/monthly-report')}
                  className="d-flex align-items-center justify-content-center modern-button"
                  size="lg"
                >
                  <FaCalendarAlt className="me-2" /> Monthly Report
                </Button>
                <Button
                  variant="warning"
                  onClick={() => navigate('/bhopal-report')}
                  className="d-flex align-items-center justify-content-center modern-button"
                  size="lg"
                >
                  <FaCity className="me-2" /> Bhopal Report
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
