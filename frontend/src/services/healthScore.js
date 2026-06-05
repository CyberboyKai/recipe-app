export function getHealthText(score) {
  if (score >= 80) return "High Nutrition";
  if (score >= 60) return "Good Nutrition";
  if (score >= 40) return "Mid Nutrition";
  return "Low Nutrition";
}
