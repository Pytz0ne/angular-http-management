import { HttpParams } from '@angular/common/http';
import { URLSearchParams } from '@angular/http';
import { HttpParameter } from './http-parameter';

export interface IHttpParameterGen {
    key: string;
    value: string;
    length: number;
    GetHttpParams(): HttpParams;
    Combine(val: IHttpParameterGen);
    FindAndRemove(key: string);
    URLSearchParams(): URLSearchParams;
    Find(key: string): IHttpParameterGen[];
    ToArray();
}

