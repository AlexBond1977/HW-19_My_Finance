//Импортируются утилиты для валидации, а также сервисы аутентификации.
// Это предоставляет доступ к нужной функциональности для проверки данных и работы с учетной записью пользователя.
import {ValidationUtils} from "../../utils/validation-utils";
import {AuthService} from "../../services/auth-service";
import {AuthUtils} from "../../utils/auth-utils";

// Класс `Signup` предназначен для управления процессом регистрации пользователя. З
// десь объявляются свойства для ввода пользователя, элемента общего сообщения об ошибках,
// валидаций и функции для перенаправления.
export class Signup {
    nameInput = null;
    lastNameInput = null;
    emailInput = null;
    passwordInput = null;
    repeatPasswordInput = null;
    commonErrorElement = null;
    validations = null;
    openNewRoute = null;

    // Конструктор принимает функцию `openNewRoute`, которая используется для перенаправления.
    // Если у пользователя уже есть токен доступа, он перенаправляется на главную страницу.
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        //  Вызов метода для нахождения всех элементов формы на странице, связанных с регистрацией.
        this.findElements();
        // Список валидаций элементов формы. Для каждого элемента задаются параметры валидации,
        // такие как регулярные выражения для проверки правильности ввода, например:
        // - `nameInput` и `lastNameInput` должны начинаться с заглавной буквы.
        // - `emailInput` должен соответствовать формату электронного адреса.
        // - `passwordInput` должен иметь определенные требования по сложности (как минимум 8 символов, включая буквы верхнего и нижнего регистра и цифры).
        // - `repeatPasswordInput` должен совпадать с `passwordInput`.
        this.validations = [
            {
                element: this.nameInput,
                options: {
                    pattern: /^[А-Я][а-я]+\s*$/
                }
            },
            {
                element: this.lastNameInput,
                options: {
                    pattern: /^[А-Я][а-я]+\s*$/
                }
            },
            {
                element: this.emailInput,
                options: {
                    pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
                }
            },
            {
                element: this.passwordInput,
                options: {
                    pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
                }
            },
            {
                element: this.repeatPasswordInput,
                options: {
                    compareTo: this.passwordInput.value,
                }
            },
        ];

        //  Устанавливается обработчик события для кнопки процесса регистрации, который вызывает
        //  метод `signup()`, когда пользователь нажимает кнопку.
        document.getElementById('process-button').addEventListener('click', this.signup.bind(this));
    }

    // Поиск элементов формы.
    findElements() {
        this.nameInput = document.getElementById('name');
        this.lastNameInput = document.getElementById('last-name');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.repeatPasswordInput = document.getElementById('repeat-password');
        this.commonErrorElement = document.getElementById('common-error');
    }

    //  Этот метод осуществляет регистрацию. Он сначала скрывает элемент, показывающий ошибки, и далее:
    // - Обновляет параметр `compareTo` для `repeatPasswordInput` с текущим значением `passwordInput`.
    // - Проверяет валидность формы с помощью `ValidationUtils.validateForm(this.validations)`.
    // - Если форма валидна, отправляет данные на сервер с помощью `AuthService.signUp({...})`.
    // - Если регистрация успешна, выполняется логин с теми же учетными данными, и при успешном логине
    // токены сохраняются с помощью `AuthUtils.setAuthInfo({...})`.
    // - В случае ошибки отражается сообщение об ошибке.
    // Таким образом, класс `Signup` управляет процессом регистрации, обрабатывает валидацию данных,
    // взаимодействует с сервером для регистрации пользователя и выполняет автоматический вход.
    async signup() {
        this.commonErrorElement.style.display = 'none';

        for (let i = 0; i < this.validations.length; i++) {
            if (this.validations[i].element === this.repeatPasswordInput) {
                this.validations[i].options.compareTo = this.passwordInput.value;
            }
        }

        if (ValidationUtils.validateForm(this.validations)) {
            const signupResult = await AuthService.signUp({
                name: this.nameInput.value,
                lastName: this.lastNameInput.value,
                email: this.emailInput.value,
                password: this.passwordInput.value,
                passwordRepeat: this.repeatPasswordInput.value,
            });

            if (signupResult) {
                const loginResult = await AuthService.logIn({
                    email: this.emailInput.value,
                    password: this.passwordInput.value,
                    rememberMe: false
                });

                if (loginResult) {
                    AuthUtils.setAuthInfo(loginResult.tokens.accessToken, loginResult.tokens.refreshToken, {
                        id: loginResult.user.id,
                        name: loginResult.user.name,
                        lastName: loginResult.user.lastName
                    });

                    return this.openNewRoute('/');
                }
            }

            this.commonErrorElement.style.display = 'block';
        }
    }
}