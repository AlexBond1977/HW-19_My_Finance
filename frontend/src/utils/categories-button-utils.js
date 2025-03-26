export class CategoriesButtonUtils {
    static toggleCategoriesButton(route) {
        const categoriesToggleButtonElement = document.getElementById('categories-toggle-button');

        if (route.route === '/finances/create' || route.route === '/finances/edit') {
            console.log('Edit');
            document.getElementById('finances-link').classList.remove('active');
            document.getElementById('income-link').classList.add('active');
        }

        if (route.title === 'Главная' || route.title === 'Доходы и расходы') {
            categoriesToggleButtonElement.classList.add('collapsed');
            categoriesToggleButtonElement.removeAttribute('aria-expanded');
            document.getElementById('panelsStayOpen-collapseOne').classList.remove('show');
            document.getElementById('accordion-item').classList.remove('accordion-active');
        } else {
            categoriesToggleButtonElement.classList.remove('collapsed');
            categoriesToggleButtonElement.setAttribute('aria-expanded', 'true');
            document.getElementById('panelsStayOpen-collapseOne').classList.add('show');
            document.getElementById('accordion-item').classList.add('accordion-active');
        }
    }
}
