// Импорт зависимостей:
// - **`UrlUtils`**: Утилита для работы с URL, позволяющая получить параметры из адресной строки.
// - **`OperationsService`**: Сервис, который управляет операциями, связанными с доходами и расходами,
// в том числе предоставляет метод для удаления операций.
import {UrlUtils} from "../../utils/url-utils";
import {OperationsService} from "../../services/operations-service";

// Класс `OperationsDelete` отвечает за удаление операции. Внутри класса объявляется свойство:
// - **`openNewRoute`**: будет хранить функцию для перенаправления пользователя на другую страницу
// после завершения удаления.
export class OperationsDelete {
    openNewRoute = null;

    // Конструктор принимает функцию `openNewRoute`, которая будет использоваться для перенаправления пользователя после удаления.
    // Получается ID операции из параметров URL с помощью `UrlUtils.getUrlParam('id')`.
    // Если ID отсутствует, происходит перенаправление на главную страницу (`/`).
    // Если ID существует, вызывается метод `deleteOperation(id)`, который асинхронно обрабатывает удаление операции.
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        this.deleteOperation(id).then();
    }

    // Метод принимает ID операции, которую нужно удалить, и делает асинхронный запрос вызова
    // `OperationsService.deleteOperation(id)`.
    async deleteOperation(id) {
        const response = await OperationsService.deleteOperation(id);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute('/operations');
    }
}