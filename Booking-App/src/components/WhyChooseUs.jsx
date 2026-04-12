// WhyChooseUs.jsx
import "./WhyChooseUs.css";
import React from "react";

const FEATURES = [
  {
    icon: "💰",
    title: "Best Prices",
    desc: "Lowest prices guaranteed. We match any rate you find elsewhere.",
    stat: "70% OFF",
    statLabel: "avg savings",
    color: "#fff7ed",
    border: "#fed7aa",
  },
  {
    icon: "🔒",
    title: "Secure Booking",
    desc: "100% encrypted payments. Your data is always safe with us.",
    stat: "256-bit",
    statLabel: "SSL encryption",
    color: "#f0fdf4",
    border: "#bbf7d0",
  },
  {
    icon: "📞",
    title: "24/7 Support",
    desc: "Round-the-clock support — always here whenever you need us.",
    stat: "24/7",
    statLabel: "always available",
    color: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    icon: "✅",
    title: "Free Cancellation",
    desc: "Plans change — cancel for free up to 24 hours before check-in.",
    stat: "Free",
    statLabel: "cancellation",
    color: "#fdf4ff",
    border: "#e9d5ff",
  },
  {
    icon: "🏨",
    title: "Verified Hotels",
    desc: "Every property is manually verified for quality and comfort.",
    stat: "100+",
    statLabel: "verified rooms",
    color: "#fff0f2",
    border: "#fecdd3",
  },
  {
    icon: "⚡",
    title: "Instant Confirm",
    desc: "Book in seconds and get instant confirmation on your phone.",
    stat: "<10s",
    statLabel: "confirmation",
    color: "#fefce8",
    border: "#fef08a",
  },
];

const WhyChooseUs = () => (
  <section className="wcu-section">

    {/* ── HEADER ── */}
    <div className="wcu-header">
      <span className="wcu-badge">
        <span className="wcu-badge__star">⭐</span>
        Why StayEase
      </span>
      <h2 className="wcu-title">
        Why <span className="wcu-title__accent">Choose Us?</span>
      </h2>
      <p className="wcu-sub">
        Millions of travellers trust StayEase for the best hotel booking experience in India.
      </p>
    </div>

    {/* ── CARDS ── */}
    <div className="wcu-grid">
      {FEATURES.map((f, i) => (
        <div
          key={f.title}
          className="wcu-card"
          style={{ animationDelay: `${i * 0.07}s` }}
        >
          <div className="wcu-card__top">
            <div
              className="wcu-card__icon"
              style={{ background: f.color, border: `1px solid ${f.border}` }}
            >
              {f.icon}
            </div>
            <div className="wcu-card__stat-wrap">
              <span className="wcu-card__stat">{f.stat}</span>
              <span className="wcu-card__stat-lbl">{f.statLabel}</span>
            </div>
          </div>
          <h3 className="wcu-card__title">{f.title}</h3>
          <p className="wcu-card__desc">{f.desc}</p>
        </div>
      ))}
    </div>

    {/* ── TRUST STRIP ── */}
    <div className="wcu-trust">
   {[
  { num: "2M+",  lbl: "Happy guests" },
  { num: "100+", lbl: "Rooms" },
  { num: "50+",  lbl: "Cities" },
  { num: "4.8★", lbl: "Avg rating" },
].map((item, i, arr) => (
  <React.Fragment key={item.lbl}>
    <div className="wcu-trust__item">
      <span className="wcu-trust__num">{item.num}</span>
      <span className="wcu-trust__lbl">{item.lbl}</span>
    </div>
    {i < arr.length - 1 && <div className="wcu-trust__div" />}
  </React.Fragment>
))}
    </div>

  </section>
);

export default WhyChooseUs;