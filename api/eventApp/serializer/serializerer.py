from rest_framework import serializers
from eventApp.models import Evenement


class EventSerializer(serializers.ModelSerializer):

    class Meta:
        model = Evenement
        fields = [
            'id', 'title', 'description', 'date', 'location', 
            'capacity','created_at',
        ]
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        
        return {
            'id': data['id'],
            'title': data['title'],
            'description': data['description'],
            'date': data['date'],
            'location': data['location'],
            'capacity': data['capacity'],
            'createdAt': data['created_at']
        }