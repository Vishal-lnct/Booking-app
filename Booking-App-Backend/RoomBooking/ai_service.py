from groq import Groq
import re
import json


# ================== GROQ CLIENT ==================
client = Groq(
    api_key="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"
)


# ================== INTENT DETECTION ==================
def detect_intent(user_msg):

    prompt = f"""
    Classify this message into ONE intent only.

    Possible intents:
    - greeting
    - hotel_search
    - recommendation
    - general_chat

    Message:
    "{user_msg}"

    Return ONLY one word.
    """

    try:

        response = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.1-8b-instant"
        )

        intent = response.choices[0].message.content.strip().lower()

        return intent

    except Exception as e:

        print("INTENT ERROR:", e)

        return "general_chat"



# ================== FILTER EXTRACTION ==================
def extract_filters(user_msg, available_cities=None):

    city_context = ""

    if available_cities:

        city_context = f"""
    Known available cities in database:
    {json.dumps(list(available_cities), ensure_ascii=False)}

    City extraction rule:
    - If the query asks for rooms/hotels in a city, set "city" to the closest matching value from known available cities.
    - Do not leave city empty when the user clearly mentioned one of the known cities.
    - Do not invent a city that is not present in known available cities.
    """

    prompt = f"""
    Extract hotel filters from this query.

    Query:
    "{user_msg}"

    {city_context}

    Return ONLY valid JSON.

    Example:
    {{
        "city": "",
        "max_price": "",
        "wifi": false,
        "ac": false,
        "parking": false
    }}

    IMPORTANT:
    - No explanation
    - No markdown
    - No extra text
    """

    try:

        response = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.1-8b-instant"
        )

        content = response.choices[0].message.content.strip()

        # remove markdown
        content = content.replace("```json", "")
        content = content.replace("```", "")

        # extract only JSON
        match = re.search(r'\{.*\}', content, re.DOTALL)

        if match:
            return match.group(0)

        return "{}"

    except Exception as e:

        print("FILTER ERROR:", e)

        return "{}"



# ================== NORMAL AI CHAT ==================
def generate_normal_reply(user_msg):

    prompt = f"""
    Reply naturally and briefly.

    User message:
    "{user_msg}"

    Keep the response friendly and short.
    """

    try:

        response = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.1-8b-instant"
        )

        return response.choices[0].message.content.strip()

    except Exception as e:

        print("CHAT ERROR:", e)

        return "Hello 👋 How can I help you today?"



# ================== HOTEL RESPONSE ==================
def generate_chat_reply(user_msg, rooms):

    # no rooms found
    if not rooms:
        return "Sorry, I couldn't find matching rooms."

    prompt = f"""
    User asked:
    "{user_msg}"

    Available hotel data:
    {json.dumps(rooms, indent=2)}

    Total rooms provided: {len(rooms)}

    Rules:
    - Use ONLY provided hotel data
    - Do NOT invent hotels, rooms, cities, amenities, ratings, or prices
    - Recommend only the rooms listed above
    - If the user asks for more rooms than provided, clearly say only {len(rooms)} matching room(s) are available
    - Do not mention any third option unless three rooms are present in the provided data
    - Keep response short
    - Speak naturally
    """

    try:

        response = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.1-8b-instant"
        )

        return response.choices[0].message.content.strip()

    except Exception as e:

        print("HOTEL CHAT ERROR:", e)

        return "I found some matching hotel rooms for you."