import { ApiUrlFlags } from '@ProjectModels/api-url-flags';
import { WebApiPostControl, WebApiPostControlRaw, WebApiPostControlResponse } from '../web-api-post-control';
import { User } from '@ProjectModels/user.model';
import { Sirket } from '@ProjectModels/sirket.model';
import { RegBirey } from '@ProjectModels/reg-birey.model';
import { RegTuzel } from '@ProjectModels/reg-tuzel.model';
import { AuthVerification } from '@Models/auth-verification.model';
import { Injectable } from '@angular/core';
import { EndpointFactory } from '@Services/endpoint-factory.service';
import { ContentTypeFlags } from '@ProjectModels/content-type-flags';
import { PresetHttpOption } from '../preset-http-option';
import { WebApiGetControl } from '../web-api-get-control';
import { Bildirim } from '@ProjectModels/bildirim.model';
import { IJwtTokenResponse } from '@Models/login-response.model';
import { ResponseContentType } from '@angular/http';

@Injectable({
    providedIn: 'root'
})
export class AuthApi {

    constructor(private endpoint: EndpointFactory) { }

    Login_POST = new WebApiPostControlRaw<FormData>(this.endpoint, ApiUrlFlags.AuthController + '/login');

    RefreshToken_POST = new WebApiPostControl<IJwtTokenResponse, FormData>(this.endpoint, ApiUrlFlags.AuthController + '/refresh-token', PresetHttpOption.Empty);
    RevokeToken_POST = new WebApiPostControl<{ message: string }, FormData>(this.endpoint, ApiUrlFlags.AuthController + '/revoke-token', PresetHttpOption.Empty);

    ForgotPassword_POST = new WebApiPostControlRaw<FormData>(this.endpoint, ApiUrlFlags.AuthController + '/forgot-password', PresetHttpOption.RawText);
    ResetPassword_POST = new WebApiPostControlRaw<FormData>(this.endpoint, ApiUrlFlags.AuthController + '/reset-password', PresetHttpOption.RawText);
    PasswordChange_POST = new WebApiPostControl<boolean, FormData>(this.endpoint, ApiUrlFlags.AuthController + '/passwordchange', PresetHttpOption.Empty);

    Verification_POST = new WebApiPostControl<number, FormData>(this.endpoint, ApiUrlFlags.AuthController + '/verification');

    Register_POST = new WebApiPostControlRaw<FormData>(this.endpoint, ApiUrlFlags.AuthController + '/Register');

}
