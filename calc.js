export function calcMaterialCost(grams, pricePerKg) {
  if (!grams || !pricePerKg) return 0;
  return grams * (pricePerKg / 1000);
}

export function calcEnergyCost(hours, powerW, pricePerKwh) {
  if (!hours || !powerW || !pricePerKwh) return 0;
  return hours * (powerW / 1000) * pricePerKwh;
}

export function calcAmortization(hours, printerPrice, lifetimeHours) {
  if (!hours || !printerPrice || !lifetimeHours) return 0;
  return hours * (printerPrice / lifetimeHours);
}

export function calcLabor(minutes, wage) {
  if (!minutes || !wage) return 0;
  return (minutes / 60) * wage;
}

export function calcFinalPrice(base, errorRate, markup) {
  const withError = base * (1 + (errorRate || 0) / 100);
  return withError * (1 + (markup || 0) / 100);
}
