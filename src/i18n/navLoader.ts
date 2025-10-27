export type NavItem = {
  pk: number
  path: string
  label: string
  display: boolean
  mobileOnly?: boolean
  scrollToId?: string
}

const mapLang = (lng: string) => {
  // i18next에서 'ko', 'en', 'cn'을 주로 쓰되, zh-CN 같은 코드도 흡수
  if (lng.toLowerCase().startsWith('ko')) return 'ko'
  if (lng.toLowerCase().startsWith('en')) return 'en'
  if (lng.toLowerCase().startsWith('zh') || lng.toLowerCase().startsWith('cn')) return 'cn'
  return 'en' // 기본
}

export async function loadNavByLang(lng: string): Promise<NavItem[]> {
  const lang = mapLang(lng)
  const mod = await import(`@/locales/${lang}/pages/nav.json`)
  return mod.default as NavItem[]

}
