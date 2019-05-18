import { ofType, StateObservable } from 'redux-observable';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { UploadService } from '../../service/upload.service';
import { StoreState } from '../model/model';
import { upload, UploadAction, uploadResponse } from '../slices/upload.slice';

const uploadEpic = (action$: Observable<UploadAction>, state$: StateObservable<StoreState>) =>
    action$.pipe(
        ofType(upload.toString()),
        switchMap(({ payload }) => UploadService.instance.uploadImage(payload)),
        map(res => uploadResponse(res))
    );

export default {
    uploadEpic
};
