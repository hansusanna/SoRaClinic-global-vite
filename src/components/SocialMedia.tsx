import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react'
import { SOCIAL_LINKS } from '../db/type/contactData'

const SOCIAL_ICONS = {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
} as const

export default function SocialMedia() {
  return (
    <div className="text-center pt-8">
      <div className="flex justify-center space-x-6">
        {SOCIAL_LINKS.map((social) => {
          const Icon = SOCIAL_ICONS[social.name as keyof typeof SOCIAL_ICONS]
          return (
            <a
              key={social.name}
              href={social.href}
              className="w-12 h-12 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group border border-pink-200/30 shadow-sm social-icon-hover"
            >
              <Icon className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
            </a>
          )
        })}
      </div>
    </div>
  )
}
