// Импортируются три модуля, которые будут использоваться внутри класса `Login`:
// - `ValidationUtils` — модуль, который содержит утилиты для проверки формы.
// - `AuthService` — сервис авторизации, вероятно, отвечающий за взаимодействие с API.
// - `AuthUtils` — набор вспомогательных функций для работы с аутентификационными данными
// (токены, информация о пользователе).
import {ValidationUtils} from "../../utils/validation-utils";
import {AuthService} from "../../services/auth-service";
import {AuthUtils} from "../../utils/auth-utils";

// Этот класс экспортируется для использования в других частях приложения.
// Внутри определены несколько переменных:
// - `emailInput` — элемент ввода электронной почты.
// - `passwordInput` — элемент ввода пароля.
// - `rememberMeCheckbox` — чекбокс "Запомнить меня".
// - `commonErrorElement` — общий элемент ошибки, который используется для отображения ошибок при входе.
// - `validations` — массив правил валидации полей формы.
// - `openNewRoute` — функция для открытия нового маршрута.
// Эти свойства инициализируются значением `null`. Их значения будут заполняться позже.
export class Login {
    emailInput = null;
    passwordInput = null;
    rememberMeCheckbox = null;
    commonErrorElement = null;
    validations = null;
    openNewRoute = null;

    // Конструктор класса `Login` принимает один аргумент — функцию `openNewRoute`, которая позволяет
    // перемещаться между маршрутами приложения. Эта функция сохраняется в свойство `this.openNewRoute`.
    // Далее происходит проверка наличия токенов аутентификации с помощью функции `getAuthInfo()`
    // из `AuthUtils`. Если токен найден, значит, пользователь уже вошел в систему, и конструктор
    // сразу вызывает `openNewRoute('/')`, перенаправляя пользователя на главную страницу.
    // Если токен отсутствует, выполняется метод `findElements()`, который заполняет элементы формы
    // (электронной почты, пароля и чекбокса). Затем создается массив `validations` с правилами валидации
    // для каждого поля формы. Для поля электронной почты добавляется регулярное выражение для проверки формата адреса.
    // В конце конструктора устанавливается обработчик события нажатия кнопки `process-button` на странице.
    // Когда кнопка нажата, вызывается метод `login`, привязанный к контексту текущего экземпляра класса.
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.findElements();
        this.validations = [
            {element: this.passwordInput},
            {
                element: this.emailInput,
                options: {
                    pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
                }
            }
        ];
        document.getElementById('process-button').addEventListener('click', this.login.bind(this));
    }

    // Метод `findElements` находит и сохраняет в свойствах класса элементы интерфейса, необходимые для работы с формой входа:
// - Поле ввода электронной почты.
// - Поле ввода пароля.
// - Чекбокс "Запомнить меня".
// - Общий элемент для вывода сообщений об ошибке.
    // Все эти элементы идентифицируются по их уникальным ID на HTML-странице.
    findElements() {
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.rememberMeCheckbox = document.getElementById('remember-me');
        this.commonErrorElement = document.getElementById('common-error');
    }

    // Метод для входа пользователя.
    async login() {
        this.commonErrorElement.style.display = 'none';
        // Проверка на корректность введённых данных в форме
        if (ValidationUtils.validateForm(this.validations)) {
            // Выполняется асинхронный запрос на сервер для аутентификации с данными,
            // введёнными пользователем.
            const loginResult = await AuthService.logIn({
                email: this.emailInput.value,
                password: this.passwordInput.value,
                rememberMe: this.rememberMeCheckbox.checked
            });

            // Если вход выполнен успешно (сервер вернул результат), то сохраняем токены
            // доступа и обновления, а также информацию о пользователе (идентификацию и имя) в локальном хранилище.
            if (loginResult) {
                AuthUtils.setAuthInfo(loginResult.tokens.accessToken, loginResult.tokens.refreshToken, {
                    id: loginResult.user.id,
                    name: loginResult.user.name,
                    lastName: loginResult.user.lastName
                });

                return this.openNewRoute('/');
            }

            this.commonErrorElement.style.display = 'block';
        }
    }
}