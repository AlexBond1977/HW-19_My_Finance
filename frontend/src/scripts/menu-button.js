const menuOpenButtonElement = document.getElementById('menu-icon');
const menuCloseButtonElement = document.getElementById('menu-close');
const menuElement = document.getElementById('menu');
const overlayElement = document.getElementById('content-layout');

menuOpenButtonElement.addEventListener('click', function () {
    menuElement.classList.add('menu_open');
});

menuCloseButtonElement.addEventListener('click', function (e) {
    menuElement.classList.remove('menu_open');
});

overlayElement.addEventListener('click', function (e) {
    if (menuElement.classList.contains('menu_open')) {
        menuElement.classList.remove('menu_open');
    }
});
