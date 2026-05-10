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


class Inscription(models.Model):
    eventId=models.ManyToManyField(Evenement,blank=True)
    firstName=models.CharField(max_length=70)
    lastName=models.CharField(max_length=80)
    email=models.CharField(max_length=100)
    registerdAt=models.DateTimeField(auto_now_add=True)