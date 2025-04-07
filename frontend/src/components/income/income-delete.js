import {UrlUtils} from "../../utils/url-utils";
import {IncomeService} from "../../services/income-service";

export class IncomeDelete {
    openNewRoute = null;

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        this.deleteCategory(id).then();
    }

    async deleteCategory(id) {
        const response = await IncomeService.deleteCategory(id);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute('/income');
    }
}