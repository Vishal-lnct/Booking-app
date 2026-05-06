from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Room
import json


@api_view(["POST"])
def chat(request):
    try:
        user_msg = request.data.get("message", "").lower()

        # 🔎 Base queryset
        qs = Room.objects.filter(isAvailable=True)

        # 🌆 City filter (simple for now)
        if "delhi" in user_msg:
            qs = qs.filter(city__icontains="delhi")

        # 💸 Cheap / affordable intent
        if any(w in user_msg for w in ["cheap", "cheapest", "affordable", "budget"]):
            qs = qs.order_by("pricePerNight")

        # ⭐ Best rated
        if "best" in user_msg:
            qs = qs.order_by("-rating")

        # 🎯 Limit + shape
        rooms = list(qs.values("id", "name", "city", "pricePerNight", "rating"))[:3]

        # Rename key for frontend
        for r in rooms:
            r["price"] = r.pop("pricePerNight")

        # 🚫 No data
        if not rooms:
            return Response({
                "rooms": [],
                "message": "No rooms available"
            })

        # ✅ Final response (NO AI)
        return Response({
            "rooms": rooms,
            "message": f"Showing results for '{user_msg}'"
        })

    except Exception as e:
        print("ERROR:", e)
        return Response({
            "rooms": [],
            "message": "Server error"
        }, status=500)