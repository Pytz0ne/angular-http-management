import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { Observable, Subject, of, throwError, empty, Subscriber } from 'rxjs';
import { catchError, tap, map, mergeMap, switchMap, finalize } from 'rxjs/operators';

import { LocalStoreManager } from './local-store-manager.service';
import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import { DBkeys } from './db-keys';
import { JwtHelper } from './jwt-helper';
import { Utilities } from './utilities';
import { IdToken, IdToken2, AccessToken, IJwtTokenResponse } from '../models/login-response.model';
import { Permission, PermissionNames, PermissionValues } from '../models/permission.model';
import { WebapiService } from '@Project/services/webapi-service';
import { HttpHeaders, HttpParams, HttpEvent } from '@angular/common/http';
import { Response } from '@angular/http';
import { User } from '@Models/user.model';

@Injectable()
export class AuthService {


  public get loginUrl() { return this.configurations.loginUrl; }
  public get homeUrl() { return this.configurations.homeUrl; }

  public loginRedirectUrl: string;
  public logoutRedirectUrl: string;

  public reLoginDelegate: () => void;

  private previousIsLoggedInCheck = false;
  private _loginStatus = new Subject<boolean>();


  constructor(private router: Router,
    private configurations: ConfigurationService,
    private endPointFactory: EndpointFactory,
    private webapi: WebapiService,
    private localStorage: LocalStoreManager) {
    webapi.ErrorEvent.subscribe(s => {
      this.handleError(s, () => { return new Observable() })
        .subscribe();
    }
    );
    this.initializeLoginStatus();
  }


  private initializeLoginStatus() {
    this.localStorage.getInitEvent().subscribe(() => {
      this.reevaluateLoginStatus();
    });
  }


  gotoPage(page: string, preserveParams = true) {

    let navigationExtras: NavigationExtras = {
      queryParamsHandling: preserveParams ? "merge" : "", preserveFragment: preserveParams
    };


    this.router.navigate([page], navigationExtras);
  }


  redirectLoginUser() {
    let redirect = this.loginRedirectUrl && this.loginRedirectUrl != '/' && this.loginRedirectUrl != ConfigurationService.defaultHomeUrl ? this.loginRedirectUrl : this.homeUrl;
    this.loginRedirectUrl = null;


    let urlParamsAndFragment = Utilities.splitInTwo(redirect, '#');
    let urlAndParams = Utilities.splitInTwo(urlParamsAndFragment.firstPart, '?');

    let navigationExtras: NavigationExtras = {
      fragment: urlParamsAndFragment.secondPart,
      queryParams: Utilities.getQueryParamsFromString(urlAndParams.secondPart),
      queryParamsHandling: "merge"
    };

    this.router.navigate([urlAndParams.firstPart], navigationExtras);
  }


  redirectLogoutUser() {
    let redirect = this.logoutRedirectUrl ? this.logoutRedirectUrl : this.loginUrl;
    this.logoutRedirectUrl = null;

    // this.router.navigate([redirect]);
  }


  redirectForLogin() {
    this.loginRedirectUrl = this.router.url;

    this.logout();
  }


  reLogin() {

    this.localStorage.deleteData(DBkeys.TOKEN_EXPIRES_IN);

    if (this.reLoginDelegate) {
      this.reLoginDelegate();
    }
    else {
      this.redirectForLogin();
    }
  }


  refreshLogin() {
    return this.getRefreshLoginEndpoint().pipe(
      map(response => {
        this.processLoginResponse(response, this.rememberMe);
        // this.router.navigate(['/'], { skipLocationChange: false });
        // window.location.reload();
        return response;
      })
    );
  }

  Register(data: FormData): Observable<Response> {
    return this.webapi.Auth.RegisterBirey_POST.Execute(fdata);
  }

  PasswordChange(data: FormData) {
    return this.webapi.Auth.PasswordChange_POST.Execute(data);
  }

  LoginWithPassword(data: FormData, rememberMe: boolean): Observable<Response> {

    if (this.isLoggedIn)
      this.logout();

    let controller = this.webapi.Auth.Login_POST;
    let qLogin = controller.Execute(data);

    return qLogin
      .pipe(
        tap(async response => {
          this.processLoginResponse(response.json(), rememberMe);
          this.hashedPassword(data.get("password").toString());
          return response
        })
      );
  }

  ForgotPassword(email?: string, username?: string, phone?: string): Observable<Response> {
    let fdata = new FormData();
    email ? fdata.append('email', email) : undefined;
    username ? fdata.append('username', username.toString()) : undefined;
    phone ? fdata.append('eposta', phone) : undefined;

    let request = this.webapi.Auth.ForgotPassword_POST;
    return request.Execute(fdata);
  }

