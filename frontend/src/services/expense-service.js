// Импорт зависимостей:`HttpUtils` - утилита, которая позволяет выполнять HTTP-запросы к серверу,
// управляя взаимодействием между клиентом и API.
import {HttpUtils} from "../utils/http-utils";

// Класс `ExpenseService` предназначен для выполнения операций, связанных с категориями расходов.
// В этом классе определены методы для получения, создания, обновления и удаления категорий расходов.
export class ExpenseService {
    // Метод `getCategories` — асинхронный и предназначен для получения списка категорий расходов.
    // - Инициализируется объект `returnObject`, который будет возвращен из метода.
    // Он содержит следующие свойства:
    //   - **`error`**: показывает, произошла ли ошибка (по умолчанию `false`).
    //   - **`redirect`**: для хранения URL-адреса перенаправления, если потребуется.
    //   - **`categories`**: для хранения списка категорий.
    static async getCategories() {
        const returnObject = {
            error: false,
            redirect: null,
            categories: null
        }

        const result = await HttpUtils.request('/categories/expense');

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе категорий расходов. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.categories = result.response;
        return returnObject;
    }

    // Этот метод получает информацию о конкретной категории расходов по ID.
    // Аналогично, инициализируется объект `returnObject`, чтобы вернуть пригодные данные.
    static async getCategory(id) {
        const returnObject = {
            error: false,
            redirect: null,
            category: null
        }

        const result = await HttpUtils.request('/categories/expense/' + id);

        if (result.redirect || result.error || !result.response || (result.response && (result.response.error || !result.response.id || !result.response.title))) {
            returnObject.error = 'Возникла ошибка при запросе категории расходов. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.category = result.response;
        return returnObject;
    }

    // Метод для создания новой категории расходов. Инициализируется объект `returnObject` без `categories`.
    static async createCategory(data) {
        const returnObject = {
            error: false,
            redirect: null
        }

        const result = await HttpUtils.request('/categories/expense', 'POST', true, data);

        if (result.redirect || result.error || !result.response || (result.response && (result.response.error || !result.response.id || !result.response.title))) {
            returnObject.error = 'Возникла ошибка при создании категории расходов. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }

    // Метод для обновления существующей категории по ID. Инициализация объекта `returnObject`.
    static async updateCategory(id, data) {
        const returnObject = {
            error: false,
            redirect: null
        }

        const result = await HttpUtils.request('/categories/expense/' + id, 'PUT', true, data);

        if (result.redirect || result.error || !result.response || (result.response && (result.response.error || !result.response.id || !result.response.title))) {
            returnObject.error = 'Возникла ошибка при редактировании категории расходов. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }

    //  Метод для удаления категории, принимающий ID категории. Инициализация объекта `returnObject`.
    static async deleteCategory(id) {
        const returnObject = {
            error: false,
            redirect: null
        }

        const result = await HttpUtils.request('/categories/expense/' + id, 'DELETE', true);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при удалении категории расходов. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }
}