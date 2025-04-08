// Импортируются необходимые утилиты:
//    - `ValidationUtils`: используется для проверки корректности введенных данных.
//    - `IncomeService`: взаимодействует с сервером для управления категориями доходов.
//    - `AuthUtils`: отвечает за проверку аутентификации пользователя.
import {ValidationUtils} from "../../utils/validation-utils";
import {IncomeService} from "../../services/income-service";
import {AuthUtils} from "../../utils/auth-utils";

// Класс `IncomeCreate` управляет логикой создания новой категории дохода. Объявляются свойства:
//    - `nameInput`: для поля ввода названия категории.
//    - `validations`: для хранения правил валидации.
//    - `openNewRoute`: функция для перенаправления пользователя.
export class IncomeCreate {
    nameInput = null;
    validations = null;
    openNewRoute = null;

    // Конструктор принимает функцию `openNewRoute` и проверяет, есть ли у пользователя токен доступа.
    // Если токен отсутствует, пользователь перенаправляется на страницу логина.
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login');
        }

        // Поле ввода для названия категории и правила для валидации инициализируются.
        this.nameInput = document.getElementById('nameInput');
        this.validations = [
            {element: this.nameInput}
        ];

        //  Устанавливается обработчик события на кнопку сохранения, который вызывает метод `saveCategory`.
        document.getElementById('saveButton').addEventListener('click', this.saveCategory.bind(this));
    }

    // Метод `saveCategory` управляет созданием новой категории дохода, валидирует вводимые данные,
    // отправляет их на сервер и обрабатывает ответ, обеспечивая соответствующее перенаправление
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