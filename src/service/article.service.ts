import { Observable, Subscription, of } from 'rxjs';
import { filter, mergeMap, switchMap, delay, mapTo, map } from 'rxjs/operators';

import { CRUDVar } from '../constant/constant';
import { BaseService } from './base.service';
import { HttpService } from './http.service';
import { MessageService } from './message.service';
import {
    ArticleSearchRequest,
    ArticleStatisticsUpdateRequest,
    ArticleUpdateRequest,
    CreateArticleRequest,
    SeriesOverviewRequest
} from './model/request.interface';
import {
    Article,
    ArticleDeleteResponse,
    ArticleOverview,
    ArticleStatistics,
    ArticleUpdateResponse,
    SeriesOverviewResponse,
    CreateArticleResponse,
} from './model/response.interface';

class ArticleService extends BaseService {
    private static _instance: ArticleService;

    private readonly articlePath = 'article';

    private readonly statisticsPath = 'statistics';

    private readonly updatePath = 'update';

    private readonly series = 'series';

    private _http: HttpService = HttpService.instance;

    private messageService: MessageService;

    constructor() {
        super();

        this.messageService = new MessageService();
    }

    getArticlesOverview(conditions: Partial<ArticleSearchRequest> = {}): Observable<ArticleOverview[]> {
        const defaultCondition: Partial<ArticleSearchRequest> = { limit: 500 };
        const condition = { ...defaultCondition, ...conditions, isOverview: true };

        return this._http
            .post<ArticleOverview[]>(this.completeApiUrl(this.articlePath, CRUDVar.SEARCH), condition)
    }

    getSeriesOverview(overview: Observable<SeriesOverviewRequest>): Observable<SeriesOverviewResponse> {
        return overview.pipe(
            switchMap(series =>
                this._http
                    .post<SeriesOverviewResponse>(this.completeApiUrl(this.articlePath, this.series), series)
            )
        );
    }

    getArticle(idObs: Observable<string>): Observable<Article> {
        return idObs.pipe(
            filter(id => id != null),
            mergeMap(id =>
                this._http
                    .get<Article>(this.completeApiUrl(this.articlePath, id))
            )
        );
    }

    // private universalRequest<T>(request: Observable<T>, ...data: Array<string | number>): Observable<T> {
    //     const identifier = data.join('-');
    //     const result = this.checkTransferStateResult<T>(identifier);

    //     if (result) {
    //         return of(result);
    //     } else {
    //         return request.pipe(tap(res => this.makeStateKey(res, identifier)));
    //     }
    // }

    addLike(data: ArticleStatisticsUpdateRequest): Observable<Partial<ArticleStatistics>> {
        return this._http.put(this.completeApiUrl(this.statisticsPath, CRUDVar.UPDATE), data);
    }

    /**
     * TODO: 后台响应返回错了，暂时就用number，就是文章的id; 实际返回的响应应该是 CreateArticleResponse;
     */
    createArticle(data: CreateArticleRequest): Observable<CreateArticleResponse> {
        return this._http
            .post<number>(this.completeApiUrl(this.articlePath, CRUDVar.CREATE), data)
            .pipe(map(id => ({id})))
    }

    updateArticle(data: ArticleUpdateRequest): Observable<ArticleUpdateResponse> {
        return this._http
            .put<ArticleUpdateResponse>(this.completeApiUrl(this.articlePath, this.updatePath), data)
    }

    handleOperateArticleResponse<T>(response: Observable<T>, message = '创建成功'): Subscription {
        return response.subscribe(_res => {
            this.messageService.showSuccessMessage(message);
        });
    }

    // private makeStateKey(value: any, identifier: string): void {
    //     if (isPlatformServer(this._platformId)) {
    //         const key = makeStateKey(identifier);

    //         this.transferState.set(key, value);
    //     }
    // }

    // private checkTransferStateResult<T>(identifier: string): T {
    //     const key = makeStateKey<T>(identifier);

    //     if (this.transferState.hasKey(key)) {
    //         const result = this.transferState.get(key, null);
    //         this.transferState.remove(key);

    //         return result;
    //     }
    // }

    deleteArticle(id: number): Observable<ArticleDeleteResponse> {
        return of(id).pipe(
            delay(300),
            mapTo({ isDeleted: true })
        );

        // return this._http
        //     .request('DELETE', this.completeApiUrl(this.articlePath, CRUDVar.DELETE), { body: { id } })
    }

    public static get instance(): ArticleService {
        return this._instance || (this._instance = new this());
    }
}

export default ArticleService.instance;
