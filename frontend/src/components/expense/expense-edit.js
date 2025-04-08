import {UrlUtils} from "../../utils/url-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {ExpenseService} from "../../services/expense-service";
import {AuthUtils} from "../../utils/auth-utils";

export class ExpenseEdit {
    nameInput = null;
    validations = null;
    categoryOriginalData = null;
    openNewRoute = null;

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login');
        }

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        this.nameInput = document.getElementById('nameInput');
        this.validations = [
            {element: this.nameInput}
        ];

        document.getElementById('saveButton').addEventListener('click', this.updateCategory.bind(this));

        this.showCategory(id).then();
    }

    async showCategory(id) {
        const categoryData = await this.getCategory(id);
        if (categoryData) {
            this.nameInput.value = categoryData.title;
        }
    }

    async getCategory(id) {
        const response = await ExpenseService.getCategory(id);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.categoryOriginalData = response.category;
        return response.category;
    }

    async updateCategory(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {
            if (this.nameInput.value !== this.categoryOriginalData.title) {
                const response = await ExpenseService.updateCategory(this.categoryOriginalData.id, {title: this.nameInput.value});

                if (response.error) {
                    alert(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }

                return this.openNewRoute('/expense');
            }
        }
    }
}