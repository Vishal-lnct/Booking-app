import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Booking_App.settings')
django.setup()

from RoomBooking.models import Room, RoomImage

# ── 30 Real Hotel Room Images ────────────────────────────────
ROOM_IMAGES = [
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
    "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&q=80",
    "https://images.unsplash.com/photo-1609766857541-ed3e726b4dcf?w=800&q=80",
    "https://images.unsplash.com/photo-1601565415267-724db0e1e4f3?w=800&q=80",
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
    "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80",
    "https://images.unsplash.com/photo-1549294413-26f195200c16?w=800&q=80",
    "https://images.unsplash.com/photo-1614604994520-f52ea2797b3e?w=800&q=80",
    "https://images.unsplash.com/photo-1631049552240-59c37f38802b?w=800&q=80",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80",
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80",
    "https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800&q=80",
    "https://images.unsplash.com/photo-1576354302919-96748cb8299e?w=800&q=80",
    "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    "https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=800&q=80",
    "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&q=80",
    "https://images.unsplash.com/photo-1525438160292-a4a860951216?w=800&q=80",
    "https://images.unsplash.com/photo-1467987506553-8f3916508521?w=800&q=80",
]

# ── 50 Indian Cities ─────────────────────────────────────────
CITIES = [
    # Metro cities
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
    "Kolkata", "Pune", "Ahmedabad", "Surat", "Jaipur",
    # Tourist destinations
    "Goa", "Udaipur", "Shimla", "Manali", "Darjeeling",
    "Ooty", "Munnar", "Coorg", "Rishikesh", "Haridwar",
    "Varanasi", "Amritsar", "Agra", "Jodhpur", "Jaisalmer",
    "Mysore", "Kodaikanal", "Mussoorie", "Nainital", "Lonavala",
    # Tier 2 cities
    "Indore", "Bhopal", "Nagpur", "Visakhapatnam", "Coimbatore",
    "Kochi", "Thiruvananthapuram", "Patna", "Lucknow", "Kanpur",
    "Chandigarh", "Dehradun", "Ranchi", "Raipur", "Bhubaneswar",
    # Hidden gems
    "Pondicherry", "Hampi", "Alleppey", "Varkala", "Kasol",
    "Spiti", "Leh", "Gangtok", "Shillong", "Aizawl",
]

# ── Realistic Room Names by Type ─────────────────────────────
SUITE_NAMES = [
    "Royal Presidential Suite", "Grand Maharaja Suite",
    "Penthouse Sky Suite", "Heritage Palace Suite",
    "Honeymoon Luxury Suite", "Imperial Grand Suite",
    "Signature Wellness Suite", "Ultra Luxury Pool Suite",
]

DELUXE_NAMES = [
    "Grand Deluxe King Room", "Sea View Deluxe Studio",
    "Deluxe Garden Terrace Room", "Panoramic View Deluxe Room",
    "Deluxe Poolside Room", "Executive Deluxe Suite",
    "Deluxe Heritage Room", "Deluxe Jungle View Room",
]

PREMIUM_NAMES = [
    "Premium Business Room", "Premium Lake View Room",
    "Premium Hill Retreat Room", "Premium City View Room",
    "Premium Balcony Room", "Club Premium Room",
    "Premium Courtyard Room", "Premium Mountain View Room",
]

STANDARD_NAMES = [
    "Classic Comfort Room", "Superior Twin Room",
    "Economy Smart Room", "Cozy Standard Room",
    "Budget Friendly Room", "Standard Queen Room",
    "Compact Studio Room", "Standard Double Room",
]

# ── Descriptions ─────────────────────────────────────────────
DESCRIPTIONS = [
    "Wake up to breathtaking views in this meticulously designed room featuring plush king-size bedding, marble bathroom and personalised butler service.",
    "An oasis of calm in the heart of the city. Enjoy floor-to-ceiling windows, a rainfall shower, and curated local artwork throughout.",
    "Blending heritage architecture with modern luxury. Handcrafted furniture, silk drapes and a private balcony overlooking manicured gardens.",
    "Perfect for couples seeking romance. A four-poster bed draped in white linen, a clawfoot bathtub, and candlelit ambiance await you.",
    "Designed for the modern business traveller. High-speed WiFi, ergonomic workspace, premium coffee machine and city views from the 18th floor.",
    "Surrounded by lush greenery and birdsong. This eco-friendly villa features natural materials, an outdoor shower and organic bath amenities.",
    "A sprawling suite with a private infinity pool, sundeck, and 24-hour room service. Experience unparalleled luxury in every detail.",
    "Rustic mountain charm meets modern comfort. Stone walls, a cosy fireplace, and warm woollen throws make this the perfect winter escape.",
    "Light-filled and airy with Scandinavian minimalist design. Premium foam mattress, blackout curtains and a pillow menu for perfect sleep.",
    "Set in a restored colonial bungalow. Teak furniture, antique mirrors, and a wrap-around veranda transport you to a gentler era.",
    "Contemporary interiors with a vibrant local twist. Bold artwork, artisan crafts, and a curated minibar featuring regional delicacies.",
    "A serene retreat high above the clouds. Panoramic floor-to-ceiling windows frame the misty mountains for an unforgettable vista.",
    "Thoughtfully designed for families. Two connecting rooms, a play area, child-safe amenities and a dedicated family concierge.",
    "Pure coastal living at its finest. Whitewashed walls, a hammock on the private patio, and the sound of waves as your lullaby.",
    "Minimalist luxury with maximum impact. Every element has been curated for comfort — from the Italian linen to the Japanese soaking tub.",
]

