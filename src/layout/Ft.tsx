import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function Ft() {
  const { t, i18n } = useTranslation('common')
  // 현재 언어를 기반으로 동적 링크 생성
  const langPrefix = `/${i18n.language}`

  return (
    <footer className="bg-gray-800 text-white mt-20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold">SoRa Clinic</h3>
            <p className="mt-4 text-gray-400 text-sm">
              {t('footer.description')}
            </p>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold">{t('footer.quickLinks.title')}</h4>
              <ul className="mt-4 space-y-2 text-sm">
              
                <li><Link to={langPrefix} className="text-gray-400 hover:text-white">{t('footer.quickLinks.home')}</Link></li>
                <li><Link to={`${langPrefix}/event`} className="text-gray-400 hover:text-white">{t('footer.quickLinks.events')}</Link></li>
              </ul>
            </div>
             <div>
              <h4 className="font-semibold">{t('footer.contact.title')}</h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-400">
                <li>{t('footer.contact.address')}</li>
                <li>{t('footer.contact.phone')}</li>
                <li>{t('footer.contact.email')}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} SoRa Clinic. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  )
}

