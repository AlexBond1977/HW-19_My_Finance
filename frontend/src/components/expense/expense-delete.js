import {UrlUtils} from "../../utils/url-utils";
import {ExpenseService} from "../../services/expense-service";

export class ExpenseDelete {
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
        const response = await ExpenseService.deleteCategory(id);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute('/expense');
    }
}