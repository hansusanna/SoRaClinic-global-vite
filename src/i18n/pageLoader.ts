export const mapLang = (lng: string) => {
  const l = lng.toLowerCase()
  if (l.startsWith('ko')) return 'ko'
  if (l.startsWith('zh') || l.startsWith('cn')) return 'cn'
  return 'en'
}

// 페이지 이름(원하는 대로 추가 가능)
export type PageName = 'about' | 'event' | 'treatments'

// JSON 모듈 타입
type JsonMod<T> = { default: T }

export async function loadPage<T = unknown>(lng: string, name: PageName): Promise<T> {
  const lang = mapLang(lng)
  const mod = await (import(`@/locales/${lang}/pages/${name}.json`) as Promise<JsonMod<T>>)
  return mod.default
}
