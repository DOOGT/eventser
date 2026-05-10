from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from eventApp.models import Evenement,Inscription
from eventApp.serializer.serializerer import InscriptionSerializer
from django.db import models 

class EventRegisterView(APIView):
    """Inscription à un événement"""
    permission_classes = [AllowAny]

    def post(self, request, id):
        try:
            event = Evenement.objects.get(id=id)
        except Evenement.DoesNotExist:
            return Response(
                {'error': 'NOT_FOUND', 'message': 'Événement non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Vérifier la capacité
        if event.is_full:
            return Response(
                {
                    'error': 'CAPACITY_REACHED',
                    'message': 'Cet événement est complet.'
                },
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )
        
        email = request.data.get('email', '')
        
        # Vérifier l'unicité - utiliser eventId au lieu de event
        if Inscription.objects.filter(eventId=event, email=email).exists():
            return Response(
                {
                    'error': 'DUPLICATE_EMAIL',
                    'message': 'Cette adresse email est déjà enregistrée pour cet événement.'
                },
                status=status.HTTP_409_CONFLICT
            )
        
        # Validation des champs requis
        errors = {}
        if not request.data.get('firstName'):
            errors['firstName'] = 'Le prénom est requis'
        if not request.data.get('lastName'):
            errors['lastName'] = 'Le nom est requis'
        if not email:
            errors['email'] = "L'email est requis"
        
        if errors:
            return Response(
                {'error': 'VALIDATION_ERROR', 'errors': errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Créer l'inscription avec les noms de champs corrects
        try:
            inscription = Inscription.objects.create(
                eventId=event,  # Utiliser eventId
                firstName=request.data.get('firstName'),  # Pas first_name
                lastName=request.data.get('lastName'),    # Pas last_name
                email=email
            )
            
            serializer = InscriptionSerializer(inscription)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': 'CREATION_ERROR', 'message': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class EventRegistrationsView(APIView):
    """Liste des inscriptions d'un événement"""
    permission_classes = [AllowAny]

    def get(self, request, id):
        try:
            event = Evenement.objects.get(id=id)
        except Evenement.DoesNotExist:
            return Response(
                {'error': 'NOT_FOUND', 'message': 'Événement non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Utiliser eventId pour filtrer
        registrations = Inscription.objects.filter(eventId=event).order_by('-registerdAt')
        serializer = InscriptionSerializer(registrations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CancelRegistrationView(APIView):
    """Annulation d'une inscription"""
    permission_classes = [AllowAny]

    def delete(self, request, id):
        try:
            registration = Inscription.objects.get(id=id)
        except Inscription.DoesNotExist:
            return Response(
                {'error': 'NOT_FOUND', 'message': 'Inscription non trouvée'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        registration.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)