import os
import django
import random

# ✅ Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Booking_App.settings')
django.setup()

from RoomBooking.models import Room, RoomImage

room_types = ["suite", "standard", "deluxe"]

# 🔥 categories for realistic variation
categories = ["hotel", "bedroom", "luxury room", "resort", "apartment"]

for i in range(100):
    room = Room.objects.create(
        name=f"Room {i+1}",
        type=random.choice(room_types),
        pricePerNight=random.randint(800, 5000),
        currency="USD",
        maxOccupancy=random.randint(1, 5),
        description="Comfortable stay with modern amenities",
        rating=round(random.uniform(3.5, 5.0), 1),
        totalReviews=random.randint(10, 500)
    )

    # 🔥 random number of images per room (3 to 6)
    for _ in range(random.randint(3, 6)):
     RoomImage.objects.create(
        room=room,
        image=f"https://picsum.photos/400/300?random={random.randint(1,10000)}"
    )

print("✅ 100 rooms with dynamic images created successfully!")