// frontend/src/pages/Ecranone.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Cards from '../ecran_one_components/card';
import { api } from '../services/api';

export default function Ecranone() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async (search = '') => {
    try {
      setLoading(true);
      setError(null);
      const params = search ? { search } : {};
      const data = await api.getEvents(params);
      setEvents(data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des événements');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Debounce la recherche
    const timeoutId = setTimeout(() => {
      loadEvents(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
          <p className="mt-2">Chargement des événements...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Erreur</Alert.Heading>
          <p>{error}</p>
          <button className="btn btn-danger" onClick={() => loadEvents()}>
            Réessayer
          </button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h1>Événements</h1>
        </Col>
        <Col xs="auto">
          <Link to="/events/create" className="btn btn-primary">
            + Nouvel événement
          </Link>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Rechercher un événement..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </Col>
      </Row>

      {events.length === 0 ? (
        <EmptyState />
      ) : (
        <Row>
          {events.map(event => (
            <Col key={event.id} md={4} className="mb-4">
              <Cards event={event} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

const EmptyState = () => {
  return (
    <div className="text-center py-5">
      <div className="mb-4">
        <i className="bi bi-calendar-x" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
      </div>
      <h2 className="text-muted mb-3">Bienvenue sur Event Manager !</h2>
      <p className="text-muted mb-4">
        Aucun événement n'est disponible pour le moment. 
        <br />Créez votre premier événement pour commencer !
      </p>
      <div className="d-flex justify-content-center gap-3">
        <Link to="/events/create" className="btn btn-primary btn-lg">
          <i className="bi bi-plus-circle me-2"></i>
          Créer un événement
        </Link>
        <button 
          className="btn btn-outline-secondary btn-lg"
          onClick={() => window.location.reload()}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Actualiser
        </button>
      </div>
    </div>
  );
};