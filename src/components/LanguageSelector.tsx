import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LanguageSelector() {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const match = location.pathname.match(/^\/(ko|en|cn)(?=\/|$)/)
  const selectedLang = (match?.[1] ?? 'ko') as 'ko' | 'en' | 'cn'

  const handleLanguageChange = (val: string) => {
    const newLang = (val as 'ko' | 'en' | 'cn')

    // 현재 경로에서 언어 프리픽스 제거 후 보존
    const rest = location.pathname.replace(/^\/(ko|en|cn)(?=\/|$)/, '') || '/'

    // 1) URL을 먼저 바꿔서 언어 감지자가 path를 우선 읽도록
    navigate(`/${newLang}${rest}${location.search}${location.hash}`, { replace: true })
  
    void i18n.changeLanguage(newLang)

    // 2) (선택) localStorage 캐시를 쓰고 싶다면 경로 우선 감지가 설정되어 있어야 안전
    // void setLanguage(newLang)
  }

  return (
    <Select value={selectedLang} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[80px] border-pink-200/50 rounded-full focus:ring-pink-400">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent className="bg-white/80 backdrop-blur-md rounded-xl">
        <SelectItem value="ko">KR</SelectItem>
        <SelectItem value="en">US</SelectItem>
        <SelectItem value="cn">CN</SelectItem>
      </SelectContent>
    </Select>
  )
}
