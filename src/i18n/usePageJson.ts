// src/i18n/usePageJson.ts
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { mapLang } from './pageLoader'

type JsonAny = { default: unknown }

// 이 파일 기준 "상대 경로"로 모든 언어/페이지 JSON을
//    빌드 타임에 한 번에 로드(eager)해 둔다.
//    ※ 폴더 구조: src/i18n/usePageJson.ts ─┬─ ../locales/ko/pages/*.json
//                                          └─ ../locales/en/pages/*.json ...
const PAGE_JSON: Record<string, JsonAny> = import.meta.glob(
  '../locales/*/pages/*.json',
  { eager: true }
)

/**
 * 다국어 페이지 JSON 로더(동기)
 * @param name 'event' | 'treatments' | 'slides' | 'navi' ...
 * @param fallbackLang 현재 언어 파일이 없을 때 우선 사용할 언어 (기본 'ko', 그다음 'en' 자동 시도)
 */
export function usePageJson<T>(name: string, fallbackLang: 'ko' | 'en' = 'ko') {
  const { i18n } = useTranslation()

  return useMemo<T | null>(() => {
    const cur = mapLang(i18n.language)

    // 찾을 후보 키들 (우선순위: 현재언어 → fallback → ko)
    const candidates = [
      `../locales/${cur}/pages/${name}.json`,
      `../locales/${fallbackLang}/pages/${name}.json`,
      `../locales/ko/pages/${name}.json`,
    ]

    for (const key of candidates) {
      const mod = PAGE_JSON[key] as { default: T } | undefined
      if (mod?.default) return mod.default
    }

    return null
  }, [i18n.language, name, fallbackLang])
}