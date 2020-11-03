import { EndpointFactory } from '@Services/endpoint-factory.service';
import { IHttpParameterGen } from './api/ihttp-parameter-gen';
import { Observable, of, throwError, timer, Subscriber } from 'rxjs';
import { HttpHeaders, HttpParams, HttpErrorResponse, HttpRequest, HttpEvent } from '@angular/common/http';
import { Response, URLSearchParams, RequestOptions, RequestOptionsArgs, RequestMethod } from '@angular/http';
import { PresetHttpOption } from './preset-http-option';
import { catchError, map, debounceTime, debounce, concatMap, delay, switchMap, timeoutWith, timeout, tap } from 'rxjs/operators';
import { EventEmitter } from '@angular/core';

export class WebApiGetControl<T> {
    constructor(
        private endpoint: EndpointFactory,
        url: string,
        options = PresetHttpOption.Empty
    ) {
        this.url = url;
        this.options = options;
    }
    public ErrorEvent: EventEmitter<any> = new EventEmitter<any>();

    private _oCurrent: Observable<T>;
    private _current: Promise<T>;
    public get Current(): Promise<T> {
        if (this._current)
            return this._current;
        else if (this._oCurrent)
            return this._current = this._oCurrent.toPromise();
        else null;
    }

    private url: string;
    public get Url() {
        return this.url;
    }

    public options: {
        headers?: HttpHeaders;
        observe?: "body";
        params?: HttpParams;
        reportProgress?: boolean;
        responseType?: "json";
        withCredentials?: boolean;
    };

    public Latest(query?: IHttpParameterGen, param?: IHttpParameterGen): Observable<T> {
        let httpParam = query ? query : null;
        (httpParam && param) ? httpParam.Combine(param) : param ? httpParam = param : null;

        httpParam ? (this.options.params = httpParam.GetHttpParams()) : null;
        return this._oCurrent = this.endpoint.GetGenericEPHttpClient<T>(this.url, this.options)
            .pipe(
                catchError(err => {
                    this.ErrorEvent.emit(err);

                    this._current = null;
                    if (err.status == 429)
                        try {
                            return timer(JSON.parse(err.error).seconds * 1000).pipe(
                                switchMap(() => this.Latest(param))
                            );
                        }
                        catch (subErr) {
                            return of(err);
                        }

                    else if (err.status == 0) {
                        throw new Error("Kritik Hata!");
                    }
                    return throwError(err);
                })
            );
    }

    public LatestGuard(query?: IHttpParameterGen, param?: IHttpParameterGen): Observable<HttpEvent<T>> {
        let httpParam = query ? query : null;
        (httpParam && param) ? httpParam.Combine(param) : param ? httpParam = param : null;

        param ? (this.options.params = param.GetHttpParams()) : false;
        let request = new HttpRequest<T>('GET', this.url, this.options);

        return this.endpoint.RequestGenericEPHttpClient<T>(request, false)
            .pipe(
                catchError(err => {

                    event
                    this._current = null;
                    if (err.status == 429)
                        try {
                            return timer(JSON.parse(err.error).seconds * 1000).pipe(
                                switchMap(() =>
                                    this.Latest(param)
                                )
                            );
                        }
                        catch (subErr) {
                            return of(err);
                        }
                    return throwError(err);
                })
            );
    }

    public CurrentOrLatest(param?: IHttpParameterGen): Promise<T> {
        if (this._current)
            if (param) {


                if (this.options.params == param.GetHttpParams())
                    return this.Current;
            }

        return this._current = this.Latest(param).toPromise();
    }

}

export class WebApiGetControlRaw {
    constructor(
        private endpoint: EndpointFactory,
        url: string,
        options?: RequestOptions) {
        this.url = url;
        this.options = options;
    }

    private _current: Promise<Response>;
    public get Current(): Promise<Response> {
        if (this._current)
            return this._current;
        else return null;
    }

    private url: string;
    public get Url() {
        return this.url;
    }

    private options: RequestOptions;
    public get Options() { return this.options; }

    public Latest(param?: IHttpParameterGen): Observable<Response> {
        this.options.params = param ? param.URLSearchParams() : new URLSearchParams();
        return this.endpoint.GetGenericEPHttp(this.url, this.options);
    }


    public LatestGuard(param?: IHttpParameterGen): Observable<Response> {
        this.options.params = param ? param.URLSearchParams() : new URLSearchParams();
        let optsArgs = <RequestOptionsArgs>{
            method: RequestMethod.Get,
            headers: this.options.headers,
            params: this.options.params,
            responseType: this.options.responseType,
            search: this.options.search,
            url: this.url,
            withCredentials: this.options.withCredentials
        };
        return this.endpoint.RequestGenericEPHttp(this.url, optsArgs, false)
            .pipe(
                catchError(err => {

                    this._current = null;
                    if (err.status == 429)
                        try {
                            return timer(JSON.parse(err.error).seconds * 1000).pipe(
                                switchMap(() =>
                                    this.Latest(param)
                                )
                            );
                        }
                        catch (subErr) {
                            return of(err);
                        }
                    return throwError(err);
                })
            );
    }
    public CurrentOrLatest(param?: IHttpParameterGen): Promise<Response> {
        if (this._current && this.options.params === param.URLSearchParams())
            return this.Current;
        else
            return this._current = this.Latest(param).toPromise();
    }
}