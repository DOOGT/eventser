// frontend/src/pages/CreateEvent.js
import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Titre requis';
    if (!formData.description.trim()) newErrors.description = 'Description requise';
    if (!formData.date) newErrors.date = 'Date requise';
    if (!formData.location.trim()) newErrors.location = 'Lieu requis';
    if (!formData.capacity || formData.capacity < 1) newErrors.capacity = 'Capacité minimale : 1';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      await api.createEvent({
        ...formData,
        capacity: parseInt(formData.capacity),
        date: new Date(formData.date).toISOString()
      });
      navigate('/');
    } catch (err) {
      setServerError(err.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: '600px' }}>
      <h1>Créer un événement</h1>
      
      {serverError && <Alert variant="danger">{serverError}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Titre *</Form.Label>
          <Form.Control
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            isInvalid={!!errors.title}
          />
          <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description *</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            isInvalid={!!errors.description}
          />
          <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Date *</Form.Label>
          <Form.Control
            type="datetime-local"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            isInvalid={!!errors.date}
          />
          <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Lieu *</Form.Label>
          <Form.Control
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            isInvalid={!!errors.location}
          />
          <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Capacité *</Form.Label>
          <Form.Control
            type="number"
            min="1"
            value={formData.capacity}
            onChange={(e) => setFormData({...formData, capacity: e.target.value})}
            isInvalid={!!errors.capacity}
          />
          <Form.Control.Feedback type="invalid">{errors.capacity}</Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" disabled={loading}>
          {loading ? 'Création...' : 'Créer l\'événement'}
        </Button>
      </Form>
    </Container>
  );
};

export default CreateEvent;