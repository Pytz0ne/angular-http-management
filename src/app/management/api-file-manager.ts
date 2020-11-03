import { Response } from '@angular/http';

export function saveFile(blobContent: Blob, fileName: string) {
    const a = document.createElement('a');
    if (navigator.appVersion.toString().indexOf('.NET') > 0 && window.navigator.msSaveBlob) {
        console.log('from Explorer', window.navigator);
        let val = window.navigator.msSaveBlob(blobContent, fileName);
        console.log(val)
    }
    else {
        a.href = window.URL.createObjectURL(blobContent);
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(window.URL.createObjectURL(blobContent));
    }
}

// export function donloadFile(blobContent: Blob, fileName: string) {
//     const blob = new Blob([blobContent], { type: 'application/octet-stream' });
//     saveAs(blob, fileName);
// }
export function getFileNameFromResponseContentDisposition(res: Response, name?: string) {
    if (!res.headers.has('Content-Disposition')) {
        let _name = '';
        if (!name)
            _name = 'file.';
        if (!name.includes('.'))
            return name + '.' + res.blob().type.split('/')[1];
        return name;
    }

    const contentDisposition = res.headers.get('content-disposition') || '';
    const matches = /filename=([^;]+)/ig.exec(contentDisposition);
    const fileName = (matches[1] || 'untitled').trim();
    return fileName;
}