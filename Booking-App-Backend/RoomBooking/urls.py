from django.urls import path
from RoomBooking import views
from rest_framework.urlpatterns import format_suffix_patterns
from django.conf import settings
from django.conf.urls.static import static
from .views import forgot_password, reset_password


urlpatterns = [

    # ================== ROOT ==================
    path('', views.api_root, name='api-root'),

    # ================== AUTH ==================
    path('login/', views.Login.as_view(), name='login'),
    path('register/', views.Register.as_view(), name='register'),
    path('token-test/', views.TestToken.as_view(), name='token-test'),

    # ================== ROOMS ==================
    path('rooms/', views.RoomList.as_view(), name='room-list'),
    path('rooms/<int:pk>/', views.RoomDetail.as_view(), name='room-detail'),

    # ================== USERS ==================
    path('users/', views.UserList.as_view(), name='user-list'),
    path('users/<int:pk>/', views.UserDetail.as_view(), name='user-detail'),

    # ================== OCCUPIED DATES ==================
    path(
        'occupied-dates/',
        views.OccupiedDatesList.as_view(),
        name='occupieddate-list'
    ),

    path(
        'occupied-dates/<int:pk>/',
        views.OccupiedDatesDetail.as_view(),
        name='occupieddate-detail'
    ),

    # ================== BOOKINGS ==================
    path('bookings/', views.BookingList.as_view(), name='booking-list'),
    path('bookings/<int:pk>/', views.BookingDetail.as_view(), name='booking-detail'),

    # ================== ADMIN ==================
    path(
        'admin/rooms/<int:pk>/toggle/',
        views.ToggleRoomAvailability.as_view(),
        name='toggle-room'
    ),

    path(
        'admin/bookings/<int:pk>/cancel/',
        views.AdminCancelBooking.as_view(),
        name='admin-cancel-booking'
    ),

    # ================== PASSWORD ==================
    path('forgot-password/', forgot_password),
    path('reset-password/', reset_password),

    # ================== AI ==================
    path('ai-search/', views.ai_search),
    path('chat/', views.chat),
]

urlpatterns = format_suffix_patterns(urlpatterns)

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )