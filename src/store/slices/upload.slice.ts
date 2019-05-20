import { createSelector, createSlice, PayloadAction, SliceActionCreator } from 'redux-starter-kit';

import { StoreState } from '../model/model';
import { UploadResult } from '../../service/upload.service';

export interface UploadState {
    images: UploadResult[];
    thumbnail: UploadResult[];
}

const initialState: UploadState = {
    images: [],
    thumbnail: [],
};

export type UploadPayload = FileList
export type UploadAction = PayloadAction<UploadPayload>;
export type UploadCreator = SliceActionCreator<UploadPayload>;

export type UploadResponsePayload = UploadResult[];
export type UploadResponseAction = PayloadAction<UploadResponsePayload>;
export type UploadResponseCreator = SliceActionCreator<UploadResponsePayload>;

export const uploadSlice = 'upload';

export const {
    reducer: uploadReducer,
    actions: { upload, uploadResponse, uploadThumbnail, uploadThumbnailResponse },
    selectors: uploadSelectors
} = createSlice({
    slice: uploadSlice,
    initialState,
    reducers: {
        upload: (state: UploadState, { payload }: UploadAction) => { },
        uploadResponse: (state: UploadState, { payload }: UploadResponseAction) => {
            state.images = payload;
        },
        uploadThumbnail: (state: UploadState, { payload }: UploadAction) => { },
        uploadThumbnailResponse: (state: UploadState, { payload }: UploadResponseAction) => {
            state.thumbnail = payload;
        }
    }
});

export const selectUpload = createSelector<StoreState, UploadState>([uploadSlice]);

export default {
    [uploadSlice]: uploadReducer
};
