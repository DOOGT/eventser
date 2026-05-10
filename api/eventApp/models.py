from django.db import models
from django.contrib.auth.models import AbstractUser



# Create your models here.

class User(AbstractUser):
    pass

class Evenement(models.Model):
    title=models.CharField(max_length=150)
    description=models.CharField(max_length=200)
    date=models.DateTimeField()
    location=models.CharField(max_length=100)
    capacity=models.IntegerField()
    createdAt=models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'evenements'
        verbose_name = 'Événement'
        verbose_name_plural = 'Événements'

    def __str__(self):
        return self.title

    @property
    def registered_count(self):
        """Nombre d'inscriptions pour cet événement"""
        return Inscription.objects.filter(eventId=self).count()

    @property
    def available_spots(self):
        """Nombre de places restantes"""
        return self.capacity - self.registered_count

    @property
    def is_full(self):
        """Vérifie si l'événement est complet"""
        return self.available_spots <= 0


class Inscription(models.Model):
    eventId=models.ForeignKey(Evenement,on_delete=models.CASCADE,related_name='inscriptions',null=True)
    firstName=models.CharField(max_length=70)
    lastName=models.CharField(max_length=80)
    email=models.CharField(max_length=100)
    registerdAt=models.DateTimeField(auto_now_add=True)