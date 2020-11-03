import { ContentTypeFlags } from '@ProjectModels/content-type-flags';
import { ResponseContentType, RequestOptions, Headers, RequestOptionsArgs } from '@angular/http';
import { HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';

export class PresetHttpOption {

    public static RawClientJson(contentType: ContentTypeFlags = ContentTypeFlags.ApplicationJson): RequestOptions {
        let opts: RequestOptions;
        opts.headers.append('Content-Type', contentType)
        opts.responseType = ResponseContentType.Json;
        opts.params
        return opts;
    }



    public static ClientJson(contentType: ContentTypeFlags = ContentTypeFlags.ApplicationJson): {
        headers?: HttpHeaders;
        observe?: "body";
        params?: HttpParams;// | { [param: string]: string | string[]; };
        reportProgress?: boolean;
        responseType?: "json";
        withCredentials?: boolean;
    } {
        return {
            headers: new HttpHeaders().set('Content-Type', contentType),
        };
    }

    public static get Empty(): {
        headers?: HttpHeaders;
        observe?: "body";
        params?: HttpParams;// | { [param: string]: string | string[]; };
        reportProgress?: boolean;
        responseType?:"json";
        withCredentials?: boolean;
    } {
        return {
            headers: new HttpHeaders(),
            params: new HttpParams(),
            reportProgress: true
        };
    }
    public static get RawBlob(): RequestOptions {
        // let asd = new HttpRequest('POST', '/upload/file', file, {
        //     reportProgress: true,
        // });

        let tRes = new RequestOptions();
        tRes.headers = new Headers();
        // tRes.headers.append("Access-Control-Allow-Origin", "*");
        // tRes.headers.append('observe', 'response');
        tRes.responseType = ResponseContentType.Blob;
        return tRes;
    }

    public static get RawText(): RequestOptions {
        // let asd = new HttpRequest('POST', '/upload/file', file, {
        //     reportProgress: true,
        // });

        let tRes = new RequestOptions();
        tRes.headers = new Headers();
        // tRes.headers.append("Access-Control-Allow-Origin", "*");
        // tRes.headers.append('observe', 'response');
        tRes.responseType = ResponseContentType.Text;
        return tRes;
    }

    public static Raw(): RequestOptions {
        let tRes = new RequestOptions();
        tRes.headers = new Headers();
        return tRes;
    }

}
