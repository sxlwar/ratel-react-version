import { Observable, of } from 'rxjs';
import { AjaxResponse } from 'rxjs/ajax';

import { MessageService } from './message.service';
import { apiError } from '../store/slices/error.slice';
import { tap } from 'rxjs/operators';
import { ErrorResponse } from './model/model';
import { PayloadAction } from 'redux-starter-kit';

class ErrorService extends MessageService {
    private static _instance: ErrorService;

    handleHttpError = ({ response }: AjaxResponse): Observable<PayloadAction<ErrorResponse, string>> =>
        of(apiError(response)).pipe(tap(action => this.showErrorMessage(action.payload.message)));

    public static get instance(): ErrorService {
        return this._instance || (this._instance = new this());
    }
}

export default ErrorService.instance;
