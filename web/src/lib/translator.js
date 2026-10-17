import translation from './translation.json';
import { getCountryCode } from './api';

//const translation: any = 

// T — чистая функция перевода: берёт текущий язык (сохранённый в localStorage / по умолчанию UZ).
// При смене языка LibraryContext вызывает перерисовку приложения, и все T(...) обновляются
// без нарушения правил хуков React (Rules of Hooks).
const T = (verb) => {
    return tr(verb, getCountryCode());
};

export const tr = (verb, countryCode = getCountryCode()) => {
    try {
        return _T(verb, countryCode);
    } catch (error) {
        return verb;
    }
};

const _T = (verb, countryCode) => {
    if (!verb) {
        return verb;
    }

    // 1. Проверяем наличие явного перевода для целевого языка (включая RU)
    if (
        Object.prototype.hasOwnProperty.call(translation, verb) &&
        translation[verb] !== undefined &&
        Object.prototype.hasOwnProperty.call(translation[verb], countryCode) &&
        translation[verb][countryCode] !== undefined &&
        translation[verb][countryCode] !== ""
    ) {
        return translation[verb][countryCode];
    }

    // 2. Резервный возврат: для старых русских ключей без потомка "RU" или неизвестных строк
    return verb;
};

/*
Translation prompt - dont delete!

Мне нужен перевод текста на сайте библиотеки аудиокниг на узбекский английский язык.
Отвечай в формате json и не добавляй комментариев.
Пример ввода:
Обновлено
Популярное
Пусто
Вывод:
[
    "Обновлено": {
        "UZ": "Yangilangan",
        "US": "Updated"
    },
    "Популярное": {
        "UZ": "Mashhur",
        "US": "Popular"
    },
    "Пусто": {
        "UZ": "Bo'sh",
        "US": "Empty"
    }
]

Переведи следующие строки (они разделены знаком новой строки):
Все права защищены
Если вы видите ошибку на сайте, выделите ее и нажмите CTRL + ENTER (⌘ + ENTER)
Подробнее
Плейлист
Аноним
Ваш комментарий
*/

export default T;
