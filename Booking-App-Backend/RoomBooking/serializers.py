from rest_framework import serializers
from .models import Room, OccupiedDate, RoomImage, User
from django.contrib.auth.hashers import make_password


class RoomImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomImage
        fields = ['id', 'image', 'caption']


class OccupiedDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OccupiedDate
        fields = ['id', 'room', 'user', 'date']


class RoomSerializer(serializers.ModelSerializer):
    images        = RoomImageSerializer(many=True, read_only=True)
    occupiedDates = OccupiedDateSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = [
            'id',
            'name',
            'city',           # ← added
            'type',
            'pricePerNight',
            'currency',
            'maxOccupancy',
            'description',
            'rating',
            'totalReviews',
            'isAvailable',    # ← added
            'hasWifi',        # ← added
            'hasAC',          # ← added
            'hasParking',     # ← added
            'hasBreakfast',   # ← added
            'hasTV',          # ← added
            'hasPool',        # ← added
            'images',
            'occupiedDates',
        ]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'full_name']

    def validate_password(self, value):
        return make_password(value)