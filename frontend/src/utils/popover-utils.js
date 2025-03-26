import {Popover} from "bootstrap";
import {AuthUtils} from "./auth-utils";

export class PopoverUtils {
    static initPopover() {
        const popoverBodyElement = document.getElementById('popover-body');
        document.querySelectorAll('[data-bs-toggle="popover"]')
            .forEach(popover => {
                new Popover(popover, {
                    html: true,
                    content: function () {
                        return popoverBodyElement.innerHTML;
                    }
                });
            });

        // Проверка аутентификации и обновление текста в поповере
        const logoutLink = document.getElementById('logout-link');

        // Проверка, существует ли токен
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            // Пользователь зарегистрирован, устанавливаем Logout
            logoutLink.textContent = 'Logout';
            logoutLink.href = '/logout';
        } else {
            // Пользователь не зарегистрирован, устанавливаем Login
            logoutLink.textContent = 'Login';
            logoutLink.href = '/login';
        }
    }
}
