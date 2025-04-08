// Импорт зависимостей:
// - **`AuthUtils`**: Утилита для работы с аутентификацией, которая включает проверку и получение токенов доступа.
// - **`config`**: Конфигурационный файл, который, вероятно, содержит настройки API, такие как базовый URL.
import {AuthUtils} from "./auth-utils";
import config from "../config/config";

// Класс `HttpUtils` предоставляет методы для выполнения HTTP-запросов к API.
export class HttpUtils {
    // Метод `request` — это статический асинхронный метод, который принимает параметры для выполнения HTTP-запроса:
    //   - **`url`**: Относительный путь к конечной точке API.
    //   - **`method`**: HTTP-метод (по умолчанию `GET`).
    //   - **`useAuth`**: Булевый параметр, указывающий, нужно ли добавлять токен аутентификации (по умолчанию `true`).
    //   - **`body`**: Тело запроса (обычно для методов `POST` или `PUT`).
    // В объекте `result` хранятся результаты выполнения: информация о наличии ошибки и информация о полученном ответе.
    static async request(url, method = 'GET', useAuth = true, body = null) {
        const result = {
            error: false,
            response: null
        }
        // Объект `params` определяет параметры для запроса, включая метод и заголовки.
        // Устанавливаются заголовки для указания формата данных, которые отправляются и
        // принимает сервер.
        const params = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        // Если параметр `useAuth` установлен на `true`, токен доступа извлекается из `AuthUtils`.
        // Если токен существует, он добавляется в заголовки запроса под именем `x-auth-token`,
        // что обычно используется для передачи токена аутентификации.
        let token = null;
        if (useAuth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if(token) {
                params.headers['x-auth-token'] = token;
            }
        }
        // Если передано тело запроса, оно сериализуется в формат JSON с помощью `JSON.stringify()` и
        // добавляется в параметры запроса.
        if (body) {
            params.body = JSON.stringify(body);
        }
        // Попытка выполнения запроса с помощью `fetch`.
        // - Запрос направляется по адресу `config.api + url` с указанными параметрами.
        // - Если запрос завершился успешно, ответ преобразуется в формат JSON.
        // - Если произошла ошибка (например, проблемы с сетью), устанавливается
        // флаг `result.error`, и метод возвращает результат.
        let response = null;
        try {
            response = await fetch(config.api + url, params);
            result.response = await response.json();
        } catch (e) {
            result.error = true;
            return result;
        }
        // Проверяется статус ответа. Если он находится вне диапазона 200–299, отмечается ошибка.
        // - Если статус 401 (неавторизован), и токен отсутствует, устанавливается перенаправление на страницу логина.
        // - Если токен доступен, вызывается метод `updateRefreshToken` для обновления токена.
        // Если обновление проходит успешно, выполняется повторный запрос.
        // При неудаче — перенаправление на страницу логина.
        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            if (useAuth && response.status === 401) {
                if (!token) {
                    result.redirect = "/login";
                } else {
                    const updateTokenResult = await AuthUtils.updateRefreshToken();
                    if (updateTokenResult) {
                        return this.request(url, method, useAuth, body);
                    } else {
                        result.redirect = "/login";
                    }
                }
            }
        }

        return result;
    }
}