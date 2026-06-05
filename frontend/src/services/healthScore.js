export function getHealthText(score) {
  if (score >= 80) return "Highly Nutritious";
  if (score >= 60) return "Well Balanced";
  if (score >= 40) return "Moderately Balanced";
  return "Less Balanced";
}
