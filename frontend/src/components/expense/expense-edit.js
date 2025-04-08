// В этом блоке кода производится импорт необходимых утилит и сервисов:
// - `UrlUtils`: используется для работы с URL, например, для получения параметров из адресной строки.
// - `ValidationUtils`: содержит методы для валидации данных, чтобы проверять, соответствует ли форма требованиям.
// - `ExpenseService`: сервис, который управляет запросами, связанными с расходами: получение, обновление и создание категорий.
// - `AuthUtils`: утилита, которая обрабатывает аутентификацию и управление токенами.
import {UrlUtils} from "../../utils/url-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {ExpenseService} from "../../services/expense-service";
import {AuthUtils} from "../../utils/auth-utils";

//  Класс `ExpenseEdit` отвечает за редактирование существующей категории расходов. Объявлены свойства:
//  - `nameInput`: для поля ввода названия категории.
//  - `validations`: для хранения правил валидации.
//  - `categoryOriginalData`: для хранения оригинальных данных категории, которые будут редактироваться.
//  - `openNewRoute`: для функции перенаправления.
export class ExpenseEdit {
    nameInput = null;
    validations = null;
    categoryOriginalData = null;
    openNewRoute = null;

    //  Конструктор принимает функцию `openNewRoute`, присваивающуюся свойству класса.
    //  Внутри конструктора происходит проверка наличия токена доступа.
    //  Если токен отсутствует, пользователь перенаправляется на страницу логина (`/login`).
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login');
        }

        //  Получается идентификатор категории из URL. Если ID не указан, пользователь
        //  перенаправляется на главную страницу (`/`).
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        // Инициализируется элемент ввода для названия категории, а также устанавливаются
        // правила валидации для этого элемента.
        this.nameInput = document.getElementById('nameInput');
        this.validations = [
            {element: this.nameInput}
        ];

        // Устанавливается обработчик событий для кнопки сохранения. Когда пользователь нажимает кнопку,
        // вызывается метод `updateCategory`, связанный с текущим контекстом класса.
        document.getElementById('saveButton').addEventListener('click', this.updateCategory.bind(this));

        this.showCategory(id).then();
    }

    // Этот метод отвечает за отображение данных категории. Он вызывается с параметром `id`.
    // - Сначала запрашиваются данные категории через метод `getCategory(id)`.
    // - Если данные успешно загружены, то значение `title` категории устанавливается в поле ввода `nameInput`.
    async showCategory(id) {
        const categoryData = await this.getCategory(id);
        if (categoryData) {
            this.nameInput.value = categoryData.title;
        }
    }

    // Метод получает категорию по ID, отправляя запрос в сервис `ExpenseService`.
    // - Если возникает ошибка, выводится сообщение, и в случае наличия редиректа осуществляется
    // перенаправление.
    // - Если запрос успешен, оригинальные данные категории сохраняются в `categoryOriginalData`.
    async getCategory(id) {
        const response = await ExpenseService.getCategory(id);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.categoryOriginalData = response.category;
        return response.category;
    }

    // Этот метод управляет обновлением категории. Он начинается с предотвращения стандартного
    // поведения события (например, перезагрузки страницы):
    // - Выполняется валидация данных с помощью `ValidationUtils.validateForm`.
    // - Если данные валидны и название категории изменилось, производится запрос на обновление
    // категории через `ExpenseService.updateCategory`.
    async updateCategory(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {
            if (this.nameInput.value !== this.categoryOriginalData.title) {
                const response = await ExpenseService.updateCategory(this.categoryOriginalData.id, {title: this.nameInput.value});

                if (response.error) {
                    alert(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }

                return this.openNewRoute('/expense');
            }
        }
    }
}