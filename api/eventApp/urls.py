from django.urls import path
from eventApp.views.eventsPuler import EvenPuller,EventDetailView
from eventApp.views.registration import EventRegisterView

urlpatterns=[
    path('api/events',EvenPuller.as_view(),name='puller'),
    path('api/events/<str:id>/',EventDetailView.as_view() , name='event-detail'),
    path('api/events/<str:id>/register/',EventRegisterView.as_view(),name="registration")
]