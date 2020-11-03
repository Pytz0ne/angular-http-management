import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpEventType, HttpErrorResponse, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, Subject, throwError, of } from 'rxjs';
import { ConfigurationService } from './configuration.service';
import { LocalStoreManager } from './local-store-manager.service';
import { DBkeys } from './db-keys';
import { ContentTypeFlags } from '@ProjectModels/content-type-flags';
import { Http, Response, RequestOptions, RequestOptionsArgs, BaseRequestOptions, RequestMethod, URLSearchParams, Headers, ResponseContentType, ResponseOptions } from '@angular/http';
import { request } from 'http';
import { PresetHttpOption } from '@Project/services/preset-http-option';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { catchError, retry, switchMap } from 'rxjs/operators';

export class FormDataVal {
  data: { key: string, val: any }[] = [];
}

@Injectable()
export class EndpointFactory {
  static readonly apiVersion: string = "1";

  private get AccessToken(): string { return this.localStorage.getDataObject<string>(DBkeys.ACCESS_TOKEN); }
  _opts: any;

  public UrlCombiner(address: string): string {
    return this.configurations.baseUrl + address;
  }



  constructor(public httpClient: HttpClient,
    public http: Http,
    protected configurations: ConfigurationService,
    private localStorage: LocalStoreManager) {
  }

  HeaderReconfigure(headers: HttpHeaders | Headers): HttpHeaders | Headers {
    let token = this.AccessToken;
    if (token)
      headers.append('authorization', 'bearer ' + token);

    return headers;
  }

  public AssignTokenRaw(options: RequestOptionsArgs): RequestOptionsArgs {
    let token = this.AccessToken;
    if (token)
      if (options.headers) {
        options.headers.set('authorization', 'bearer ' + token);
      }
      else
        options.headers = new Headers({ 'authorization': 'bearer ' + token });
    return options;
  }

  public AssignTokenClient(options: { headers?: HttpHeaders }): {
    headers?: HttpHeaders;
    observe?: "body";
    params?: HttpParams;// | { [param: string]: string | string[]; };
    reportProgress?: boolean;
    responseType?: "json";
    withCredentials?: boolean;
  } {
    let token = this.AccessToken;
    if (token)
      options.headers = options.headers.set('authorization', 'bearer ' + token);
    return options;
  }
  // private this.AssignToken(options:any)

  get GetHttpClient() {
    return this.httpClient;
  }

  UrlParse(url: string) {
    return this.UrlCombiner(url);
  }

  GetGenericEPHttpClient<T>(url: string, options = PresetHttpOption.ClientJson(), useretry: boolean = true): Observable<T> {
    return this.httpClient.get<T>(this.UrlCombiner(url), this.AssignTokenClient(options))
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  GetGenericEPHttp(url: string, options: RequestOptions, b = false, useretry = true): Observable<Response> {
    return this.http.get(b ? url : this.UrlCombiner(url), this.AssignTokenRaw(options))
      .pipe(
        retry(useretry ? 1 : 0)
      );
  }


  RequestGenericEPHttpClient<T>(request: HttpRequest<any>, useretry = false): Observable<HttpEvent<T>> {

    request.headers.append('authentication', this.AccessToken);

    return this.httpClient.request<T>(request)
      .pipe(
        retry(useretry ? 1 : 0)
      );
  }

  RequestGenericEPHttp(url: string, options: RequestOptionsArgs, useretry = true): Observable<Response> {

    return this.http.request(this.UrlCombiner(url), this.AssignTokenRaw(options))
      .pipe(
        retry(useretry ? 1 : 0)
      );
  }


  PostGenericEPHttpClient<T>(url: string, data, options = PresetHttpOption.ClientJson()): Observable<T> {
    return this.httpClient.post<T>(this.UrlCombiner(url), data, this.AssignTokenClient(options))
      .pipe(
        catchError(this.handleError)
      );
  }

  PostGenericEPHttp(url: string, data, requestOptions: RequestOptionsArgs): Observable<Response> {
    requestOptions
    return this.http.post(this.UrlCombiner(url), data, this.AssignTokenRaw(requestOptions))
      .pipe(
        catchError(this.handleError)
      );
  }


  PutGenericEPHttpClient<T>(url: string, body: any, options = PresetHttpOption.Empty): Observable<T> {
    return this.httpClient.put<T>(this.UrlCombiner(url), body, this.AssignTokenClient(options))
      .pipe(
        catchError(this.handleError)
      );
  }
  PutGenericEPHttp(url: string, jsonData, options = PresetHttpOption.Raw()): Observable<Response> {
    return this.http.put(this.UrlCombiner(url), jsonData, this.AssignTokenRaw(options));
  }

  DeleteGenericEPHttpClient<T>(url: string, options = PresetHttpOption.ClientJson()): Observable<T> {
    return this.httpClient.delete<T>(this.UrlCombiner(url), this.AssignTokenClient(options));
  }
  DeleteGenericEPHttp(url: string, options = PresetHttpOption.RawClientJson()): Observable<Response> {
    return this.http.delete(this.UrlCombiner(url), this.AssignTokenRaw(options));
  }

  handleError(error) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    }
    else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage, '--ERROR--');
    return throwError(error);
  }

}
