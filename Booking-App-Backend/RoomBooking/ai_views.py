from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Room
from .ai_service import extract_filters
import json


# ================== AI SEARCH ==================
@api_view(["POST"])
def ai_search(request):
    query = request.data.get("query", "")

    try:
        filters = json.loads(extract_filters(query))
    except:
        filters = {}

    return Response({
        "filters": filters
    })


# ================== CHAT BOT ==================
@api_view(["POST"])
def chat(request):
    user_msg = request.data.get("message", "").lower()

    # 🧠 Step 1: AI extracts filters
    try:
        filters = json.loads(extract_filters(user_msg))
    except:
        filters = {}

    # 🧱 Step 2: DB filtering (REAL LOGIC)
    qs = Room.objects.filter(isAvailable=True)

    if filters.get("city"):
        qs = qs.filter(city__icontains=filters["city"])

    if filters.get("max_price"):
        qs = qs.filter(pricePerNight__lte=filters["max_price"])

    if filters.get("wifi"):
        qs = qs.filter(hasWifi=True)

    if filters.get("ac"):
        qs = qs.filter(hasAC=True)

    if filters.get("parking"):
        qs = qs.filter(hasParking=True)

    # 🔥 intent handling (important)
    if any(w in user_msg for w in ["cheap", "cheapest", "affordable", "budget"]):
        qs = qs.order_by("pricePerNight")

    if "best" in user_msg:
        qs = qs.order_by("-rating")

    # 🎯 limit results
    rooms = list(qs.values("id", "name", "city", "pricePerNight", "rating"))[:3]

    # rename key for frontend
    for r in rooms:
        r["price"] = r.pop("pricePerNight")

    # ✅ final response (NO AI)
    if not rooms:
        return Response({
            "rooms": [],
            "message": "No rooms found"
        })

    return Response({
        "rooms": rooms,
        "message": f"Showing results for '{user_msg}'"
    })