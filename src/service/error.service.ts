import { Observable, throwError } from 'rxjs';

import { MessageService } from './message.service';


export class ErrorService extends MessageService {
    private static _instance: ErrorService;

    handleHttpError = (error: any): Observable<any> => {
        const exception = error.error;

        if (exception instanceof ErrorEvent) {
            console.error(exception.message);
        } else {
            this.showErrorMessage(exception.message);
        }

        return throwError(error); // 这个错误不要随便抛，否则会导致服务端渲染时后台代码报错： can't read ngOriginError of undefined;
    };

    public static get instance(): ErrorService {
        return this._instance || (this._instance = new this());
    }
}

export default ErrorService;
