import { createContext, useState, useContext, useEffect } from 'react';
import { getCountryCode, request } from './lib/api';
import { setUser as setLocalUser } from './lib/api';

// Создаем контекст с начальным значением
const LibraryContext = createContext();

// Создаем провайдер контекста
export function LibraryProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [countryCode, setCountryCode] = useState(getCountryCode() ?? 'UZ');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('dark_mode') == "dark");
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

  // Сохранение темы в localStorage при изменении
  useEffect(() => {
    if (darkMode !== null && darkMode !== undefined) {
      localStorage.setItem('dark_mode', darkMode ? "dark" : "light");
    }
  }, [darkMode]);

  return (
    <LibraryContext.Provider value={{ user, setUser, isAdmin, darkMode, setDarkMode, countryCode, setCountryCode }}>
      {children}
    </LibraryContext.Provider>
  );
}

export default function useLibrary() {
  return useContext(LibraryContext);
}
