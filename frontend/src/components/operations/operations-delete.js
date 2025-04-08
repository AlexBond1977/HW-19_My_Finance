import {UrlUtils} from "../../utils/url-utils";
import {IncomeService} from "../../services/income-service";
import {OperationsService} from "../../services/operations-service";

export class OperationsDelete {
    openNewRoute = null;

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        this.deleteOperation(id).then();
    }

    async deleteOperation(id) {
        const response = await OperationsService.deleteOperation(id);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute('/operations');
    }
}