  ResetPassword(password: string, code: string): Observable<Response> {
    let data = new FormData();
    data.append('password', password);
    data.append('code', code);

    let request = this.webapi.Auth.ResetPassword_POST;
    return request.Execute(data);
  }

  private async ProcessLoginResponse(response: IJwtTokenResponse, rememberMe: boolean) {
    const accessToken = response.access_token;
    if (accessToken == null) {
      throw new Error('accessToken cannot be null');
    }

    const refreshToken = response.refresh_token || this.refreshToken;
    const expiresIn = new Date(response.expires_in);
    const tokenExpiryDate = new Date();
    tokenExpiryDate.setSeconds(tokenExpiryDate.getSeconds() + (Date.now()));
    const accessTokenExpiry = tokenExpiryDate;
    const jwtHelper = new JwtHelper();
    let decodedIdToken = <IdToken>jwtHelper.decodeToken(response.access_token);

    let permissions: PermissionValues[] = Array.isArray(decodedIdToken.permission) ? decodedIdToken.permission : [decodedIdToken.permission];

    if (!this.isLoggedIn) {
      this.configurations.import(decodedIdToken.configuration);
    }
    this.saveTokenDetails(permissions, accessToken, accessToken, refreshToken, accessTokenExpiry, rememberMe);
    return this.FetchSelf(rememberMe).toPromise();

  }


  private SelfSave(user: User, rememberMe?: boolean) {
    rememberMe = rememberMe ? rememberMe : this.rememberMe;

    this.saveUserDetails(user, rememberMe);
    this.reevaluateLoginStatus(user);
    // this.yetkiService.Load(user);
  }


  private hashedPassword(hashedPassword: string) {
    if (this.rememberMe)
      this.localStorage.savePermanentData(hashedPassword, DBkeys.CURRENT_USER_HASHED_PASSWORD);
    else
      this.localStorage.saveSyncedSessionData(hashedPassword, DBkeys.CURRENT_USER_HASHED_PASSWORD);
  }






  private saveUserDetails(user: User, rememberMe: boolean) {
    if (rememberMe)
      this.localStorage.savePermanentData(user, DBkeys.CURRENT_USER);
    else
      this.localStorage.saveSyncedSessionData(user, DBkeys.CURRENT_USER);

    this.localStorage.savePermanentData(rememberMe, DBkeys.REMEMBER_ME);
  }

  private saveTokenDetails(permissions: PermissionValues[], accessToken: string, idToken: string, refreshToken: string, expiresIn: Date, rememberMe: boolean) {

    if (rememberMe) {
      this.localStorage.savePermanentData(accessToken, DBkeys.ACCESS_TOKEN);
      this.localStorage.savePermanentData(idToken, DBkeys.ID_TOKEN);
      this.localStorage.savePermanentData(refreshToken, DBkeys.REFRESH_TOKEN);
      this.localStorage.savePermanentData(expiresIn, DBkeys.TOKEN_EXPIRES_IN);
      this.localStorage.savePermanentData(permissions, DBkeys.USER_PERMISSIONS);
    }
    else {
      this.localStorage.saveSyncedSessionData(accessToken, DBkeys.ACCESS_TOKEN);
      this.localStorage.saveSyncedSessionData(idToken, DBkeys.ID_TOKEN);
      this.localStorage.saveSyncedSessionData(refreshToken, DBkeys.REFRESH_TOKEN);
      this.localStorage.saveSyncedSessionData(expiresIn, DBkeys.TOKEN_EXPIRES_IN);
      this.localStorage.saveSyncedSessionData(permissions, DBkeys.USER_PERMISSIONS);
    }

    this.localStorage.savePermanentData(rememberMe, DBkeys.REMEMBER_ME);
  }


  logout(): void {

    let data = new FormData();
    data.append('token', this.localStorage.getData(DBkeys.REFRESH_TOKEN));
    this.webapi.Auth.RevokeToken_POST.Execute(data).subscribe();

    this.localStorage.deleteData(DBkeys.ACCESS_TOKEN);
    this.localStorage.deleteData(DBkeys.ID_TOKEN);
    this.localStorage.deleteData(DBkeys.REFRESH_TOKEN);
    this.localStorage.deleteData(DBkeys.TOKEN_EXPIRES_IN);
    this.localStorage.deleteData(DBkeys.USER_PERMISSIONS);
    this.localStorage.deleteData(DBkeys.CURRENT_USER);

    this.localStorage.deleteData(DBkeys.CURRENT_USER_HASHED_PASSWORD);

    this.configurations.clearLocalChanges();
    this.reevaluateLoginStatus();

    this.router.navigate([this.loginUrl]);
  }


