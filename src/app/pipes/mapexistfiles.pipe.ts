import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapexistfiles'
})
export class MapexistfilesPipe implements PipeTransform {

  transform(value, ...args: any[]): any[] {
    // let res = (value.map(m => m.Mevcut))
    //   .reduceRight(r => r);
    // let res2 = (value.map(m => m.Mevcut))
    //   .reduce(r => r);

    // let res3 = (value.map(m => m.Mevcut))

    let res: any[] = [];
    value.map(m => m.Mevcut).forEach(i =>
      i.forEach(element => res.push(element)));
    return res;
  }

}
