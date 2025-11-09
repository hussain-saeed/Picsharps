function TitleBlock({ subtitle, title, description }) {
  return (
    <div className="py-[62px] text-center">
      <span
        className="font-semibold text-white mb-[25px] inline-block"
        style={{
          background: "var(--gradient-color)",
          letterSpacing: "3px",
          padding: "6px 18px",
          border: "1px solid white",
        }}
      >
        {subtitle}
      </span>
      <h1 className="font-black uppercase text-[48px] mb-1">{title}</h1>
      <p className="max-w-[800px] mx-auto">{description}</p>
    </div>
  );
}

export default TitleBlock;
