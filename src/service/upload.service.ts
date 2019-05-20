import * as qiniu from 'qiniu-js';
import { from, Observable, of, Subject } from 'rxjs';
import { catchError, delay, filter, map, mergeMap, take, takeUntil, timeout, switchMapTo } from 'rxjs/operators';

import { ALLOW_UPLOAD_FILE_TYPES, CRUDVar, QiniuErrorCode } from '../constant/constant';
import { GetQiniuTokenResponse } from './model/response.interface';
import { HttpService } from './http.service';
import { MessageService } from './message.service';

export interface UploadResult {
    name: string;
    url: string;
    error?: {
        index: number;
        reason: string;
    };
}

export class UploadService extends MessageService {
    private static _instance: UploadService;

    private readonly path = 'upload';

    uploading$: Subject<boolean> = new Subject();

    uploadedCount = 0;

    uploadTotal = 0;

    private uploadResults: UploadResult[] = [];

    readonly urlPrefix = 'https://assets.hijavascript.com/';

    result$: Subject<UploadResult[]> = new Subject();

    private _http: HttpService;

    constructor() {
        super();

        this._http = new HttpService();
    }

    private getUploadToken(name: string): Observable<string> {
        return this._http
            .post<GetQiniuTokenResponse>(this.completeApiUrl(this.path, CRUDVar.CREATE), { name })
            .pipe(map(res => res.uploadToken));
    }

    /**
     * Upload file to qiniu server;
     * 1、获取token
     * 2、上传图片
     * 3、图片全部上传完成时发出上传结果
     * 4、发生错误或完成时终止数据流
     */
    uploadImage(files: FileList): Observable<UploadResult[]> {
        this.uploading$.next(true);

        this.uploadTotal = files.length;

        return from(files).pipe(
            delay(100),
            mergeMap((file, index) => {
                const name = this.getOptimizeFileName(file.name);

                return this.getUploadToken(name).pipe(
                    map(token => ({
                        index,
                        obs: qiniu.upload(
                            file,
                            name,
                            token,
                            { mimeType: ALLOW_UPLOAD_FILE_TYPES },
                            { useCdnDomain: true }
                        )
                    }))
                );
            }),
            timeout(1000),
            map(engine => engine.obs.subscribe(this.createUploadObserver(engine.index))),
            switchMapTo(this.result$.asObservable()),
            takeUntil(
                this.uploading$.pipe(
                    filter(uploading => !uploading),
                    take(1)
                )
            ),
            catchError(err => {
                this.tokenError(err);

                return of(null);
            })
        );
    }

    private getOptimizeFileName(name: string): string {
        const timestamp = new Date().getTime();
        const ary = name.split('.');
        const originName = ary
            .slice(0, -1)
            .map(item => item.replace(/\s/g, ''))
            .join('_');

        return originName + timestamp + '.' + ary[ary.length - 1];
    }

    private tokenError(err: any): void {
        this.reset();

        this.showErrorMessage(`上传失败或请求超时！错误原因：${err.message}`);
    }

    /**
     * Get upload image observer;
     */
    private createUploadObserver(index: number): qiniu.Observer {
        const spy = () => {
            this.uploadedCount += 1;

            if (this.uploadedCount === this.uploadTotal) {
                this.result$.next([...this.uploadResults]);
                this.reset();
            }
        };

        return {
            next: _ => {},
            error: ({ code }: qiniu.Error) => {
                this.uploadResults.push({ url: '', name: '', error: { index, reason: QiniuErrorCode[code] } });

                spy();

                this.showErrorMessage(
                    `第${index + 1}张图片上传失败，失败原因：` + QiniuErrorCode[code]
                );
            },
            complete: obj => {
                this.uploadResults.push({ url: this.urlPrefix + obj.key, name: obj.key });

                spy();

                if (this.uploadedCount === this.uploadTotal) {
                    if (this.uploadResults.some(item => !!item.error)) {
                        this.showWarningMessage('部分图片未上传成功！');
                    } else {
                        this.showSuccessMessage('图片上传成功');
                    }
                }
            }
        };
    }

    private reset(): void {
        this.uploading$.next(false);

        this.uploadedCount = 0;

        this.uploadTotal = 0;

        this.uploadResults = [];
    }

    base64ToFile(dataUrl: string, fileName: string): File {
        if (!dataUrl) {
            return null;
        }

        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8Arr = new Uint8Array(n);

        while (n--) {
            u8Arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8Arr], fileName, { type: mime });
    }

    public static get instance(): UploadService {
        return this._instance || (this._instance = new this());
    }
}
