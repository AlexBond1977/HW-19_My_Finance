// Импортируются:
// `UrlUtils` - утилита для работы с URL.
// `IncomeService` - сервис, который управляет взаимодействием с API для операций,
// связанных с доходами, включая удаление категорий.
import {UrlUtils} from "../../utils/url-utils";
import {IncomeService} from "../../services/income-service";

// Класс `IncomeDelete` отвечает за процесс удаления категории дохода. Он содержит свойство:
// `openNewRoute` для перенаправления пользователя на другую страницу после удаления.
export class IncomeDelete {
    openNewRoute = null;

    // Конструктор принимает функцию `openNewRoute`, которая используется для перенаправления пользователя.
    // - Метод `UrlUtils.getUrlParam('id')` получает ID категории дохода из URL.
    // - Если ID отсутствует , происходит перенаправление на главную страницу (`/`).
    // - Если ID существует, вызывается метод `deleteCategory(id)`, который обрабатывает удаление категории.
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        this.deleteCategory(id).then();
    }

    // Метод принимает ID категории, которую нужно удалить, и делает асинхронный запрос
    // вызова `IncomeService.deleteCategory(id)`.
    async deleteCategory(id) {
        const response = await IncomeService.deleteCategory(id);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute('/income');
    }
}