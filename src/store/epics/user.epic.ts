import { Observable } from 'rxjs';
import { ofType, StateObservable } from 'redux-observable';
import { map, switchMap, tap } from 'rxjs/operators';

import authService from '../../service/auth.service';
import { User } from '../../service/model/model';
import { StoreState } from '../model/model';
import { login, LoginAction, loginResponse, logout, LogoutAction, logoutResponse } from '../slices/user.slice';

const loginEpic = (action$: Observable<LoginAction>, state$: StateObservable<StoreState>) =>
    action$.pipe(
        ofType(login.toString()),
        switchMap(({ payload }) => {
            let source: Observable<User> = null;
            if (payload && !authService.getUserId()) {
                const { code, state } = payload;

                source = authService.loginAsGithubUser(code, state);
            } else {
                source = authService.checkLoginState();
            }

            return source.pipe(map(res => loginResponse(res)))
        })
    );

const logoutEpic = (action$: Observable<LogoutAction>, state$: StateObservable<StoreState>) =>
    action$.pipe(
        ofType(logout.toString()),
        tap(v => console.log(v)),
        switchMap(_ => authService.logout().pipe(map(res => logoutResponse(res.isLogout))))
    );

export default {
    loginEpic,
    logoutEpic,
}
