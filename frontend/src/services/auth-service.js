// Импорт зависимостей:
// `HttpUtils` для выполнения HTTP-запросов на сервер и обработки ответов.
import {HttpUtils} from "../utils/http-utils";

// Класс `AuthService` предназначен для управления процессами аутентификации,
// такими как вход, регистрация и выход пользователей.
export class AuthService {
    // Метод `logIn` — асинхронный, принимает объект `data` с данными для аутентификации.
    // Отправляется POST-запрос на сервер по адресу `'/login'` с данными пользователя.
    static async logIn(data) {
        const result = await HttpUtils.request('/login', 'POST', false, data);

        if (result.error || !result.response || (result.response && (!result.response.tokens.accessToken || !result.response.tokens.refreshToken || !result.response.user.id || !result.response.user.name || !result.response.user.lastName))) {
            return false;
        }

        return result.response;
    }

    //  Метод `signUp` аналогичен, отправляет POST-запрос на сервер по адресу `'/signup'` с данными для регистрации.
    static async signUp(data) {
        const result = await HttpUtils.request('/signup', 'POST', false, data);

        if (result.error || !result.response || (result.response && (!result.response.user.id || !result.response.user.name || !result.response.user.lastName || !result.response.user.email))) {
            return false;
        }

        return result.response;
    }

    // Метод `logout` — также асинхронный, и выполняет POST-запрос на сервер по адресу
    // `'/logout'`, чтобы завершить сессию пользователя.
    static async logout(data) {
        await HttpUtils.request('/logout', 'POST', false, data);
    }
}