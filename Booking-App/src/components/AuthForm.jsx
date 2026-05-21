import React, { useContext, useEffect, useState } from "react";
import "./AuthForm.css";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/bookingService";

const AuthForm = () => {
  const { user, login } = useContext(UserContext);
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

  const extractError = (err) => {
    const data = err?.response?.data;
    if (!data) return "Something went wrong. Please try again.";
    if (typeof data === "string") return data;
    if (data.detail) return data.detail;
    const messages = Object.entries(data)
      .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
      .join(" | ");
    return messages || "Something went wrong.";
  };

  async function handleLogin() {
    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const data = await loginUser({
        username: formData.email,
        password: formData.password,
      });
      if (!data.token || !data.user) {
        setError("Unexpected response from server. Please try again.");
        return;
      }
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const data = await registerUser({
        email:     formData.email,
        password:  formData.password,
        full_name: formData.name,
      });
      if (!data.token || !data.user) {
        setError("Unexpected response from server. Please try again.");
        return;
      }
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
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

      {/* ── Left panel ── */}
      <div className="auth-left">
        <div className="auth-left__inner">
          <a href="/" className="auth-logo">StayEase</a>
          <h2 className="auth-left__title">
            Your perfect stay<br />is one click away.
          </h2>
          <p className="auth-left__sub">
            Join thousands of travellers booking with confidence across India.
          </p>
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
              <span>100% secure &amp; encrypted</span>
            </div>
            <div className="auth-feature">
              <span className="auth-feature__icon">📞</span>
              <span>24/7 customer support</span>
            </div>
          </div>
        </div>
        <div className="auth-left__bg" />
      </div>

      {/* ── Right panel ── */}
      <div className="auth-right">
        <div className="auth-form-wrap">

          {/* Logo on mobile */}
          <a href="/" className="auth-logo-mobile">StayEase</a>

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

          <div className="auth-heading">
            <h1 className="auth-title">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="auth-subtitle">
              {isLogin
                ? "Sign in to manage your bookings"
                : "Get started — it's free"}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>

            {!isLogin && (
              <div className="auth-field">
                <label className="auth-label" htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="auth-input"
                  autoComplete="name"
                  required
                />
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@email.com"
                value={formData.email}
                onChange={handleChange}
                className="auth-input"
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label className="auth-label" htmlFor="password">Password</label>
                {isLogin && (
                  <button
                    type="button"
                    className="auth-forgot"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="auth-input-wrap">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder={isLogin ? "Enter password" : "Min. 8 characters"}
                  value={formData.password}
                  onChange={handleChange}
                  className="auth-input"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                />
                <button
                  type="button"
                  className="auth-show-pass"
                  aria-label={showPass ? "Hide password" : "Show password"}
                  onClick={() => setShowPass(p => !p)}
                >
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? <span className="auth-spinner" />
                : isLogin ? "Sign In" : "Create Account"}
            </button>

            <div className="auth-divider">
              <span />
              <p>or continue with</p>
              <span />
            </div>

            <div className="auth-socials">
              <button type="button" className="auth-social">
                <img src="https://www.google.com/favicon.ico" alt="" width="15" height="15" />
                Google
              </button>
              <button type="button" className="auth-social">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
                Phone
              </button>
            </div>

          </form>

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