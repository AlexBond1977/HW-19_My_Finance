import {AuthUtils} from "../utils/auth-utils";
import {BalanceService} from "../services/balance-service";
import {ValidationUtils} from "../utils/validation-utils";

export class Layout {
    balanceElement = null;
    balancePopupElement = null;
    balanceInput = null;
    openNewRoute = null;

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.findElements();

        this.getBalance().then();
        this.balanceElement.addEventListener("click", () => {
            this.balancePopupElement.classList.remove("d-none");
        });

        document.getElementById('confirm').addEventListener('click', this.updateBalance.bind(this));
        document.getElementById('cancel').addEventListener('click', () => {
            this.balancePopupElement.classList.add("d-none");
            this.balanceInput.classList.remove('is-invalid');
        });
    }

    findElements() {
        this.balanceElement = document.getElementById("balance");
        this.balancePopupElement = document.getElementById("balance-popup");
        this.balanceInput = document.getElementById("balanceInput");
    }

    async getBalance() {
        const response = await BalanceService.getBalance();
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.showBalance(response.balance);
    }

    async updateBalance() {
        const validations = [
            {element: this.balanceInput}
        ];

        if (ValidationUtils.validateForm(validations)) {
            const response = await BalanceService.updateBalance({
                "newBalance": this.balanceInput.value
            });

            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            this.showBalance(response.balance);
            this.balancePopupElement.classList.add("d-none");
        }
    }

    showBalance(balance) {
        this.balanceElement.innerText = balance + '$';
    }
}