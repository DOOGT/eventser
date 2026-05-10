// frontend/src/components/Cards.js
import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Cards = ({ event }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="mb-0">{event.title}</Card.Title>
          {event.isFull ? (
            <Badge bg="danger">Complet</Badge>
          ) : (
            <Badge bg="success">{event.availableSpots} places</Badge>
          )}
        </div>
        
        <Card.Subtitle className="mb-2 text-muted">
          <i className="bi bi-calendar me-2"></i>
          {formatDate(event.date)}
        </Card.Subtitle>
        
        <Card.Subtitle className="mb-3 text-muted">
          <i className="bi bi-geo-alt me-2"></i>
          {event.location}
        </Card.Subtitle>
        
        <Card.Text>
          {event.description?.length > 100 
            ? `${event.description.substring(0, 100)}...` 
            : event.description}
        </Card.Text>

        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <small className="text-muted">Places disponibles</small>
            <small>{event.availableSpots} / {event.capacity}</small>
          </div>
          <div className="progress" style={{ height: '6px' }}>
            <div 
              className={`progress-bar ${event.isFull ? 'bg-danger' : 'bg-success'}`}
              role="progressbar"
              style={{ 
                width: `${((event.capacity - event.availableSpots) / event.capacity) * 100}%` 
              }}
              aria-valuenow={event.capacity - event.availableSpots}
              aria-valuemin="0"
              aria-valuemax={event.capacity}
            />
          </div>
        </div>

        <Link 
          to={`/events/${event.id}`} 
          className={`btn btn-${event.isFull ? 'outline-secondary' : 'primary'} w-100`}
        >
          {event.isFull ? 'Voir les détails' : "S'inscrire"}
        </Link>
      </Card.Body>
    </Card>
  );
};

export default Cards;