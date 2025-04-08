import {AuthUtils} from "../../utils/auth-utils";
import {UrlUtils} from "../../utils/url-utils";
import {IncomeService} from "../../services/income-service";
import {ValidationUtils} from "../../utils/validation-utils";
import {ExpenseService} from "../../services/expense-service";
import {OperationsService} from "../../services/operations-service";

export class OperationsEdit {
    typeSelect = null;
    categorySelect = null;
    amountInput = null;
    dateInput = null;
    commentInput = null;
    validations = null;
    operationOriginalData = null;
    openNewRoute = null;

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.findElements();

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        this.validations = [
            {element: this.categorySelect},
            {element: this.amountInput},
            {element: this.dateInput}
        ];

        this.dateInput.max = new Date().toISOString().split('T')[0];

        this.init(id).then();

        this.typeSelect.addEventListener('change', e => this.getCategories(e.target.value));

        document.getElementById('saveButton').addEventListener('click', this.updateOperation.bind(this));
    }

    findElements() {
        this.typeSelect = document.getElementById('typeSelect');
        this.categorySelect = document.getElementById('categorySelect');
        this.amountInput = document.getElementById('amountInput');
        this.dateInput = document.getElementById('dateInput');
        this.commentInput = document.getElementById('commentInput');
    }

    async init(id) {
        const operationData = await this.getOperation(id);
        if (operationData) {
            this.showRecords(operationData);

            if (operationData.type) {
                await this.getCategories(operationData.type, operationData.category);
            }
        }
    }

    async getOperation(id) {
        const response = await OperationsService.getOperation(id);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.operationOriginalData = response.operation;
        return response.operation;
    }

    showRecords(data) {
        this.amountInput.value = data.amount;
        this.commentInput.value = data.comment;
        this.dateInput.value = data.date;
        this.typeSelect.value = data.type;
    }

    async getCategories(type, category) {
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
            if (category === response.categories[i].title) {
                option.selected = true;
            }

            this.categorySelect.appendChild(option);
        }
    }

    async updateOperation(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {
            const changedData = {
                amount: parseInt(this.amountInput.value),
                type: this.typeSelect.value,
                category_id: parseInt(this.categorySelect.value),
                date: this.dateInput.value,
                comment: this.commentInput.value
            };

            if (Object.keys(changedData).length > 0) {
                const response = await OperationsService.updateOperation(this.operationOriginalData.id, changedData);

                if (response.error) {
                    alert(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }

                return this.openNewRoute('/operations');
            }
        }
    }
}