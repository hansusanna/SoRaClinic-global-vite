export function toAssetUrl(path?: string) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path

  const base = import.meta.env.BASE_URL ?? '/'
  const baseNorm = base.endsWith('/') ? base : base + '/'
  const clean = path.startsWith('/') ? path.slice(1) : path
  return `${baseNorm}${clean}`
}

