const WhyChooseUs = () => {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Why Choose StayEase?</h2>

      <div style={{
        display: "flex",
        justifyContent: "space-around",
        marginTop: "20px"
      }}>
        <div>
          <h3>💰 Best Prices</h3>
          <p>Affordable rooms guaranteed</p>
        </div>

        <div>
          <h3>🔒 Secure Booking</h3>
          <p>Safe and secure payments</p>
        </div>

        <div>
          <h3>📞 24/7 Support</h3>
          <p>Always here to help</p>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;