import { ajax, AjaxResponse } from 'rxjs/ajax';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// export interface RequestOptions {
//     observer?: 'body' | 'event';
//     params?: { [param: string]: string | string[] };
//     reportProgress?: boolean;
// }

export class HttpService {
    private createGetParams(params: object): string {
        if (!params) {
            return '';
        }

        return Object.entries(params)
            .map((item: [string, string | number]) => item.join('='))
            .join('&');
    }

    get<T>(url: string, options?: { params?: { [key: string]: string | number } }, headers?: Object): Observable<T> {
        const completeUrl = !!options ? url + '?' + this.createGetParams(options.params) : url;

        return ajax.getJSON(completeUrl, headers);
    }

    post<T>(url: string, body: object, headers?: Object): Observable<T> {
        return ajax.post(url, body, headers).pipe(map(({ response }: AjaxResponse) => response));
    }
}
