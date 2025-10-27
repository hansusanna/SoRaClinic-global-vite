
export function toAssetUrl(path?: string) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path // 외부 URL 그대로
  const base = (import.meta as any).env?.BASE_URL ?? '/'
  const clean = path.startsWith('/') ? path.slice(1) : path
  return `${base}${clean}`  // 항상 앱 베이스 기준으로 고정
}
