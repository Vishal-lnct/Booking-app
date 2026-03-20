import React, { useContext, useEffect, useState } from "react";
import "./AuthForm.css";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/bookingService";

const AuthForm = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [isLogin,  setIsLogin]  = useState(true);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  async function handleLogin() {
    setLoading(true);
    try {
      const data = await loginUser({
        username: formData.email,
        password: formData.password,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data);
      navigate("/");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    setLoading(true);
    try {
      const data = await registerUser({
        username:  formData.email,
        email:     formData.email,
        password:  formData.password,
        full_name: formData.name,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data);
      navigate("/");
    } catch {
      setError("Registration failed. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async e => {
    e.preventDefault();
    if (isLogin) await handleLogin();
    else         await handleRegister();
  };

  const toggle = () => {
    setIsLogin(p => !p);
    setFormData({ email: "", password: "", name: "" });
    setError("");
  };

  return (
    <div className="auth-page">

      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-left__inner">
          <a href="/" className="auth-logo">StayEase</a>
          <h2 className="auth-left__title">
            Your perfect stay<br />is one click away.
          </h2>
          <p className="auth-left__sub">
            Join thousands of travellers booking with confidence across India.
          </p>

          {/* Feature list */}
          <div className="auth-features">
            <div className="auth-feature">
              <span className="auth-feature__icon">✅</span>
              <span>Free cancellation on most rooms</span>
            </div>
            <div className="auth-feature">
              <span className="auth-feature__icon">💳</span>
              <span>Pay at hotel — no upfront payment</span>
            </div>
            <div className="auth-feature">
              <span className="auth-feature__icon">🔒</span>
              <span>100% secure & encrypted</span>
            </div>
            <div className="auth-feature">
              <span className="auth-feature__icon">📞</span>
              <span>24/7 customer support</span>
            </div>
          </div>
        </div>

        {/* Background image overlay */}
        <div className="auth-left__bg" />
      </div>

      {/* Right panel — form */}
      <div className="auth-right">
        <div className="auth-form-wrap">

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${isLogin ? "auth-tab--active" : ""}`}
              onClick={() => { setIsLogin(true); setError(""); }}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${!isLogin ? "auth-tab--active" : ""}`}
              onClick={() => { setIsLogin(false); setError(""); }}
            >
              Create Account
            </button>
          </div>

          {/* Title */}
          <h1 className="auth-title">
            {isLogin ? "Welcome back 👋" : "Join StayEase 🏨"}
          </h1>
          <p className="auth-subtitle">
            {isLogin
              ? "Sign in to manage your bookings"
              : "Create your free account in seconds"}
          </p>

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit}>

            {!isLogin && (
              <div className="auth-field">
                <label className="auth-label">Full Name</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">👤</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="auth-input"
                    required
                  />
                </div>
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">📧</span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label className="auth-label">Password</label>
                {isLogin && (
                  <button type="button" className="auth-forgot">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔑</span>
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder={isLogin ? "Enter password" : "Min. 8 characters"}
                  value={formData.password}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />
                <button
                  type="button"
                  className="auth-show-pass"
                  onClick={() => setShowPass(p => !p)}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="auth-error">
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? <span className="auth-spinner" />
                : isLogin ? "Sign In →" : "Create Account →"}
            </button>

            {/* Divider */}
            <div className="auth-divider">
              <span />
              <p>or continue with</p>
              <span />
            </div>

            {/* Social (UI only) */}
            <div className="auth-socials">
              <button type="button" className="auth-social">
                <img src="https://www.google.com/favicon.ico" alt="Google" width="16" />
                Google
              </button>
              <button type="button" className="auth-social">
                📱 Phone
              </button>
            </div>

          </form>

          {/* Switch */}
          <p className="auth-switch">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button className="auth-switch__btn" onClick={toggle}>
              {isLogin ? " Sign Up" : " Sign In"}
            </button>
          </p>

          <p className="auth-terms">
            By continuing, you agree to StayEase's{" "}
            <a href="#">Terms of Service</a> &amp;{" "}
            <a href="#">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;