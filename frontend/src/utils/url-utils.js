// Класс `UrlUtils` предназначен для упрощения работы с параметрами URL в веб-приложении.
export class UrlUtils {
    // Статический метод, который принимает один аргумент `param` — название параметра,
    // который нужно извлечь из URL.
    static getUrlParam(param) {
        // Создается новый экземпляр `URLSearchParams`. Конструктор принимает строку,
        // содержащую параметры запроса из URL, который можно получить из `window.location.search`.
        // Эта строка включает все параметры после `?` в адресной строке,
        // например, в URL `http://example.com/?id=123&name=John`, `window.location.search`
        // будет равно `?id=123&name=John`.
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
}