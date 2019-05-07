// import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { isPlatformBrowser } from '@angular/common';

import { Observable, throwError } from 'rxjs';

import { BaseService } from './base.service';

export class ErrorService extends BaseService {
    // private isBrowser = isPlatformBrowser(this.platformId);

    // constructor(private _snack: MatSnackBar, @Inject(PLATFORM_ID) private platformId: Object) {

    handleHttpError = (error: any): Observable<any> => {
        const exception = error.error;

        // if (this.isBrowser) {
        if (exception instanceof ErrorEvent) {
            console.error(exception.message);
        } else {
            // this._snack.open(exception.message, '', this.snakeBarConfig);
        }
        // }

        return throwError(error); // 这个错误不要随便抛，否则会导致服务端渲染时后台代码报错： can't read ngOriginError of undefined;
    };
}
