from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from eventApp.models import Evenement
from eventApp.serializer.serializerer import EventSerializer
from django.db import models 


class EvenPuller(APIView):
    permission_classes=[AllowAny]

    def get(self,request):

        if request.method == 'GET':
            events = Evenement.objects.all()

        
        # Recherche textuelle
            search = request.query_params.get('search', '')
            if search:
                events = events.filter(
                    models.Q(title__icontains=search) | 
                    models.Q(description__icontains=search) |
                    models.Q(location__icontains=search)
                )
                
            
            # Filtre par date
            date = request.query_params.get('date', '')
            if date:
                events = events.filter(date__date=date)
            
            serializer = EventSerializer(events, many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        
    
    def post(self, request):
        """Crée un nouvel événement avec validation"""
        
        # Validation manuelle des champs requis (optionnel, le serializer le fait déjà)
        required_fields = ['title', 'date', 'location', 'capacity']
        errors = {}
        
        for field in required_fields:
            if field not in request.data or not request.data.get(field):
                errors[field] = f'Le champ {field} est requis'
        
        if errors:
            return Response(
                {'error': 'VALIDATION_ERROR', 'errors': errors}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validation de la capacité
        capacity = request.data.get('capacity')
        if capacity and (not isinstance(capacity, int) or capacity < 1):
            return Response(
                {'error': 'VALIDATION_ERROR', 'message': 'La capacité doit être un nombre positif'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class EventDetailView(APIView):
    """Détail, modification et suppression d'un événement"""
    permission_classes = [AllowAny]

    def get_object(self, id):
        """Récupère un événement par son ID ou retourne None"""
        try:
            return Evenement.objects.get(id=id)
        except Evenement.DoesNotExist:
            return None

    def get(self, request, id):
        """Affiche le détail d'un événement"""
        event = self.get_object(id)
        if not event:
            return Response(
                {'error': 'NOT_FOUND', 'message': 'Événement non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = EventSerializer(event)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id):
        """Met à jour un événement (modification complète ou partielle)"""
        event = self.get_object(id)
        if not event:
            return Response(
                {'error': 'NOT_FOUND', 'message': 'Événement non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )
        # partial=True permet la modification partielle
        serializer = EventSerializer(event, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        """Supprime un événement et toutes ses inscriptions"""
        event = self.get_object(id)
        if not event:
            return Response(
                {'error': 'NOT_FOUND', 'message': 'Événement non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )
        event.delete()  # Les inscriptions seront supprimées en cascade
        return Response(
            {'message': 'Événement supprimé avec succès'},
            status=status.HTTP_204_NO_CONTENT
        )


