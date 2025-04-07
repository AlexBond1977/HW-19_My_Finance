export class CommonUtils {
    static activateLink(element) {
        element.classList.add('active');
        element.classList.add('text-white');
        element.classList.remove('text-primary-emphasis');

        const svg = element.querySelector('svg path');
        if (svg) {
            svg.style.fill = '#fff';
        }
    }

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