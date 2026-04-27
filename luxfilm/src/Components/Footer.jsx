import React, { useContext } from "react";
import logo from "../assets/logo.png";
import { LanguageContext } from "../context/LanguageContext";

const Footer = () => {
  const { t } = useContext(LanguageContext);
  return (
    <footer className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] pt-16 pb-8 px-4 lg:px-12 border-t border-[var(--border)] mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="w-32 lg:w-40">
            <img src={logo} alt="LuxFilm" className="object-contain" />
          </div>

          <div className="flex gap-6 text-xs font-bold tracking-widest uppercase">
            <span className="cursor-pointer hover:text-[#660B05] transition-colors">
              {t("facebook")}
            </span>
            <span className="cursor-pointer hover:text-[#660B05] transition-colors">
              {t("instagram")}
            </span>
            <span className="cursor-pointer hover:text-[#660B05] transition-colors">
              {t("twitter")}
            </span>
            <span className="cursor-pointer hover:text-[#660B05] transition-colors">
              {t("youtube")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-[var(--text-secondary)]">
          <ul className="flex flex-col gap-3">
            <li className="hover:text-[var(--text-primary)] cursor-pointer transition">
              {t("audioDescription")}
            </li>
            <li className="hover:text-[var(--text-primary)] cursor-pointer transition">
              {t("investorRelations")}
            </li>
            <li className="hover:text-[var(--text-primary)] cursor-pointer transition">
              {t("legalNotices")}
            </li>
          </ul>

          <ul className="flex flex-col gap-3">
            <li className="hover:text-[var(--text-primary)] cursor-pointer transition">
              {t("helpCenter")}
            </li>
            <li className="hover:text-[var(--text-primary)] cursor-pointer transition">
              {t("jobs")}
            </li>
            <li className="hover:text-[var(--text-primary)] cursor-pointer transition">
              {t("cookiePreferences")}
            </li>
          </ul>

          <ul className="flex flex-col gap-3">
            <li className="hover:text-[var(--text-primary)] cursor-pointer transition">
              {t("giftCards")}
            </li>
            <li className="hover:text-[var(--text-primary)] cursor-pointer transition">
              {t("termsOfUse")}
            </li>
            <li className="hover:text-[var(--text-primary)] cursor-pointer transition">
              {t("corporateInformation")}
            </li>
          </ul>

          <ul className="flex flex-col gap-3">
            <li className="hover:text-[var(--text-primary)] cursor-pointer transition">
              {t("mediaCenter")}
            </li>
            <li className="hover:text-[var(--text-primary)] cursor-pointer transition">
              {t("privacy")}
            </li>
            <li className="hover:text-[var(--text-primary)] cursor-pointer transition">
              {t("contactUs")}
            </li>
          </ul>
        </div>

        <div className="mt-10">
          <button className="border border-[var(--border)] px-2 py-1 text-xs text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)] transition">
            {t("serviceCode")}
          </button>
        </div>

        <div className="mt-6 text-[11px] text-[var(--text-secondary)]">
          {t("copyrightNotice")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
