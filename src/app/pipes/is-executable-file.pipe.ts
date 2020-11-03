import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isExecutableFile'
})
export class IsExecutableFilePipe implements PipeTransform {

  transform(value: string): boolean {
    if (!value.includes('.'))
      return false;
    let parts = value.split('.');
    return IsExecutableFilePipe.BrowserAvailableFileExtensions
      .includes(parts[parts.length - 1].toLowerCase());
  }
  static BrowserAvailableFileExtensions = [
    'pdf',
    'png',
    'jpg',
    'jpeg',
    'mp4',
    'mp3'
  ];
}
