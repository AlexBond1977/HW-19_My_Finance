import {HttpUtils} from "../utils/http-utils";

export class BalanceService {
    static async getBalance() {
        const returnObject = {
            error: false,
            redirect: null,
            balance: null
        }

        const result = await HttpUtils.request('/balance');

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