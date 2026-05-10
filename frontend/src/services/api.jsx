import axios from "axios";


const apiClient = axios.create({
    baseURL: 'http://localhost:8000/',
    headers: {
    'Content-Type': 'application/json',
  },

});

apiClient.interceptors.response.use(
  (response) => {
    // Pour les réponses 204 No Content, retourner null
    if (response.status === 204) return null;
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      throw error.response.data;
    } else if (error.request) {
      // La requête a été faite mais pas de réponse
      throw { 
        error: 'NETWORK_ERROR', 
        message: 'Impossible de se connecter au serveur' 
      };
    } else {
      // Erreur lors de la configuration de la requête
      throw { 
        error: 'REQUEST_ERROR', 
        message: error.message 
      };
    }
  }
);
export const api = {
  // Events
  getEvents: (params = {}) => {
    return apiClient.get('api/events', { params });
  },

  createEvent: (data) => {
    return apiClient.post('api/events', data);
  },

  getEvent: (id) => {
    return apiClient.get(`api/events/${id}`);
  },

  updateEvent: (id, data) => {
    return apiClient.put(`api/events/${id}`, data);
  },

  deleteEvent: (id) => {
    return apiClient.delete(`api/events/${id}`);
  },
  registerForEvent: (eventId, data) => apiClient.post(`api/events/${eventId}/register/`, data),
  getEventRegistrations: (eventId) => apiClient.get(`api/events/${eventId}/registrations/`),
  cancelRegistration: (registrationId) => apiClient.delete(`api/registrations/${registrationId}/`),

};

