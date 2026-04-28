import React from 'react';
import logo from '../assets/logo.png';
import { useLanguage } from '../Context/Language';

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#141414] text-[#e5e5e5] pt-16 pb-8 px-4 lg:px-12 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="w-32 lg:w-40">
            <img src={logo} alt="LuxFilm" className="object-contain" />
          </div>
          
          <div className="flex gap-6 text-xs font-bold tracking-widest uppercase">
            <span className="cursor-pointer hover:text-[#660B05] transition-colors">Facebook</span>
            <span className="cursor-pointer hover:text-[#660B05] transition-colors">Instagram</span>
            <span className="cursor-pointer hover:text-[#660B05] transition-colors">Twitter</span>
            <span className="cursor-pointer hover:text-[#660B05] transition-colors">Youtube</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-400">
          <ul className="flex flex-col gap-3">
            <li className="hover:text-white cursor-pointer transition">{t('footer.audioDescription')}</li>
            <li className="hover:text-white cursor-pointer transition">{t('footer.investorRelations')}</li>
            <li className="hover:text-white cursor-pointer transition">{t('footer.legalNotices')}</li>
          </ul>
          
          <ul className="flex flex-col gap-3">
            <li className="hover:text-white cursor-pointer transition">{t('footer.helpCenter')}</li>
            <li className="hover:text-white cursor-pointer transition">{t('footer.jobs')}</li>
            <li className="hover:text-white cursor-pointer transition">{t('footer.cookiePreferences')}</li>
          </ul>

          <ul className="flex flex-col gap-3">
            <li className="hover:text-white cursor-pointer transition">{t('footer.giftCards')}</li>
            <li className="hover:text-white cursor-pointer transition">{t('footer.termsOfUse')}</li>
            <li className="hover:text-white cursor-pointer transition">{t('footer.corporateInformation')}</li>
          </ul>

          <ul className="flex flex-col gap-3">
            <li className="hover:text-white cursor-pointer transition">{t('footer.mediaCenter')}</li>
            <li className="hover:text-white cursor-pointer transition">{t('footer.privacy')}</li>
            <li className="hover:text-white cursor-pointer transition">{t('footer.contactUs')}</li>
          </ul>
        </div>

        <div className="mt-10">
          <button className="border border-gray-600 px-2 py-1 text-xs hover:border-white hover:text-white transition">
            {t('footer.serviceCode')}
          </button>
        </div>

        <div className="mt-6 text-[11px] text-gray-500">
          {t('footer.copyright', { year: '2026' })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
