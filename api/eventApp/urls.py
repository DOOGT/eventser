from django.urls import path
from eventApp.views.eventsPuler import EvenPuller

urlpatterns=[
    path('api/events',EvenPuller.as_view(),name='puller'),
]