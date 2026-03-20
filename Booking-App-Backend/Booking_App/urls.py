from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # ✅ FIX: Add API prefix
    path('api/', include('RoomBooking.urls')),
]

urlpatterns += [
    path('api-auth/', include('rest_framework.urls')),
]