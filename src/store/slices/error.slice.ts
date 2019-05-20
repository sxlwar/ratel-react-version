import { createSelector, createSlice, PayloadAction, SliceActionCreator } from 'redux-starter-kit';

import { ErrorResponse } from '../../service/model/model';
import { StoreState } from '../model/model';

export interface ErrorState {
    apiError: ErrorResponse;
}

const initialState: ErrorState = {
    apiError: null
};

export type ApiErrorPayload = ErrorResponse;
export type ApiErrorAction = PayloadAction<ApiErrorPayload>;
export type ApiErrorCreator = SliceActionCreator<ApiErrorPayload>;

export const errorSlice = 'error';

export const {
    reducer: errorReducer,
    actions: { apiError },
    selectors: errorSelectors
} = createSlice({
    slice: errorSlice,
    initialState,
    reducers: {
        apiError: (state: ErrorState, { payload }: ApiErrorAction) => {
            state.apiError = payload;
        }
    }
});

export const selectError = createSelector<StoreState, ErrorState>([errorSlice]);
export const selectApiErrorState = createSelector<StoreState, ErrorResponse>(
    [selectError],
    (state: ErrorState) => state.apiError
);

export default {
    [errorSlice]: errorReducer
};
