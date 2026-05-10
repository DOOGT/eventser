from rest_framework import serializers
from eventApp.models import Evenement,Inscription


class EventSerializer(serializers.ModelSerializer):

    availableSpots = serializers.IntegerField(source='available_spots', read_only=True)
    isFull = serializers.BooleanField(source='is_full', read_only=True)
    registeredCount = serializers.IntegerField(source='registered_count', read_only=True)

    class Meta:
        model = Evenement
        fields = [
            'id', 'title', 'description', 'date', 'location',
            'capacity', 'availableSpots', 'isFull', 'registeredCount', 'createdAt'
        ]


class InscriptionSerializer(serializers.ModelSerializer):
    # eventId est une ForeignKey, on récupère juste l'ID
    eventId = serializers.CharField(source='eventId_id', read_only=True)

    class Meta:
        model = Inscription
        fields = ['id', 'eventId', 'firstName', 'lastName', 'email', 'registerdAt']