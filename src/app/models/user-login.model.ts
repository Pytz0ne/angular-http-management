export class UserLogin {
    constructor(registerNo?: string, password?: string, rememberMe?: boolean) {
        this.registerno = registerNo;
        this.password = password;
        this.rememberMe = rememberMe;
    }

    registerno: string;
    password: string;
    rememberMe: boolean;
}
