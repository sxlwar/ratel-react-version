import { ofType, StateObservable } from 'redux-observable';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { UploadService } from '../../service/upload.service';
import { StoreState } from '../model/model';
import { upload, UploadAction, uploadResponse, uploadThumbnail, uploadThumbnailResponse } from '../slices/upload.slice';

const uploadEpic = (action$: Observable<UploadAction>, state$: StateObservable<StoreState>) =>
    action$.pipe(
        ofType(upload.toString(), uploadThumbnail.toString()),
        switchMap(({ payload, type }) =>
            UploadService.instance
                .uploadImage(payload)
                .pipe(map(res => (type === upload.toString() ? uploadResponse(res) : uploadThumbnailResponse(res))))
        )
    );

export default {
    uploadEpic
};
