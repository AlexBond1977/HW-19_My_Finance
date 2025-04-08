// Класс `CommonUtils` предоставляет утилитарные функции, которые могут использоваться
// в разных частях приложения.
export class CommonUtils {
    // Метод - **`activateLink`** предназначен для изменения стилей элемента навигации, чтобы визуально обозначить, что он активен.
    // - **Добавление и удаление CSS классов**:
    //   - `element.classList.add('active')`: добавляет класс `active`, что ссылка активна или выбрана.
    //   - `element.classList.add('text-white')`: добавляет класс, изменяющий цвет текста на белый.
    //   - `element.classList.remove('text-primary-emphasis')`: удаляет класс, который, предписывает другой цвет текста.
    static activateLink(element) {
        element.classList.add('active');
        element.classList.add('text-white');
        element.classList.remove('text-primary-emphasis');

        const svg = element.querySelector('svg path');
        if (svg) {
            svg.style.fill = '#fff';
        }
    }

    // Метод  **`unactivateLink`** предназначен для изменения стилей элемента навигации,
    // чтобы визуально обозначить, что он неактивен.
    // - **Удаление и добавление CSS классов**:
    //   - `element.classList.remove('text-white')`: удаляет класс, который выставлял текст белым.
    //   - `if (!element.classList.contains('sub-category'))`: если элемент не является
    //   подкатегорией, то добавляется класс `text-primary-emphasis`, который задает
    //   изначальный цвет текста (например, синий).
    static unactivateLink(element) {
        element.classList.remove('text-white');
        if (!element.classList.contains('sub-category')) {
            element.classList.add('text-primary-emphasis');
        }

        const svg = element.querySelector('svg path');
        if (svg) {
            svg.style.fill = '#052C65';
        }

        element.classList.remove('active');
    }
}