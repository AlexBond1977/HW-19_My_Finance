// Импорт зависимостей:
// - `HttpUtils` - утилита для выполнения HTTP-запросов. Она используется для общения с API.
// -`moment` - библиотека для работы с датами, которая позволяет удобно форматировать и манипулировать датами.
import {HttpUtils} from "../utils/http-utils";
import moment from "moment/moment";

// Класс `OperationsService` предназначен для обработки запросов, связанных с операциями,
// такими как получение списка операций, создание, обновление и удаление отдельных операций.
export class OperationsService {
    // Метод `getOperations` предназначен для получения операций. Он принимает объект `params`,
    // который может содержать параметры запроса (например, период и даты).
    // Создается объект `returnObject`, который будет возвращен,
    // чтобы инкапсулировать результаты выполнения метода.
    static async getOperations(params) {
        const returnObject = {
            error: false,
            redirect: null,
            operations: null
        }

        // Если переданы параметры `dateFrom` и `dateTo`, они обрабатываются:
        // Строки дат разбиваются по точкам.
        // Создаются объекты `Date`, которые передаются библиотеке `moment` для
        // форматирования в стандартный вид (YYYY-MM-DD).
        // Формируется строка `query`, которая будет добавлена к запросу.
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

    // Метод для получения информации о конкретной операции по её ID.
    // Инициализируется объект `returnObject`.
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

    // Метод для создания новой операции. Инициализируется объект `returnObject`.
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

    // Метод обновляет существующую операцию по её ID. Инициализируется объект `returnObject`.
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

    // Метод для удаления операции по её ID. Инициализируется объект `returnObject`.
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