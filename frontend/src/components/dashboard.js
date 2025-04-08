// Импорт зависимостей:
// - **`moment`**: Библиотека для работы с датами, позволяющая легко форматировать и управлять ими.
// - **`ValidationUtils`**: Утилита для валидации пользовательского ввода.
// - **`OperationsService`**: Сервис для работы с операциями, получает данные операций с сервера.
// - **`AuthUtils`**: Утилита для проверки аутентификации пользователя.
// - **`config`**: Конфигурационный файл, который вероятно содержит настройки приложения.
import {Chart, PieController, ArcElement, Legend, Colors, Tooltip} from "chart.js";
import {AuthUtils} from "../utils/auth-utils";
import moment from "moment/moment";
import {ValidationUtils} from "../utils/validation-utils";
import {OperationsService} from "../services/operations-service";

// Класс `OperationsList` управляет списком операций. Объявляются свойства:
// - **`calendarFromElement`** и **`calendarToElement`**: Элементы для выбора начальной и конечной даты операций.
// - **`linkFromElement`** и **`linkToElement`**: Элементы для открытия соответствующих календарей.
// - **`validations`**: Массив с элементами, которые будут проверяться на корректность ввода.
// - **`popupElement`**: Модальное окно для подтверждения удаления операции.
// - **`confirmBtn`** и **`cancelBtn`**: Кнопки для подтверждения и отмены удаления.
// - **`openNewRoute`**: Функция для перенаправления пользователя.
// - **`incomeChart`** и **`expenseChart`**: Графики для отображения данных о доходах и расходах.
export class Dashboard {
    calendarFromElement = null;
    linkFromElement = null;
    calendarToElement = null;
    linkToElement = null;
    validations = null;
    openNewRoute = null;
    incomeChart = null;
    expenseChart = null;

    // Конструктор принимает функцию `openNewRoute`, которая будет использоваться для перенаправления.
    // Проверяется наличие токена доступа: если токен отсутствует, происходит перенаправление на страницу логина.
    // Вызываются методы `findElements()` и `initCalendar()` для инициализации элементов управления и календарей.
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.openNewRoute = openNewRoute;
        Chart.register(PieController, ArcElement, Legend, Colors, Tooltip);

        this.findElements();
        this.initCalendar();
        this.initPie();
        this.validations = [
            {element: this.calendarFromElement},
            {element: this.calendarToElement}
        ];

