export default function ContactMap() {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-200/50 shadow-lg">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.4!2d127.0276!3d37.4979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca159b09c6c85%3A0x6e0d49d8e93b2a8b!2sGangnam-gu%2C%20Seoul%2C%20South%20Korea!5e0!3m2!1sen!2s!4v1635870000000!5m2!1sen!2s"
        width="100%"
        height="400"
        style={{ border: 0, minHeight: '400px' }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="SoRa Clinic Location - Gangnam-gu, Seoul"
        className="w-full h-full min-h-[400px] transition-all duration-300 md:hover:contrast-110"
      />
    </div>
  )
}
