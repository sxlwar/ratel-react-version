import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { catchError, filter, map, mergeMap, take } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { GithubAuthConfig, User } from './model/auth.interface';
import { LogoutResponse } from './model/response.interface';
import { BaseService } from './base.service';
import { ErrorService } from './error.service';
import { HttpService } from './http.service';
import UrlDetectorService from './url.detector.service';

class AuthService extends BaseService {
    private static _instance: AuthService;

    public readonly path = 'auth';

    private readonly githubConfigPath = 'github/config';

    private readonly githubLoginPath = 'github/code';

    private readonly logoutPath = 'logout';

    private readonly userInfoPath = 'user';

    private readonly githubAuthURI = 'https://github.com/login/oauth/authorize';

    private readonly storedUserId = 'githubId';

    public user$: BehaviorSubject<User> = new BehaviorSubject(null);

    userObs: Observable<User>;

    // isBrowser = isPlatformBrowser(this._platformId);
    isBrowser = true;

    private _error: ErrorService;

    private _http: HttpService;

    constructor() {
        super();

        this._error = new ErrorService();
        this._http = new HttpService();

        // if (this.isBrowser) {
        //     this.monitorGithubUserInfo();
        // }

        this.userObs = this.user$.asObservable();
    }

    private monitorGithubUserInfo(): void {
        UrlDetectorService.instance
            .queryParamsChange()
            .pipe(
                filter((params: any) => params && params['code'] && params['state']),
                mergeMap(({ code, state }) =>
                    this._http.get<User>(this.completeApiUrl(this.path, this.githubLoginPath), {
                        params: { code, state }
                    })
                ),
                take(1)
            )
            .subscribe((user: User) => {
                this.user$.next(user);

                this.storeUserId(user.githubId);
            });
    }

    public loginAsGithubUser(code: string, state: string): Observable<User> {
        return this._http.get<User>(this.completeApiUrl(this.path, this.githubLoginPath), { params: { code, state } });
    }

    private storeUserId(id: number): void {
        localStorage.setItem(this.storedUserId, String(id));
    }

    private clearUserId(): void {
        localStorage.removeItem(this.storedUserId);
    }

    private getUserId(): number | null {
        return this.isBrowser ? (+localStorage.getItem(this.storedUserId) as number) : null;
    }

    /**
     * 用户如果没有执行出退出操作，重新向服务器获取用户的信息；
     */
    checkLoginState(): Observable<User> {
        const id = this.getUserId();

        if (id) {
            return this._http
                .post<User>(this.completeApiUrl(this.path, this.userInfoPath), { id })
                .pipe(catchError(this._error.handleHttpError))
        } else {
            return of(null)
        }
    }

    /**
     * 通知服务器删除用户信息，同时删除本地的用户id
     */
    logout(): Subscription {
        return this._http
            .post<LogoutResponse>(this.completeApiUrl(this.path, this.logoutPath), { id: this.getUserId() })
            .pipe(catchError(this._error.handleHttpError))
            .subscribe((res: LogoutResponse) => {
                if (res.isLogout) {
                    this.clearUserId();

                    this.user$.next(null);
                }
            });
    }

    /**
     * 获取 github 身份验证所需要的配置项，主要是 clientId;
     */
    getGithubAddress(redirectPath: string): Observable<string> {
        return this._http.get<GithubAuthConfig>(this.completeApiUrl(this.path, this.githubConfigPath)).pipe(
            map(
                (config: GithubAuthConfig) =>
                    `${this.githubAuthURI}?client_id=${
                        config.clientId
                    }&redirect_uri=${environment.githubAuthRedirectAddress + redirectPath}&scope=user&state=${
                        config.state
                    }`
            ),
            catchError(this._error.handleHttpError)
        );
    }

    public static get instance(): AuthService {
        return this._instance || (this._instance = new this());
    }
}

export default AuthService.instance;
