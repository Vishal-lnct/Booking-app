export const aiSearch = async (query) => {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/ai-search/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      throw new Error("Server error");
    }

    return await res.json();
  } catch (err) {
    console.error("AI Search Error:", err);
    return { filters: "{}" }; // fallback
  }
};