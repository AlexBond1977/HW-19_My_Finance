import {HttpUtils} from "../utils/http-utils";

export class IncomeService {
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