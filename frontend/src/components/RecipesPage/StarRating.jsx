export default function StarRating({ value, max = 5, compact = false }) {
  if (compact) {
    return `★ ${value}`;
  }

  return (
    <div style={{ display: "flex", gap: 2, color: "#f59e0b", fontSize: 14 }}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i}>{i < value ? "★" : "☆"}</span>
      ))}
    </div>
  );
}
