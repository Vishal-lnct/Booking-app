from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


class Room(models.Model):
    ROOM_TYPES = [
        ('suite',    'Suite'),
        ('standard', 'Standard'),
        ('deluxe',   'Deluxe'),
        ('premium',  'Premium'),
    ]

    CURRENCY_TYPES = [
        ('USD', 'USD'),
        ('EUR', 'EUR'),
        ('INR', 'INR'),
    ]

    name          = models.CharField(max_length=100, blank=True, default='')
    city          = models.CharField(max_length=100, default='India')
    type          = models.CharField(max_length=100, choices=ROOM_TYPES)
    pricePerNight = models.IntegerField(default=150)
    currency      = models.CharField(default="INR", max_length=10, choices=CURRENCY_TYPES)
    maxOccupancy  = models.IntegerField(default=1)
    description   = models.TextField(max_length=1000)
    rating        = models.FloatField(default=4.0)
    totalReviews  = models.IntegerField(default=0)
    isAvailable   = models.BooleanField(default=True)

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

    class Meta:
        # ✅ Prevent duplicate date entries for same room
        unique_together = ('room', 'date')

    def __str__(self):
        return f"{self.date} - {self.room.name}"


class Booking(models.Model):
    STATUS_CHOICES = [
        ('upcoming',   'Upcoming'),
        ('completed',  'Completed'),
        ('cancelled',  'Cancelled'),
    ]

    room       = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='bookings')
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    check_in   = models.DateField()
    check_out  = models.DateField()
    status     = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Booking #{self.id} — {self.user} — Room {self.room}"


class User(AbstractUser):
    email     = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100, default="")