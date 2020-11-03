import { HttpParams } from '@angular/common/http';
import { IHttpParameterGen } from './ihttp-parameter-gen';
import { URLSearchParams } from '@angular/http';
import { HttpParameter } from './http-parameter';

export class HttpCustomParams extends HttpParameter {
    private HttpCustomParams() { }

    public static Generate(key: string, value: string) {
        let val = new HttpCustomParams();
        val.key = key;
        val.value = value;
        return val;
    }
}