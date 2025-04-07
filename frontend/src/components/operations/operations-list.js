import moment from "moment";
import {ValidationUtils} from "../../utils/validation-utils";
import {OperationsService} from "../../services/operations-service";
import {AuthUtils} from "../../utils/auth-utils";
import config from "../../config/config";

export class OperationsList {
    calendarFromElement = null;
    linkFromElement = null;
    calendarToElement = null;
    linkToElement = null;
    validations = null;
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
        this.initCalendar();
        this.validations = [
            {element: this.calendarFromElement},
            {element: this.calendarToElement}
        ];

        this.cancelBtn.addEventListener('click', () => {
            this.popupElement.classList.add("d-none");
        });

        this.getOperations({period: 'today'}).then();
        this.initFilter();
    }

    findElements() {
        this.calendarFromElement = document.getElementById("calendar-from");
        this.linkFromElement = document.getElementById('from');
        this.popupElement = document.getElementById('delete-popup');
        this.confirmBtn = document.getElementById('confirm-delete');
        this.cancelBtn = document.getElementById('cancel-delete');
        this.calendarToElement = document.getElementById("calendar-to");
        this.linkToElement = document.getElementById('to');
    }

    initCalendar() {
        $(this.calendarFromElement).datetimepicker({
            format: 'L',
            locale: 'ru',
            useCurrent: false
        });

        this.linkFromElement.addEventListener('click', () => {
            $(this.calendarFromElement).datetimepicker('toggle');
        });

        $(this.calendarFromElement).on("change.datetimepicker", (e) => {
            this.linkFromElement.innerText = moment(e.date).format('DD-MM-YYYY');
            $(this.calendarFromElement).datetimepicker('hide');
            $(this.calendarToElement).datetimepicker('minDate', e.date);
            if (ValidationUtils.validateForm(this.validations)) {
                this.getOperations({
                    period: "interval",
                    dateFrom: this.calendarFromElement.value,
                    dateTo: this.calendarToElement.value
                }).then();
            }
        });

        $(this.calendarToElement).datetimepicker({
            format: 'L',
            locale: 'ru',
            useCurrent: false
        });

        this.linkToElement.addEventListener('click', () => {
            $(this.calendarToElement).datetimepicker('toggle');
        })

        $(this.calendarToElement).on("change.datetimepicker", (e) => {
            this.linkToElement.innerText = moment(e.date).format('DD-MM-YYYY');
            $(this.calendarToElement).datetimepicker('hide');
            $(this.calendarFromElement).datetimepicker('maxDate', e.date);
            if (ValidationUtils.validateForm(this.validations)) {
                this.getOperations({
                    period: "interval",
                    dateFrom: this.calendarFromElement.value,
                    dateTo: this.calendarToElement.value
                }).then();
            }
        });
    }

    initFilter() {
        this.linkFromElement.disabled = true;
        this.linkToElement.disabled = true;

        document.querySelectorAll('input[type="radio"][name="filter"]').forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.checked && radio.id === 'interval') {
                    this.linkFromElement.disabled = false;
                    this.linkToElement.disabled = false;

                    if (ValidationUtils.validateForm(this.validations)) {
                        console.log(this.calendarToElement.value);
                        this.getOperations({
                            period: radio.id,
                            dateFrom: this.calendarFromElement.value,
                            dateTo: this.calendarToElement.value
                        }).then();
                    }
                } else {
                    $(this.calendarFromElement).datetimepicker('hide');
                    $(this.calendarToElement).datetimepicker('hide');
                    this.linkFromElement.disabled = true;
                    this.linkToElement.disabled = true;
                    this.getOperations({period: radio.id}).then();
                }
            });
        });
    }

    async getOperations(params) {
        const response = await OperationsService.getOperations(params);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.showOperations(response.operations);
    }

    showOperations(operations) {
        const table = document.getElementById('records');
        table.innerHTML = "";
        for (let i = 0; i < operations.length; i++) {
            const trElement = document.createElement('tr');

            const thElement = document.createElement('th');
            thElement.scope = 'row';
            thElement.innerText = i + 1;

            const typeOperation = document.createElement('td');
            typeOperation.className = operations[i].type === config.typeOperation.income ? 'text-success' : 'text-danger';
            typeOperation.innerText = operations[i].type === config.typeOperation.income ? 'доход' : 'расход';

            const categoryElement = document.createElement('td');
            categoryElement.innerText = operations[i].category;

            const amountElement = document.createElement('td');
            amountElement.innerText = operations[i].amount + '$';

            const dateElement = document.createElement('td');
            dateElement.innerText = new Date(operations[i].date).toLocaleDateString();

            trElement.appendChild(thElement);
            trElement.appendChild(typeOperation);
            trElement.appendChild(categoryElement);
            trElement.appendChild(amountElement);
            trElement.appendChild(dateElement);

            const commentElement = document.createElement('td');
            commentElement.innerText = operations[i].comment ? operations[i].comment : '';
            trElement.appendChild(commentElement);

            const tdElement = document.createElement('td');

            const tools = document.createElement('div');
            tools.className = 'operations-tools';

            const linkDelete = document.createElement('a');
            linkDelete.style.cursor = 'pointer';
            linkDelete.addEventListener('click', () => {
                this.popupElement.classList.remove('d-none');
                this.deleteOperation(operations[i].id);
            });

            const imageTrash = document.createElement('img');
            imageTrash.src = '/img/trash.svg';
            linkDelete.appendChild(imageTrash);

            const linkEdit = document.createElement('a');
            linkEdit.href = '/operations/edit?id=' + operations[i].id;

            const imagePen = document.createElement('img');
            imagePen.src = '/img/pen.svg';
            linkEdit.appendChild(imagePen);

            tools.appendChild(linkDelete);
            tools.appendChild(linkEdit);
            tdElement.appendChild(tools);
            trElement.appendChild(tdElement);
            table.appendChild(trElement);
        }
    }

    deleteOperation(id) {
        this.confirmBtn.href = '/operations/delete?id=' + id;
    }
}