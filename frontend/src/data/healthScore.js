export function getHealthText(score) {
  if (score >= 80) return "Highly nutritious";
  if (score >= 60) return "Well balanced";
  if (score >= 40) return "Moderately balanced";
  return "Less balanced";
}
