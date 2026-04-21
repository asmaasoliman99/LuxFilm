import React from 'react';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-[#141414] text-[#e5e5e5] pt-16 pb-8 px-4 lg:px-12 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto">
        
        {/* الجزء العلوي: اللوجو والسوشيال ميديا كـ نصوص */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="w-32 lg:w-40">
            <img src={logo} alt="LuxFilm" className="object-contain" />
          </div>
          
          {/* تم استبدال الأيقونات بنصوص شيك مع Hover effect نبيتي */}
          <div className="flex gap-6 text-xs font-bold tracking-widest uppercase">
            <span className="cursor-pointer hover:text-[#660B05] transition-colors">Facebook</span>
            <span className="cursor-pointer hover:text-[#660B05] transition-colors">Instagram</span>
            <span className="cursor-pointer hover:text-[#660B05] transition-colors">Twitter</span>
            <span className="cursor-pointer hover:text-[#660B05] transition-colors">Youtube</span>
          </div>
        </div>

        {/* روابط الفوتر: 4 أعمدة */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-400">
          <ul className="flex flex-col gap-3">
            <li className="hover:text-white cursor-pointer transition">Audio Description</li>
            <li className="hover:text-white cursor-pointer transition">Investor Relations</li>
            <li className="hover:text-white cursor-pointer transition">Legal Notices</li>
          </ul>
          
          <ul className="flex flex-col gap-3">
            <li className="hover:text-white cursor-pointer transition">Help Center</li>
            <li className="hover:text-white cursor-pointer transition">Jobs</li>
            <li className="hover:text-white cursor-pointer transition">Cookie Preferences</li>
          </ul>

          <ul className="flex flex-col gap-3">
            <li className="hover:text-white cursor-pointer transition">Gift Cards</li>
            <li className="hover:text-white cursor-pointer transition">Terms of Use</li>
            <li className="hover:text-white cursor-pointer transition">Corporate Information</li>
          </ul>

          <ul className="flex flex-col gap-3">
            <li className="hover:text-white cursor-pointer transition">Media Center</li>
            <li className="hover:text-white cursor-pointer transition">Privacy</li>
            <li className="hover:text-white cursor-pointer transition">Contact Us</li>
          </ul>
        </div>

        {/* كود الخدمة (Service Code) */}
        <div className="mt-10">
          <button className="border border-gray-600 px-2 py-1 text-xs hover:border-white hover:text-white transition">
            Service Code
          </button>
        </div>

        {/* حقوق النشر */}
        <div className="mt-6 text-[11px] text-gray-500">
          © 1997-2026 LuxFilm, Inc.
        </div>
      </div>
    </footer>
  );
};

export default Footer;