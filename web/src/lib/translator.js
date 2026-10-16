import translation from './translation.json';
import useLibrary from '../LibraryContext';
import { getCountryCode } from './api';

//const translation: any = 

// T — в теле компонента: язык берётся из контекста, поэтому компонент перерисуется при смене языка.
// В обработчиках событий и эффектах хуки недоступны — там нужен tr(); T в таком месте тоже не падает,
// а берёт сохранённый язык.
const T = (verb) => {
    let countryCode;
    try {
        // eslint-disable-next-line react-hooks/rules-of-hooks -- вызов безусловный, try ловит только вызов вне рендера
        countryCode = useLibrary().countryCode;
    } catch (error) {
        countryCode = getCountryCode();
    }
    return tr(verb, countryCode);
};

export const tr = (verb, countryCode = getCountryCode()) => {
    try {
        return _T(verb, countryCode);
    } catch (error) {
        return verb;
    }
};

const _T = (verb, countryCode) => {
    //let code = 'UZ';
    //let code = 'RU';
    
    if (countryCode === 'RU') {
        return verb;
    }

    let error = null;
    if (!translation.hasOwnProperty(verb)) {
        error = 'NF';
    }

    if (!error && translation.hasOwnProperty(verb) && translation[verb] !== undefined && !translation[verb].hasOwnProperty(countryCode)) {
        error = 'EC';
    }

    if (error) {
        //return verb;
        //return "[" + error + "] " + verb;
        //request('translation/add', {'code': getCountryCode() ?? 'UZ', 'ru': verb}).then((_)=>{}).catch((error) => Alert.alert('Error while save translation verb ' + verb, error));
        return verb;
    }


    return translation[verb][countryCode];
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
