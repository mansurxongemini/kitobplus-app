import T from "../lib/translator";

// "10 soat 20 daqiqa" / "45 daqiqa". Вызывать внутри компонента (T использует контекст).
export const useFormatDuration = () => {
  const h = T("ч.");
  const m = T("мин.");
  return (seconds) => {
    const s = Math.max(0, Math.round(Number(seconds) || 0));
    const hours = Math.floor(s / 3600);
    const mins = Math.round((s % 3600) / 60);
    if (!s) return "";
    if (!hours) return `${mins || 1} ${m}`;
    return mins ? `${hours} ${h} ${mins} ${m}` : `${hours} ${h}`;
  };
};

export const coverUrl = (host, book) =>
  book && book.pics_ext ? `${host}/pics/books/${book.id}.${book.pics_ext}` : null;
