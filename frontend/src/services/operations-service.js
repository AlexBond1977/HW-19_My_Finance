import {HttpUtils} from "../utils/http-utils";
import moment from "moment/moment";

export class OperationsService {
    static async getOperations(params) {
        const returnObject = {
            error: false,
            redirect: null,
            operations: null
        }

        let query = null;
        if (params.dateFrom && params.dateTo) {
            let dateFrom = params.dateFrom.split('.');
            dateFrom = moment(new Date(dateFrom[2], dateFrom[1] - 1, dateFrom[0])).format('YYYY-MM-DD');

            let dateTo = params.dateTo.split('.');
            dateTo = moment(new Date(dateTo[2], dateTo[1] - 1, dateTo[0])).format('YYYY-MM-DD');

            query = '&dateFrom=' + dateFrom + '&dateTo=' + dateTo;
        }

        const result = await HttpUtils.request('/operations?period=' + params.period + (query ? query : ''));

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе операций. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.operations = result.response;
        return returnObject;
    }

    static async getOperation(id) {
        const returnObject = {
            error: false,
            redirect: null,
            operation: null
        }

        const result = await HttpUtils.request('/operations/' + id);

        if (result.redirect || result.error || !result.response || (result.response && (result.response.error || !result.response.id))) {
            returnObject.error = 'Возникла ошибка при запросе операции. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.operation = result.response;
        return returnObject;
    }

    static async createOperation(data) {
        const returnObject = {
            error: false,
            redirect: null
        }

        const result = await HttpUtils.request('/operations', 'POST', true, data);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при создании операции. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }

    static async updateOperation(id, data) {
        const returnObject = {
            error: false,
            redirect: null
        }

        const result = await HttpUtils.request('/operations/' + id, 'PUT', true, data);

        if (result.redirect || result.error || !result.response || (result.response && (result.response.error || !result.response.id))) {
            returnObject.error = 'Возникла ошибка при редактировании операции. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }

    static async deleteOperation(id) {

        const returnObject = {
            error: false,
            redirect: null
        }

        const result = await HttpUtils.request('/operations/' + id, 'DELETE', true);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при удалении операции. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }
}