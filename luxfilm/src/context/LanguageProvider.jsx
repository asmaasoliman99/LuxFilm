import React, { useEffect, useState } from "react";
import { LanguageContext } from "./LanguageContext";

const translations = {
  en: {
    home: "Home",
    genres: "Genres",
    myList: "My List",
    searchPlaceholder: "Titles, people, genres",
    allGenres: "All Genres",
    langEnglish: "English",
    langArabic: "العربية",
    searchResults: "Search results for",
    searchByGenre: "Search by genre",
    category: "Category",
    enterName: "Type a movie name or choose a genre in the search bar.",
    searching: "Searching...",
    errorLoading: "Error loading results. Please try again.",
    noResults: "No results found. Try changing the name or genre.",
    play: "Play",
    moreInfo: "More Info",
    loading: "Loading...",
    blockbusterMovies: "Blockbuster Movies",
    onlyOnLuxFilm: "Only on LuxFilm",
    upcoming: "Upcoming",
    topPicksForYou: "Top Picks for You",
  },
  ar: {
    home: "الرئيسية",
    genres: "الأنواع",
    myList: "المفضلة",
    searchPlaceholder: "ابحث باسم الفيلم أو النوع",
    allGenres: "كل الأنواع",
    langEnglish: "English",
    langArabic: "العربية",
    searchResults: "نتائج البحث عن",
    searchByGenre: "بحث حسب النوع",
    category: "الفئة",
    enterName: "اكتب اسم فيلم أو اختر نوعًا في شريط البحث.",
    searching: "جارٍ البحث...",
    errorLoading: "حدث خطأ أثناء تحميل النتائج. حاول مرة أخرى.",
    noResults: "لم يتم العثور على نتائج. حاول تغييرات في الاسم أو النوع.",
    play: "تشغيل",
    moreInfo: "المزيد",
    loading: "جارٍ التحميل...",
    blockbusterMovies: "أفلام البلوكسوستر",
    onlyOnLuxFilm: "حصريًا على لوكس فيلم",
    upcoming: "قادمة",
    topPicksForYou: "أفضل التوصيات لك",
  },
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "en";
    return localStorage.getItem("appLang") || "en";
  });

  useEffect(() => {
    localStorage.setItem("appLang", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const t = (key) => translations[lang]?.[key] || translations.en[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
