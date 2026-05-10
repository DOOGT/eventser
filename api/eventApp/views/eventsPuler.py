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


