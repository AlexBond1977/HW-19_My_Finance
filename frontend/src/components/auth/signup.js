import {ValidationUtils} from "../../utils/validation-utils";
import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";

export class Signup {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.findElements();

        this.validations = [
            {element: this.fullNameElement, options: {pattern: /^([А-ЯЁ][а-яё]+\s){2}([А-ЯЁ][а-яё]+)$/}},
            {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
            {element: this.passwordElement, options: {pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/}},
            {element: this.passwordRepeatElement, options: {compareTo: this.passwordElement.value}},
        ];

        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));
    }

    findElements() {
        this.fullNameElement = document.getElementById('full-name');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('password-repeat');
        this.commonErrorElement = document.getElementById('common-error');
    }

    async signUp() {
        this.commonErrorElement.style.display = 'none';

        for (let i = 0; i < this.validations.length; i++) {
            if (this.validations[i].element === this.passwordRepeatElement) {
                this.validations[i].options.compareTo = this.passwordElement.value;
            }
        }

        if (ValidationUtils.validateForm(this.validations)) {
            const signupResult = await AuthService.signUp({
                name: this.fullNameElement.value.split(' ')[0],
                lastName: this.fullNameElement.value.split(' ')[1],
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.passwordRepeatElement.value
            });

            if (signupResult) {
                AuthUtils.setAuthInfo(signupResult.tokens.accessToken, signupResult.tokens.refreshToken, {
                    id: signupResult.user.id,
                    name: signupResult.user.name,
                    lastName: signupResult.user.lastName
                });

                return this.openNewRoute('/');
            }

            this.commonErrorElement.style.display = 'block';
        }
    }
}
