import {HttpUtils} from "../utils/http-utils";

export class AuthService {
    static async logIn(data) {
        const result = await HttpUtils.request('/login', 'POST', false, data);

        if (result.error || !result.response || (result.response && (!result.response.tokens.accessToken || !result.response.tokens.refreshToken || !result.response.user.id || !result.response.user.name || !result.response.user.lastName))) {
            return false;
        }

        return result.response;
    }

    static async signUp(data) {
        const result = await HttpUtils.request('/signup', 'POST', false, data);

        if (result.error || !result.response || (result.response && (!result.response.user.id || !result.response.user.name || !result.response.user.lastName || !result.response.user.email))) {
            return false;
        }

        return result.response;
    }

    static async logout(data) {
        await HttpUtils.request('/logout', 'POST', false, data);
    }
}