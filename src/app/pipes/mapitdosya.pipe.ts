import { Pipe, PipeTransform } from '@angular/core';
import { ITxfile } from '@ProjectInterfaces/txfile.interface';

@Pipe({
  name: 'mapitfile'
})
export class MapitfilePipe implements PipeTransform {

  transform(value, ...args: any[]): ITxfile[] {
    return value.map(m => m.Tarsafile);
  }

}
