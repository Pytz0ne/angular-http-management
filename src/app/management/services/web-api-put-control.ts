import { EndpointFactory } from '@Services/endpoint-factory.service';
import { IHttpParameterGen } from './api/ihttp-parameter-gen';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { RequestOptions, Response } from '@angular/http';
import { WebapiService } from './webapi-service';
import { PresetHttpOption } from './preset-http-option';

export class WebApiPutControl<T, T2> {
    constructor(
        private endpoint: EndpointFactory,
        url: string,
        options = PresetHttpOption.Empty) {
        this.url = url;
        this.options = options;
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
    private options;
    // : {
    //     headers?: HttpHeaders | { [header: string]: string | string[]; };
    //     observe?: "body";
    //     params?: HttpParams | { [param: string]: string | string[]; };
    //     reportProgress?: boolean;
    //     responseType?: "json";
    //     withCredentials?: boolean;
    // };
    public get Options() {
        return this.options;
    }

    public Execute(data: T2, param?: IHttpParameterGen): Observable<T> {
        param ? (this.options.params = param.GetHttpParams()) : false;
        return this._lastRequest = this.endpoint.PutGenericEPHttpClient<T>(this.url, data, this.options);
    }

}

export class WebApiPutControlRaw<T1> {
    constructor(
        private endpoint: EndpointFactory,
        url: string,
        options = PresetHttpOption.Raw()) {
        this.url = url;
        this.options = options;
    }

    private _lastRequest: Observable<Response>;

    public get LastRequest(): Observable<Response> {
        if (this._lastRequest)
            return this._lastRequest;
    }

    private url: string;
    public get Url() {
        return this.url;
    }
    private options: RequestOptions;
    public get Options() {
        return this.options;
    }

    public Execute(data: T1, param?: IHttpParameterGen): Observable<Response> {
        this.options.params = param.URLSearchParams();
        return this._lastRequest = this.endpoint.PutGenericEPHttp(this.url, data, this.options);
    }

}