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


