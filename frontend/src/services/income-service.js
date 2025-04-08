// Импорт зависимостей: `HttpUtils` - утилита для выполнения HTTP-запросов к серверу.
// Она используется для отправки запросов и обработки ответов от API.
import {HttpUtils} from "../utils/http-utils";

// Класс `IncomeService` предназначен для выполнения операций, связанных с категориями доходов,
// такими как получение, создание, обновление и удаление категорий.
export class IncomeService {
    // Метод `getCategories` предназначен для получения списка категорий доходов. Он также является асинхронным.
    // Создается объект `returnObject`, который будет содержать результаты выполнения метода,
    // включая флаги ошибок и перенаправления.
    static async getCategories() {
        const returnObject = {
            error: false,
            redirect: null,
            categories: null
        }

        const result = await HttpUtils.request('/categories/income');

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе категорий доходов. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.categories = result.response;
        return returnObject;
    }

    // Метод `getCategory` предназначен для получения данных конкретной категории дохода по ID.
    // Создается объект `returnObject` для хранения результата.
    static async getCategory(id) {
        const returnObject = {
            error: false,
            redirect: null,
            category: null
        }

        const result = await HttpUtils.request('/categories/income/' + id);

        if (result.redirect || result.error || !result.response || (result.response && (result.response.error || !result.response.id || !result.response.title))) {
            returnObject.error = 'Возникла ошибка при запросе категории доходов. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.category = result.response;
        return returnObject;
    }

    // Метод `createCategory` предназначен для создания новой категории дохода.
    // Инициализируется объект `returnObject`.
    static async createCategory(data) {
        const returnObject = {
            error: false,
            redirect: null
        }

        const result = await HttpUtils.request('/categories/income', 'POST', true, data);

        if (result.redirect || result.error || !result.response || (result.response && (result.response.error || !result.response.id || !result.response.title))) {
            returnObject.error = 'Возникла ошибка при создании категории доходов. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }

    // Метод `updateCategory` предназначен для обновления существующей категории дохода по её ID.
    // Создается объект `returnObject`.
    static async updateCategory(id, data) {
        const returnObject = {
            error: false,
            redirect: null
        }

        const result = await HttpUtils.request('/categories/income/' + id, 'PUT', true, data);

        if (result.redirect || result.error || !result.response || (result.response && (result.response.error || !result.response.id || !result.response.title))) {
            returnObject.error = 'Возникла ошибка при редактировании категории доходов. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }

    // Метод для удаления категории дохода по её ID.
    // Создается объект `returnObject`.
    static async deleteCategory(id) {
        const returnObject = {
            error: false,
            redirect: null
        }

        const result = await HttpUtils.request('/categories/income/' + id, 'DELETE', true);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при удалении категории доходов. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }
}