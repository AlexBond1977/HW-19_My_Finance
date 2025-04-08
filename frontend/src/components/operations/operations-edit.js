//  Импорт зависимостей:
// - **`AuthUtils`**: Утилита для работы с аутентификацией пользователя.
// - **`UrlUtils`**: Утилита для работы с параметрами URL.
// - **`IncomeService`**: Сервис, который управляет категориями доходов.
// - **`ValidationUtils`**: Утилита для проверки корректности введенных данных.
// - **`ExpenseService`**: Сервис, который управляет категориями расходов.
// - **`OperationsService`**: Сервис, который обрабатывает операции (доходы и расходы).
import {AuthUtils} from "../../utils/auth-utils";
import {UrlUtils} from "../../utils/url-utils";
import {IncomeService} from "../../services/income-service";
import {ValidationUtils} from "../../utils/validation-utils";
import {ExpenseService} from "../../services/expense-service";
import {OperationsService} from "../../services/operations-service";

// Класс `OperationsEdit` предназначен для редактирования операций, включая настройку и валидацию ввода.
// Объявлены следующие свойства:
// - **`typeSelect`**: Выпадающий список для выбора типа операции (доход или расход).
// - **`categorySelect`**: Выпадающий список для выбора категории.
// - **`amountInput`**: Поле для ввода суммы операции.
// - **`dateInput`**: Поле для ввода даты операции.
// - **`commentInput`**: Поле для ввода комментария к операции.
// - **`validations`**: Массив с элементами, которые будут подлежать валидации.
// - **`operationOriginalData`**: Хранит оригинальные данные операции, которые загружаются из базы.
// - **`openNewRoute`**: Функция для перенаправления.
export class OperationsEdit {
    typeSelect = null;
    categorySelect = null;
    amountInput = null;
    dateInput = null;
    commentInput = null;
    validations = null;
    operationOriginalData = null;
    openNewRoute = null;

    // Конструктор принимает функцию `openNewRoute`, которая будет использоваться для перенаправления пользователя.
    // Проверяется наличие токена доступа: если токен отсутствует, пользователя перенаправляют на страницу логина.
    // Вызывается метод `findElements()`, чтобы инициализировать элементы формы.
    // Получается ID операции из параметров URL. Если ID отсутствует, происходит перенаправление на главную страницу.
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

    // Этот метод инициализирует ссылки на необходимые элементы ввода, связанные с операцией.
    findElements() {
        this.typeSelect = document.getElementById('typeSelect');
        this.categorySelect = document.getElementById('categorySelect');
        this.amountInput = document.getElementById('amountInput');
        this.dateInput = document.getElementById('dateInput');
        this.commentInput = document.getElementById('commentInput');
    }

    // Этот метод загружает данные операции по ID и заполняет поля ввода с полученной информацией.
    // Также загружает категории в зависимости от типа операции.
    async init(id) {
        const operationData = await this.getOperation(id);
        if (operationData) {
            this.showRecords(operationData);

            if (operationData.type) {
                await this.getCategories(operationData.type, operationData.category);
            }
        }
    }

    // Этот метод делает запрос на получение операции по ID через сервис `OperationsService`
    // и обновляет свойства класса с оригинальными данными операции.
    async getOperation(id) {
        const response = await OperationsService.getOperation(id);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.operationOriginalData = response.operation;
        return response.operation;
    }

    // Метод заполняет поля ввода значениями, полученными из операции, которую пользователь редактирует.
    showRecords(data) {
        this.amountInput.value = data.amount;
        this.commentInput.value = data.comment;
        this.dateInput.value = data.date;
        this.typeSelect.value = data.type;
    }

    // Этот метод загружает категории для выбранного типа операции (доход или расход) и заполняет выпадающий список категориями.
    // Если категория совпадает с загруженной операцией, она устанавливается как выбранная.
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

    // Метод, который обрабатывает событие сохранения операции при нажатии на кнопку "Сохранить".
    async updateOperation(e) {
        e.preventDefault();

        // Метод проверяет валидацию данных, если данные валидны, создается объект `changedData`,
        // который содержит измененные значения операции.
        // Если данные были изменены, вызывается сервис `OperationsService` для обновления операции.
        // При наличии ошибки показывается сообщение, при отсутствии – пользователь перенаправляется на страницу списка операций.
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