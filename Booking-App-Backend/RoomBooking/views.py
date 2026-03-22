from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from rest_framework import generics, permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied

from django.contrib.auth import authenticate
import datetime

from .models import User, Room, OccupiedDate, Booking
from .serializers import (
    RoomSerializer, OccupiedDateSerializer,
    UserSerializer, BookingSerializer
)
from .permissions import IsAdminOrReadOnly, IsOwnerOrReadOnly


@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'rooms':          reverse('room-list',          request=request, format=format),
        'users':          reverse('user-list',          request=request, format=format),
        'occupied-dates': reverse('occupieddate-list',  request=request, format=format),
        'bookings':       reverse('booking-list',       request=request, format=format),
    })


class RoomList(generics.ListCreateAPIView):
    serializer_class   = RoomSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        rooms = Room.objects.filter(isAvailable=True)

        city       = self.request.GET.get('city')
        max_price  = self.request.GET.get('maxPrice')
        room_type  = self.request.GET.get('type')
        occupancy  = self.request.GET.get('occupancy')
        min_rating = self.request.GET.get('minRating')

        if city:       rooms = rooms.filter(city__icontains=city)
        if max_price:  rooms = rooms.filter(pricePerNight__lte=max_price)
        if room_type:  rooms = rooms.filter(type__icontains=room_type)
        if occupancy:  rooms = rooms.filter(maxOccupancy__gte=occupancy)
        if min_rating: rooms = rooms.filter(rating__gte=min_rating)

        if self.request.GET.get('wifi')      == 'true': rooms = rooms.filter(hasWifi=True)
        if self.request.GET.get('ac')        == 'true': rooms = rooms.filter(hasAC=True)
        if self.request.GET.get('parking')   == 'true': rooms = rooms.filter(hasParking=True)
        if self.request.GET.get('breakfast') == 'true': rooms = rooms.filter(hasBreakfast=True)
        if self.request.GET.get('pool')      == 'true': rooms = rooms.filter(hasPool=True)

        return rooms


class RoomDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Room.objects.all()
    serializer_class   = RoomSerializer
    permission_classes = [IsAdminOrReadOnly]


class OccupiedDatesList(generics.ListCreateAPIView):
    serializer_class   = OccupiedDateSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return OccupiedDate.objects.all()


class OccupiedDatesDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset           = OccupiedDate.objects.all()
    serializer_class   = OccupiedDateSerializer
    permission_classes = [IsAdminOrReadOnly]


class BookingList(generics.ListCreateAPIView):
    serializer_class   = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Booking.objects.all()
        return Booking.objects.filter(user=user)

    def perform_create(self, serializer):
        booking = serializer.save(user=self.request.user)

        current = booking.check_in
        while current < booking.check_out:
            OccupiedDate.objects.get_or_create(
                room=booking.room,
                date=current,
                defaults={'user': self.request.user}
            )
            current += datetime.timedelta(days=1)


class BookingDetail(generics.RetrieveDestroyAPIView):
    serializer_class   = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Booking.objects.all()
        return Booking.objects.filter(user=user)

    def destroy(self, request, *args, **kwargs):
        booking = self.get_object()

        if booking.status != 'upcoming':
            return Response(
                {"detail": "Only upcoming bookings can be cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = 'cancelled'
        booking.save()

        OccupiedDate.objects.filter(
            room      = booking.room,
            date__gte = booking.check_in,
            date__lt  = booking.check_out,
        ).delete()

        return Response(
            {"detail": "Booking cancelled successfully."},
            status=status.HTTP_200_OK
        )


class UserList(generics.ListAPIView):
    queryset           = User.objects.all()
    serializer_class   = UserSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return User.objects.all()
        return User.objects.filter(id=user.id)


class UserDetail(generics.RetrieveAPIView):
    queryset           = User.objects.all()
    serializer_class   = UserSerializer

    def get_object(self):
        user = self.request.user
        obj  = super().get_object()
        if obj == user or user.is_staff or user.is_superuser:
            return obj
        raise PermissionDenied("You do not have permission to access this user's details.")


class Register(generics.CreateAPIView):
    queryset           = User.objects.all()
    serializer_class   = UserSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        self.response_data = {
            "user": {
                "id":           user.id,
                "username":     user.username,
                "email":        user.email,
                "full_name":    user.full_name,
                "is_staff":     user.is_staff,      # ✅ added
                "is_superuser": user.is_superuser,  # ✅ added
            },
            "token": token.key,
        }

    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)
        return Response(self.response_data)


class Login(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user is None:
            raise AuthenticationFailed('Invalid username or password')

        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "user": {
                "id":           user.id,
                "username":     user.username,
                "email":        user.email,
                "full_name":    user.full_name,
                "is_staff":     user.is_staff,      # ✅ added
                "is_superuser": user.is_superuser,  # ✅ added
            },
            "token": token.key,
        })
class ToggleRoomAvailability(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        # ✅ Only admin can toggle
        if not request.user.is_staff and not request.user.is_superuser:
            raise PermissionDenied("Admin only.")
        
        try:
            room = Room.objects.get(pk=pk)
            room.isAvailable = not room.isAvailable  # ✅ flip true/false
            room.save()
            return Response({
                "detail": f"Room is now {'available' if room.isAvailable else 'unavailable'}",
                "isAvailable": room.isAvailable
            })
        except Room.DoesNotExist:
            return Response({"detail": "Room not found."}, status=404)


class AdminCancelBooking(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        # ✅ Only admin can cancel any booking
        if not request.user.is_staff and not request.user.is_superuser:
            raise PermissionDenied("Admin only.")

        try:
            booking = Booking.objects.get(pk=pk)

            if booking.status != 'upcoming':
                return Response(
                    {"detail": "Only upcoming bookings can be cancelled."},
                    status=400
                )

            booking.status = 'cancelled'
            booking.save()

            # ✅ Free up occupied dates
            OccupiedDate.objects.filter(
                room      = booking.room,
                date__gte = booking.check_in,
                date__lt  = booking.check_out,
            ).delete()

            return Response({"detail": "Booking cancelled successfully."})

        except Booking.DoesNotExist:
            return Response({"detail": "Booking not found."}, status=404)

class TestToken(generics.RetrieveAPIView):
    queryset           = User.objects.all()
    serializer_class   = UserSerializer