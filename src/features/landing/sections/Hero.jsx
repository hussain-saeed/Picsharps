import Container from "../../../components/Container";

function Hero() {
  return (
    <div className="bg-(--secondary-section-color) flex">
      <Container className="flex flex-col items-center">
        <h1
          className="text-[40px] sm:text-[90px]"
          style={{
            marginTop: "72px",
            marginBottom: "14px",
            background: "var(--gradient-color)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "900",
            textAlign: "center",
          }}
        >
          DESIGN EASILY
        </h1>
        <p
          className="w-[85%] lg:w-[60%]"
          style={{
            marginBottom: "62px",
            color: "rgba(0, 0, 0, 1)",
            fontSize: "20px",
            textAlign: "center",
          }}
        >
          Enhance, retouch, remove backgrounds, and create stunning visuals in
          seconds — no design skills needed.
        </p>
        <div
          style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
          className="w-[85%] md:w-[60%] h-auto overflow-hidden rounded-[30px] mb-[110px]"
        >
          <img
            src="/images/hero.gif"
            alt="Hero"
            className="w-full h-full object-cover"
          />
        </div>
      </Container>
    </div>
  );
}

export default Hero;
