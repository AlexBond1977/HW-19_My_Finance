// Импорт зависимостей:
// - **`AuthUtils`**: Утилита для управления аутентификацией и проверкой наличия токена доступа.
// - **`BalanceService`**: Сервис, который взаимодействует с API для получения и обновления баланса пользователя.
// - **`ValidationUtils`**: Утилита, содержащая функции для проверки корректности пользовательского ввода.
import {AuthUtils} from "../utils/auth-utils";
import {BalanceService} from "../services/balance-service";
import {ValidationUtils} from "../utils/validation-utils";

// Класс `Layout` управляет интерфейсом, связанным с балансом. Здесь объявляются свойства:
// - **`balanceElement`**: Элемент для отображения текущего баланса пользователя.
// - **`balancePopupElement`**: Модальное окно для обновления баланса.
// - **`balanceInput`**: Поле ввода для новой суммы баланса.
// - **`openNewRoute`**: Функция для перенаправления пользователя на другую страницу.
export class Layout {
    balanceElement = null;
    balancePopupElement = null;
    balanceInput = null;
    openNewRoute = null;

    // Конструктор принимает функцию `openNewRoute`, используемую для перенаправления пользователя.
    // - Проверяется наличие токена доступа: если токен отсутствует, пользователя перенаправляют на страницу логина (`/login`).
    // - Вызывается метод `findElements()` для инициализации интерфейсных элементов.
    // - Асинхронно загружается текущий баланс пользователя с помощью метода `getBalance()`.
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

    // Метод находит и инициализирует необходимые элементы DOM: текущий баланс,
    // попап для обновления баланса и поле для ввода нового значения баланса.
    findElements() {
        this.balanceElement = document.getElementById("balance");
        this.balancePopupElement = document.getElementById("balance-popup");
        this.balanceInput = document.getElementById("balanceInput");
    }

    // Метод асинхронно запрашивает текущий баланс пользователя через `BalanceService.getBalance()`.
    // Если возникает ошибка, выводится сообщение с ошибкой.
    // Если запрос успешен, вызывается метод `showBalance`, который отображает полученное значение баланса.
    async getBalance() {
        const response = await BalanceService.getBalance();
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.showBalance(response.balance);
    }

    // Метод, который асинхронно обновляет баланс на сервере.
    // - Сначала выполняется валидация ввода в поле `balanceInput`.
    // - Если ввод корректен, отправляется запрос на обновление баланса с новым значением.
    // - Если возникает ошибка, выводится сообщение об ошибке, и при необходимости осуществляется перенаправление.
    // - Если запрос успешен, обновляется отображаемый баланс, и попап скрывается.
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

    // Метод отвечает за обновление текстового содержимого элемента, отображающего текущий баланс пользователя.
    showBalance(balance) {
        this.balanceElement.innerText = balance + '$';
    }
}