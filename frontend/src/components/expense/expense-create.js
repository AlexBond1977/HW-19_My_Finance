//  Импортируются необходимые модули:
//  - `ValidationUtils`: утилита для валидации данных, которая содержит методы для проверки корректности введенных данных.
//  - `ExpenseService`: сервис, отвечающий за операции, связанные с расходами: создание и удаление категорий.
//  - `AuthUtils`: утилита для работы с аутентификацией, управляющая токенами и данными пользователя.
import {ValidationUtils} from "../../utils/validation-utils";
import {ExpenseService} from "../../services/expense-service";
import {AuthUtils} from "../../utils/auth-utils";

// Класс `ExpenseCreate` управляет процессом создания новой категории расхода и свойства:
// - `nameInput`: для поля ввода имени категории.
// - `validations`: для хранения правил валидации.
// - `openNewRoute`: для функции перенаправления.
export class ExpenseCreate {
    nameInput = null;
    validations = null;
    openNewRoute = null;

    //  В конструкторе передается функция `openNewRoute`, присваивающаяся свойству класса.
    //  Затем выполняется проверка на наличие токена доступа.
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login');
        }

        // Инициализация элемента ввода для названия категории и определение валидации
        // для этого элемента.
        this.nameInput = document.getElementById('nameInput');
        this.validations = [
            {element: this.nameInput}
        ];

        // Обработчик событий устанавливается для кнопки сохранения. Когда пользователь нажимает
        // кнопку, вызывается метод `saveCategory`, привязанный к текущему контексту класса
        // с помощью `bind(this)`.
        document.getElementById('saveButton').addEventListener('click', this.saveCategory.bind(this));
    }

    // Этот метод выполняет сохранение новой категории. Он начинается с проверки валидации данных
    // с помощью `ValidationUtils.validateForm`. Если валидация проходит успешно,
    // создаётся новая категория, используя сервис `ExpenseService`.
    async saveCategory() {
        if (ValidationUtils.validateForm(this.validations)) {
            const response = await ExpenseService.createCategory({title: this.nameInput.value});

            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            return this.openNewRoute('/expense');
        }
    }
}