  private reevaluateLoginStatus(currentUser?: User) {

    let user = currentUser || this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER);
    let isLoggedIn = user != null;


    if (this.previousIsLoggedInCheck != isLoggedIn) {
      setTimeout(() => {
        this._loginStatus.next(isLoggedIn);
      });
    }

    this.previousIsLoggedInCheck = isLoggedIn;
  }


  getLoginStatusEvent(): Observable<boolean> {
    return this._loginStatus.asObservable();
  }


  get currentUser(): User {

    let user = this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER);
    this.reevaluateLoginStatus(user);

    return user;
  }

  get userPermissions(): PermissionValues[] {
    return this.localStorage.getDataObject<PermissionValues[]>(DBkeys.USER_PERMISSIONS) || [];
  }

  get accessToken(): string {

    this.reevaluateLoginStatus();
    return this.localStorage.getData(DBkeys.ACCESS_TOKEN);
  }

  get accessTokenExpiryDate(): Date {

    this.reevaluateLoginStatus();
    return this.localStorage.getDataObject<Date>(DBkeys.TOKEN_EXPIRES_IN, true);
  }

  get isSessionExpired(): boolean {

    if (this.accessTokenExpiryDate == null) {
      return true;
    }

    return !(this.accessTokenExpiryDate.valueOf() > new Date().valueOf());
  }


  get idToken(): string {

    this.reevaluateLoginStatus();
    return this.localStorage.getData(DBkeys.ID_TOKEN);
  }

  get refreshToken(): string {

    this.reevaluateLoginStatus();
    return this.localStorage.getData(DBkeys.REFRESH_TOKEN);
  }

  get isLoggedIn(): boolean {
    return this.currentUser != null;
  }

  get rememberMe(): boolean {
    return this.localStorage.getDataObject<boolean>(DBkeys.REMEMBER_ME) == true;
  }





  private taskPauser: Subject<any>;
  private isRefreshingLogin: boolean = false;

  getRefreshLoginEndpoint(): Observable<IJwtTokenResponse> {

    // let header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    // let params = new HttpParams()
    //   .append('refresh_token', this.refreshToken)
    //   .append('grant_type', 'refresh_token')
    //   .append('scope', 'openid email phone profile offline_access roles');

    // let requestBody = params.toString();

    let data = new FormData();
    data.append('token', this.refreshToken);
    return this.webapi.Auth.RefreshToken_POST.Execute(data);
  }



  protected getRequestHeaders(): { headers: HttpHeaders | { [header: string]: string | string[]; } } {
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.accessToken,
      'Content-Type': 'application/json',
      'Accept': `application/vnd.iman.v${EndpointFactory.apiVersion}+json, application/json, text/plain, */*`,
      'App-Version': ConfigurationService.appVersion
    });

    return { headers: headers };
  }



  protected handleError(error, continuation: () => Observable<any> | null) {
    if (error.status == 401) {

      if (this.isRefreshingLogin) {
        return this.pauseTask(continuation);
      }

      this.isRefreshingLogin = true;
      return this.refreshLogin().pipe(
        mergeMap(data => {

          this.isRefreshingLogin = false;
          this.resumeTasks(true);

          this.router.navigate(['.'], { skipLocationChange: false });
          return continuation();
        }),
        catchError(refreshLoginError => {

          this.isRefreshingLogin = false;
          this.resumeTasks(false);

          if (refreshLoginError.status == 0 ||
            refreshLoginError.status == 401 ||
            (refreshLoginError.url && refreshLoginError.url.toLowerCase().includes(this.loginUrl.toLowerCase()))) {
            this.reLogin();
            this.router.navigate(['/']);
            return throwError('session expired');
          }
          else {
            return throwError(refreshLoginError || 'server error');
          }
        }));
    }

    if (error.url && error.url.toLowerCase().includes(this.loginUrl.toLowerCase())) {
      this.reLogin();

      return throwError((error.error && error.error.error_description) ? `session expired (${error.error.error_description})` : 'session expired');
    }
    else {
      return throwError(error);
    }
  }



  private pauseTask(continuation: () => Observable<any>) {
    if (!this.taskPauser)
      this.taskPauser = new Subject();

    return this.taskPauser.pipe(switchMap(continueOp => {
      return continueOp ? continuation() : throwError('session expired');
    }));
  }


  private resumeTasks(continueOp: boolean) {
    setTimeout(() => {
      if (this.taskPauser) {
        this.taskPauser.next(continueOp);
        this.taskPauser.complete();
        this.taskPauser = null;
      }
    });
  }
}
