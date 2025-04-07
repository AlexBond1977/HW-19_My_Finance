import {ValidationUtils} from "../../utils/validation-utils";
import {AuthService} from "../../services/auth-service";
import {AuthUtils} from "../../utils/auth-utils";

export class Login {
    emailInput = null;
    passwordInput = null;
    rememberMeCheckbox = null;
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

    findElements() {
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.rememberMeCheckbox = document.getElementById('remember-me');
        this.commonErrorElement = document.getElementById('common-error');
    }

    async login() {
        this.commonErrorElement.style.display = 'none';
        if (ValidationUtils.validateForm(this.validations)) {
            const loginResult = await AuthService.logIn({
                email: this.emailInput.value,
                password: this.passwordInput.value,
                rememberMe: this.rememberMeCheckbox.checked
            });

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