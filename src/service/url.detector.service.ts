import { fromEvent, Observable } from 'rxjs';

class UrlDetectorService {
    private static _instance: UrlDetectorService;

    public queryParamsChange(): Observable<{ [key: string]: string | number }> {
        return fromEvent(window, 'popstate', _ => {
            const search: string = document.location.search.slice(1);

            const params = search.split('&').reduce((acc: any, cur: string) => {
                const [key, value] = cur.split('=');

                acc[key] = value;

                return acc;
            }, {});

            return params;
        });
    }

    public static get instance(): UrlDetectorService {
        return this._instance || (this._instance = new this());
    }
}

export default UrlDetectorService;
