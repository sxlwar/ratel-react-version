import { ofType, StateObservable } from 'redux-observable';
import { Observable, of, concat } from 'rxjs';
import { map, switchMap, take, tap, last, withLatestFrom, filter, catchError, mergeMap } from 'rxjs/operators';

import { ArticleCreation } from '../../components/form';
import articleService from '../../service/article.service';
import { UploadService } from '../../service/upload.service';
import { StoreState } from '../model/model';
import {
    createArticle,
    CreateArticleAction,
    createArticleResponse,
    deleteArticle,
    DeleteArticleAction,
    deleteArticleResponse,
    UpdateArticleAction,
    updateArticle,
    updateArticleResponse
} from '../slices/article.slice';
import { selectUpload, uploadThumbnail, uploadThumbnailResponse } from '../slices/upload.slice';
import { selectUser } from '../slices/user.slice';
import store from '../index';
import { MessageService } from '../../service/message.service';
import errorService from '../../service/error.service';

const message = new MessageService();

/**
 * * 检查文章创建时的thumbnail字段
 */
const checkThumbnail = (article: ArticleCreation): FileList | null => {
    const { title, thumbnail, isCustomThumbnail } = article;
    const file = UploadService.instance.base64ToFile(thumbnail, title);

    return isCustomThumbnail
        ? ({
              0: file,
              length: 1,
              item() {
                  return file;
              }
          } as FileList)
        : null;
};

/**
 * * 1. 检查 thumbnail 字段
 * *    if 使用自定义图片时: 先上传图片，把thumbnail设置成响应中的图片地址
 * *    else 不做任何处理
 * * 2. 从store中获取 userId 生成最后的请求信息
 * * 3. 发起创建请求
 * * 4. 显示成功后的提示信息（showSnackbar 早于 createArticleResponse）
 */
const createArticleEpic = (action$: Observable<CreateArticleAction>, state$: StateObservable<StoreState>) =>
    action$.pipe(
        ofType(createArticle.toString()),
        switchMap(({ payload }) => {
            const file = checkThumbnail(payload);

            if (file) {
                const updateThumbnail = state$.pipe(
                    map(state => selectUpload(state).thumbnail[0]),
                    map(uploadResult => ({ ...payload, thumbnail: uploadResult.url })),
                    take(1)
                );
                const uploaded = action$.pipe(
                    ofType(uploadThumbnailResponse.toString()),
                    take(1)
                );
                const launch = of(file).pipe(tap(file => store.dispatch(uploadThumbnail(file))));

                return concat(launch, uploaded, updateThumbnail).pipe(last()) as Observable<ArticleCreation>;
            } else {
                return of(payload);
            }
        }),
        withLatestFrom(
            state$.pipe(
                map(state => selectUser(state)),
                filter(item => item && !!item.user)
            ),
            (request, { user: { id: userId } }) => ({ ...request, userId })
        ),
        mergeMap(request =>
            articleService.createArticle(request).pipe(
                tap(_ => message.showSuccessMessage('文章创建成功！')),
                map(res => createArticleResponse(res)),
                catchError(errorService.handleHttpError)
            )
        )
    );

const deleteArticleEpic = (action$: Observable<DeleteArticleAction>, state$: StateObservable<StoreState>) =>
    action$.pipe(
        ofType(deleteArticle.toString()),
        switchMap(({ payload: { id } }) => articleService.deleteArticle(id).pipe(
            tap(_ => message.showSuccessMessage('删除成功')),
            map(response => deleteArticleResponse(response)),
            catchError(errorService.handleHttpError)
        )),
    );

const updateArticleEpic = (action$: Observable<UpdateArticleAction>, state$:  StateObservable<StoreState>) =>
action$.pipe(
    ofType(updateArticle.toString()),
    switchMap(({payload}) => articleService.updateArticle(payload).pipe(
        tap(_ => message.showSuccessMessage('更新成功')),
        map(response => updateArticleResponse(response)),
        catchError(errorService.handleHttpError)
    ))
);

export default {
    createArticleEpic,
    deleteArticleEpic,
    updateArticleEpic,
};
