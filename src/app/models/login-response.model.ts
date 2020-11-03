import { PermissionValues } from './permission.model';
import { User } from '../yapi-isleri/models/user.model';
import { ResultFlags } from './result-flags.enum';

export class UserDataContainer {
    user: User;
    token: string;
}
export interface IJwtTokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: string;
}
// export interface ILoginResponse extends IJwtTokenResponse {

//     access_token: string;
//     refresh_token: string;
//     expires_in: string;
//     // token_type: string;

//     user: User;

//     //access_token: string;
//     //id_token: string;
//     //refresh_token: string;
//     //expires_in: number;

//     // success: boolean;
//     // data: User;
//     // token: string;
// }
// export interface IRegisterResponse extends IAuthResponse {
//     user: User
// }

export interface IdToken {
    sub: string;
    name: string;
    fullname: string;
    jobtitle: string;
    email: string;
    phone: string;
    role: string | string[];
    permission: PermissionValues | PermissionValues[];
    configuration: string;
}


export interface IdToken2 {
    sub: string;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface AccessToken {
    nbf: number;
    exp: number;
    iss: string;
    aud: string | string[];
    client_id: string;
    sub: string;
    auth_time: number;
    idp: string;
    role: string | string[];
    permission: PermissionValues | PermissionValues[];
    name: string;
    email: string;
    phone_number: string;
    fullname: string;
    jobtitle: string;
    configuration: string;
    scope: string | string[];
    amr: string[];
}