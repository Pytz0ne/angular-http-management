// 
// 
// 
// 

// import { Injectable, Injector } from '@angular/core';
// import { Observable } from 'rxjs';
// import { catchError } from 'rxjs/operators';

// import { EndpointFactory } from './endpoint-factory.service';
// import { ConfigurationService } from './configuration.service';
// import { LocalStoreManager } from './local-store-manager.service';
// import { HttpClient } from '@angular/common/http';
// import { Http } from '@angular/http';
// import { AuthApi } from '@Project/services/api/auth-api';
// import { AuthService } from './auth.service';


// @Injectable()
// export class AccountEndpoint extends AuthService {

//   private readonly _usersUrl: string = "/api/account/users";
//   private readonly _userByUserNameUrl: string = "/api/account/users/username";
//   private readonly _currentUserUrl: string = "/api/account/users/me";
//   private readonly _currentUserPreferencesUrl: string = "/api/account/users/me/preferences";
//   private readonly _unblockUserUrl: string = "/api/account/users/unblock";
//   private readonly _rolesUrl: string = "/api/account/roles";
//   private readonly _roleByRoleNameUrl: string = "/api/account/roles/name";
//   private readonly _permissionsUrl: string = "/api/account/permissions";

//   get usersUrl() { return this.configurations.baseUrl + this._usersUrl; }
//   get userByUserNameUrl() { return this.configurations.baseUrl + this._userByUserNameUrl; }
//   get currentUserUrl() { return this.configurations.baseUrl + this._currentUserUrl; }
//   get currentUserPreferencesUrl() { return this.configurations.baseUrl + this._currentUserPreferencesUrl; }
//   get unblockUserUrl() { return this.configurations.baseUrl + this._unblockUserUrl; }
//   get rolesUrl() { return this.configurations.baseUrl + this._rolesUrl; }
//   get roleByRoleNameUrl() { return this.configurations.baseUrl + this._roleByRoleNameUrl; }
//   get permissionsUrl() { return this.configurations.baseUrl + this._permissionsUrl; }



//   constructor(router, EPFact: EndpointFactory, configurations: ConfigurationService, injector: Injector) {
//     super(router, configurations, EPFact, null, null);
//     this.EPFact = EPFact;
//     this.configurations = configurations;
//   }
//   configurations: ConfigurationService;
//   EPFact: EndpointFactory;



//   getUserEndpoint<T>(userId?: string): Observable<T> {
//     let endpointUrl = userId ? `${this.UsersUrl}/${userId}` : this.currentUserUrl;

//     let opts = PresetHttpOption.ClientJson();
//     // opts.headers.append(this.getRequestHeaders());
//     return this.EPFact.GetGenericEPHttpClient<T>(endpointUrl).pipe<T>(
//       catchError(error => {
//         return this.handleError(error, () => this.getUserEndpoint(userId));
//       }));
//   }


//   getUserByUserNameEndpoint<T>(userName: string): Observable<T> {
//     let endpointUrl = `${this.UserByUserNameUrl}/${userName}`;
//     // this.getRequestHeaders()
//     return this.EPFact.GetGenericEPHttpClient<T>(endpointUrl).pipe<T>(
//       catchError(error => {
//         return this.handleError(error, () => this.getUserByUserNameEndpoint(userName));
//       }));
//   }


//   getUserEndpoint<T>(page?: number, pageSize?: number): Observable<T> {
//     let endpointUrl = page && pageSize ? `${this.UsersUrl}/${page}/${pageSize}` : this.UsersUrl;
//     // , this.getRequestHeaders()
//     return this.EPFact.GetGenericEPHttpClient<T>(endpointUrl).pipe<T>(
//       catchError(error => {
//         return this.handleError(error, () => this.getUserEndpoint(page, pageSize));
//       }));
//   }


//   getNewUserEndpoint<T>(userObject: any): Observable<T> {

//     return this.EPFact.PostGenericEPHttpClient<T>(this.UsersUrl, JSON.stringify(userObject), this.getRequestHeaders()).pipe<T>(
//       catchError(error => {
//         return this.handleError(error, () => this.getNewUserEndpoint(userObject));
//       }));
//   }

//   getUpdateUserEndpoint<T>(userObject: any, userId?: string): Observable<T> {
//     let endpointUrl = userId ? `${this.UsersUrl}/${userId}` : this.currentUserUrl;

//     return this.EPFact.PutGenericEPHttpClient<T>(endpointUrl, JSON.stringify(userObject), this.getRequestHeaders()).pipe<T>(
//       catchError(error => {
//         return this.handleError(error, () => this.getUpdateUserEndpoint(userObject, userId));
//       }));
//   }

//   getPatchUpdateUserEndpoint<T>(patch: {}, userId?: string): Observable<T>
//   getPatchUpdateUserEndpoint<T>(value: any, op: string, path: string, from?: any, userId?: string): Observable<T>
//   getPatchUpdateUserEndpoint<T>(valueOrPatch: any, opOrUserId?: string, path?: string, from?: any, userId?: string): Observable<T> {
//     let endpointUrl: string;
//     let patchDocument: {};

