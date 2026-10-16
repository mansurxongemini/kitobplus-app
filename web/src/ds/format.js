import T from "../lib/translator";

// "10 soat 20 daqiqa" / "45 daqiqa". Вызывать внутри компонента (T использует контекст).
export const useFormatDuration = () => {
  const h = T("ч.");
  const m = T("мин.");
  return (seconds) => {
    // Округляем до минут один раз: иначе 8:59:40 давало «8 ч. 60 мин.».
    const total = Math.round(Math.max(0, Number(seconds) || 0) / 60);
    const hours = Math.floor(total / 60);
    const mins = total % 60;
    if (!Number(seconds)) return "";
    if (!hours) return `${mins || 1} ${m}`;
    return mins ? `${hours} ${h} ${mins} ${m}` : `${hours} ${h}`;
  };
};

export const coverUrl = (host, book) =>
  book && book.pics_ext ? `${host}/pics/books/${book.id}.${book.pics_ext}` : null;
