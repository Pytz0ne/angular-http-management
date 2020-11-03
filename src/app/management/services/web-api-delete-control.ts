import { EndpointFactory } from '@Services/endpoint-factory.service';
import { IHttpParameterGen } from './api/ihttp-parameter-gen';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Response, RequestOptions } from '@angular/http';
import { WebapiService } from './webapi-service';

export class WebApiDeleteControl<T> {
    constructor(
        private endpoint: EndpointFactory,
        url: string) {
        this.url = url;
    }

    private _lastRequest: Observable<T>;

    public get LastRequest(): Observable<T> {
        if (this._lastRequest)
            return this._lastRequest;
    }

    private url: string;
    public get Url() {
        return this.url;
    }
    private options: {
        headers?: HttpHeaders; observe?: "body";
        params?: HttpParams;
        reportProgress?: boolean;
        responseType?: "json";
        withCredentials?: boolean;
    };
    public get Options() {
        return this.options;
    }

    public Execute(param?: IHttpParameterGen): Observable<T> {
        param ? (this.options.params = param.GetHttpParams()) : false;
        return this._lastRequest = this.endpoint.DeleteGenericEPHttpClient<T>(this.url, this.options);
    }
}

export class WebApiDeleteControlRaw {
    constructor(
        private endpoint: EndpointFactory,
        url: string) {
        this.url = url;
    }

    private _lastRequest: Observable<Response>;

    public get LastRequest(): Promise<Response> {
        if (this._lastRequest)
            return this._lastRequest.toPromise();
    }

    private url: string;
    public get Url() {
        return this.url;
    }
    private options: RequestOptions;
    public get Options() {
        return this.options;
    }

    public Execute(param?: IHttpParameterGen): Observable<Response> {
        this.options.params = param.URLSearchParams();
        return this._lastRequest = this.endpoint.DeleteGenericEPHttp(this.url, this.options);
    }
}