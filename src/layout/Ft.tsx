export default function Footer() {

  return (
    <footer className="bg-white border-t border-[#0ABAB5]/30">
      <div className="max-w-7xl mx-auto px-6 py-16">


        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © 2024 SoRa Clinic. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-[#0ABAB5] text-sm transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-[#0ABAB5] text-sm transition-colors duration-300">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
      
    </footer>
  );
}