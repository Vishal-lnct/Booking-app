from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from cloudinary.models import CloudinaryField


class Room(models.Model):
    ROOM_TYPES = [
        ('suite', 'Suite'),
        ('standard', 'Standard'),
        ('deluxe', 'Deluxe'),
        ('premium', 'Premium'),       # ← added
    ]

    CURRENCY_TYPES = [
        ('USD', 'USD'),
        ('EUR', 'EUR'),
        ('INR', 'INR'),               # ← added INR
    ]

    name          = models.CharField(max_length=100, blank=True, default='')
    city          = models.CharField(max_length=100, default='India')  # ← added
    type          = models.CharField(max_length=100, choices=ROOM_TYPES)
    pricePerNight = models.IntegerField(default=150)
    currency      = models.CharField(default="INR", max_length=10, choices=CURRENCY_TYPES)
    maxOccupancy  = models.IntegerField(default=1)
    description   = models.TextField(max_length=1000)
    rating        = models.FloatField(default=4.0)
    totalReviews  = models.IntegerField(default=0)
    isAvailable   = models.BooleanField(default=True)  # ← added

    # Amenities                                         # ← all added
    hasWifi       = models.BooleanField(default=True)
    hasAC         = models.BooleanField(default=True)
    hasParking    = models.BooleanField(default=False)
    hasBreakfast  = models.BooleanField(default=False)
    hasTV         = models.BooleanField(default=True)
    hasPool       = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({self.type}) - {self.city}"


class RoomImage(models.Model):
    image   = models.URLField()
    caption = models.CharField(max_length=255, blank=True, null=True)
    room    = models.ForeignKey(Room, related_name='images', on_delete=models.CASCADE)

    def __str__(self):
        return f"Image for {self.room.name}"


class OccupiedDate(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='occupiedDates')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='booked_dates')
    date = models.DateField()

    def __str__(self):
        return f"{self.date} - {self.room.name}"


class User(AbstractUser):
    email     = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100, default="")