// Класс `FileUtils` предназначен для управления загрузкой файлов (скриптов и стилей) в приложение.
// Он может использоваться в разных местах для подключения ресурсов без необходимости
// жёсткого кодирования их в HTML.
export class FileUtils {
    // Метод `loadPageScript` предназначен для загрузки JavaScript-скриптов динамически
    // по указанному адресу `src`.
    // Возвращает объект `Promise`, что позволяет работать с асинхронным кодом.
    static loadPageScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve('Script loaded: ' + src);
            script.onerror = () => reject(new Error(`Script load error for: ${src}`));
            document.body.appendChild(script);
        });
    }

    // Метод `loadPageStyle` предназначен для динамической загрузки CSS-стилей.
    // - Создается новый элемент `<link>`, который будет добавлен в `document.head`.
    // - Устанавливаются атрибуты:
    //   - **`rel`**: Определяет связь с документом как стили (`stylesheet`).
    //   - **`type`**: Указывает тип содержимого (обычно `text/css`).
    //   - **`href`**: Указывает источник стиля, принимая значение `src`.
    static loadPageStyle(src) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = src;
        document.head.appendChild(link);
    }
}