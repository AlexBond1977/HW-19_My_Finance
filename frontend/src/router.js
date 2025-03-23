import {Login} from "./components/auth/login";
import {Signup} from "./components/auth/signup";
import {CategoriesButtonUtils} from "./utils/categories-button-utils";
import {SidebarUtils} from "./utils/sidebar-utils";
import {PopoverUtils} from "./utils/popover-utils";
import {AuthUtils} from "./utils/auth-utils";
import {Logout} from "./components/auth/logout";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.userName = null;

        this.initEvents();

        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/pages/main.html',
                useLayout: '/templates/layout.html',
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/pages/404.html',
                useLayout: false,
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('auth-page');
                    new Login(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('auth-page');
                },
            },
            {
                route: '/signup',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/signup.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('auth-page');
                    new Signup(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('auth-page');
                },
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/income/list.html',
                useLayout: '/templates/layout.html',
            },
            {
                route: '/income/create',
                title: 'Создание дохода',
                filePathTemplate: '/templates/pages/income/create.html',
                useLayout: '/templates/layout.html',
            },
            {
                route: '/income/edit',
                title: 'Редактирование дохода',
                filePathTemplate: '/templates/pages/income/edit.html',
                useLayout: '/templates/layout.html',
             },
            {
                route: '/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/expenses/list.html',
                useLayout: '/templates/layout.html',
            },
            {
                route: '/expenses/create',
                title: 'Создание расхода',
                filePathTemplate: '/templates/pages/expenses/create.html',
                useLayout: '/templates/layout.html',
            },
            {
                route: '/expenses/edit',
                title: 'Редактирование расхода',
                filePathTemplate: '/templates/pages/expenses/edit.html',
                useLayout: '/templates/layout.html',
            },
            {
                route: '/finances',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/finances/list.html',
                useLayout: '/templates/layout.html',
            },
            {
                route: '/finances/create',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/pages/finances/create.html',
                useLayout: '/templates/layout.html',
            },
            {
                route: '/finances/edit',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/pages/finances/edit.html',
                useLayout: '/templates/layout.html',
            },
        ]
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this)); // при первом открытии страницы
        window.addEventListener('popstate', this.activateRoute.bind(this)); // при переходе со страницы на страницу
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

    async clickHandler(e) {
        let element = null;

        if (e.target.nodeName === 'a') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'a') {
            element = e.target.parentNode;
        }

        if (element) {
            e.preventDefault();

            const currentRoute = window.location.pathname;

            const url = element.href.replace(window.location.origin, '');
            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }
            await this.openNewRoute(url);
        }
    }

    async activateRoute(e, oldRoute = null) {
        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute);

            if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                currentRoute.unload();
            }
        }

        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);


        if (newRoute) {
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Lumincoin FINANCE';
            }

            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentPageElement;

                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');

                    this.profileNameElement = document.getElementById('profile-name');
                    if (!this.userName) {
                        let userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoKey);
                        console.log(userInfo);
                        if (userInfo) {
                            userInfo = JSON.parse(userInfo);
                            if (userInfo.name || userInfo.lastName) {
                                this.userName = userInfo.name + " " + userInfo.lastName;
                                console.log(this.userName);
                            }
                        }
                    }
                    this.profileNameElement.innerText = this.userName;

                    this.activateMenuItem(newRoute);

                    PopoverUtils.initPopover();

                    SidebarUtils.openMenuHandler();
                    SidebarUtils.closeMenuHandler();
                }

                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            console.log('No route found');
            history.pushState({}, '', '/404');
            await this.activateRoute();
        }
    }

    activateMenuItem(route) {
        document.querySelectorAll('.sidebar .nav-link').forEach(item => {
            const href = item.getAttribute('href');

            if ((route.route.includes(href) && href !== '/' || (route.route === '/' && href === '/'))) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }

            CategoriesButtonUtils.toggleCategoriesButton(route);
        });
    }
}
