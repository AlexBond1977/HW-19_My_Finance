// Импорт зависимостей:
// `IncomeService` для взаимодействия с API, который управляет операциями,
// связанными с категориями доходов: получением, обновлением и удалением.
// `AuthUtils` для работы с аутентификацией, которая позволяет проверять наличие
// токенов и управлять сессиями пользователей.
import {IncomeService} from "../../services/income-service";
import {AuthUtils} from "../../utils/auth-utils";

// Класс `IncomeList` отвечает за отображение списка категорий доходов и управление пользовательским взаимодействием.
// Объявлены следующие свойства:
// - **`addElementBtn`**: Кнопка для добавления новой категории дохода.
// - **`rowElement`**: Элемент, в который будут добавлены категории дохода.
// - **`popupElement`**: Модальное окно для подтверждения удаления категории.
// - **`confirmBtn`**: Кнопка для подтверждения удаления категории.
// - **`cancelBtn`**: Кнопка для отмены удаления категории.
// - **`openNewRoute`**: Функция для перенаправления пользователя на другую страницу.
export class IncomeList {
    addElementBtn = null;
    rowElement = null;
    popupElement = null;
    confirmBtn = null;
    cancelBtn = null;
    openNewRoute = null;

    // Конструктор принимает функцию `openNewRoute`, которая будет использоваться для перенаправления.
    // Проверяется наличие токена доступа: если токен отсутствует, пользователь перенаправляется на страницу логина (`/login`).
    // Вызывается метод `findElements()` для инициализации ключевых элементов DOM.
    // Устанавливается обработчик события для кнопки `cancelBtn`: при нажатии на кнопку
    // модальное окно скрывается (класс `d-none` добавляется).
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.findElements();

        this.cancelBtn.addEventListener('click', () => {
            this.popupElement.classList.add("d-none");
        });

        this.getCategoriesIncome().then();
    }

    // В данном методе идентифицируются и инициализируются элементы DOM:
    //   - `addElementBtn`: кнопка для добавления новой категории.
    //   - `rowElement`: контейнер для списка категорий.
    //   - `popupElement`: элемент для модального окна удаления.
    //   - `confirmBtn`: кнопка подтверждения удаления.
    //   - `cancelBtn`: кнопка отмены действия в модальном окне.
    findElements() {
        this.addElementBtn =  document.getElementById('addCategory');
        this.rowElement = document.getElementById('categories-list');
        this.popupElement = document.getElementById('delete-popup');
        this.confirmBtn = document.getElementById('confirm-delete');
        this.cancelBtn = document.getElementById('cancel-delete');
    }

    // Метод асинхронно запрашивает список категорий доходов через `IncomeService.getCategories()`.
    // Если при запросе возникает ошибка, выводится сообщение об ошибке с помощью `alert`.
    // Если запрос успешен, вызывается метод `showCategories`, передавая список полученных категорий.
    async getCategoriesIncome() {
        const response = await IncomeService.getCategories();
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.showCategories(response.categories);
    }

    // Этот метод отвечает за создание и отображение карточек для каждой категории в списке.
    // Создаются элементы `div` для каждой категории.
    // Наполняются карточки данными: названием категории и кнопками для редактирования и удаления.
    // При нажатии на кнопку "Удалить" модальное окно (попап) отображается, а также вызывается
    // метод `deleteCategory` с ID категории.
    showCategories(categories) {
        for (let i = 0; i < categories.length; i++) {
            const colBlock = document.createElement('div');
            colBlock.classList.add('col');

            const cardBlock = document.createElement('div');
            cardBlock.className = 'card p-3 h-100 border';

            const cardBodyBlock = document.createElement('div');
            cardBodyBlock.className = 'card-body p-0';

            const nameCategory = document.createElement('h3');
            nameCategory.className = 'text-primary-emphasis mb-3';
            nameCategory.innerText = categories[i].title;

            const editLink = document.createElement('a');
            editLink.className = 'btn btn-primary me-2 mb-2 fw-medium text-small edit-link';
            editLink.href = '/income/edit?id=' + categories[i].id;
            editLink.innerText = 'Редактировать';

            const deleteLink = document.createElement('a');
            deleteLink.className = 'btn btn-danger fw-medium mb-2 text-small delete-link';
            deleteLink.innerText = 'Удалить';
            deleteLink.addEventListener('click', () => {
                this.popupElement.classList.remove('d-none');
                this.deleteCategory(categories[i].id);
            });

            cardBodyBlock.appendChild(nameCategory);
            cardBodyBlock.appendChild(editLink);
            cardBodyBlock.appendChild(deleteLink);
            cardBlock.appendChild(cardBodyBlock);
            colBlock.appendChild(cardBlock);

            this.rowElement.insertBefore(colBlock, this.addElementBtn);
        }
    }

    // Устанавливает атрибут `href` кнопки подтверждения удаления, чтобы указать
    // URL для запроса на удаление выбранной категории.
    deleteCategory(id) {
        this.confirmBtn.href = '/income/delete?id=' + id;
    }
}