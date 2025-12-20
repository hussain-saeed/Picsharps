function Container({ children, className = "" }) {
  return (
    <div className={`container mx-auto px-2 xs:px-4 ${className}`}>{children}</div>
  );
}

export default Container;