# ── Amenity Presets ───────────────────────────────────────────
AMENITY_PRESETS = [
    # Budget
    {"hasWifi": True,  "hasAC": True,  "hasTV": True,  "hasParking": False, "hasBreakfast": False, "hasPool": False},
    # Mid range
    {"hasWifi": True,  "hasAC": True,  "hasTV": True,  "hasParking": True,  "hasBreakfast": False, "hasPool": False},
    # Business
    {"hasWifi": True,  "hasAC": True,  "hasTV": True,  "hasParking": True,  "hasBreakfast": True,  "hasPool": False},
    # Premium
    {"hasWifi": True,  "hasAC": True,  "hasTV": True,  "hasParking": True,  "hasBreakfast": True,  "hasPool": True},
    # Luxury
    {"hasWifi": True,  "hasAC": True,  "hasTV": True,  "hasParking": True,  "hasBreakfast": True,  "hasPool": True},
    # Basic
    {"hasWifi": True,  "hasAC": False, "hasTV": True,  "hasParking": False, "hasBreakfast": False, "hasPool": False},
    # Resort
    {"hasWifi": True,  "hasAC": True,  "hasTV": False, "hasParking": True,  "hasBreakfast": True,  "hasPool": True},
]

# ── Price ranges by type ──────────────────────────────────────
PRICE_RANGES = {
    "suite":    (8000,  25000),
    "deluxe":   (4000,  9000),
    "premium":  (2500,  5500),
    "standard": (1000,  3000),
}

# ── Rating ranges by type ─────────────────────────────────────
RATING_RANGES = {
    "suite":    (4.3, 5.0),
    "deluxe":   (4.0, 4.9),
    "premium":  (3.8, 4.7),
    "standard": (3.5, 4.5),
}

# ── Occupancy by type ─────────────────────────────────────────
OCCUPANCY_RANGES = {
    "suite":    (2, 6),
    "deluxe":   (2, 4),
    "premium":  (1, 3),
    "standard": (1, 2),
}

# ── Name pools by type ────────────────────────────────────────
NAME_POOLS = {
    "suite":    SUITE_NAMES,
    "deluxe":   DELUXE_NAMES,
    "premium":  PREMIUM_NAMES,
    "standard": STANDARD_NAMES,
}

# ── Clear old data ────────────────────────────────────────────
print("🗑️  Clearing old rooms and images...")
RoomImage.objects.all().delete()
Room.objects.all().delete()
print("✅ Cleared\n")

# ── Create 100 rooms ─────────────────────────────────────────
room_types = ["suite", "standard", "deluxe", "premium"]

# Ensure every city gets at least 2 rooms
city_pool = CITIES * 2          # 100+ entries
random.shuffle(city_pool)
city_pool = city_pool[:100]     # exactly 100

for i in range(100):
    room_type   = random.choice(room_types)
    city        = city_pool[i]
    price_min, price_max = PRICE_RANGES[room_type]
    rat_min,   rat_max   = RATING_RANGES[room_type]
    occ_min,   occ_max   = OCCUPANCY_RANGES[room_type]
    amenities   = random.choice(AMENITY_PRESETS)
    name_pool   = NAME_POOLS[room_type]

    room = Room.objects.create(
        name          = random.choice(name_pool),
        city          = city,
        type          = room_type,
        pricePerNight = random.randint(price_min, price_max),
        currency      = "INR",
        maxOccupancy  = random.randint(occ_min, occ_max),
        description   = random.choice(DESCRIPTIONS),
        rating        = round(random.uniform(rat_min, rat_max), 1),
        totalReviews  = random.randint(15, 600),
        isAvailable   = True,
        **amenities,
    )

    # 3–5 unique real room images per room
    images = random.sample(ROOM_IMAGES, k=random.randint(3, 5))
    for url in images:
        RoomImage.objects.create(room=room, image=url)

    print(f"  {i+1:>3}/100  {room_type:<9}  ₹{room.pricePerNight:>6,}  "
          f"★{room.rating}  {city:<20}  {room.name}")

print(f"\n🎉 100 rooms created across {len(set(city_pool))} Indian cities!")
print("   Search any city to find rooms instantly.")