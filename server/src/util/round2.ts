export function round2(n: number) {
  return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
}
