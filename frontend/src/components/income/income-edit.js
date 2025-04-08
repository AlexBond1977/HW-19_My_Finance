// Импорт зависимостей:
// `UrlUtils` для работы с URL, используется для получения параметров из адресной строки.
// - `IncomeService` для управления запросами, связанными с доходами.
// - `ValidationUtils` для валидации пользовательского ввода.
// - `AuthUtils` для работы с аутентификацией, токенами и хранением данных пользователя.
import {UrlUtils} from "../../utils/url-utils";
import {IncomeService} from "../../services/income-service";
import {ValidationUtils} from "../../utils/validation-utils";
import {AuthUtils} from "../../utils/auth-utils";

// Класс `IncomeEdit` управляет редактированием категории дохода. Объявляются следующие свойства:
// - `nameInput` для поля ввода названия категории.
// - `validations` для хранения правил валидации, связанных с полем ввода.
// - `categoryOriginalData` для хранения оригинальных данных категории, которые загружаются из базы.
// - `openNewRoute` для функции перенаправления пользователя.
export class IncomeEdit {
    nameInput = null;
    validations = null;
    categoryOriginalData = null;
    openNewRoute = null;

    // Конструктор принимает функцию `openNewRoute`, которая будет использоваться для перенаправления пользователя.
    // Выполняется проверка наличия токена доступа: если токен отсутствует, пользователь перенаправляется на страницу логина (`/login`).
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login');
        }

        // Получается ID категории из URL с помощью метода `UrlUtils.getUrlParam('id')`.
        // Если ID отсутствует, пользователь перенаправляется на главную страницу (`/`).
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        // Инициализация элементов ввода и валидации.
        this.nameInput = document.getElementById('nameInput');
        this.validations = [
            {element: this.nameInput}
        ];

        // Устанавливается обработчик события для кнопки сохранения, который вызывает
        // метод `updateCategory` при нажатии на кнопку.
        document.getElementById('saveButton').addEventListener('click', this.updateCategory.bind(this));

        this.showCategory(id).then();
    }

    // Метод загружает данные категории по ID с помощью метода `getCategory`.
    // Если данные успешно загружены, то значение `title` категории устанавливается в поле ввода `nameInput`.
    async showCategory(id) {
        const categoryData = await this.getCategory(id);
        if (categoryData) {
            this.nameInput.value = categoryData.title;
        }
    }

    // Метод отправляет запрос на сервер через `IncomeService` для получения категории по ее ID.
    // Если в ответе присутствует ошибка, выводится сообщение об ошибке.
    // Если запрос успешен, оригинальные данные категории сохраняются в `categoryOriginalData`.
    async getCategory(id) {
        const response = await IncomeService.getCategory(id);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.categoryOriginalData = response.category;
        return response.category;
    }

    // Метод обрабатывает событие нажатия кнопки сохранения. Сначала предотвращается стандартное
    // поведение формы (перезагрузка страницы). Проверяется валидация данных с помощью `ValidationUtils.validateForm`.
    // Если валидация проходит успешно и новое название отличается от оригинального,
    // выполняется асинхронный запрос на обновление категории.
    async updateCategory(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {
            if (this.nameInput.value !== this.categoryOriginalData.title) {
                const response = await IncomeService.updateCategory(this.categoryOriginalData.id, {title: this.nameInput.value});

                if (response.error) {
                    alert(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }

                return this.openNewRoute('/income');
            }
        }
    }
}