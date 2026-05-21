// src/shared/utils/format.ts — add this export alongside formatLikes
export function formatStatCount(n = 0): string {
  if (n < 1000)  return `${n}`;
  if (n < 10000) return `${(n / 1000).toFixed(1)}k`;
  return `${Math.floor(n / 1000)}k`;
}