// Импорт зависимостей: `HttpUtils` - утилита, отвечающая за выполнение HTTP-запросов к серверу.
// Используется для отправки и обработки запросов к API.
import {HttpUtils} from "../utils/http-utils";

// Класс `BalanceService` предоставляет методы для получения и обновления баланса пользователя.
export class BalanceService {
    // Статический асинхронный метод `getBalance` предназначен для получения текущего баланса.
    // - Инициализируется объект `returnObject`, который будет возвращен из метода. Он содержит три свойства:
    //   - **`error`**: показывает, произошла ли ошибка (по умолчанию `false`).
    //   - **`redirect`**: используется для хранения URL-адреса перенаправления, если потребуется.
    //   - **`balance`**: для хранения значения текущего баланса.
    static async getBalance() {
        const returnObject = {
            error: false,
            redirect: null,
            balance: null
        }

        const result = await HttpUtils.request('/balance');
        // Проверка ответа:
        //   - Если есть `redirect`, то пользователь будет перенаправлен.
        //   - Если есть ошибка (`result.error`), или вместо ожидаемого ответа получен `null`, или одновременно есть ошибка в ответе (`result.response.error`).
        // - В случае ошибки, в `returnObject` устанавливается сообщение об ошибке, и объект возвращается.
        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе баланса. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.balance = result.response.balance;
        return returnObject;
    }

    // Статический асинхронный метод `updateBalance` предназначен для обновления баланса пользователя.
    // Он принимает аргумент `data`, который обычно содержит новое значение баланса.
    // Инициализируется объект `returnObject`, аналогично методу `getBalance`.
    static async updateBalance(data) {
        const returnObject = {
            error: false,
            redirect: null,
            balance: null
        }

        const result = await HttpUtils.request('/balance', 'PUT', true, data);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при обновлении баланса. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.balance = result.response.balance;
        return returnObject;
    }
}