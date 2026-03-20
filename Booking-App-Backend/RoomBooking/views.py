from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from rest_framework import mixins, generics, permissions
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied

from django.contrib.auth import authenticate

from .models import User, Room, OccupiedDate
from .serializers import RoomSerializer, OccupiedDateSerializer, UserSerializer
from .permissions import IsAdminOrReadOnly, IsOwnerOrReadOnly


@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'rooms':          reverse('room-list', request=request, format=format),
        'users':          reverse('user-list', request=request, format=format),
        'occupied-dates': reverse('occupieddate-list', request=request, format=format),
    })


class RoomList(generics.ListCreateAPIView):
    serializer_class   = RoomSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        rooms = Room.objects.filter(isAvailable=True)  # ← only available rooms

        # ── Filters from query params ──────────────────────────
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

        # ── Amenity filters ────────────────────────────────────
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
    queryset           = OccupiedDate.objects.all()
    serializer_class   = OccupiedDateSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if not user.is_superuser and not user.is_staff:
            return OccupiedDate.objects.filter(user=user)
        return super().get_queryset()


class OccupiedDatesDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset           = OccupiedDate.objects.all()
    serializer_class   = OccupiedDateSerializer
    permission_classes = [IsAdminOrReadOnly]


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
                "id":        user.id,
                "username":  user.email,
                "email":     user.email,
                "full_name": user.full_name,
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
                "id":        user.id,
                "username":  user.username,
                "email":     user.email,
                "full_name": user.full_name,
            },
            "token": token.key,
        })


class TestToken(generics.RetrieveAPIView):
    queryset           = User.objects.all()
    serializer_class   = UserSerializer