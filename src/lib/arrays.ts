export function range(start: number, length: number) {
  return Array.from({ length: length - start }, (_, i) => i + start);
}
