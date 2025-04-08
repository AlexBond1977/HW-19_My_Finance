import {ValidationUtils} from "../../utils/validation-utils";
import {AuthService} from "../../services/auth-service";
import {AuthUtils} from "../../utils/auth-utils";

export class Signup {
    nameInput = null;
    lastNameInput = null;
    emailInput = null;
    passwordInput = null;
    repeatPasswordInput = null;
    commonErrorElement = null;
    validations = null;
    openNewRoute = null;

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.findElements();
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

        document.getElementById('process-button').addEventListener('click', this.signup.bind(this));
    }

    findElements() {
        this.nameInput = document.getElementById('name');
        this.lastNameInput = document.getElementById('last-name');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.repeatPasswordInput = document.getElementById('repeat-password');
        this.commonErrorElement = document.getElementById('common-error');
    }

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