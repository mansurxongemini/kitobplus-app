import translation from './translation.json';
import useLibrary from '../LibraryContext';

//const translation: any = 

const T = (verb: string) => {
    const {countryCode} = useLibrary();

    //console.log("T(verb...");
    let result = verb;
    try {
        result = _T(verb, countryCode);
    } catch(error) {
        return verb;
    };

    //console.log("T(" + (getCountryCode() ?? 'UZ') + ", " + verb + ") = " + result);
    return result;
};

const _T = (verb: string, countryCode: string) => {
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
