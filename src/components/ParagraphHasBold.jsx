function ParagraphHasBold({ children, bold = [] }) {
  const words = children.split(" ");
  return (
    <p style={{ color: "rgba(102, 102, 102, 1)", lineHeight: "30px" }}>
      {words.map((word, index) => (
        <span key={index}>
          {bold.includes(word) ? <strong>{word}</strong> : word}
          {index < words.length - 1 && " "}
        </span>
      ))}
    </p>
  );
}

export default ParagraphHasBold;
