// Класс `ValidationUtils` предназначен для валидации данных, вводимых пользователем.
// Он включает в себя методы, которые помогают проверять, корректно ли заполнены поля формы.
export class ValidationUtils {
    // Статический метод, который принимает массив объектов `validations`, каждый из которых
    // должен содержать элемент и параметры для валидации.
    // Переменная `isValid` инициализируется значением `true`, чтобы отслеживать,
    // является ли форма валидной.
    // Метод проходит по каждому элементу в массиве `validations` и вызывает метод `validateField`,
    // передавая текущий элемент и его параметры.
    // Если хотя бы одно поле не проходит валидацию (т.е. `validateField` возвращает `false`),
    // переменная `isValid` устанавливается в `false`.
    // В конце метод возвращает `isValid`, индицируя корректность всей формы.
    static validateForm(validations) {
        let isValid = true;

        for (let i = 0; i < validations.length; i++) {
            if (!this.validateField(validations[i].element, validations[i].options)) {
                isValid = false;
            }
        }

        return isValid;
    }

    // Статический метод, который проверяет, является ли указанное поле валидным на основе его значения
    // и заданных параметров. Переменная `condition` инициализируется значением поля ввода.
    static validateField(element, options) {
        let condition = element.value;
        // Если переданы параметры валидации (`options`):
        // Если объект содержит свойство `pattern`, производится проверка значения поля
        // на соответствие регулярному выражению.
        // Если объект содержит свойство `compareTo`, проверяется, совпадает ли
        // значение данного поля с указанным значением (например, для проверки второго поля пароля).
        if (options) {
            if (options.hasOwnProperty('pattern')) {
                condition = element.value && element.value.match(options.pattern);
            } else if (options.hasOwnProperty('compareTo')) {
                condition = element.value && element.value === options.compareTo;
            }
        }

        if (condition) {
            element.classList.remove('is-invalid');
            return true;
        }

        element.classList.add('is-invalid');
        return false;
    }
}