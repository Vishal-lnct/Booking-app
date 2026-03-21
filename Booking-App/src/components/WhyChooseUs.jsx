import "./WhyChooseUs.css";

const FEATURES = [
  {
    icon: "💰",
    title: "Best Prices",
    desc: "Get the lowest prices guaranteed. We match any rate you find elsewhere.",
    stat: "70% OFF",
    statLabel: "avg savings",
  },
  {
    icon: "🔒",
    title: "Secure Booking",
    desc: "100% encrypted payments. Your data and money are always safe with us.",
    stat: "256-bit",
    statLabel: "SSL encryption",
  },
  {
    icon: "📞",
    title: "24/7 Support",
    desc: "Round-the-clock customer support. We're always here whenever you need us.",
    stat: "24/7",
    statLabel: "always available",
  },
  {
    icon: "✅",
    title: "Free Cancellation",
    desc: "Plans change — cancel for free on most bookings up to 24 hours before.",
    stat: "Free",
    statLabel: "cancellation",
  },
  {
    icon: "🏨",
    title: "Verified Hotels",
    desc: "Every property is manually verified by our team for quality and comfort.",
    stat: "10K+",
    statLabel: "verified hotels",
  },
  {
    icon: "⚡",
    title: "Instant Confirmation",
    desc: "Book in seconds and get instant confirmation on your email and phone.",
    stat: "<10s",
    statLabel: "confirmation",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="wcu-section">

      {/* Header */}
      <div className="wcu-header">
        <span className="wcu-badge">⭐ Why StayEase</span>
        <h2 className="wcu-title">Why Choose Us?</h2>
        <p className="wcu-sub">
          Millions of travellers trust StayEase for the best hotel booking experience in India.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="wcu-grid">
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className="wcu-card"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="wcu-card__top">
              <div className="wcu-card__icon">{f.icon}</div>
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

      {/* Bottom trust strip */}
      <div className="wcu-trust">
        <div className="wcu-trust__item">
          <span className="wcu-trust__num">2M+</span>
          <span className="wcu-trust__lbl">Happy Guests</span>
        </div>
        <div className="wcu-trust__div" />
        <div className="wcu-trust__item">
          <span className="wcu-trust__num">10K+</span>
          <span className="wcu-trust__lbl">Hotels</span>
        </div>
        <div className="wcu-trust__div" />
        <div className="wcu-trust__item">
          <span className="wcu-trust__num">500+</span>
          <span className="wcu-trust__lbl">Cities</span>
        </div>
        <div className="wcu-trust__div" />
        <div className="wcu-trust__item">
          <span className="wcu-trust__num">4.8★</span>
          <span className="wcu-trust__lbl">Avg Rating</span>
        </div>
      </div>

    </section>
  );
};

export default WhyChooseUs;