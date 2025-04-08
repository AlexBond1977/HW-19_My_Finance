import {IncomeService} from "../../services/income-service";
import {AuthUtils} from "../../utils/auth-utils";

export class IncomeList {
    addElementBtn = null;
    rowElement = null;
    popupElement = null;
    confirmBtn = null;
    cancelBtn = null;
    openNewRoute = null;

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.findElements();

        this.cancelBtn.addEventListener('click', () => {
            this.popupElement.classList.add("d-none");
        });

        this.getCategoriesIncome().then();
    }

    findElements() {
        this.addElementBtn =  document.getElementById('addCategory');
        this.rowElement = document.getElementById('categories-list');
        this.popupElement = document.getElementById('delete-popup');
        this.confirmBtn = document.getElementById('confirm-delete');
        this.cancelBtn = document.getElementById('cancel-delete');
    }

    async getCategoriesIncome() {
        const response = await IncomeService.getCategories();
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.showCategories(response.categories);
    }

    showCategories(categories) {
        for (let i = 0; i < categories.length; i++) {
            const colBlock = document.createElement('div');
            colBlock.classList.add('col');

            const cardBlock = document.createElement('div');
            cardBlock.className = 'card p-3 h-100 border';

            const cardBodyBlock = document.createElement('div');
            cardBodyBlock.className = 'card-body p-0';

            const nameCategory = document.createElement('h3');
            nameCategory.className = 'text-primary-emphasis mb-3';
            nameCategory.innerText = categories[i].title;

            const editLink = document.createElement('a');
            editLink.className = 'btn btn-primary me-2 mb-2 fw-medium text-small edit-link';
            editLink.href = '/income/edit?id=' + categories[i].id;
            editLink.innerText = 'Редактировать';

            const deleteLink = document.createElement('a');
            deleteLink.className = 'btn btn-danger fw-medium mb-2 text-small delete-link';
            deleteLink.innerText = 'Удалить';
            deleteLink.addEventListener('click', () => {
                this.popupElement.classList.remove('d-none');
                this.deleteCategory(categories[i].id);
            });

            cardBodyBlock.appendChild(nameCategory);
            cardBodyBlock.appendChild(editLink);
            cardBodyBlock.appendChild(deleteLink);
            cardBlock.appendChild(cardBodyBlock);
            colBlock.appendChild(cardBlock);

            this.rowElement.insertBefore(colBlock, this.addElementBtn);
        }
    }

    deleteCategory(id) {
        this.confirmBtn.href = '/income/delete?id=' + id;
    }
}