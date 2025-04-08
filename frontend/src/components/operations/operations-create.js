import {AuthUtils} from "../../utils/auth-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {IncomeService} from "../../services/income-service";
import {UrlUtils} from "../../utils/url-utils";
import {ExpenseService} from "../../services/expense-service";
import {OperationsService} from "../../services/operations-service";

export class OperationsCreate {
    typeSelect = null;
    categorySelect = null;
    amountInput = null;
    dateInput = null;
    commentInput = null;
    validations = null;
    openNewRoute = null;

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.findElements();

        const type = UrlUtils.getUrlParam('type');
        if (!type) {
            return this.openNewRoute('/');
        }

        this.typeSelect.value = type;
        this.typeSelect.addEventListener('change', e => this.getCategories(e.target.value));

        this.getCategories(type).then();

        this.validations = [
            {element: this.categorySelect},
            {element: this.amountInput},
            {element: this.dateInput}
        ];

        this.dateInput.max = new Date().toISOString().split('T')[0];

        document.getElementById('saveButton').addEventListener('click', this.saveOperation.bind(this));
    }

    findElements() {
        this.typeSelect = document.getElementById('typeSelect');
        this.categorySelect = document.getElementById('categorySelect');
        this.amountInput = document.getElementById('amountInput');
        this.dateInput = document.getElementById('dateInput');
        this.commentInput = document.getElementById('commentInput');
    }

    async getCategories(type) {
        const response = type === 'income' ? await IncomeService.getCategories() : await ExpenseService.getCategories();
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.categorySelect.innerHTML = '';
        const disableOption = document.createElement("option");
        disableOption.disabled = true;
        disableOption.selected = true;
        disableOption.innerText = 'Категория...';
        disableOption.value = null;
        this.categorySelect.appendChild(disableOption);

        for (let i = 0; i < response.categories.length; i++) {
            const option = document.createElement("option");
            option.value = response.categories[i].id;
            option.innerText = response.categories[i].title;

            this.categorySelect.appendChild(option);
        }
    }

    async saveOperation() {
        if (ValidationUtils.validateForm(this.validations)) {
            const response = await OperationsService.createOperation({
                type: this.typeSelect.value,
                amount: +this.amountInput.value,
                date: this.dateInput.value,
                comment: this.commentInput.value ? this.commentInput.value : ' ',
                category_id: parseInt(this.categorySelect.value)
            });

            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            return this.openNewRoute('/operations');
        }
    }
}