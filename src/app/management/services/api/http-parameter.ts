import { HttpParams } from '@angular/common/http';
import { URLSearchParams } from '@angular/http';
import { IHttpParameterGen } from './ihttp-parameter-gen';

export abstract class HttpParameter implements IHttpParameterGen {
    public key: string;
    public value: string;

    public GetHttpParams(): HttpParams {
        let res = new HttpParams();
        this.combined.forEach(i =>
            i.forEach(item =>
                res = res.append(item.key, item.value)
            ));
        if (this.key) res = res.append(this.key, this.value);
        return res;
    }


    public Combine(val: IHttpParameterGen) {
        if (!val.value)
            return;
        let vals = this.combined.get(val.key);
        if (vals === undefined)
            vals = [];
        vals.push(val)
        this.combined.set(val.key, vals);
        // this.combined.set(val.key, val);
    }
    public FindAndRemove(key: string) {
        this.combined.delete(key);
    }
    public URLSearchParams(): URLSearchParams {
        let res = new URLSearchParams();
        this.combined.forEach(i =>
            i
                // .filter(m => m.value != undefined)
                .forEach(item =>
                    res.append(item.value, item.value)
                )
        );
        res.append(this.key, this.value);
        return res;
    }
    public Find(key: string): IHttpParameterGen[] {
        return this.combined.get(key);
    }
    public ToArray() {
        let res = {};
        this.combined.forEach(i =>
            i.forEach(item => {
                if (item.value)
                    res[item.key] = item.value;
            }));
        if (this.value)
            res[this.key] = this.value;
        return res;
    }
    protected combined: Map<string, IHttpParameterGen[]> = new Map<string, IHttpParameterGen[]>();
    // protected combined2: Map<string, IHttpParameterGen> = new Map<string, IHttpParameterGen>();
    get length(): number {
        return this.combined.size;
    }
}
