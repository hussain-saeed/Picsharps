function ContentSection({
  id,
  background,
  border,
  boxShadow,
  image,
  title,
  children,
}) {
  return (
    <article
      id={id}
      className="scroll-mt-24 rounded-4xl p-8"
      style={{ background: background, border: border, boxShadow: boxShadow }}
    >
      <div
        className="flex items-center gap-3 mb-5"
        style={{ fontSize: "20px", fontWeight: "700" }}
      >
        <img src={image} alt={title} />
        <p>{title}</p>
      </div>
      <div className="prose prose-lg max-w-none">{children}</div>
    </article>
  );
}

export default ContentSection;
