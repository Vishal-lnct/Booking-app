import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function ResetPassword() {
  const { uid, token } = useParams();
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/reset-password/",
        {
          uid,
          token,
          password,
        }
      );
      alert("Password reset successful");
    } catch (err) {
      alert("Error resetting password");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>Reset Password</button>
    </div>
  );
}

export default ResetPassword;