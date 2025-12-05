function HeroSection({ content }) {
  return (
    <div
      style={{ paddingTop: "190px", marginBottom: "70px", textAlign: "center" }}
    >
      {content.imageUrl && (
        <div className="mb-12">
          <img src={content.imageUrl} alt={content.title} className="mx-auto" />
        </div>
      )}

      <h1
        style={{
          fontSize: "48px",
          fontWeight: "900",
          letterSpacing: "2px",
          background: "var(--gradient-color-2)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "12px",
        }}
      >
        {content.title}
      </h1>

      <div className="space-y-3">
        {content.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            style={{
              fontSize: index === 0 ? "16px" : "14px",
              color: index === 0 ? "black" : "rgb(140, 140, 140)",
              letterSpacing: "2px",
              fontWeight: "500",
            }}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

export default HeroSection;
