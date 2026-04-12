import { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/forgot-password/", {
        email,
      });
      alert("Reset link sent to your email");
    } catch (err) {
      alert("Error sending email");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSubmit}>
        Send Reset Link
      </button>
    </div>
  );
}

export default ForgotPassword;