//     if (path) {
//       endpointUrl = userId ? `${this.UsersUrl}/${userId}` : this.currentUserUrl;
//       patchDocument = from ?
//         [{ "value": valueOrPatch, "path": path, "op": opOrUserId, "from": from }] :
//         [{ "value": valueOrPatch, "path": path, "op": opOrUserId }];
//     }
//     else {
//       endpointUrl = opOrUserId ? `${this.UsersUrl}/${opOrUserId}` : this.currentUserUrl;
//       patchDocument = valueOrPatch;
//     }

//     // return this.EPFact.PatchGenericEPHttpClient<T>(endpointUrl, JSON.stringify(patchDocument), this.getRequestHeaders()).pipe<T>(
//     //   catchError(error => {
//     //     return this.handleError(error, () => this.getPatchUpdateUserEndpoint(valueOrPatch, opOrUserId, path, from, userId));
//     //   }));
//     return null
//   }


//   getUserPreferencesEndpoint<T>(): Observable<T> {
//     // , this.getRequestHeaders()
//     return this.EPFact.GetGenericEPHttpClient<T>(this.currentUserPreferencesUrl).pipe<T>(
//       catchError(error => {
//         return this.handleError(error, () => this.getUserPreferencesEndpoint());
//       }));
//   }

//   getUpdateUserPreferencesEndpoint<T>(configuration: string): Observable<T> {
//     return this.EPFact.PutGenericEPHttpClient<T>(this.currentUserPreferencesUrl, JSON.stringify(configuration), this.getRequestHeaders()).pipe<T>(
//       catchError(error => {
//         return this.handleError(error, () => this.getUpdateUserPreferencesEndpoint(configuration));
//       }));
//   }

//   getUnblockUserEndpoint<T>(userId: string): Observable<T> {
//     let endpointUrl = `${this.unblockUserUrl}/${userId}`;

//     return this.EPFact.PutGenericEPHttpClient<T>(endpointUrl, null, this.getRequestHeaders()).pipe<T>(
//       catchError(error => {
//         return this.handleError(error, () => this.getUnblockUserEndpoint(userId));
//       }));
//   }

//   getDeleteUserEndpoint<T>(userId: string): Observable<T> {
//     let endpointUrl = `${this.UsersUrl}/${userId}`;

//     return this.EPFact.DeleteGenericEPHttpClient<T>(endpointUrl, this.getRequestHeaders()).pipe<T>(
//       catchError(error => {
//         return this.handleError(error, () => this.getDeleteUserEndpoint(userId));
//       }));
//   }





//   getRoleEndpoint<T>(roleId: string): Observable<T> {
//     let endpointUrl = `${this.RolesUrl}/${roleId}`;
//     // , this.getRequestHeaders()
//     return this.EPFact.GetGenericEPHttpClient<T>(endpointUrl).pipe<T>(
//       catchError(error => {
//         return this.handleError(error, () => this.getRoleEndpoint(roleId));
//       }));
//   }


//   getRoleByRoleNameEndpoint<T>(roleName: string): Observable<T> {
//     let endpointUrl = `${this.roleByRoleNameUrl}/${roleName}`;
//     // , this.getRequestHeaders()
//     return this.EPFact.GetGenericEPHttpClient<T>(endpointUrl).pipe<T>(
//       catchError(error => {
//         return this.handleError(error, () => this.getRoleByRoleNameEndpoint(roleName));
//       }));
//   }



//   getRolesEndpoint<T>(page?: number, pageSize?: number): Observable<T> {
//     let endpointUrl = page && pageSize ? `${this.RolesUrl}/${page}/${pageSize}` : this.RolesUrl;
//     // , this.getRequestHeaders()
//     return this.EPFact.GetGenericEPHttpClient<T>(endpointUrl).pipe<T>(
//       catchError(error => {
//         return this.handleError(error, () => this.getRolesEndpoint(page, pageSize));
//       }));
//   }

//   getNewRoleEndpoint<T>(roleObject: any): Observable<T> {

//     return this.EPFact.PostGenericEPHttpClient<T>(this.RolesUrl, JSON.stringify(roleObject), this.getRequestHeaders()).pipe<T>(
//       catchError(error => {
//         return this.handleError(error, () => this.getNewRoleEndpoint(roleObject));
//       }));
//   }

//   getUpdateRoleEndpoint<T>(roleObject: any, roleId: string): Observable<T> {
//     let endpointUrl = `${this.RolesUrl}/${roleId}`;

//     return this.EPFact.PutGenericEPHttpClient<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders()).pipe<T>(
//       catchError(error => {
//         return this.handleError(error, () => this.getUpdateRoleEndpoint(roleObject, roleId));
//       }));
//   }

//   getDeleteRoleEndpoint<T>(roleId: string): Observable<T> {
//     let endpointUrl = `${this.RolesUrl}/${roleId}`;

//     return this.EPFact.DeleteGenericEPHttpClient<T>(endpointUrl, this.getRequestHeaders()).pipe<T>(
//       catchError(error => {
//         return this.handleError(error, () => this.getDeleteRoleEndpoint(roleId));
//       }));
//   }


//   getPermissionsEndpoint<T>(): Observable<T> {
//     // , this.getRequestHeaders()
//     return this.EPFact.GetGenericEPHttpClient<T>(this.permissionsUrl).pipe<T>(
//       catchError(error => {
//         return this.handleError(error, () => this.getPermissionsEndpoint());
//       }));
//   }
// }
