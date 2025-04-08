// Импорт зависимостей:
// - **`AuthUtils`**: Утилита для работы с аутентификацией. Позволяет проверять наличие токена доступа.
// - **`ValidationUtils`**: Утилита, содержащая методы для валидации пользовательского ввода.
// - **`IncomeService`**: Сервис для управления категориями доходов.
// - **`UrlUtils`**: Утилита для извлечения параметров из URL.
// - **`ExpenseService`**: Сервис для управления категориями расходов.
// - **`OperationsService`**: Сервис для обработки операций (доходов и расходов).
import {AuthUtils} from "../../utils/auth-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {IncomeService} from "../../services/income-service";
import {UrlUtils} from "../../utils/url-utils";
import {ExpenseService} from "../../services/expense-service";
import {OperationsService} from "../../services/operations-service";

// Класс `OperationsCreate` отвечает за создание новой операции. Объявляются следующие свойства:
// - **`typeSelect`**: Выпадающий список для выбора типа операции (доход или расход).
// - **`categorySelect`**: Выпадающий список для выбора категории.
// - **`amountInput`**: Поле для ввода суммы операции.
// - **`dateInput`**: Поле для ввода даты операции.
// - **`commentInput`**: Поле для ввода комментария к операции.
// - **`validations`**: Список элементов для валидации.
// - **`openNewRoute`**: Функция для перенаправления пользователя на другие страницы.
export class OperationsCreate {
    typeSelect = null;
    categorySelect = null;
    amountInput = null;
    dateInput = null;
    commentInput = null;
    validations = null;
    openNewRoute = null;

    // Конструктор принимает функцию `openNewRoute`, которую он будет использовать для перенаправления пользователя.
    // Проверяется наличие токена доступа: если токен отсутствует, пользователя перенаправляют на страницу логина.
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

        // Инициализация элементов и обработчиков событий:
        // Устанавливается значение `typeSelect` в соответствии с полученным типом из URL.
        // Устанавливается обработчик события на изменение выпадающего списка типа операции:
        // при изменении типа категории вызывается метод `getCategories`.
        this.typeSelect.value = type;
        this.typeSelect.addEventListener('change', e => this.getCategories(e.target.value));

        this.getCategories(type).then();

        // Создается массив для валидации, который включает поля для категории, суммы и даты.
        this.validations = [
            {element: this.categorySelect},
            {element: this.amountInput},
            {element: this.dateInput}
        ];

        // Устанавливается максимальная дата для поля даты.
        // Пользователь не сможет выбрать дату, превышающую текущую.
        this.dateInput.max = new Date().toISOString().split('T')[0];

        // Устанавливается обработчик события для кнопки сохранения, связанный с методом `saveOperation`.
        document.getElementById('saveButton').addEventListener('click', this.saveOperation.bind(this));
    }

    findElements() {
        this.typeSelect = document.getElementById('typeSelect');
        this.categorySelect = document.getElementById('categorySelect');
        this.amountInput = document.getElementById('amountInput');
        this.dateInput = document.getElementById('dateInput');
        this.commentInput = document.getElementById('commentInput');
    }

    // Метод загружает категории в зависимости от типа операции (доход или расход).
    // Используются соответствующие сервисы.
    // Если запрос возвращает ошибку, показывается сообщение, и потенциально происходит перенаправление.
    async getCategories(type) {
        const response = type === 'income' ? await IncomeService.getCategories() : await ExpenseService.getCategories();
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        // Заполнение выпадающего списка категорий. Сначала выпадающий список категории очищается.
        // Затем создается и добавляется элемент-опция, который сообщает пользователю выбрать категорию.
        // В цикле для каждой категории создаются элементы `<option>`, которые добавляются в выпадающий список.
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

    // Метод сохраняет новую операцию, если форма проходит валидацию.
    // Создается объект с данными, которые будут отправлены на сервер (тип, сумма, дата, комментарий, категория).
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