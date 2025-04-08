import {ValidationUtils} from "../../utils/validation-utils";
import {IncomeService} from "../../services/income-service";
import {AuthUtils} from "../../utils/auth-utils";

export class IncomeCreate {
    nameInput = null;
    validations = null;
    openNewRoute = null;

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.nameInput = document.getElementById('nameInput');
        this.validations = [
            {element: this.nameInput}
        ];

        document.getElementById('saveButton').addEventListener('click', this.saveCategory.bind(this));
    }

    async saveCategory() {
        if (ValidationUtils.validateForm(this.validations)) {
            const response = await IncomeService.createCategory({title: this.nameInput.value});

            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            return this.openNewRoute('/income');
        }
    }
}