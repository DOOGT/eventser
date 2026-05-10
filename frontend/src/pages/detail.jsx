// frontend/src/pages/EventDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Spinner, Alert, Card, Badge, Form, Button } from 'react-bootstrap';
import { api } from '../services/api';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const data = await api.getEvent(id);
      setEvent(data);
    } catch (err) {
      setError('Événement non trouvé');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setRegistrationError(null);
    setRegistrationSuccess(false);

    try {
      await api.registerForEvent(id, formData);
      setRegistrationSuccess(true);
      setFormData({ firstName: '', lastName: '', email: '' });
      loadEvent(); // Recharger pour mettre à jour le compteur
    } catch (err) {
      setRegistrationError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Chargement...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
        <Link to="/" className="btn btn-primary">← Retour à la liste</Link>
      </Container>
    );
  }

  if (!event) return null;

  return (
    <Container className="mt-4" style={{ maxWidth: '800px' }}>
      <Link to="/" className="btn btn-outline-primary mb-3">← Retour à la liste</Link>
      
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h1 className="h2">{event.title}</h1>
            {event.isFull ? (
              <Badge bg="danger" className="fs-6">COMPLET</Badge>
            ) : (
              <Badge bg="success" className="fs-6">
                {event.availableSpots} place{event.availableSpots > 1 ? 's' : ''} restante{event.availableSpots > 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          <p className="text-muted mb-2">
            📅 {new Date(event.date).toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <p className="text-muted mb-3">📍 {event.location}</p>
          <p>{event.description}</p>

          <div className="mt-4">
            <h5>Places disponibles</h5>
            <div className="progress mb-2" style={{ height: '10px' }}>
              <div
                className={`progress-bar ${event.isFull ? 'bg-danger' : 'bg-success'}`}
                style={{ 
                  width: event.capacity > 0 
                    ? `${((event.capacity - event.availableSpots) / event.capacity) * 100}%` 
                    : '0%' 
                }}
              />
            </div>
            <small className="text-muted">
              {event.availableSpots} / {event.capacity} places
            </small>
          </div>
        </Card.Body>
      </Card>

      {!event.isFull && (
        <Card>
          <Card.Body>
            <h5 className="mb-3">S'inscrire à cet événement</h5>
            
            {registrationSuccess && (
              <Alert variant="success">
                ✅ Inscription réussie ! Vous êtes maintenant inscrit à cet événement.
              </Alert>
            )}
            
            {registrationError && (
              <Alert variant="danger">❌ {registrationError}</Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Prénom *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Votre prénom"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required
                  disabled={submitting}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nom *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Votre nom"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required
                  disabled={submitting}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  disabled={submitting}
                />
              </Form.Group>

              <Button type="submit" disabled={submitting}>
                {submitting ? 'Inscription en cours...' : "S'inscrire"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {event.isFull && (
        <Alert variant="warning">
          🔴 Cet événement est complet. Aucune inscription n'est possible pour le moment.
        </Alert>
      )}
    </Container>
  );
};

export default EventDetail;