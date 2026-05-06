export const sendMessage = async (message) => {
  const res = await fetch("http://127.0.0.1:8000/api/chat/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  return await res.json();
};