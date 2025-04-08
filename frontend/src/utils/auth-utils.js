// Импорт конфигураци, который содержит настройки API и другие параметры, используемые в приложении.
import config from "../config/config";

// Класс `AuthUtils` содержит статические методы и свойства для управления аутентификацией:
// - **`accessTokenKey`**: Ключ, используемый для хранения токена доступа.
// - **`refreshTokenKey`**: Ключ для хранения токена обновления.
// - **`userInfoTokenKey`**: Ключ для хранения информации о пользователе.
export class AuthUtils {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoTokenKey = 'userInfo';

    // Метод предназначен для получения информации о токенах или пользователе.
    // Если передан конкретный ключ (`key`), и он совпадает с одним из ключей токенов,
    // метод возвращает соответствующее значение из `localStorage`.
    // В противном случае возвращается объект с текущими значениями всех трёх токенов
    // (доступа, обновления и информации о пользователе), использующий `localStorage.getItem`.
    static getAuthInfo(key = null) {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) {
            return localStorage.getItem(key);
        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoTokenKey]: localStorage.getItem(this.userInfoTokenKey)
            }
        }
    }

    // Этот метод используется для установки информации о аутентификации. Он принимает
    // токены доступа и обновления, а также информацию о пользователе.
    // Токены сохраняются в `localStorage`. Информация о пользователе (если передана)
    // сериализуется с помощью `JSON.stringify` и также сохраняется.
    static setAuthInfo(accessToken, refreshToken, userInfo = null) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
        }
    }

    // Метод удаляет токены доступа, обновления и информацию о пользователе из `localStorage`.
    // Это обычно выполняется при выходе пользователя из системы, чтобы очистить все данные
    // аутентификации.
    static removeAuthInfo() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
    }

    // Асинхронный метод, назначенный для обновления токена доступа, используя токен обновления.
    // Сначала он извлекает текущий токен обновления с помощью `getAuthInfo`.
    static async updateRefreshToken() {
        let result = false;
        const refreshToken = this.getAuthInfo(this.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(config.api + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    refreshToken: refreshToken
                })
            });

            if (response && response.status === 200) {
                const tokens = await response.json();
                if (tokens.tokens && !tokens.error) {
                    this.setAuthInfo(tokens.tokens.accessToken, tokens.tokens.refreshToken);
                    result = true;
                }
            }
        }

        if (!result) {
            this.removeAuthInfo();
        }

        return result;
    }
}