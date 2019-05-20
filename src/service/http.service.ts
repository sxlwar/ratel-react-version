import { ajax, AjaxResponse } from 'rxjs/ajax';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';

export type RequestMethod = 'GET' | 'PUT' | 'DELETE' | 'UPDATE';

export class HttpService extends BaseService {
    private static _instance: HttpService;

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

    put<T>(url: string, body: object, headers?: Object): Observable<T> {
        return ajax.put(url, body, headers).pipe(map(({ response }: AjaxResponse) => response));
    }

    request<T>(method: RequestMethod, url: string, body: { [key: string]: any }): Observable<T> {
        return ajax({
            url,
            method,
            body
        }).pipe(map(({ response }: AjaxResponse) => response));
    }

    public static get instance(): HttpService {
        return this._instance || (this._instance = new this());
    }
}
