export function roundToDecimal(n: number, d: number) {
  const factor = 10 ** d;
  return Math.floor(n * factor) / factor;
}
