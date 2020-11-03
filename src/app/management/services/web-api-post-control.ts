import { EndpointFactory } from '@Services/endpoint-factory.service';
import { HttpParams, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ContentTypeFlags } from '@ProjectModels/content-type-flags';
import { IHttpParameterGen } from './api/ihttp-parameter-gen';
import { RequestOptions, Response, Request, Headers } from '@angular/http';
import { WebapiService } from './webapi-service';
import { PresetHttpOption } from './preset-http-option';
import { EventEmitter } from '@angular/core';

export class WebApiPostControl<T, T1> {
    private _contentType: ContentTypeFlags;

    constructor(
        private endpoint: EndpointFactory,
        url: string, options: {
            headers?: HttpHeaders; observe?: "body";
            params?: HttpParams;
            reportProgress?: boolean;
            responseType?: "json";
            withCredentials?: boolean;
        } = PresetHttpOption.Empty,
    ) {
        this.url = url;
        this.options = options;
    }
    public ErrorEvent: EventEmitter<any> = new EventEmitter<any>();

    private url: string;
    public get Url() {
        return this.url;
    }
    private options: {
        headers?: HttpHeaders;
        observe?: "body";
        params?: HttpParams;
        reportProgress?: boolean;
        responseType?: "json";
        withCredentials?: boolean;
    };
    public get Options() {
        return this.options;
    }

    private _lastRequest: Observable<T>;
    public get LastRequest(): Observable<T> {
        if (this._lastRequest)
            return this._lastRequest;
        else return null;
    }


    public Execute(data: T1, param?: IHttpParameterGen): Observable<T> {
        param ? (this.options.params = param.GetHttpParams()) : false;
        return this._lastRequest = this.endpoint.PostGenericEPHttpClient<T>(this.url, data, this.options)
            // .pipe(catchError(err => {
            //     this.ErrorEvent.emit(err);
            //     return of(err);
            // }))
            ;
    }

    public ExecuteGuard(data: T1, param?: IHttpParameterGen): Observable<HttpEvent<T>> {
        param ? (this.options.params = param.GetHttpParams()) : false;
        let request = new HttpRequest<T1>('POST', this.url, data, this.options);

        return this.endpoint.RequestGenericEPHttpClient<T>(request, false);
    }
}

export class WebApiPostControlResponse<T, RES> {
    private _contentType: ContentTypeFlags;

    constructor(
        private endpoint: EndpointFactory,
        url: string, options: {
            headers?: HttpHeaders,
            reportProgress?: boolean,
            params?: HttpParams,
            responseType?: "json" | "arraybuffer" | "blob" | "text",
            withCredentials?: boolean
        },
    ) {
        this.url = url;
        this.options = options;
    }

    private url: string;
    public get Url() {
        return this.url;
    }
    private options: {
        headers?: HttpHeaders;
        observe?: "body";
        params?: HttpParams;
        reportProgress?: boolean;
        responseType?: "json" | "arraybuffer" | "blob" | "text",
        withCredentials?: boolean;
    };

    public get Options() { return this.options; }

    private _lastRequest: Observable<HttpEvent<RES>>;
    public get LastRequest(): Observable<HttpEvent<RES>> {
        if (this._lastRequest)
            return this._lastRequest;
        else return null;
    }


    public Execute(data: T, param?: IHttpParameterGen, useretry = false): Observable<HttpEvent<RES>> {
        param ? (this.options.params = param.GetHttpParams()) : false;
        this.options = this.endpoint.AssignTokenClient(this.options);
        const config = new HttpRequest('POST', this.endpoint.UrlCombiner(this.url), data, this.options);

        return this._lastRequest = this.endpoint.RequestGenericEPHttpClient<RES>(config, useretry);

    }
}





export class WebApiPostControlRaw<T1> {
    private _contentType: ContentTypeFlags;

    constructor(
        private endpoint: EndpointFactory,
        url: string,
        options = PresetHttpOption.Raw()
    ) {
        this.url = url;
        this.options = options;
    }

    private url: string;
    public get Url() {
        return this.url;
    }
    private options: RequestOptions;
    public get Options() {
        return this.options;
    }

    private _lastRequest: Observable<Response>;
    public get LastRequest(): Observable<Response> {
        if (this._lastRequest)
            return this._lastRequest;
        else return null;
    }

    public Execute(data: T1, param?: IHttpParameterGen): Observable<Response> {
        param ? (this.options.params = param.URLSearchParams()) : false;
        return this._lastRequest = this.endpoint.PostGenericEPHttp(this.url, data, this.options);
    }
}