        this.getOperations({period: 'today'}).then();
        this.initFilter();
    }

    // Метод инициализирует ссылки на важные элементы в интерфейсе, включая календари и кнопки.
    findElements() {
        this.calendarFromElement = document.getElementById("calendar-from");
        this.linkFromElement = document.getElementById('from');
        this.calendarToElement = document.getElementById("calendar-to");
        this.linkToElement = document.getElementById('to');
    }

    // Инициализирует первый и второй календари для выбора даты.
    // Устанавливает обработчики событий для открытия и изменения значений в календаре.
    // Устанавливает минимальную дату календаря и загружает операции, если валидация проходит.
    initCalendar() {
        $(this.calendarFromElement).datetimepicker({
            format: 'L',
            locale: 'ru',
            useCurrent: false
        });

        this.linkFromElement.addEventListener('click', () => {
            $(this.calendarFromElement).datetimepicker('toggle');
        });

        $(this.calendarFromElement).on("change.datetimepicker", (e) => {
            this.linkFromElement.innerText = moment(e.date).format('DD-MM-YYYY');
            $(this.calendarFromElement).datetimepicker('hide');
            $(this.calendarToElement).datetimepicker('minDate', e.date);
            if (ValidationUtils.validateForm(this.validations)) {
                this.getOperations({
                    period: "interval",
                    dateFrom: this.calendarFromElement.value,
                    dateTo: this.calendarToElement.value
                }).then();
            }
        });

        $(this.calendarToElement).datetimepicker({
            format: 'L',
            locale: 'ru',
            useCurrent: false
        });

        this.linkToElement.addEventListener('click', () => {
            $(this.calendarToElement).datetimepicker('toggle');
        })

        $(this.calendarToElement).on("change.datetimepicker", (e) => {
            this.linkToElement.innerText = moment(e.date).format('DD-MM-YYYY');
            $(this.calendarToElement).datetimepicker('hide');
            $(this.calendarFromElement).datetimepicker('maxDate', e.date);
            if (ValidationUtils.validateForm(this.validations)) {
                this.getOperations({
                    period: "interval",
                    dateFrom: this.calendarFromElement.value,
                    dateTo: this.calendarToElement.value
                }).then();
            }
        });
    }

    initPie() {
        this.incomeChart = new Chart(document.getElementById('income-chart'), {
            type: 'pie',
            data: {
                labels: [
                    'Нет данных',
                ],
                datasets: [{
                    data: [1],
                    hoverOffset: 1
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        padding: 15
                    },
                    colors: {
                        forceOverride: true
                    }
                }
            }
        });

        this.expenseChart = new Chart(document.getElementById('expense-chart'), {
            type: 'pie',
            data: {
                labels: [
                    'Нет данных',
                ],
                datasets: [{
                    data: [1],
                    hoverOffset: 1
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        padding: 15
                    },
                    colors: {
                        forceOverride: true
                    }
                }
            }
        });
    }

    // Инициализирует фильтр операций. Кнопки для перехода к календарям отключаются по умолчанию.
    // Добавляет обработчики событий для радиокнопок, которые управляют доступностью календарей
    // в зависимости от выбранного фильтра.
    // Если выбран интервал, максимальные и минимальные даты устанавливаются соответственно,
    // и загружаются операции в выбранном диапазоне дат. Если выбран другой фильтр,
    // календари скрываются.
    initFilter() {
        this.linkFromElement.disabled = true;
        this.linkToElement.disabled = true;

        document.querySelectorAll('input[type="radio"][name="filter"]').forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.checked && radio.id === 'interval') {
                    this.linkFromElement.disabled = false;
                    this.linkToElement.disabled = false;

                    if (ValidationUtils.validateForm(this.validations)) {
                        console.log(this.calendarToElement.value);
                        this.getOperations({
                            period: radio.id,
                            dateFrom: this.calendarFromElement.value,
                            dateTo: this.calendarToElement.value
                        }).then();
                    }
                } else {
                    $(this.calendarFromElement).datetimepicker('hide');
                    $(this.calendarToElement).datetimepicker('hide');
                    this.linkFromElement.disabled = true;
                    this.linkToElement.disabled = true;
                    this.getOperations({period: radio.id}).then();
                }
            });
        });
    }

    // Этот метод отправляет запрос на получение операций через `OperationsService`.
    // Если возникает ошибка, пользователь видит сообщение об ошибке.
    // В случае успешного получения данных вызывается метод `showOperations`,
    // который отображает операции на странице.
    async getOperations(params) {
        const response = await OperationsService.getOperations(params);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.showOperations(response.operations);
    }

    // Этот метод разделяет операции на доходные и расходные, загружая соответствующие данные для каждого графика.
    // С помощью метода `updateChart` обновляются данные для пироговых диаграмм (или других графиков).
    showOperations(operations) {
        const incomeData = operations.filter(op => op.type === 'income');
        const expenseData = operations.filter(op => op.type === 'expense');

        this.updateChart(incomeData, this.incomeChart);
        this.updateChart(expenseData, this.expenseChart);
    }

    // Заполняет массивы `categories` и `amount` на основе переданных данных.
    // Удаляет дубликаты из массива `categories`.
    // Обновляет данные по меткам и значениям графиков.
    // Метод `element.update()` обновляет график на странице.
    updateChart(data, element) {
        if (data.length > 0) {
            let categories = [];
            let amount = [];

            for (let i = 0; i < data.length; i++) {
                categories.push(data[i].category);
            }
            categories = categories.filter((item, i, ar) => ar.indexOf(item) === i);

            element.data.labels = categories;

            for (let i = 0; i < categories.length; i++) {
                const sum = data.filter(item => item.category === categories[i]).map(item => item.amount).reduce((acc, item) => acc + item);
                amount.push(sum);
            }

            element.data.datasets[0].data = amount;
            element.update();
        }
    }
}