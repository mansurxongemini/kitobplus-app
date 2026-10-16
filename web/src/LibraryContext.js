import { createContext, useState, useContext, useEffect } from 'react';
import { getCountryCode, request } from './lib/api';
import { setUser as setLocalUser } from './lib/api';

// Создаем контекст с начальным значением
const LibraryContext = createContext();

// Создаем провайдер контекста
export function LibraryProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [countryCode, setCountryCode] = useState(getCountryCode() ?? 'UZ');
  // Тема: light | dark | contrast (высокий контраст). darkMode оставлен для старых компонентов.
  const [themeMode, setThemeMode] = useState(() => {
    const saved = localStorage.getItem('theme_mode');
    if (['light', 'dark', 'contrast'].includes(saved)) return saved;
    return localStorage.getItem('dark_mode') == "dark" ? 'dark' : 'light';
  });
  const darkMode = themeMode !== 'light';
  const setDarkMode = (dark) => setThemeMode(dark ? 'dark' : 'light');
  // Размер текста: normal | large | xlarge
  const [textScale, setTextScale] = useState(() => localStorage.getItem('text_scale') || 'normal');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user !== undefined || user === null) return;
    
    //setUser(null);

    request('auth/user', {}).then(_ => {
      if (_.success && _.user) {
        console.log("Set user");
        setUser(_.user);
        setIsAdmin(_.user['levels_id'] == 1 && _.user['state'] == 2);
      }
    }).catch(_ => {
      console.log("Error while get user. Someone unregistered?");
    });
  }, [user]);

  useEffect(() => {
    if (countryCode !== undefined) {
      var cc = countryCode.toLowerCase()
      if (cc == 'us') {
        cc = 'en';
      }
      console.log("change lang to " + cc);
      document.documentElement.setAttribute('lang', cc);
    }
  }, [countryCode]);

  // Сохранение темы и размера текста
  useEffect(() => {
    localStorage.setItem('theme_mode', themeMode);
    localStorage.setItem('dark_mode', themeMode === 'light' ? "light" : "dark");
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('text_scale', textScale);
  }, [textScale]);

  return (
    <LibraryContext.Provider value={{ user, setUser, isAdmin, darkMode, setDarkMode, themeMode, setThemeMode, textScale, setTextScale, countryCode, setCountryCode }}>
      {children}
    </LibraryContext.Provider>
  );
}

export default function useLibrary() {
  return useContext(LibraryContext);
}
