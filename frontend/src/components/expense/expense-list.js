// Осуществляется импорт необходимых утилит и сервисов:
// - `ExpenseService`: сервис, отвечающий за взаимодействие с API для управления категориями расходов.
// - `AuthUtils`: утилита, содержащая методы для работы с аутентификацией и хранением токенов.
import {ExpenseService} from "../../services/expense-service";
import {AuthUtils} from "../../utils/auth-utils";

// Класс `ExpenseList` управляет отображением списка категорий расходов и взаимодействием с пользователем.
// Здесь объявляются свойства:
//    - `addElementBtn`: кнопка для добавления новой категории.
//    - `rowElement`: элемент, содержащий список категорий.
//    - `popupElement`: модальное окно для подтверждения удаления.
//    - `confirmBtn`: кнопка подтверждения удаления.
//    - `cancelBtn`: кнопка отмены действия (закрытия модального окна).
//    - `openNewRoute`: функция для перенаправления пользователя.
export class ExpenseList {
    addElementBtn = null;
    rowElement = null;
    popupElement = null;
    confirmBtn = null;
    cancelBtn = null;
    openNewRoute = null;

    // Конструктор принимает функцию `openNewRoute` и проверяет наличие токена доступа.
    // Если токен отсутствует, происходит перенаправление пользователя на страницу логина (`/login`).
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login');
        }

        // Вызываем метод `findElements()` для инициализации ссылок на ключевые элементы страницы.
        this.findElements();

        //  Устанавливается обработчик события для кнопки отмены. При нажатии на кнопку
        //  модальное окно становится невидимым.
        this.cancelBtn.addEventListener('click', () => {
            this.popupElement.classList.add("d-none");
        });

        //  Вызывается метод `getCategoriesExpense()` для загрузки всех категорий расходов.
        this.getCategoriesExpense().then();
    }

    // Метод для поиска элементов: содержатся ссылки на элементы DOM для добавления категории,
    // списка категорий, попапа для подтверждения удаления и соответствующих кнопок.
    findElements() {
        this.addElementBtn =  document.getElementById('addCategory');
        this.rowElement = document.getElementById('categories-list');
        this.popupElement = document.getElementById('delete-popup');
        this.confirmBtn = document.getElementById('confirm-delete');
        this.cancelBtn = document.getElementById('cancel-delete');
    }

    // Метод получения категорий - отправляет запрос на получение категорий расходов через `ExpenseService`.
    // - Если ответ содержит ошибку, выводится предупреждение. Если необходимо, пользователь перенаправляется.
    // - Если запрос успешен, вызывается метод `showCategories` для отображения полученных категорий.
    async getCategoriesExpense() {
        const response = await ExpenseService.getCategories();
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.showCategories(response.categories);
    }

    // Метод отображения категорий. Этот метод принимает массив категорий и создает соответствующие HTML-элементы
    // для отображения каждой категории в виде карточек. Внутри цикла:
    // - Создаются блоки для категории, включая название, кнопку редактирования и удаления.
    // - Кнопка "Редактировать" перенаправляет на страницу редактирования.
    // - Кнопка "Удалить" вызывает модальное окно с подтверждением удаления и передает ID категории в метод `deleteCategory`.
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
            editLink.href = '/expense/edit?id=' + categories[i].id;
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

    // Метод удаления категории. Этот метод обновляет атрибут `href` кнопки подтверждения
    // удаления, устанавливая URL для запроса на удаление категории.
    deleteCategory(id) {
        this.confirmBtn.href = '/expense/delete?id=' + id;
    }
}