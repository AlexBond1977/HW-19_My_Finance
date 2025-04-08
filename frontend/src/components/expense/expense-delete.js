// Импортируются необходимые модули:
// - `UrlUtils`: утилита, которая содержит методы для работы с URL - извлечение параметров из адресной строки.
// - `ExpenseService`: сервис, который управляет операциями, связанными с расходами,
// включая функции для удаления категорий.
import {UrlUtils} from "../../utils/url-utils";
import {ExpenseService} from "../../services/expense-service";

// Класс `ExpenseDelete` отвечает за логику удаления категории расходов.
// Внутри класса объявляется свойство `openNewRoute`, которое будет использоваться
// для перенаправления пользователя.
export class ExpenseDelete {
    openNewRoute = null;

    // В конструкторе передается функция `openNewRoute`, которая присваивается свойству класса.
    // Затем вызывается метод `UrlUtils.getUrlParam('id')` для получения идентификатора категории,
    // которую необходимо удалить, из параметров URL. Если идентификатор отсутствует,
    // пользователь перенаправляется на главную страницу (`/`).
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        this.deleteCategory(id).then();
    }

    // Асинхронный метод `deleteCategory(id)`, который управляет процессом удаления
    // выбранной категориио с отправкой запроса на сервер для удаления категории с
    // указанным идентификатором.
    async deleteCategory(id) {
        const response = await ExpenseService.deleteCategory(id);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute('/expense');
    }
}