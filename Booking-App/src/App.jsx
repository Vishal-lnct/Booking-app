import { useContext, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import { UserContext } from "./components/UserContext";

function App() {
  // ✅ No useEffect needed — UserContext already reads localStorage on init
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Just a brief tick to let context initialize
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", fontFamily: "'DM Sans', sans-serif",
        flexDirection: "column", gap: "16px", background: "#f4f4f4"
      }}>
        <div style={{
          width: "40px", height: "40px",
          border: "3px solid #f0f0f0", borderTop: "3px solid #e60023",
          borderRadius: "50%", animation: "spin 0.7s linear infinite"
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: "#777", fontSize: "14px", margin: 0 }}>Loading StayEase...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;