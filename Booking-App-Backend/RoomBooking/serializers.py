from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Room, RoomImage, OccupiedDate, Booking
import datetime

User = get_user_model()


class RoomImageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = RoomImage
        fields = ['id', 'image', 'caption']


class RoomSerializer(serializers.ModelSerializer):
    images        = RoomImageSerializer(many=True, read_only=True)
    occupiedDates = serializers.SerializerMethodField()

    class Meta:
        model  = Room
        fields = [
            'id', 'name', 'city', 'type',
            'pricePerNight', 'currency',
            'maxOccupancy', 'description',
            'rating', 'totalReviews', 'isAvailable',
            'hasWifi', 'hasAC', 'hasParking',
            'hasBreakfast', 'hasTV', 'hasPool',
            'images', 'occupiedDates',
        ]

    def get_occupiedDates(self, obj):
        # ✅ Returns list of { date, room } for calendar blocking on frontend
        dates = OccupiedDate.objects.filter(room=obj)
        return OccupiedDateSerializer(dates, many=True).data


class OccupiedDateSerializer(serializers.ModelSerializer):
    class Meta:
        model  = OccupiedDate
        fields = ['id', 'room', 'user', 'date']

    def validate(self, data):
        # ✅ Block duplicate date for same room
        exists = OccupiedDate.objects.filter(
            room=data['room'],
            date=data['date']
        ).exists()
        if exists:
            raise serializers.ValidationError(
                {"detail": "This room is already booked on that date."}
            )
        return data


class BookingSerializer(serializers.ModelSerializer):
    room_name = serializers.CharField(source='room.name', read_only=True)

    class Meta:
        model  = Booking
        fields = [
            'id', 'room', 'room_name',
            'check_in', 'check_out',
            'status', 'created_at',
        ]
        read_only_fields = ['user', 'status', 'created_at', 'room_name']

    def validate(self, data):
        check_in  = data.get('check_in')
        check_out = data.get('check_out')
        today     = datetime.date.today()

        # check_in cannot be in the past
        if check_in and check_in < today:
            raise serializers.ValidationError(
                {"check_in": "Check-in date cannot be in the past."}
            )

        # check_out must be after check_in
        if check_in and check_out and check_out <= check_in:
            raise serializers.ValidationError(
                {"check_out": "Check-out must be after check-in."}
            )

        # Block overlapping bookings for same room
        if check_in and check_out and data.get('room'):
            overlap = Booking.objects.filter(
                room       = data['room'],
                status__in = ['upcoming'],
                check_in__lt  = check_out,
                check_out__gt = check_in,
            )
            if self.instance:
                overlap = overlap.exclude(pk=self.instance.pk)
            if overlap.exists():
                raise serializers.ValidationError(
                    {"detail": "This room is already booked for the selected dates."}
                )

        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id', 'username', 'email', 'full_name', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user